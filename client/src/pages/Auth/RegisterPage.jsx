import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(username, email, password);
            toast.success('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to create account. Please try again.');
            toast.error(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">

            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            <div className="relative w-full max-w-md px-6">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-6">
                            <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
                            Create an account
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Start your AI-powered learning experience
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                Username
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                                    focusedField === 'username' ? 'text-emerald-500' : 'text-slate-400'
                                }`}>
                                    <User className="h-5 w-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors duration-200"
                                    placeholder="yourusername"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                                    focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                                }`}>
                                    <Mail className="h-5 w-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors duration-200"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                                    focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                                }`}>
                                    <Lock className="h-5 w-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors duration-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-medium overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-opacity duration-200"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    'Creating account...'
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                            Sign in
                        </Link>
                    </p>

                    {/* Subtle Footer Text */}
                    <p className="text-xs text-slate-400">
                        By continuing, you agree to our Terms & Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;