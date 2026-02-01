import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "text-primary font-semibold" : "text-gray-500 hover:text-primary";
    };

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tight text-gray-900">
                            TechForge<span className="text-primary">.</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/home" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/home')}`}>
                            Home
                        </Link>
                        <Link to="/blogs" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/blogs')}`}>
                            Explore
                        </Link>
                        <Link to="/writeablog" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/writeablog')}`}>
                            Write
                        </Link>
                        <Link to="/contact" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/contact')}`}>
                            Contact
                        </Link>

                        {user?.role === "admin" && (
                            <Link to="/admin" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 text-red-500 hover:text-red-600`}>
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Section: Search & Auth */}
                    <div className="flex items-center gap-4">
                        {/* Search Input - Minimalist */}
                        <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all duration-300">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="ml-2 bg-transparent border-none focus:ring-0 text-sm text-gray-600 w-24 focus:w-40 transition-all duration-300 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        {/* Notifications */}
                        {user && (
                            <Link to="/notifications" className="text-gray-400 hover:text-primary transition-colors relative">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </Link>
                        )}

                        {/* Auth Button */}
                        {!user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="hidden sm:block text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden sm:block text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="relative group">
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border-2 border-transparent group-hover:border-primary transition-all">
                                        {user.name.charAt(0)}
                                    </div>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 hidden group-hover:block transform opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-right">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-semibold truncate text-gray-900">{user.name}</p>
                                    </div>
                                    <Link to="/my-blogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                                        My Blogs
                                    </Link>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                                        Profile Settings
                                    </Link>
                                    <div className="border-t border-gray-50 mt-1">
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Button (Placeholder) */}
                        <div className="md:hidden flex items-center">
                            <button className="text-gray-500 hover:text-primary">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
