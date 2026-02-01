import axiosInstance from "./axiosInstance";

export const createBlog = (data) => {
    const config = {};

    // If data is FormData, let axios set Content-Type automatically
    if (data instanceof FormData) {
        // Remove Content-Type from headers if it exists
        if (config.headers) {
            delete config.headers['Content-Type'];
        }
    }

    return axiosInstance.post("/posts", data, config);
};

export const getAllBlogs = (params) => {
    return axiosInstance.get("/posts", { params });
};

export const getBlogById = (id) => {
    return axiosInstance.get(`/posts/${id}`);
};

export const deleteBlog = (id) => {
    return axiosInstance.delete(`/posts/${id}`);
};

export const updateBlog = (id, data) => {
    return axiosInstance.put(`/posts/${id}`, data);
};

export const getMyBlogs = () => {
    return axiosInstance.get("/posts/me");
};
