import { Link } from "react-router-dom";

export default function PostCard({
    blogId,
    image,
    imageUrl: imageUrlProp,
    tags,
    title,
    coverImage,
    date,
    createdAt,
    content,
    authorName,
}) {
    // blob: URLs are temporary browser-only object URLs — they break on page refresh.
    // Prefer the server-provided cover image, then legacy image props, then a placeholder.
    const normalizeImageUrl = (url) => {
        if (typeof url !== 'string') return null;
        const trimmed = url.trim();

        try {
            const parsed = new URL(trimmed, window.location.origin);
            const backendBase = import.meta.env.VITE_API_BASE_URL
                ? new URL(import.meta.env.VITE_API_BASE_URL).origin
                : 'http://localhost:5000';
            if (parsed.origin === backendBase) {
                return parsed.pathname + parsed.search + parsed.hash;
            }
        } catch (err) {
            // ignore invalid URL, fallback to raw string
        }

        return trimmed;
    };

    const PLACEHOLDER = 'https://placehold.co/600x400?text=No+Image';
    const rawImage = coverImage || image || imageUrlProp;
    const cleanedImage = normalizeImageUrl(rawImage) || '';
    const imageUrl = cleanedImage
        ? cleanedImage.startsWith('http') || cleanedImage.startsWith('blob:') || cleanedImage.startsWith('/')
            ? cleanedImage
            : PLACEHOLDER
        : PLACEHOLDER;

    // Strip HTML tags and truncate content for preview
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const getPreviewText = (htmlContent, maxLength = 150) => {
        const plainText = stripHtml(htmlContent);
        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    };

    // Format date from ISO string to "01-Feb-2026"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const displayDate = createdAt ? formatDate(createdAt) : date;

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <Link to={`/blogs/${blogId}`} className="overflow-hidden block">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-56 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="p-5">
                <span className="inline-block bg-blue-900 text-white text-xs font-medium px-3 py-1 rounded-md mb-3">
                    {Array.isArray(tags) ? tags[0] : tags}
                </span>

                <Link to={`/blogs/${blogId}`}>
                    <h2 className="text-lg font-bold leading-snug mt-2 mb-2 group-hover:text-blue-900 transition-colors">
                        {title}
                    </h2>
                </Link>

                <p className="text-sm text-gray-500 mb-3">
                    {displayDate}
                </p>

                <p className="text-sm text-gray-600">
                    {getPreviewText(content)}
                </p>
            </div>
        </div>
    );
}
