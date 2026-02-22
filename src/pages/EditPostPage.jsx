import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlogById, updateBlog } from '../api/blog.api';
import BlogPostForm from '../components/blog/BlogPostForm';

export default function EditPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogById(id);

                // 🔥 IMPORTANT FIX
                setPost(res.data.post);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleUpdate = async (data) => {
        await updateBlog(id, data);
    };

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Blog not found</div>;

    return (
        <BlogPostForm
            mode="edit"
            initialData={post}
            onSubmit={handleUpdate}
            labels={{
                heading: "Edit Post",
                publishButton: "Update & Publish",
                draftButton: "Update Draft"
            }}
        />
    );
}
