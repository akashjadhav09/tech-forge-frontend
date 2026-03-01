import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import SearchWithDropdown from "../common/SearchWithDropdown";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "text-primary font-semibold" : "text-gray-500 hover:text-primary";
    };

    const handleExploreClick = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else {
            navigate('/blogs');
        }
    };

    const handleWriteClick = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else {
            navigate('/writeablog');
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu and dropdown when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    const handleSearch = (value, type) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            navigate(
                `/blogs?search=${encodeURIComponent(trimmedValue)}&type=${type.toLowerCase()}`
            );
        } else {
            navigate("/blogs");
        }
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
                        <a href="#" onClick={handleExploreClick} className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/blogs')}`}>
                            Explore
                        </a>
                        <a href="#" onClick={handleWriteClick} className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive('/writeablog')}`}>
                            Write
                        </a>
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
                        {/* Search Input - Minimalist (Hidden on mobile) */}
                        <SearchWithDropdown
                            options={["Title", "Author", "Category"]}
                            onSearch={handleSearch}
                        />
                        {/* Notifications (Hidden on small mobile) */}
                        {user && (
                            <Link to="/notifications" className="hidden sm:hidden text-gray-400 hover:text-primary transition-colors relative">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </Link>
                        )}

                        {/* Auth Button (Desktop) */}
                        <div className="hidden md:block">
                            {!user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/login"
                                        className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 focus:outline-none"
                                    >
                                        <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border-2 transition-all ${isDropdownOpen ? 'border-primary' : 'border-transparent hover:border-primary'}`}>
                                            {user.name.charAt(0)}
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 transform transition-all duration-200 origin-top-right z-50 ${isDropdownOpen ? 'block opacity-100 scale-100' : 'hidden opacity-0 scale-95'}`}>
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
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-gray-500 hover:text-primary focus:outline-none p-2"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg h-screen overflow-y-auto pb-20">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link to="/home" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Home
                        </Link>
                        <a href="#" onClick={handleExploreClick} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Explore
                        </a>
                        <a href="#" onClick={handleWriteClick} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Write a Blog
                        </a>
                        <Link to="/contact" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Contact
                        </Link>
                        {user?.role === "admin" && (
                            <Link to="/admin" className="block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 px-4 pb-6">
                        {!user ? (
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full text-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center px-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Link to="/my-blogs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                        My Blogs
                                    </Link>
                                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">
                                        Profile Settings
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
