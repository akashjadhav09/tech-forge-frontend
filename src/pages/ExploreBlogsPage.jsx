import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/blog/PostCard";
import { getAllBlogs, searchBlogs } from "../api/blog.api";

export default function ExploreBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const searchType = searchParams.get("type");

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, 12, searchQuery, searchType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, searchType]);

    const fetchPosts = async (pageNumber = 1, limit = 12, query = searchQuery, type = searchType) => {
        try {
            setLoading(true);

            let res;
            if (query && type) {
                res = await searchBlogs(query, type, { pageNumber, limit });
            } else {
                res = await getAllBlogs({ pageNumber, limit });
            }

            const data = res.data.posts || [];

            if (data.length < limit) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (pageNumber === 1) {
                setBlogs(data);
            } else {
                setBlogs(prev => [...prev, ...data]);
            }

        } catch (err) {
            console.error(err);
            setError("Failed to fetch blogs.");
            setBlogs([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };
    const posts = blogs;

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, 12, searchQuery, searchType);
    };

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

                    {hasMore && !loading && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
