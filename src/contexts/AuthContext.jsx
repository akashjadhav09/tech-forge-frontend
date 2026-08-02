import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { registerAuthSyncListener, registerVisibilityAuthCheck } from '../utils/authSync';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const res = await getProfile();
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // migrateTokenKeys(); // run migration before fetchUser
        fetchUser();

        // Listen for logout events triggered in other browser tabs.
        // When another tab removes the auth tokens from localStorage,
        // the `storage` event fires here and we call logout() to clear
        // local state and redirect to /login.
        const cleanup = registerAuthSyncListener(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            navigate('/login');
        });

        return cleanup; // deregister listener on unmount
    }, []);

    // Safety net: when the user switches back to this tab, verify the token
    // is still present. The `storage` event fires in real-time but React
    // Router's navigate() may not execute reliably in background tabs.
    // This guarantees an immediate redirect as soon as the tab is focused.
    useEffect(() => {
        const cleanup = registerVisibilityAuthCheck(() => {
            setUser(null);
            navigate('/login');
        });
        return cleanup;
    }, [navigate]);

    const login = async (responseData) => {
        const accessToken = responseData?.data.accessToken;
        const refreshToken = responseData?.data.refreshToken;

        if (!accessToken) {
            console.error("[AuthContext] accessToken not found in response");
            throw new Error("accessToken missing from server response");
        }

        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
