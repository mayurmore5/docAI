import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import {
    Save, Download, Wand2, ChevronLeft, Loader,
    Plus, Trash2, MoreHorizontal, FileText,
    AlignLeft, Check, RefreshCw, Maximize2, Minimize2,
    PieChart, Image as ImageIcon
} from 'lucide-react';

export default function Editor() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [refining, setRefining] = useState(false);
    const [refineInstruction, setRefineInstruction] = useState("");
    const [showPreview, setShowPreview] = useState(false);

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

            updateItemContent(selectedItem.id, res.data.content);
        } catch (error) {
            console.error("Error generating content", error);
        } finally {
            setGenerating(false);
        }
    }

    async function handleRefine(instruction) {
        const instr = instruction || refineInstruction;
        if (!selectedItem || !instr) return;

        setRefining(true);
        try {
            const res = await client.post('/generate/refine', {
                text: selectedItem.content,
                instruction: instr
            });

            updateItemContent(selectedItem.id, res.data.refined);
            setRefineInstruction("");
        } catch (error) {
            console.error("Error refining content", error);
        } finally {
            setRefining(false);
        }
    }

    function updateItemContent(itemId, newContent) {
        const updatedItems = project.items.map(item =>
            item.id === itemId ? { ...item, content: newContent } : item
        );
        setProject({ ...project, items: updatedItems });
        setSelectedItem({ ...selectedItem, content: newContent });
    }

    async function handleAddItem() {
        try {
            const res = await client.post(`/projects/${id}/items`, {}, {
                params: { title: "New Section" }
            });
            setProject(res.data);
            // Select the new item (last one)
            setSelectedItem(res.data.items[res.data.items.length - 1]);
        } catch (error) {
            console.error("Error adding item", error);
        }
    }

    async function handleDeleteItem(e, itemId) {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this section?")) return;

        try {
            const res = await client.delete(`/projects/${id}/items/${itemId}`);
            setProject(res.data);
            if (selectedItem?.id === itemId) {
                setSelectedItem(res.data.items.length > 0 ? res.data.items[0] : null);
            }
        } catch (error) {
            console.error("Error deleting item", error);
        }
    }

    async function handleAddChart() {
        const prompt = window.prompt("Describe the chart data (e.g., 'Bar chart of Q1 sales: Product A 100, Product B 150')");
        if (!prompt) return;

        try {
            const res = await client.post(`/projects/${id}/items`, {}, {
                params: { title: "New Chart" }
            });
            // Immediately convert to chart type
            const newItem = res.data.items[res.data.items.length - 1];
            const chartRes = await client.post('/generate/chart', {
                project_id: id,
                item_id: newItem.id,
                prompt: prompt
            });

            // Refresh project
            fetchProject();
        } catch (error) {
            console.error("Error adding chart", error);
        }
    }

    async function handleAddImagePrompt() {
        const prompt = window.prompt("Describe the image you want (e.g., 'A futuristic city skyline at night')");
        if (!prompt) return;

        try {
            // If selected item is a slide, add image to it. If not, create new image item.
            let itemId = selectedItem?.id;

            if (!selectedItem || (selectedItem.type !== 'slide' && selectedItem.type !== 'image_prompt')) {
                const res = await client.post(`/projects/${id}/items`, {}, {
                    params: { title: "New Image" }
                });
                itemId = res.data.items[res.data.items.length - 1].id;
            }

            const imgRes = await client.post('/generate/image-prompt', {
                project_id: id,
                item_id: itemId,
                prompt: prompt
            });

            // Refresh project
            fetchProject();
        } catch (error) {
            console.error("Error adding image", error);
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

    if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader className="animate-spin text-indigo-600" /></div>;
    if (!project) return <div className="flex items-center justify-center h-screen bg-slate-50">Project not found</div>;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-slate-800 truncate font-display">{project.title}</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-0.5">{project.type} Project</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {project.items.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm transition-all duration-200 border ${selectedItem?.id === item.id ? 'bg-indigo-50 border-indigo-100 text-indigo-700 font-medium shadow-sm' : 'border-transparent hover:bg-slate-50 text-slate-600'}`}
                        >
                            <div className="flex items-center gap-3 truncate">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${selectedItem?.id === item.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'}`}>
                                    {index + 1}
                                </span>
                                <span className="truncate">{item.title}</span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteItem(e, item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-600 rounded transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={handleAddItem}
                        className="w-full flex items-center justify-center gap-2 p-3 mt-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium"
                    >
                        <Plus size={16} /> Add Section
                    </button>

                    {project.type === 'powerpoint' && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                onClick={handleAddChart}
                                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium"
                            >
                                <PieChart size={16} /> Chart
                            </button>
                            <button
                                onClick={handleAddImagePrompt}
                                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium"
                            >
                                <ImageIcon size={16} /> Image
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 font-medium"
                    >
                        <Download size={18} /> Export Document
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {selectedItem ? (
                    <>
                        {/* Top Bar */}
                        <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-bold text-slate-800 font-display">{selectedItem.title}</h1>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200">
                                    {project.type === 'word' ? 'Section' : 'Slide'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showPreview ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    {showPreview ? <AlignLeft size={16} /> : <FileText size={16} />}
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                <button
                                    onClick={handleGenerateContent}
                                    disabled={generating}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 font-medium text-sm"
                                >
                                    {generating ? <Loader className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                    Auto-Generate
                                </button>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col relative overflow-hidden">
                                {/* Quick Actions Toolbar */}
                                {!showPreview && (
                                    <div className="flex items-center gap-2 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                                        <span className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">Quick Refine:</span>
                                        <button onClick={() => handleRefine("Make it more professional and formal")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">Professional</button>
                                        <button onClick={() => handleRefine("Shorten this text significantly")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">Shorten</button>
                                        <button onClick={() => handleRefine("Expand on this with more details")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">Expand</button>
                                        <button onClick={() => handleRefine("Fix grammar and spelling errors")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">Fix Grammar</button>
                                        <button onClick={() => handleRefine("Convert to bullet points")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap">Bullets</button>
                                    </div>
                                )}

                                {showPreview ? (
                                    <div className="flex-1 p-8 prose prose-slate max-w-none">
                                        {selectedItem.type === 'chart' && selectedItem.chart_data ? (
                                            <div className="p-4 border rounded bg-slate-50">
                                                <h3 className="text-center font-bold mb-4">{selectedItem.chart_data.title}</h3>
                                                <div className="text-center text-slate-500 text-sm">
                                                    [Chart Preview: {selectedItem.chart_data.type.toUpperCase()}]<br />
                                                    Categories: {selectedItem.chart_data.categories.join(', ')}
                                                </div>
                                            </div>
                                        ) : selectedItem.type === 'image_prompt' ? (
                                            <div className="p-4 border rounded bg-slate-50 flex flex-col items-center justify-center h-auto min-h-[16rem]">
                                                {selectedItem.image_url ? (
                                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                                                        <img src={selectedItem.image_url} alt={selectedItem.image_prompt} className="w-full h-full object-cover" />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
                                                            {selectedItem.image_prompt}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon size={48} className="text-slate-300 mb-4" />
                                                        <p className="text-center italic text-slate-600">"{selectedItem.image_prompt}"</p>
                                                        <span className="text-xs text-slate-400 mt-2">Image Placeholder</span>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            /* Standard Slide (Text + Optional Image) */
                                            <div className="flex flex-col gap-6">
                                                {selectedItem.image_url && (
                                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm border border-slate-100">
                                                        <img src={selectedItem.image_url} alt="Slide Visual" className="w-full h-full object-cover" />
                                                    </div>
                                                )}

                                                <div className="prose prose-slate max-w-none">
                                                    {selectedItem.content.split('\n').map((line, i) => {
                                                        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-4">{line.slice(2)}</h1>;
                                                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mb-3">{line.slice(3)}</h2>;
                                                        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                                                        return <p key={i} className="mb-2">{line}</p>;
                                                    })}
                                                    {!selectedItem.content && <p className="text-slate-400 italic">No text content.</p>}
                                                </div>
                                            </div>
                                        )}
                                        {!selectedItem.content && !selectedItem.chart_data && !selectedItem.image_prompt && !selectedItem.image_url && <p className="text-slate-400 italic">No content generated yet.</p>}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col h-full">
                                        {selectedItem.image_url && (
                                            <div className="h-48 bg-slate-100 border-b border-slate-200 relative group">
                                                <img src={selectedItem.image_url} className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                    <button onClick={handleAddImagePrompt} className="bg-white text-slate-800 px-3 py-1 rounded shadow text-sm font-medium">Change Image</button>
                                                </div>
                                            </div>
                                        )}
                                        <textarea
                                            className="flex-1 w-full p-8 outline-none resize-none text-slate-700 leading-relaxed font-sans text-lg"
                                            value={selectedItem.content || ""}
                                            onChange={(e) => {
                                                const newContent = e.target.value;
                                                setSelectedItem({ ...selectedItem, content: newContent });
                                            }}
                                            placeholder="Start writing or generate content with AI..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Refinement Bar */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="max-w-4xl mx-auto flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={refineInstruction}
                                        onChange={(e) => setRefineInstruction(e.target.value)}
                                        placeholder="Ask AI to refine this section..."
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Wand2 size={18} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRefine()}
                                    disabled={refining || !refineInstruction}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                >
                                    {refining ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                    <span>Refine</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <FileText size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Section Selected</h3>
                        <p className="max-w-xs text-center">Select a section from the sidebar to start editing or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Sparkles({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
