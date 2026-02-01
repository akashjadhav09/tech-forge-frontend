import PostTags from "../components/blog/PostTags"
import PostCard from "../components/blog/PostCard"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/blogs');
        }
    };

    const posts = [
        {
            image:
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            tag: "Travel",
            title: "What Traveling Greece For 2 Weeks Taught Me About Life",
            date: "Jun 21, 2021",
            readTime: "11 min read",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis",
        },
        {
            image:
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            tag: "Travel",
            title: "What Traveling Greece For 2 Weeks Taught Me About Life",
            date: "Jun 21, 2021",
            readTime: "11 min read",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis",
        },
        {
            image:
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            tag: "Travel",
            title: "What Traveling Greece For 2 Weeks Taught Me About Life",
            date: "Jun 21, 2021",
            readTime: "11 min read",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis",
        }
    ];
    return (
        <div className="main-content-wrapper">
            <div className="tags-wrapper flex items-center justify-center gap-4">
                <PostTags />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <PostCard key={index} {...post} />
                    ))}
                </div>
            </div>

            <div className="pb-6 border-t border-gray-100 flex items-center justify-center">
                <button
                    onClick={handleExploreClick}
                    type="button"
                    className="px-6 py-2.5 bg-primary border border-transparent rounded-lg text-white font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                    Explore more
                </button>
            </div>
        </div>
    )
}