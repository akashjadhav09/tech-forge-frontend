import axiosInstance from "./axiosInstance";

/**
 * GET /api/v1/comments/:blogId
 * Fetch all comments for a blog post
 */
export const getCommentsAsPerBlog = async (blogId) => {
    const response = await axiosInstance.get(`/comments/${blogId}`);
    return response.data;
};

/**
 * GET /api/v1/comments/:userId
 * Fetch all comments made by a specific user
 */
export const getCommentsByUser = async (userId) => {
    const response = await axiosInstance.get(`/comments/${userId}`);
    return response.data;
};

/**
 * POST /api/v1/comment
 * Create a new comment — blogId must be sent in the request body
 */
export const createComment = async (blogId, data) => {
    const response = await axiosInstance.post(`/comment`, {
        ...data,
        blogId,
    });
    return response.data;
};

/**
 * PUT /api/v1/comment/:id
 * Update a comment by its own ID
 */
export const updateComment = async (commentId, data) => {
    const response = await axiosInstance.put(`/comment/${commentId}`, data);
    return response.data;
};

/**
 * DELETE /api/v1/comment/:id
 * Delete a comment by its own ID
 */
export const deleteComment = async (commentId) => {
    const response = await axiosInstance.delete(`/comment/${commentId}`);
    return response.data;
};
