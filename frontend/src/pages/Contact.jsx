import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                        Contact Us
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="mt-16 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                    <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                        <div className="lg:self-center">
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                                Get in touch
                            </h3>
                            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                                Whether you have a feature request, need support, or just want to say hello, our team is ready to help.
                            </p>
                            <div className="mt-8 space-y-6">
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Mail className="h-6 w-6 mr-3 text-blue-500" />
                                    <span>support@oceanai.com</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Phone className="h-6 w-6 mr-3 text-blue-500" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-6 w-6 mr-3 text-blue-500" />
                                    <span>123 AI Boulevard, Tech City, CA 94000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-slate-50 dark:bg-slate-700 pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                        <form className="space-y-6 max-w-lg mx-auto lg:mr-auto lg:ml-0">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                                <input type="text" id="name" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white sm:text-sm p-2" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <input type="email" id="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white sm:text-sm p-2" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                                <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white sm:text-sm p-2"></textarea>
                            </div>
                            <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
