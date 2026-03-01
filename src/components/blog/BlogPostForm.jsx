import { useState, useRef, useEffect } from 'react';

export default function BlogPostForm({
    mode = "create",
    initialData = {},
    onSubmit,
    labels = {}
}) {

    const {
        heading = "Create New Post",
        subheading = "Share your thoughts with the world.",
        publishButton = "Publish Post",
        draftButton = "Save Draft"
    } = labels;

    const [title, setTitle] = useState(initialData.title || '');
    const [tags, setTags] = useState(
        initialData.tags ? initialData.tags.join(', ') : ''
    );
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(
    initialData.coverImage
        ? `http://localhost:3000/${initialData.coverImage}`
        : null
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef(null);

    // Prefill editor content in edit mode
    useEffect(() => {
        if (editorRef.current && initialData.content) {
            editorRef.current.innerHTML = initialData.content;
        }
    }, [initialData.content]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current.focus();
    };

    const handleSubmit = async (status) => {
    if (isSubmitting) return;

    const htmlContent = editorRef.current.innerHTML;

    if (!title.trim() || !htmlContent.trim()) {
        alert("Please provide a title and content.");
        return;
    }

    try {
        setIsSubmitting(true);

        const tagsArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        let payload;

        // 🔥 If new image selected → use FormData
        if (coverImage) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', htmlContent);
            formData.append('status', status);

            tagsArray.forEach(tag => {
                formData.append('tags', tag);
            });

            formData.append('coverImage', coverImage);

            payload = formData;
        } else {
            // No new image
            payload = {
                title,
                content: htmlContent,
                status,
                tags: tagsArray
            };
        }

        await onSubmit(payload, mode);

    } catch (error) {
        console.error("Failed to save post:", error);
    } finally {
        setIsSubmitting(false);
    }
};


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Header */}
                        <div className="border-b border-gray-100 pb-6">
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {heading}
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                {subheading}
                            </p>
                        </div>

                        {/* Cover Image Upload (UNCHANGED DESIGN) */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Cover Image
                            </label>

                            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                coverImagePreview
                                    ? 'border-primary bg-purple-50'
                                    : 'border-gray-300 hover:border-primary'
                            }`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                {coverImagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={coverImagePreview}
                                            alt="Cover Preview"
                                            className="mx-auto h-64 object-cover rounded-md shadow-sm"
                                        />
                                        <p className="mt-2 text-sm text-primary font-medium">
                                            Click to change image
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            {/* SVG unchanged */}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <span className="text-primary font-medium">
                                                Upload a file
                                            </span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Post Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an engaging title..."
                                className="block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Enter tags separated by commas..."
                                className="block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Editor (UNCHANGED) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Content
                            </label>

                            <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">

                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => handleFormat('bold')}
                                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-white rounded transition-colors font-bold"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormat('italic')}
                                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-white rounded transition-colors italic"
                                    >
                                        I
                                    </button>
                                </div>

                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="block w-full p-4 min-h-75 outline-none"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => handleSubmit('draft')}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Saving...' : draftButton}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit('published')}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 bg-primary border border-transparent rounded-lg text-white font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Publishing...' : publishButton}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
