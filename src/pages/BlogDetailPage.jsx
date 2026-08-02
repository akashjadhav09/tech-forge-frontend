import { useState, useEffect } from 'react';
import AlertModal from '../components/common/AlertModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBlogById } from '../api/blog.api';
import { getCommentsAsPerBlog, createComment, updateComment, deleteComment } from '../api/comment.api';
import { addLike, removeLike, getLikes } from '../api/like.api';
import { addDislike, removeDislike, getDislikes } from '../api/dislike.api';

export default function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = (msg) => {
        setAlertMessage(msg);
        setAlertOpen(true);
    };

    // Interaction States - MUST be declared before any early returns
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null
    const [reactionLoading, setReactionLoading] = useState(false);

    // Comments State - MUST be declared before any early returns
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await getBlogById(id);
                setPost(res.data.post || res.data.data || res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load blog.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    // Fetch like/dislike counts and current user reaction state
    useEffect(() => {
        const fetchReactions = async () => {
            if (!id) return;
            try {
                const [likeRes, dislikeRes] = await Promise.all([
                    getLikes(id),
                    getDislikes(id),
                ]);

                // Helper: walk top-level and nested `data` to find a numeric field
                const extractCount = (res, fields) => {
                    if (res == null) return 0;
                    for (const f of fields) {
                        if (typeof res[f] === 'number') return res[f];
                    }
                    if (res.data && typeof res.data === 'object') {
                        for (const f of fields) {
                            if (typeof res.data[f] === 'number') return res.data[f];
                        }
                    }
                    return 0;
                };

                // Helper: walk top-level and nested `data` to find a boolean field
                const extractBool = (res, fields) => {
                    if (res == null) return false;
                    for (const f of fields) {
                        if (typeof res[f] === 'boolean') return res[f];
                    }
                    if (res.data && typeof res.data === 'object') {
                        for (const f of fields) {
                            if (typeof res.data[f] === 'boolean') return res.data[f];
                        }
                    }
                    return false;
                };

                const likeCount = extractCount(likeRes, ['count', 'likes', 'totalLikes', 'likesCount', 'likeCount']);
                const dislikeCount = extractCount(dislikeRes, ['count', 'dislikes', 'totalDislikes', 'dislikesCount', 'dislikeCount']);
                const isLiked = extractBool(likeRes, ['isLiked', 'liked', 'hasLiked', 'userLiked']);
                const isDisliked = extractBool(dislikeRes, ['isDisliked', 'disliked', 'hasDisliked', 'userDisliked']);

                setLikes(likeCount);
                setDislikes(dislikeCount);

                if (isLiked) {
                    setUserAction('like');
                } else if (isDisliked) {
                    setUserAction('dislike');
                } else {
                    setUserAction(null);
                }
            } catch (err) {
                // Reactions are non-critical — silently fail
                console.error('[Reactions] Failed to fetch reactions:', err);
            }
        };

        fetchReactions();
    }, [id]);

    // Update browser tab title when post is loaded
    useEffect(() => {
        if (post?.title) {
            document.title = `${post.title} | TechForge`;
        }

        // Cleanup: reset title when component unmounts
        return () => {
            document.title = 'TechForge';
        };
    }, [post]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await getCommentsAsPerBlog(id);
                // API returns: { data: [ { commentId, authorName, userId, content, ... } ] }
                const commentsData =
                    Array.isArray(res?.data) ? res.data :
                        Array.isArray(res) ? res :
                            Array.isArray(res?.comments) ? res.comments :
                                [];
                setComments(commentsData);
            } catch (err) {
                console.error(err);
                setError("Failed to load comments.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (!post) return <div className="text-center py-20">Blog not found</div>;

    // --- Handlers ---

    const handleLike = async () => {
        if (!user) { showAlert("Please login to like posts."); return; }
        if (reactionLoading) return;

        // Optimistic update
        const prevAction = userAction;
        const prevLikes = likes;
        const prevDislikes = dislikes;

        try {
            setReactionLoading(true);

            if (userAction === 'like') {
                // Toggle off — remove like
                setLikes(likes - 1);
                setUserAction(null);
                await removeLike(id);
            } else {
                // Switch from dislike → like, or fresh like
                if (userAction === 'dislike') {
                    setDislikes(dislikes - 1);
                    await removeDislike(id);
                }
                setLikes(likes + 1);
                setUserAction('like');
                await addLike(id);
            }
        } catch (err) {
            console.error('Like action failed:', err);
            // Rollback optimistic update
            setLikes(prevLikes);
            setDislikes(prevDislikes);
            setUserAction(prevAction);
        } finally {
            setReactionLoading(false);
        }
    };

    const handleDislike = async () => {
        if (!user) { showAlert("Please login to react to posts."); return; }
        if (reactionLoading) return;

        // Optimistic update
        const prevAction = userAction;
        const prevLikes = likes;
        const prevDislikes = dislikes;

        try {
            setReactionLoading(true);

            if (userAction === 'dislike') {
                // Toggle off — remove dislike
                setDislikes(dislikes - 1);
                setUserAction(null);
                await removeDislike(id);
            } else {
                // Switch from like → dislike, or fresh dislike
                if (userAction === 'like') {
                    setLikes(likes - 1);
                    await removeLike(id);
                }
                setDislikes(dislikes + 1);
                setUserAction('dislike');
                await addDislike(id);
            }
        } catch (err) {
            console.error('Dislike action failed:', err);
            // Rollback optimistic update
            setLikes(prevLikes);
            setDislikes(prevDislikes);
            setUserAction(prevAction);
        } finally {
            setReactionLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!newComment.trim()) return;

        const tempId = `temp-${Date.now()}`;

        // Resolve author name + userId from any AuthContext shape
        const authorName =
            user?.name || user?.data?.name ||
            user?.username || user?.data?.username || 'You';

        const userId =
            user?._id || user?.data?._id ||
            user?.data?.userId || user?.userId || tempId;

        // Optimistic comment — matches the API response shape
        const optimisticComment = {
            commentId: tempId,
            blogId: id,
            userId,
            authorName,
            content: newComment,
            createdAt: new Date().toISOString(),
            isEditing: false,
        };

        setComments(prev => [...prev, optimisticComment]);
        const contentToSave = newComment;
        setNewComment("");

        try {
            const createdRes = await createComment(id, { content: contentToSave });
            // Handle multiple response shapes
            const realComment =
                createdRes?.data?.comment ??
                createdRes?.comment ??
                createdRes?.data ??
                createdRes;

            setComments(current => current.map(c =>
                c.commentId === tempId ? { ...realComment, isEditing: false } : c
            ));
        } catch (error) {
            console.error("Failed to create comment", error);
            setComments(current => current.filter(c => c.commentId !== tempId));
            showAlert(error?.response?.data?.message || 'Failed to post comment.');
        }
    };

    const handleEditClick = (comment) => {
        setComments(prev => prev.map(c =>
            c.commentId === comment.commentId ? { ...c, isEditing: true } : c
        ));
        setEditCommentText(comment.content);
    };

    const handleSaveEdit = async (commentId) => {
        setComments(prev => prev.map(c =>
            c.commentId === commentId ? { ...c, content: editCommentText, isEditing: false } : c
        ));
        const textToSave = editCommentText;
        setEditCommentText("");

        try {
            const updatedRes = await updateComment(commentId, { content: textToSave });
            const realComment =
                updatedRes?.data?.comment ??
                updatedRes?.comment ??
                updatedRes?.data ??
                updatedRes;

            if (realComment && realComment.commentId) {
                setComments(current => current.map(c =>
                    c.commentId === commentId ? { ...realComment, isEditing: false } : c
                ));
            }
        } catch (error) {
            console.error("Failed to update comment", error);
            showAlert(error?.response?.data?.message || 'Failed to update comment.');
        }
    };

    const handleCancelEdit = (commentId) => {
        setComments(prev => prev.map(c =>
            c.commentId === commentId ? { ...c, isEditing: false } : c
        ));
        setEditCommentText("");
    };

    const handleDeleteComment = async (commentId) => {
        setComments(current => current.filter(c => c.commentId !== commentId));
        try {
            await deleteComment(commentId);
        } catch (error) {
            console.error('Failed to delete comment:', error);
            const res = await getCommentsAsPerBlog(id).catch(() => null);
            if (res) {
                const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setComments(data);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <AlertModal
                isOpen={alertOpen}
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Hero Image */}
                <div className="h-96 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <img
                        src={post.coverImage ? (post.coverImage.startsWith('http') ? post.coverImage : post.coverImage.startsWith('/') ? post.coverImage : `/${post.coverImage}`) : post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                        <div className="flex gap-2 mb-3">
                            {(post.tags || []).map(tag => (
                                <span key={tag} className="bg-primary/90 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-sm font-medium text-gray-200">
                            <span>By {post.authorName || post.author?.name || post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.createdAt || post.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                            <span className="mx-2">•</span>
                            <span>{post.viewCount ?? post.views ?? 0} views</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

                    {/* Like / Dislike Section */}
                    <div className="mt-12 py-6 border-t border-b border-gray-100 flex items-center gap-6">
                        <span className="text-gray-500 font-medium mr-2">Was this article helpful?</span>

                        <button
                            onClick={handleLike}
                            disabled={reactionLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed ${userAction === 'like' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <svg className="w-5 h-5" fill={userAction === 'like' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                            <span className="font-bold">{likes}</span>
                        </button>

                        <button
                            onClick={handleDislike}
                            disabled={reactionLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed ${userAction === 'dislike' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <svg className="w-5 h-5" fill={userAction === 'dislike' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                            <span className="font-bold">{dislikes}</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>

                        {/* Add Comment */}
                        <form onSubmit={handleAddComment} className="mb-10">
                            <div className="flex gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user?.data?.fullName?.charAt(0) || '?'}
                                </div>
                                <div className="grow">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={user ? "Add to the discussion..." : "Login to comment..."}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all resize-y min-h-25"
                                        disabled={!user}
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!user || !newComment.trim()}
                                            className="cursor-pointer px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-8">
                            {comments.map(comment => (
                                <div key={comment.commentId || comment._id} className="flex gap-4 group">
                                    <div className="shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                        {(comment.authorName || comment.author?.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="grow">
                                        <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 mr-2">
                                                        {comment.authorName ||
                                                            comment.author?.name ||
                                                            comment.author?.username ||
                                                            'Anonymous'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                                    </span>
                                                </div>

                                                {/* Actions (Update/Delete) - Only show if 'my' comment */}
                                                {user && (() => {
                                                    // API shape: comment.userId matches logged-in user's id
                                                    const loggedInId =
                                                        user?._id || user?.data?._id ||
                                                        user?.data?.userId || user?.userId;
                                                    const isOwner =
                                                        (loggedInId && comment.userId && loggedInId === comment.userId) ||
                                                        (loggedInId && comment.author?._id && loggedInId === comment.author._id);
                                                    return isOwner && !comment.isEditing;
                                                })() && (
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditClick(comment)}
                                                                className="cursor-pointer text-xs text-blue-600 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.commentId || comment._id)}
                                                                className="cursor-pointer text-xs text-red-600 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>

                                            {comment.isEditing ? (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    />
                                                    <div className="flex gap-2 mt-2 justify-end">
                                                        <button
                                                            onClick={() => handleCancelEdit(comment.commentId || comment._id)}
                                                            className="cursor-pointer text-xs text-gray-500 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveEdit(comment.commentId || comment._id)}
                                                            className="cursor-pointer text-xs bg-primary text-white px-3 py-1 rounded"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
