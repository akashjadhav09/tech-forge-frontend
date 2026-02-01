import { Link } from "react-router-dom";

export default function PostCard({
    id = 1, // Defaulting to 1 for demo purposes
    image,
    tag,
    title,
    date,
    readTime,
    description,
}) {
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <Link to={`/blogs/${id}`} className="overflow-hidden block">
                <img
                    src={image}
                    alt={title}
                    className="h-56 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="p-5">
                <span className="inline-block bg-blue-900 text-white text-xs font-medium px-3 py-1 rounded-md mb-3">
                    {tag}
                </span>

                <Link to={`/blogs/${id}`}>
                    <h2 className="text-lg font-bold leading-snug mt-2 mb-2 group-hover:text-blue-900 transition-colors">
                        {title}
                    </h2>
                </Link>

                <p className="text-sm text-gray-500 mb-3">
                    {date} · {readTime}
                </p>

                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
}
