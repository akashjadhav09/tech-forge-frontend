import axiosInstance from "./axiosInstance";

// POST /api/v1/blog
// Body: { title, content, status, coverImage?: string, tags?: string[] }
// status: "Draft" | "Published" | "Archived"
export const createBlog = (data) => {
    return axiosInstance.post("/blog", data);
};

export const getAllBlogs = (params) => {
    const offset = params.offset ?? ((params.pageNumber ? (params.pageNumber - 1) * params.limit : 0));
    return axiosInstance.get("/blog", { params: { limit: params.limit, offset, status: params.status } });
};

export const searchBlogs = (query, type, params) => {
    return axiosInstance.get(`/blog/search`, {
        params: {
            [type]: query,
            page: params?.pageNumber,
            limit: params?.limit
        }
    });
};

export const getBlogById = (id) => {
    return axiosInstance.get(`/blog/${id}`);
};

export const deleteBlog = (id) => {
    return axiosInstance.delete(`/blog/${id}`);
};

export const updateBlog = (id, data) => {
    return axiosInstance.put(`/blog/${id}`, data);
};

export const getMyBlogs = (userId) => {
    return axiosInstance.get(`/blog/user/${userId}`);
};

/**
 * POST /api/v1/blog/upload-image
 * Uploads a single cover image and returns the public URL.
 * @param {File} file - The image File object from the file input
 * @returns {Promise<{ imageUrl: string }>}
 */
export const uploadBlogImage = (file) => {
    const formData = new FormData();
    formData.append("blog-image", file); // must match multer field name
    return axiosInstance.post("/blog/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
