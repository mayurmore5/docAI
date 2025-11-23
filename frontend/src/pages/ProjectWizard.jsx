import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { FileText, Monitor, Loader } from 'lucide-react';

export default function ProjectWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'word',
        title: '',
        topic: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await client.post('/projects/', formData);
            navigate(`/editor/${res.data.id}`);
        } catch (error) {
            console.error("Error creating project", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Project</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'word' })}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${formData.type === 'word' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                            >
                                <FileText size={32} className={formData.type === 'word' ? 'text-blue-500' : 'text-gray-400'} />
                                <span className="font-medium">Word Document</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'powerpoint' })}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${formData.type === 'powerpoint' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                            >
                                <Monitor size={32} className={formData.type === 'powerpoint' ? 'text-orange-500' : 'text-gray-400'} />
                                <span className="font-medium">PowerPoint</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Q3 Financial Report"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Topic / Description</label>
                        <textarea
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                            placeholder="Describe what you want to generate..."
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" /> Generating Outline...
                            </>
                        ) : (
                            'Create Project'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
