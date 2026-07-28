import { useState, useRef, useEffect } from 'react';
import AlertModal from '../common/AlertModal';
import { uploadBlogImage } from '../../api/blog.api';

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
    // coverImageUrl: the real http URL stored after a successful upload (or from initialData)
    const [coverImageUrl, setCoverImageUrl] = useState(
        initialData.coverImage ?? null
    );
    // coverImagePreview: blob URL for instant local preview while uploading
    const [coverImagePreview, setCoverImagePreview] = useState(
        initialData.coverImage ?? null
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = (msg) => {
        setAlertMessage(msg);
        setAlertOpen(true);
    };

    const editorRef = useRef(null);

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

    // Prefill editor content in edit mode
    useEffect(() => {
        if (editorRef.current && initialData.content) {
            editorRef.current.innerHTML = initialData.content;
        }
    }, [initialData.content]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show blob preview instantly so the user sees their image right away
        const blobUrl = URL.createObjectURL(file);
        setCoverImagePreview(blobUrl);
        setCoverImageUrl(null); // clear old real URL until upload succeeds
        setUploadError(null);
        setIsUploading(true);

        try {
            const res = await uploadBlogImage(file);
            const rawUrl = res.data?.data?.imageUrl || res.data?.imageUrl;
            const realUrl = normalizeImageUrl(rawUrl);
            setCoverImageUrl(realUrl);          // store the real URL
            setCoverImagePreview(realUrl || blobUrl); // keep preview if URL is invalid
            URL.revokeObjectURL(blobUrl);        // free memory
        } catch (err) {
            console.error('Image upload failed:', err);
            setUploadError('Image upload failed. Please try again.');
            setCoverImagePreview(null);           // clear broken preview
            setCoverImageUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current.focus();
    };

    const handleSubmit = async (status) => {
        if (isSubmitting) return;

        if (isUploading) {
            showAlert('Please wait for the image to finish uploading.');
            return;
        }

        const htmlContent = editorRef.current.innerHTML;

        if (!title.trim() || !htmlContent.trim()) {
            showAlert("Please provide a title and content.");
            return;
        }

        try {
            setIsSubmitting(true);

            const statusMap = {
                draft: "Draft",
                published: "Published",
            };

            const tagsArray = tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const payload = {
                title: title.trim(),
                content: htmlContent,
                tags: tagsArray,
                status: statusMap[status] ?? "Draft",
                // Only include coverImage if we have a real server URL (not a blob)
                ...(coverImageUrl && { coverImage: coverImageUrl }),
            };

            await onSubmit(payload);

        } catch (error) {
            console.error("Failed to save post:", error);
            showAlert(error?.response?.data?.message ?? "Failed to save post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <AlertModal
                isOpen={alertOpen}
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
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

                            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${coverImagePreview
                                    ? 'border-primary bg-purple-50'
                                    : 'border-gray-300 hover:border-primary'
                                }`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                />

                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2 text-primary">
                                        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <p className="text-sm font-medium">Uploading image...</p>
                                    </div>
                                ) : coverImagePreview ? (
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
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </div>
                                )}
                            </div>
                            {uploadError && (
                                <p className="mt-1 text-sm text-red-500">{uploadError}</p>
                            )}
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
                                className={`px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Saving...' : draftButton}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSubmit('published')}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 bg-primary border border-transparent rounded-lg text-white font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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
