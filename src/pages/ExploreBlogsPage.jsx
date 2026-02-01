import { useEffect, useState } from "react";
import PostCard from "../components/blog/PostCard";
import { getAllBlogs } from "../api/blog.api";

export default function ExploreBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getAllBlogs();
                const data = res.data.posts;
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

    const posts = blogs;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Explore Blogs
                </h1>
                <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>
            </div>

            {loading && <div className="text-center py-10">Loading blogs...</div>}
            {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

            {!loading && !error && (
                <div className="max-w-7xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center text-gray-500">No blogs found.</div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post, index) => (
                                <PostCard key={index} {...post} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Placeholder */}
                    <div className="mt-12 flex justify-center">
                        <button className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Load More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
