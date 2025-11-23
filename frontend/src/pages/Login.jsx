import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { loginWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (error) {
            console.error("Failed to log in", error);
        }
    }

    if (currentUser) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
