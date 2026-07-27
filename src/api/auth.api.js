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

/**
 * PATCH /api/v1/users/me/avatar
 * Updates the logged-in user's avatar image
 * @param {File} file - The image File object from the file input
 * @returns {Promise<{ data: { profileImage: string, ... } }>}
 */
export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("profile-image", file); // must match API field name
    return axiosInstance.patch("/users/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
