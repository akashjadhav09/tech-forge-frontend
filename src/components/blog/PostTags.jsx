export default function PostTags({ tags = [], selectedTag, onTagSelect }) {
    const handleTagClick = (tag) => {
        // If clicking 'All' or the same tag, deselect to show all
        if (tag === 'All' || selectedTag === tag) {
            onTagSelect(null);
        } else {
            onTagSelect(tag);
        }
    };

    if (tags.length === 0) {
        return null; // Don't render anything if no tags
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            {/* All tag to show all blogs */}
            <span
                onClick={() => handleTagClick('All')}
                className={`inline-block font-medium px-4 py-2 rounded-md cursor-pointer transition-all ${selectedTag === null
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-primary hover:text-white'
                    }`}
            >
                All
            </span>

            {tags.map((tag, index) => (
                <span
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={`capitalize inline-block font-medium px-4 py-2 rounded-md cursor-pointer transition-all ${selectedTag === tag
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-primary hover:text-white'
                        }`}
                >
                    {/* {tag.charAt(0).toUpperCase() + tag.slice(1)} */}
                    {tag}
                </span>
            ))}
        </div>
    );
}