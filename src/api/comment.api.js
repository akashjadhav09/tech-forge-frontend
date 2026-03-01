import axiosInstance from "./axiosInstance";


export const createComment = async (blogId, data) => {
    const response = await axiosInstance.post(`/comments/post/${blogId}`, data);
    return response.data;
};

export const getCommentById = async (commentId) => {
    const response = await axiosInstance.get(`/comments/${commentId}`);
    return response.data;
};

export const getCommentsAsPerBlog = async (blogId) => {
    const response = await axiosInstance.get(`/comments/post/${blogId}`);
    return response.data;
};

export const updateComment = async (blogId, commentId, data) => {
    const response = await axiosInstance.put(`/comments/post/${blogId}/${commentId}`, data);
    return response.data;
};

export const deleteComment = async (blogId, commentId) => {
    const response = await axiosInstance.delete(`/comments/post/${blogId}/${commentId}`);
    return response.data;
};

export const deleteAllComments = async (blogId) => {
    const response = await axiosInstance.delete(`/comments/postId/${blogId}`);
    return response.data;
};


