import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
    return axiosInstance.post("/auth/signup", data);
};

export const loginUser = (data) => {
    return axiosInstance.post("/auth/signin", data);
};

export const getProfile = () => {
    return axiosInstance.get("/users/me");
};
