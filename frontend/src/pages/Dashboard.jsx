import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Presentation, Clock, Search, Grid, List as ListIcon } from 'lucide-react';
import client from '../api/client';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await client.get('/projects/');
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your AI-generated documents</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                        <Link
                            to="/create"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                        >
                            <Plus size={20} /> New Project
                        </Link>
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-blue-500 dark:text-blue-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No projects found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Get started by creating your first AI document.</p>
                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                            Create New Project <Plus size={16} />
                        </Link>
                    </div>
                ) : (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/editor/${project.id}`}
                                    className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${project.type === 'word'
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                            }`}>
                                            {project.type === 'word' ? <FileText size={24} /> : <Presentation size={24} />}
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full uppercase tracking-wide">
                                            {project.type}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                        {project.topic}
                                    </p>

                                    <div className="flex items-center text-slate-400 text-xs border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                                        <Clock size={14} className="mr-1" />
                                        <span>Last edited recently</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Edited</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${project.type === 'word'
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                            : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                                        }`}>
                                                        {project.type === 'word' ? <FileText size={20} /> : <Presentation size={20} />}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{project.title}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.type === 'word'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                    }`}>
                                                    {project.type === 'word' ? 'Document' : 'Presentation'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {project.topic}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                Recently
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/editor/${project.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                                    Open
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
