import axios from "axios";
import { getIsOnline, waitUntilOnline } from '../utils/networkMonitor';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// ─── Interceptor 1: Offline detection — pre-flight block ────────────────────
// Runs BEFORE the auth interceptor so we never waste a token attachment on a
// request that cannot possibly reach the server.
//
// If the browser is known-offline we await waitUntilOnline(), which is a
// Promise that resolves when the 'online' event fires. Once it resolves we
// return the config — Axios then dispatches the request normally with a fresh
// token attached by the next interceptor.
//
// IMPORTANT: we must return `config`, not the waitUntilOnline() promise
// itself. Axios request interceptors must resolve with a config object;
// returning anything else (e.g. a response) corrupts the internal chain.
axiosInstance.interceptors.request.use(
    async (config) => {
        if (!getIsOnline() && !config._offlineRetry) {
            // Block here until the 'online' event fires.
            await waitUntilOnline();
        }
        // Always return the config so Axios continues normally.
        return config;
    },
    (error) => Promise.reject(error)
);

// Attach access token automatically to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        // Guard: skip if token is missing or the literal string "undefined"
        if (token && token !== "undefined" && token !== "null") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 — attempt silent token refresh before failing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response && !originalRequest?._offlineRetry) {
            originalRequest._offlineRetry = true;
            await waitUntilOnline();
            return axiosInstance(originalRequest);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request until the refresh is done
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                // No refresh token — clear storage and reject
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                    refreshToken: refreshToken,
                });

                // The API wraps tokens in data.data (envelope pattern).
                // Fall back to the root data object for non-enveloped responses.
                const payload = data?.data ?? data;

                // Support both camelCase and snake_case response shapes
                const newAccessToken = payload?.accessToken ?? payload?.access_token;
                const newRefreshToken = payload?.refreshToken ?? payload?.refresh_token;

                // Guard: if the token is still missing, treat it as a failed refresh
                if (!newAccessToken || newAccessToken === "undefined") {
                    throw new Error("Refresh response did not contain a valid access token");
                }

                localStorage.setItem("accessToken", newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }

                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
