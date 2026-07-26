import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyBlogs, deleteBlog, updateBlog } from '../api/blog.api';
import PostCard from '../components/blog/PostCard';

export default function MyBlogsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchMyBlogs();
    }, [user, navigate]);

    const fetchMyBlogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getMyBlogs(user.data.userId);
            setBlogs(res.data.data || res.data.data || res.data || []);
        } catch (err) {
            console.error('Error fetching my blogs:', err);
            setError(err.response?.data?.message || 'Failed to load your blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            return;
        }

        try {
            await deleteBlog(blogId);
            // Remove from local state
            setBlogs(prev => prev.filter(blog => blog.blogId !== blogId));
        } catch (err) {
            console.error('Error deleting blog:', err);
            alert(err.response?.data?.message || 'Failed to delete blog');
        }
    };

    const handleEdit = (blogId) => {
        navigate(`/blogs/${blogId}/edit`);
    };

    const handlePublish = async (blogId) => {
        try {
            await updateBlog(blogId, { status: 'Published' });
            // Update local state so UI reflects instantly
            setBlogs(prev =>
                prev.map(blog =>
                    blog.blogId === blogId ? { ...blog, status: 'Published' } : blog
                )
            );
        } catch (err) {
            console.error('Error publishing blog:', err);
            alert(err.response?.data?.message || 'Failed to publish blog');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={fetchMyBlogs}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                                My Blogs
                            </h1>
                            <p className="text-gray-600">
                                Manage and view all your published articles
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/writeablog')}
                            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-hover transition-all duration-300 hover:-translate-y-0.5"
                        >
                            + Write New Blog
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Blogs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{blogs.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Published</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {blogs.filter(b => b.status === 'Published').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Drafts</p>
                                <p className="text-3xl font-bold text-amber-500 mt-2">
                                    {blogs.filter(b => b.status !== 'Published').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blogs Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md">
                        <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs yet</h3>
                        <p className="text-gray-500 mb-6">Start writing your first blog post!</p>
                        <button
                            onClick={() => navigate('/writeablog')}
                            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-hover transition-all duration-300"
                        >
                            Write Your First Blog
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => {
                            const isDraft = blog.status !== 'Published';
                            return (
                                <div key={blog.blogId} className="relative group">
                                    <PostCard {...blog} blogId={blog.blogId} />

                                    {/* Status Badge — always visible */}
                                    <div className="absolute top-4 left-4 z-10">
                                        {isDraft ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 shadow-sm">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                Draft
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300 shadow-sm">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Published
                                            </span>
                                        )}
                                    </div>

                                    {/* Edit / Delete — top right on hover */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        <button
                                            onClick={() => handleEdit(blog.blogId)}
                                            className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.blogId)}
                                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Publish button — bottom right, only on Draft, only on hover */}
                                    {isDraft && (
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            <button
                                                onClick={() => handlePublish(blog.blogId)}
                                                title="Publish this blog"
                                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Publish
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
