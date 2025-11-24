import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, Lock, Loader } from 'lucide-react';

export default function Login() {
    const { loginWithGoogle, signup, login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGoogleLogin() {
        try {
            setError("");
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (error) {
            console.error("Failed to log in", error);
            setError("Failed to log in with Google.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/');
        } catch (error) {
            console.error("Auth error", error);
            setError(isLogin ? "Failed to log in. Check your credentials." : "Failed to create account.");
        } finally {
            setLoading(false);
        }
    }

    if (currentUser) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden items-center justify-center text-white p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Sparkles size={32} className="text-indigo-200" />
                        </div>
                        <h1 className="text-4xl font-bold font-display">Ocean AI</h1>
                    </div>
                    <h2 className="text-5xl font-bold mb-6 leading-tight">
                        Craft Documents <br />
                        <span className="text-indigo-300">at the Speed of Thought</span>
                    </h2>
                    <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                        Generate professional Word documents and PowerPoint presentations in seconds using advanced AI. Refine, edit, and export with ease.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 font-display mb-2">
                                {isLogin ? "Welcome Back" : "Create Account"}
                            </h2>
                            <p className="text-slate-500">
                                {isLogin ? "Sign in to continue to your workspace" : "Get started with your free account"}
                            </p>
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="input-field pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input-field pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Sign Up")}
                            </button>
                        </form>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group shadow-sm"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            <span>Google</span>
                        </button>

                        <div className="mt-8 text-center text-sm text-slate-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
