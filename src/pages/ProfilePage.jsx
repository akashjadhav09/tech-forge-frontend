import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
    const { user, logout } = useAuth();

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
                {/* Header / Cover */}
                <div className="bg-primary h-32 md:h-48 relative">
                    <div className="absolute -bottom-12 left-8 md:left-12">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full ring-4 ring-white bg-white flex items-center justify-center text-primary text-4xl font-bold shadow-md">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8 md:px-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded-full uppercase tracking-wide">
                                {user.role || 'Member'}
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
                            <span className="block text-2xl font-bold text-gray-900">0</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Blogs Published</span>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <span className="block text-2xl font-bold text-gray-900">0</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Comments</span>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <span className="block text-2xl font-bold text-gray-900">Joined</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Just now</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
