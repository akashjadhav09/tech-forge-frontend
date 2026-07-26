import axiosInstance from "./axiosInstance";

/**
 * POST /api/v1/blog/:blogId/like
 * Add a like to a blog post
 */
export const addLike = async (blogId) => {
    const response = await axiosInstance.post(`/blog/${blogId}/like`);
    return response.data;
};

/**
 * DELETE /api/v1/blog/:blogId/like
 * Remove a like from a blog post
 */
export const removeLike = async (blogId) => {
    const response = await axiosInstance.delete(`/blog/${blogId}/like`);
    return response.data;
};

/**
 * GET /api/v1/blog/:blogId/like
 * Get like count and whether current user has liked
 */
export const getLikes = async (blogId) => {
    const response = await axiosInstance.get(`/blog/${blogId}/like`);
    return response.data;
};
