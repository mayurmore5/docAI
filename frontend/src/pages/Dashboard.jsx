import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { PlusCircle, FileText, Monitor } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        client.get('/projects/')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <PlusCircle size={20} />
                    New Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(project => (
                    <Link key={project.id} to={`/editor/${project.id}`} className="block">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-4">
                                {project.type === 'word' ? <FileText className="text-blue-500" /> : <Monitor className="text-orange-500" />}
                                <span className="text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                            <p className="text-gray-600 truncate">{project.topic}</p>
                        </div>
                    </Link>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                        No projects yet. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
