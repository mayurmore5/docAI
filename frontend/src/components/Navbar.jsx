import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Layout } from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    }

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                                <Layout size={18} />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                Ocean AI
                            </span>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                About
                            </Link>
                            <Link to="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Pricing
                            </Link>
                            <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="hidden md:flex items-center gap-4">
                            {currentUser ? (
                                <>
                                    <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Home</Link>
                        <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800">About</Link>
                        <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Pricing</Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Contact</Link>
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">Log Out</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">Log In</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
