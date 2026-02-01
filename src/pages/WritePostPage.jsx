import { useState, useRef } from 'react';

export default function WritePostPage() {
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const editorRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Get HTML content from the contentEditable div
        const htmlContent = editorRef.current.innerHTML;

        console.log({
            title,
            content: htmlContent,
            coverImage
        });
        alert("Post data logged to console! (API integration pending)");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Header */}
                        <div className="border-b border-gray-100 pb-6">
                            <h1 className="text-3xl font-extrabold text-gray-900">Create New Post</h1>
                            <p className="mt-2 text-sm text-gray-500">Share your thoughts with the world.</p>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Cover Image</label>

                            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${coverImagePreview ? 'border-primary bg-purple-50' : 'border-gray-300 hover:border-primary'}`}>
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
                                        <p className="mt-2 text-sm text-primary font-medium">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <span className="text-primary font-medium">Upload a file</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an engaging title..."
                                className="block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary placeholder-gray-400 transition-colors"
                            />
                        </div>

                        {/* Editor Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Content</label>

                            <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                {/* Toolbar */}
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => handleFormat('bold')}
                                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-white rounded transition-colors font-bold"
                                        title="Bold"
                                    >
                                        B
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormat('italic')}
                                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-white rounded transition-colors italic"
                                        title="Italic"
                                    >
                                        I
                                    </button>
                                </div>

                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="block w-full p-4 min-h-[300px] border-0 focus:ring-0 text-gray-800 leading-relaxed outline-none"
                                    placeholder="Write your story..."
                                    style={{ whiteSpace: 'pre-wrap' }}
                                ></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                            >
                                Save Draft
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-primary border border-transparent rounded-lg text-white font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]"
                            >
                                Publish Post
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}