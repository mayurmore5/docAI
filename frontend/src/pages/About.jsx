import React from 'react';

export default function About() {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                    About Ocean AI
                </h1>
                <p className="mt-6 text-xl text-slate-500 dark:text-slate-400">
                    We are on a mission to revolutionize document creation.
                </p>

                <div className="mt-12 prose prose-lg prose-blue dark:prose-invert text-slate-500 dark:text-slate-400">
                    <p>
                        Ocean AI was founded with a simple goal: to help people create high-quality documents and presentations faster than ever before. We believe that AI can be a powerful partner in the creative process, handling the heavy lifting of structure and drafting so you can focus on the ideas.
                    </p>
                    <p>
                        Our platform leverages cutting-edge generative AI models to understand your topics and generate relevant, structured content. Whether you're a student working on an essay, a professional preparing a report, or an entrepreneur pitching an idea, Ocean AI gives you a head start.
                    </p>
                    <h3>Our Values</h3>
                    <ul>
                        <li><strong>Innovation:</strong> We constantly push the boundaries of what's possible with AI.</li>
                        <li><strong>Simplicity:</strong> We believe powerful tools should be easy to use.</li>
                        <li><strong>Quality:</strong> We strive to generate content that is accurate, relevant, and professional.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
