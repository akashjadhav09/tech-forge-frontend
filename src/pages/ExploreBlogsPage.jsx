import PostCard from "../components/blog/PostCard";

export default function ExploreBlogsPage() {
    const posts = [
        {
            image: "https://images.unsplash.com/photo-1499750310159-5254f4cc1555?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            tag: "Technology",
            title: "The Future of Artificial Intelligence in Healthcare",
            date: "Feb 02, 2026",
            readTime: "5 min read",
            description: "Exploring how AI is transforming diagnostics and patient care in modern medicine.",
        },
        {
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            tag: "Travel",
            title: "What Traveling Greece For 2 Weeks Taught Me About Life",
            date: "Jun 21, 2021",
            readTime: "11 min read",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet.",
        },
        {
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            tag: "Coding",
            title: "Mastering React Hooks: A Comprehensive Guide",
            date: "Jan 15, 2026",
            readTime: "8 min read",
            description: "Deep dive into useState, useEffect, and custom hooks for better component logic.",
        },
        {
            image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            tag: "Lifestyle",
            title: "Minimalism: How Less Can Be More",
            date: "Dec 10, 2025",
            readTime: "6 min read",
            description: "Discovering peace and clarity by decluttering your physical and digital life.",
        },
        {
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            tag: "Business",
            title: "Startup Lessons I Learned the Hard Way",
            date: "Nov 05, 2025",
            readTime: "12 min read",
            description: "Key takeaways from a failed venture and how to apply them to your next big idea.",
        },
        {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            tag: "Data Science",
            title: "Visualizing Big Data: Tools and Techniques",
            date: "Oct 20, 2025",
            readTime: "7 min read",
            description: "How to tell compelling stories with data using modern visualization libraries.",
        }
    ];

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

            <div className="max-w-7xl mx-auto">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <PostCard key={index} {...post} />
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-12 flex justify-center">
                    <button className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
}
