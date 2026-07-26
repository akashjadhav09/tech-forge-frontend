import axiosInstance from "./axiosInstance";

/**
 * POST /api/v1/blog/:blogId/dislike
 * Add a dislike to a blog post
 */
export const addDislike = async (blogId) => {
    const response = await axiosInstance.post(`/blog/${blogId}/dislike`);
    return response.data;
};

/**
 * DELETE /api/v1/blog/:blogId/dislike
 * Remove a dislike from a blog post
 */
export const removeDislike = async (blogId) => {
    const response = await axiosInstance.delete(`/blog/${blogId}/dislike`);
    return response.data;
};

/**
 * GET /api/v1/blog/:blogId/dislike
 * Get dislike count and whether current user has disliked
 */
export const getDislikes = async (blogId) => {
    const response = await axiosInstance.get(`/blog/${blogId}/dislike`);
    return response.data;
};
