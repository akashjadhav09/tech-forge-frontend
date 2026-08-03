import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getBlogById, updateBlog } from '../api/blog.api';
import { useToast } from '../contexts/ToastContext';

import BlogPostForm from '../components/blog/BlogPostForm';
import Loader from '../components/common/Loader';

export default function EditPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (!id) {
            setError('Blog ID is missing from the URL.');
            setLoading(false);
            return;
        }

        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await getBlogById(id);

                // API response shape: { success, data: { blogId, title, ... } }
                const blogData =
                    res?.data?.post ??
                    res?.data?.data ??
                    res?.data ??
                    null;

                // Accept either _id (Mongoose) or blogId (UUID-based backend)
                if (!blogData || (!blogData._id && !blogData.blogId)) {
                    setError('Blog not found.');
                } else {
                    setPost(blogData);
                }
            } catch (err) {
                console.error('Failed to load blog for editing:', err);
                setError(err?.response?.data?.message || 'Failed to load blog.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleUpdate = async (data) => {
        try {
            await updateBlog(id, data);
            const isDraft = data.status === 'Draft';
            if (isDraft) {
                toast.info('Draft updated', 'Your changes have been saved as a draft.');
            } else {
                toast.success('Blog updated!', 'Your post has been updated and published.');
            }
            navigate('/my-blogs');
        } catch (error) {
            console.error('Update blog failed:', error);
            toast.error('Update failed', error?.response?.data?.message || 'Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-10">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <p className="text-red-600 font-semibold text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/my-blogs')}
                        className="cursor-pointer mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Back to My Blogs
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div>
                    <img src="public/assets/not-found.svg" alt="No Blogs Found" className="mx-auto mb-4 w-32 h-32" />
                    <p>No blogs found.</p>
                </div>
            </div>
        );
    }

    return (
        <BlogPostForm
            mode="edit"
            initialData={post}
            onSubmit={handleUpdate}
            labels={{
                heading: "Edit Post",
                subheading: "Update your article below.",
                publishButton: "Update & Publish",
                draftButton: "Update Draft"
            }}
        />
    );
}
