import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { getMyBlogs } from '../api/blog.api';
import { uploadAvatar } from '../api/auth.api';

export default function ProfilePage() {
    const { user, logout, fetchUser } = useAuth();
    const fileInputRef = useRef(null);
    const [blogCount, setBlogCount] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

    // Fetch blog count on mount or when user changes
    useEffect(() => {
        if (user?.data?.id) {
            const fetchBlogCount = async () => {
                try {
                    const response = await getMyBlogs(user.data.id);
                    // Count only published blogs
                    const publishedBlogs = response.data?.data?.filter(
                        blog => blog.status === 'Published'
                    ) || [];
                    setBlogCount(publishedBlogs.length);
                } catch (error) {
                    console.error('Failed to fetch blog count:', error);
                    setBlogCount(0);
                }
            };
            fetchBlogCount();
        }
    }, [user?.data?.id]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            setUploadMessage({
                type: 'error',
                text: 'File size exceeds 2MB limit'
            });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setUploadMessage({
                type: 'error',
                text: 'Only JPEG, PNG, WebP, and GIF formats are allowed'
            });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
            return;
        }

        setUploading(true);
        setUploadMessage({ type: '', text: '' });

        try {
            await uploadAvatar(file);
            setUploadMessage({
                type: 'success',
                text: 'Avatar uploaded successfully!'
            });
            // Refresh user data to get updated avatar
            await fetchUser();
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Avatar upload failed:', error);
            setUploadMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to upload avatar'
            });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
                <Link to="/login" className="text-primary font-bold hover:underline">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Upload Message Toast */}
                {uploadMessage.text && (
                    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 ${
                        uploadMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                        {uploadMessage.text}
                    </div>
                )}

                {/* Header / Cover */}
                <div className="bg-primary h-32 md:h-48 relative">
                    <div className="absolute -bottom-12 left-8 md:left-12">
                        <div
                            onClick={handleAvatarClick}
                            className="h-24 w-24 md:h-32 md:w-32 rounded-full ring-4 ring-white bg-white flex items-center justify-center text-primary text-4xl font-bold shadow-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity relative"
                        >
                            {user?.data?.profileImage ? (
                                <img
                                    src={
                                        user.data.profileImage.startsWith('http')
                                            ? user.data.profileImage
                                            : user.data.profileImage.startsWith('/')
                                                ? user.data.profileImage
                                                : `/${user.data.profileImage}`
                                    }
                                    alt={user?.data?.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user?.data?.fullName?.charAt(0)?.toUpperCase() ?? '?'
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">Click to upload</p>
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploading}
                />

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8 md:px-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user?.data?.fullName}</h1>
                            <p className="text-gray-500 font-medium">{user?.data?.email}</p>
                            {user?.data?.bio && (
                                <p className="text-gray-600 mt-2 text-sm">{user.data.bio}</p>
                            )}
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded-full uppercase tracking-wide">
                                {user?.data?.role || 'Member'}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 border-t border-gray-100 pt-8">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <span className="block text-2xl font-bold text-gray-900">{blogCount}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Blogs Published</span>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <span className="block text-2xl font-bold text-gray-900">0</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Comments</span>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <span className="block text-2xl font-bold text-gray-900">
                                {user?.data?.createdAt
                                    ? new Date(user.data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : 'Recently'}
                            </span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Member Since</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
