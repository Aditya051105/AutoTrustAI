import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowRight, UserPlus } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('BUYER');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await api.post('/users/register/', { username, password, email, role, phone });
            navigate('/login');
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: Record<string, unknown> } };
            const data = errorObj.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join(' ');
                setError(messages || 'Registration failed.');
            } else {
                setError('Registration failed. Server unreachable.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex justify-center items-center py-12 px-4 bg-[#f4f6f8]">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#002c6c] text-white flex items-center justify-center font-serif italic font-black text-xl border-2 border-blue-200 mx-auto mb-3 shadow-md">
                        AT
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                        Create an Account
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Join AutoTrust AI as Buyer, Seller, or Certified Mechanic
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-xs font-semibold">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Account Role
                        </label>
                        <select 
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="BUYER">Buyer (Explore & Make Offers)</option>
                            <option value="SELLER">Seller (List Cars & Manage Garage)</option>
                            <option value="MECHANIC">Mechanic (Diagnostic Inspections)</option>
                            <option value="MANAGER">Service Center Manager</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="Choose username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Phone (Optional)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002c6c] focus:bg-white transition"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-xs font-black uppercase tracking-wider text-white bg-[#002c6c] hover:bg-[#001f4d] focus:outline-none transition disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                Register Account <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Already registered?</span>
                    <Link to="/login" className="font-bold text-[#002c6c] hover:underline flex items-center gap-1">
                        Sign In <UserPlus className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
