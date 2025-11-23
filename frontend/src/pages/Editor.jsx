import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { Save, Download, Wand2, ChevronLeft, Loader } from 'lucide-react';

export default function Editor() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [refining, setRefining] = useState(false);
    const [refineInstruction, setRefineInstruction] = useState("");

    useEffect(() => {
        fetchProject();
    }, [id]);

    async function fetchProject() {
        try {
            const res = await client.get(`/projects/${id}`);
            setProject(res.data);
            if (res.data.items.length > 0 && !selectedItem) {
                setSelectedItem(res.data.items[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching project", error);
            setLoading(false);
        }
    }

    async function handleGenerateContent() {
        if (!selectedItem) return;
        setGenerating(true);
        try {
            const res = await client.post('/generate/content', {
                project_id: id,
                item_id: selectedItem.id
            });

            // Update local state
            const updatedItems = project.items.map(item =>
                item.id === selectedItem.id ? { ...item, content: res.data.content } : item
            );
            setProject({ ...project, items: updatedItems });
            setSelectedItem({ ...selectedItem, content: res.data.content });
        } catch (error) {
            console.error("Error generating content", error);
        } finally {
            setGenerating(false);
        }
    }

    async function handleRefine() {
        if (!selectedItem || !refineInstruction) return;
        setRefining(true);
        try {
            const res = await client.post('/generate/refine', {
                text: selectedItem.content,
                instruction: refineInstruction
            });

            // Update local state
            const updatedItems = project.items.map(item =>
                item.id === selectedItem.id ? { ...item, content: res.data.refined } : item
            );
            setProject({ ...project, items: updatedItems });
            setSelectedItem({ ...selectedItem, content: res.data.refined });
            setRefineInstruction("");
        } catch (error) {
            console.error("Error refining content", error);
        } finally {
            setRefining(false);
        }
    }

    async function handleExport() {
        try {
            const response = await client.get(`/projects/${id}/export`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const ext = project.type === 'word' ? 'docx' : 'pptx';
            link.setAttribute('download', `${project.title}.${ext}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting", error);
        }
    }

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!project) return <div className="flex items-center justify-center h-screen">Project not found</div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-lg truncate">{project.title}</h2>
                    <p className="text-xs text-gray-500 uppercase mt-1">{project.type} Project</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {project.items.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`p-3 rounded cursor-pointer mb-1 text-sm ${selectedItem?.id === item.id ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <span className="mr-2 text-gray-400">{index + 1}.</span>
                            {item.title}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedItem ? (
                    <>
                        <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h1>
                            <button
                                onClick={handleGenerateContent}
                                disabled={generating}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {generating ? <Loader className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                Generate Content
                            </button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[500px] max-w-4xl mx-auto">
                                <textarea
                                    className="w-full h-full min-h-[400px] outline-none resize-none text-gray-800 leading-relaxed"
                                    value={selectedItem.content || ""}
                                    onChange={(e) => {
                                        const newContent = e.target.value;
                                        setSelectedItem({ ...selectedItem, content: newContent });
                                        // Ideally debounce update to project state/DB
                                    }}
                                    placeholder="Content will appear here..."
                                />
                            </div>
                        </div>

                        {/* Refinement Bar */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="max-w-4xl mx-auto flex gap-2">
                                <input
                                    type="text"
                                    value={refineInstruction}
                                    onChange={(e) => setRefineInstruction(e.target.value)}
                                    placeholder="Ask AI to refine this section (e.g., 'Make it more formal', 'Summarize into bullets')"
                                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                />
                                <button
                                    onClick={handleRefine}
                                    disabled={refining || !refineInstruction}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {refining ? <Loader className="animate-spin" size={16} /> : "Refine"}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a section to edit
                    </div>
                )}
            </div>
        </div>
    );
}
