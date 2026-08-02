import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllBlogs } from "../api/blog.api";

import Loader from "../components/common/Loader";
import PostTags from "../components/blog/PostTags";
import PostCard from "../components/blog/PostCard";


export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getAllBlogs({ limit: 12, offset: 0, status: 'Published' });
                const data = res.data.data;
                setBlogs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleExploreClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/blogs');
        }
    };

    // Extract unique tags from all blogs
    const allTags = blogs.reduce((tags, blog) => {
        if (Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        }
        return tags;
    }, []);

    // Filter blogs by selected tag
    const filteredBlogs = selectedTag
        ? blogs.filter(blog => Array.isArray(blog.tags) && blog.tags.includes(selectedTag))
        : blogs;

    // Show only first 3 posts on homepage
    const posts = filteredBlogs.slice(0, 3);

    return (
        <div className="main-content-wrapper">
            <div className="tags-wrapper flex items-center justify-center gap-4">
                <PostTags
                    tags={allTags}
                    selectedTag={selectedTag}
                    onTagSelect={setSelectedTag}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {loading &&
                    <div className="text-center py-10">
                        <Loader />
                    </div>
                }
                {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

                {!loading && !error && (
                    <>
                        {posts.length === 0 ? (
                            <div className="text-center text-gray-500">
                                {selectedTag ? `No blogs found with tag "${selectedTag}"` :
                                    <div>
                                        <img src="public/assets/not-found.svg" alt="No Blogs Found" className="mx-auto mb-4 w-32 h-32" />
                                        <p>No blogs found.</p>
                                    </div>
                                }
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post, index) => (
                                    <PostCard key={post.blogId} {...post} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {posts.length > 2 && (
                <div className="pb-6 border-t border-gray-100 flex items-center justify-center">
                    <button
                        onClick={handleExploreClick}
                        type="button"
                        className="cursor-pointer px-6 py-2.5 bg-primary border border-transparent rounded-lg text-white font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                        Explore more
                    </button>
                </div>
            )}

        </div>
    );
}