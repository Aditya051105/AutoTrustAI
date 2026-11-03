import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api/axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AddVehicle from './pages/AddVehicle';
import Marketplace from './pages/Marketplace';
import MechanicDashboard from './pages/MechanicDashboard';
import VehicleStatus from './pages/VehicleStatus';
import VehicleDetail from './pages/VehicleDetail';
import BuyerDashboard from './pages/BuyerDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  LogOut, 
  Wrench, 
  Store, 
  ShoppingBag, 
  X, 
  Search, 
  Phone, 
  Lock, 
  Plus
} from 'lucide-react';

function App() {
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-semibold text-lg text-slate-500">
        Loading AutoTrust AI...
      </div>
    );
  }

  const handleRoleChange = async (newRole: string) => {
    try {
      const response = await api.patch('/users/profile/', { role: newRole });
      const data = response.data;
      if (data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        window.location.reload();
      } else {
        alert("Failed to switch role.");
      }
    } catch {
      alert("Failed to change role.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(headerSearch.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const isActiveTab = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans flex flex-col justify-between">
      {/* 1. Top Utility Header (Dark Automotive Navy) */}
      <div className="bg-[#002244] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold tracking-wide flex items-center gap-1.5 text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              AutoTrust AI Certified Pre-Owned Automotive Network
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">150-Point Standardized Diagnostics</span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <span className="flex items-center gap-1 hover:text-white transition cursor-pointer">
              <Phone className="w-3 h-3 text-blue-400" />
              Support: 1800-AUTOTRUST
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 hover:text-white transition cursor-pointer">
              <Lock className="w-3 h-3 text-emerald-400" />
              Buyer Escrow Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Automotive Brand Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Automotive Emblem Badge Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#002244] via-[#003366] to-[#002244] border-2 border-slate-300 shadow-md group-hover:shadow-lg transition">
              <span className="font-black italic text-lg tracking-wider text-white font-serif uppercase">
                Auto<span className="text-blue-300">Trust</span>
              </span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black rounded-sm bg-gradient-to-r from-amber-400 to-amber-200 text-slate-900 uppercase tracking-tighter">
                AI
              </span>
            </div>
          </Link>

          {/* Central Integrated Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-lg items-center relative">
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Find make, model, or year (e.g. EcoSport, Camry, Tesla)..."
              className="w-full pl-4 pr-11 py-2 bg-slate-50 border border-slate-300 rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#002c6c] hover:bg-[#001f4d] text-white p-1.5 rounded-full shadow-sm transition"
              title="Search inventory"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/seller/add"
              className="hidden lg:inline-flex items-center gap-1.5 bg-[#002c6c] hover:bg-[#001f4d] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              List Car
            </Link>

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#002c6c] transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#002c6c] border border-blue-200 px-2.5 py-1 rounded-md">
                  {user.role}
                </span>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-9 h-9 rounded-full bg-[#002c6c] text-white font-black text-sm flex items-center justify-center border-2 border-slate-200 hover:scale-105 transition shadow-sm"
                  title="Account Management"
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Sub-Navigation Tab Strip (Matching the Mockup Pills) */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 sm:px-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 text-xs font-extrabold uppercase tracking-wider">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-md transition ${isActiveTab('/') ? 'bg-[#002c6c] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              Showroom
            </Link>
            <Link
              to="/marketplace"
              className={`px-4 py-1.5 rounded-md transition ${isActiveTab('/marketplace') ? 'bg-[#002c6c] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              All Models / Marketplace
            </Link>
            <Link
              to="/buyer"
              className={`px-4 py-1.5 rounded-md transition ${isActiveTab('/buyer') ? 'bg-[#002c6c] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              Buyer Hub
            </Link>
            <Link
              to="/seller"
              className={`px-4 py-1.5 rounded-md transition ${isActiveTab('/seller') ? 'bg-[#002c6c] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              Seller Garage
            </Link>
            <Link
              to="/mechanic"
              className={`px-4 py-1.5 rounded-md transition ${isActiveTab('/mechanic') ? 'bg-[#002c6c] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              Mechanic Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#002244] text-white">
                  <h2 className="font-bold text-sm tracking-wide uppercase">Account Settings</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {user && (
                  <div className="p-6 flex flex-col items-center border-b border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-[#002c6c] text-white flex items-center justify-center font-black text-2xl shadow-md mb-3 border-2 border-slate-200">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900">@{user.username}</h3>
                    <p className="text-xs text-slate-400 mb-4">{user.email}</p>
                    
                    {/* Role Switcher */}
                    <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1.5">
                        Switch Active Role:
                      </span>
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-[#002c6c] px-3 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer outline-none"
                      >
                        <option value="BUYER">BUYER (Browse & Make Offers)</option>
                        <option value="SELLER">SELLER (List Cars & Manage Garage)</option>
                        <option value="MECHANIC">MECHANIC (Conduct Inspections)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col gap-2">
                  <Link onClick={() => setIsSidebarOpen(false)} to="/marketplace" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition flex items-center gap-3">
                    <Store className="w-4 h-4 text-blue-600" />
                    Marketplace Inventory
                  </Link>
                  
                  <Link onClick={() => setIsSidebarOpen(false)} to="/buyer" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Buyer Dashboard & Offers
                  </Link>
                  
                  <Link onClick={() => setIsSidebarOpen(false)} to="/seller" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition flex items-center gap-3">
                    <Store className="w-4 h-4 text-blue-600" />
                    Seller Garage & Listings
                  </Link>

                  <Link onClick={() => setIsSidebarOpen(false)} to="/mechanic" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition flex items-center gap-3">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Mechanic Studio
                  </Link>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => { logout(); setIsSidebarOpen(false); navigate('/'); }} 
                  className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Page Body */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/status/:id" element={<VehicleStatus />} />
          
          {/* Dashboard Routes */}
          <Route path="/buyer/*" element={user ? <BuyerDashboard /> : <Login />} />
          <Route path="/seller" element={user ? <SellerDashboard /> : <Login />} />
          <Route path="/seller/add" element={user ? <AddVehicle /> : <Login />} />
          <Route path="/mechanic/*" element={user ? <MechanicDashboard /> : <Login />} />
        </Routes>
      </main>

      {/* 4. Automotive Industry Footer */}
      <footer className="bg-[#001830] text-slate-400 py-12 px-6 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1 rounded-full bg-[#002c6c] border border-blue-400 font-serif font-black text-sm text-white tracking-wider">
                AUTOTRUST <span className="text-amber-400">AI</span>
              </div>
              <span className="text-xs text-slate-400">Certified Pre-Owned Standards & Valuation Authority</span>
            </div>

            <div className="flex flex-wrap gap-6 font-bold text-slate-300">
              <Link to="/marketplace" className="hover:text-white transition">Inventory</Link>
              <Link to="/seller" className="hover:text-white transition">Sell Vehicle</Link>
              <Link to="/mechanic" className="hover:text-white transition">Inspection Portal</Link>
              <Link to="/buyer" className="hover:text-white transition">Buyer Escrow</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 AutoTrust AI Inc. All rights reserved. 150-Point Inspection Standard.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Statement</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Inspection</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Escrow Protection Guarantee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
