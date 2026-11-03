import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const doLogin = async (user: string, pass: string) => {
        setError('');
        setIsLoading(true);
        try {
            const res = await api.post('/users/login/', { username: user, password: pass });
            login(res.data.access, res.data.refresh);
            navigate('/');
        } catch (err: unknown) {
            setError('Invalid username or password. Please verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await doLogin(username, password);
    };

    const handleQuickLogin = async (demoUser: string) => {
        setUsername(demoUser);
        setPassword('password123');
        await doLogin(demoUser, 'password123');
    };

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 bg-[#f4f6f8]">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-[#002c6c] text-white flex items-center justify-center font-serif italic font-black text-xl border-2 border-blue-200 mx-auto mb-3 shadow-md">
                        AT
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                        Sign In to AutoTrust AI
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Access your Garage, Inspection Studio, and Buyer Portfolio
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-5 text-xs font-semibold">
                        {error}
                    </div>
                )}

                {/* 1-Click Demo Accounts */}
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#002c6c]" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                            1-Click Demo Quick Logins
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => handleQuickLogin('demo_seller')}
                            className="bg-white hover:bg-blue-50 border border-slate-300 hover:border-[#002c6c] text-slate-800 hover:text-[#002c6c] py-2 px-1 text-[11px] font-bold rounded-lg transition shadow-sm text-center"
                        >
                            🚗 Seller
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin('demo_mechanic')}
                            className="bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-700 py-2 px-1 text-[11px] font-bold rounded-lg transition shadow-sm text-center"
                        >
                            🔧 Mechanic
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin('demo_buyer')}
                            className="bg-white hover:bg-purple-50 border border-slate-300 hover:border-purple-600 text-slate-800 hover:text-purple-700 py-2 px-1 text-[11px] font-bold rounded-lg transition shadow-sm text-center"
                        >
                            💼 Buyer
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                        Password prefilled: <span className="font-mono text-slate-600 font-bold">password123</span>
                    </p>
                </div>

                {/* Standard Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-xs font-black uppercase tracking-wider text-white bg-[#002c6c] hover:bg-[#001f4d] focus:outline-none transition disabled:opacity-50"
                    >
                        {isLoading ? 'Authenticating...' : (
                            <>
                                Sign In <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="font-bold text-[#002c6c] hover:underline flex items-center gap-1">
                        Register <ShieldCheck className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
