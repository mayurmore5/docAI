import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Presentation, Zap, Layout, Shield, Globe } from 'lucide-react';

export default function Landing() {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32 space-y-24">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="block">Create documents</span>
                                <span className="block text-blue-600 dark:text-blue-400">at the speed of thought</span>
                            </h1>
                            <p className="mt-3 text-base text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Ocean AI helps you generate professional Word documents and PowerPoint presentations in seconds. Just provide a topic, and let our AI do the rest.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                <Link
                                    to="/create"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                                >
                                    Get Started <ArrowRight className="ml-2" size={20} />
                                </Link>
                            </div>
                        </div>
                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                <div className="relative block w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
                                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                        <Layout size={120} className="text-blue-200 dark:text-slate-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Everything you need to create content
                        </p>
                    </div>

                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="pt-6">
                                <div className="flow-root bg-white dark:bg-slate-800 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                                                <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-slate-900 dark:text-white tracking-tight">Word Documents</h3>
                                        <p className="mt-5 text-base text-slate-500 dark:text-slate-400">
                                            Generate comprehensive reports, articles, and essays with structured outlines and detailed content.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-white dark:bg-slate-800 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                                <Presentation className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-slate-900 dark:text-white tracking-tight">PowerPoint Slides</h3>
                                        <p className="mt-5 text-base text-slate-500 dark:text-slate-400">
                                            Create visually appealing presentations with AI-generated slide content, charts, and images.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-white dark:bg-slate-800 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                                                <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-slate-900 dark:text-white tracking-tight">Instant Generation</h3>
                                        <p className="mt-5 text-base text-slate-500 dark:text-slate-400">
                                            Save hours of work. Our advanced AI models generate high-quality drafts in seconds.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-4">
                                <li><Link to="/pricing" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>
                                <li><Link to="/create" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Features</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-4">
                                <li><Link to="/about" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</Link></li>
                                <li><Link to="/contact" className="text-base text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 md:flex md:items-center md:justify-between">
                        <div className="flex space-x-6 md:order-2">
                            <a href="#" className="text-slate-400 hover:text-slate-500">
                                <span className="sr-only">GitHub</span>
                                <Globe className="h-6 w-6" />
                            </a>
                        </div>
                        <p className="mt-8 text-base text-slate-400 md:mt-0 md:order-1">
                            &copy; 2024 Ocean AI. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
