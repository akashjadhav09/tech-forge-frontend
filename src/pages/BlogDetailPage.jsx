import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBlogById } from '../api/blog.api';
import { getCommentsAsPerBlog, createComment, updateComment, deleteComment } from '../api/comment.api';

export default function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Interaction States - MUST be declared before any early returns
    const [likes, setLikes] = useState(42);
    const [dislikes, setDislikes] = useState(3);
    const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null

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
                setComments(res);
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

    const handleLike = () => {
        if (!user) return alert("Please login to like posts.");

        if (userAction === 'like') {
            setLikes(likes - 1);
            setUserAction(null);
        } else {
            if (userAction === 'dislike') {
                setDislikes(dislikes - 1);
            }
            setLikes(likes + 1);
            setUserAction('like');
        }
    };

    const handleDislike = () => {
        if (!user) return alert("Please login to react to posts.");

        if (userAction === 'dislike') {
            setDislikes(dislikes - 1);
            setUserAction(null);
        } else {
            if (userAction === 'like') {
                setLikes(likes - 1);
            }
            setDislikes(dislikes + 1);
            setUserAction('dislike');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!newComment.trim()) return;

        const tempId = Date.now().toString();
        const comment = {
            _id: tempId,
            author: {
                _id: user._id || tempId,
                name: user.name || "Anonymous",
                email: user.email || ""
            },
            content: newComment,
            createdAt: new Date().toISOString(),
            isEditing: false
        };

        setComments(prev => [...prev, comment]);
        const contentToSave = newComment;
        setNewComment("");

        try {
            const createdRes = await createComment(id, { content: contentToSave });
            const realComment = createdRes.comment || createdRes.data || createdRes;

            setComments(current => current.map(c =>
                c._id === tempId ? { ...realComment, isEditing: false } : c
            ));
        } catch (error) {
            console.error("Failed to create comment", error);
        }
    };

    const handleEditClick = (comment) => {
        const updatedComments = comments.map(c =>
            c._id === comment._id ? { ...c, isEditing: true } : c
        );
        setComments(updatedComments);
        setEditCommentText(comment.content);
    };

    const handleSaveEdit = async (commentId) => {
        const updatedComments = comments.map(c =>
            c._id === commentId ? { ...c, content: editCommentText, isEditing: false } : c
        );
        setComments(updatedComments);
        const textToSave = editCommentText;
        setEditCommentText("");

        try {
            const updatedRes = await updateComment(id, commentId, { content: textToSave });
            const realComment = updatedRes.comment || updatedRes.data || updatedRes;

            if (realComment && realComment._id) {
                setComments(current => current.map(c =>
                    c._id === commentId ? { ...realComment, isEditing: false } : c
                ));
            }
        } catch (error) {
            console.error("Failed to update comment", error);
        }
    };

    const handleCancelEdit = (commentId) => {
        const updatedComments = comments.map(c =>
            c._id === commentId ? { ...c, isEditing: false } : c
        );
        setComments(updatedComments);
        setEditCommentText("");
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(c => c._id !== commentId));
        deleteComment(id, commentId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Hero Image */}
                <div className="h-96 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <img
                        src={post.coverImage ? (post.coverImage.startsWith('http') ? post.coverImage : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'}/${post.coverImage}`) : post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                        <div className="flex gap-2 mb-3">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-primary/90 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-sm font-medium text-gray-200">
                            <span>By {post.author?.name || post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.createdAt || post.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                            <span className="mx-2">•</span>
                            <span>{post.views || 0} views</span>
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${userAction === 'like' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <svg className="w-5 h-5" fill={userAction === 'like' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                            <span className="font-bold">{likes}</span>
                        </button>

                        <button
                            onClick={handleDislike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${userAction === 'dislike' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                                    {user ? user.name.charAt(0) : '?'}
                                </div>
                                <div className="grow">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder={user ? "Add to the discussion..." : "Login to comment..."}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y min-h-25"
                                        disabled={!user}
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!user || !newComment.trim()}
                                            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                <div key={comment._id} className="flex gap-4 group">
                                    <div className="shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                        {comment.author?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="grow">
                                        <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 mr-2">{comment.author?.name || 'Anonymous'}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                                    </span>
                                                </div>

                                                {/* Actions (Update/Delete) - Only show if 'my' comment */}
                                                {user && (user._id === comment.author?._id || user.name === comment.author?.name) && !comment.isEditing && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditClick(comment)}
                                                            className="text-xs text-blue-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-xs text-red-600 hover:underline"
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
                                                            onClick={() => handleCancelEdit(comment._id)}
                                                            className="text-xs text-gray-500 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveEdit(comment._id)}
                                                            className="text-xs bg-primary text-white px-3 py-1 rounded"
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
