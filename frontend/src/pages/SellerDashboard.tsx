import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    ShieldCheck, 
    Clock, 
    AlertCircle, 
    Check, 
    X, 
    Trash2, 
    ExternalLink, 
    Gauge, 
    Fuel, 
    MapPin,
    Car,
    Tag,
    ChevronDown,
    ChevronUp,
    BarChart3
} from 'lucide-react';

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    variant: string;
    manufacturing_year: number;
    fuel_type: string;
    transmission: string;
    mileage: number;
    asking_price: string;
    location: string;
    is_verified: boolean;
    has_inspection_booked: boolean;
    trust_score?: number | null;
    fair_market_value?: string | null;
    images?: Array<{ image_url: string }>;
}

interface Offer {
    id: number;
    offer_amount: string;
    message: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    created_at: string;
    buyer?: number;
    vehicle_details?: {
        id: number;
        brand: string;
        model: string;
        variant: string;
        asking_price: string;
        fair_market_value: string;
        images?: Array<{ image_url: string }>;
    };
}

const getStatusConfig = (v: Vehicle) => {
    if (v.is_verified) return {
        label: '✓ CERTIFIED & LIVE',
        ribbonBg: 'bg-emerald-600',
        badgeBg: 'bg-emerald-500/95',
        borderAccent: 'border-l-4 border-emerald-500',
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
    };
    if (v.has_inspection_booked) return {
        label: '⏱ INSPECTION PENDING',
        ribbonBg: 'bg-amber-500',
        badgeBg: 'bg-amber-500/95',
        borderAccent: 'border-l-4 border-amber-500',
        icon: <Clock className="w-3.5 h-3.5" />,
    };
    return {
        label: '⚠ NEEDS INSPECTION',
        ribbonBg: 'bg-slate-600',
        badgeBg: 'bg-slate-600/95',
        borderAccent: 'border-l-4 border-slate-400',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
    };
};

const SellerDashboard = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [offersExpanded, setOffersExpanded] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [vehRes, offRes] = await Promise.all([
                api.get('/vehicles/my-vehicles/'),
                api.get('/transactions/incoming/')
            ]);
            setVehicles(vehRes.data);
            setOffers(offRes.data);
        } catch (err) {
            console.error("Error fetching seller data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookInspection = async (vehicleId: number) => {
        try {
            await api.post('/inspections/book/', { vehicle: vehicleId });
            alert("Inspection booked! An authorized AutoTrust mechanic will claim and complete the diagnostic.");
            fetchData();
        } catch (err) {
            alert("Failed to book inspection.");
        }
    };

    const handleDeleteVehicle = async (vehicleId: number) => {
        if (!window.confirm("Remove this vehicle listing permanently?")) return;
        try {
            await api.delete(`/vehicles/delete/${vehicleId}/`);
            fetchData();
        } catch (err) {
            alert("Failed to delete listing.");
        }
    };

    const handleOfferStatus = async (offerId: number, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await api.patch(`/transactions/manage/${offerId}/`, { status });
            fetchData();
        } catch (err) {
            alert("Failed to update offer status.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#002c6c] flex items-center justify-center animate-pulse">
                        <Car className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-wider">Loading Your Garage...</p>
                </div>
            </div>
        );
    }

    const verifiedCount = vehicles.filter((v) => v.is_verified).length;
    const pendingInspectionCount = vehicles.filter((v) => !v.is_verified && v.has_inspection_booked).length;
    const pendingOffers = offers.filter((o) => o.status === 'PENDING');

    return (
        <div className="min-h-screen bg-[#f4f6f8]">

            {/* ── GARAGE HERO BANNER ── */}
            <div className="relative bg-gradient-to-r from-[#001830] via-[#002244] to-[#002c6c] text-white overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 60%,0 50%,100% 0,100%" fill="rgba(255,255,255,0.03)" />
                        <line x1="0" y1="100%" x2="70%" y2="0" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="6 10" />
                    </svg>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-lg">
                            <span className="font-black text-white text-lg italic font-serif">AT</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold tracking-widest uppercase text-blue-300 mb-0.5">AutoTrust Seller Portal</p>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                                My Garage
                            </h1>
                            <p className="text-slate-300 text-xs mt-1">
                                Manage inventory · Monitor inspections · Negotiate buyer offers
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/seller/add"
                        className="inline-flex items-center gap-2 bg-white text-[#002c6c] hover:bg-blue-50 font-black px-6 py-3 rounded-lg shadow-md text-sm uppercase tracking-wider transition hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" />
                        List New Vehicle
                    </Link>
                </div>
            </div>

            {/* ── 4 STAT METRIC CARDS ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-5 z-10 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Total Listed',
                            value: vehicles.length,
                            icon: <Car className="w-5 h-5" />,
                            iconBg: 'bg-[#002c6c]',
                            accent: 'border-l-4 border-[#002c6c]',
                        },
                        {
                            label: 'AI Verified',
                            value: verifiedCount,
                            icon: <ShieldCheck className="w-5 h-5" />,
                            iconBg: 'bg-emerald-600',
                            accent: 'border-l-4 border-emerald-500',
                        },
                        {
                            label: 'Under Inspection',
                            value: pendingInspectionCount,
                            icon: <Clock className="w-5 h-5" />,
                            iconBg: 'bg-amber-500',
                            accent: 'border-l-4 border-amber-400',
                        },
                        {
                            label: 'Active Offers',
                            value: pendingOffers.length,
                            icon: <Tag className="w-5 h-5" />,
                            iconBg: 'bg-violet-600',
                            accent: 'border-l-4 border-violet-500',
                        },
                    ].map((stat) => (
                        <div key={stat.label} className={`bg-white ${stat.accent} rounded-lg shadow-sm p-5 flex items-center gap-4`}>
                            <div className={`w-11 h-11 ${stat.iconBg} text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                                {stat.icon}
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">{stat.label}</span>
                                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── VEHICLE INVENTORY ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-[#002c6c] rounded-full" />
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Vehicle Inventory</h2>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {vehicles.length} listings
                        </span>
                    </div>
                </div>

                {vehicles.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
                            <Car className="w-10 h-10 text-[#002c6c]" />
                        </div>
                        <h3 className="text-lg font-black uppercase text-slate-900 mb-2">Your Garage Is Empty</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                            List your vehicle to unlock the AutoTrust inspection pipeline and sell at peak certified value.
                        </p>
                        <Link to="/seller/add" className="inline-flex items-center gap-2 bg-[#002c6c] hover:bg-[#001f4d] text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-sm">
                            <Plus className="w-4 h-4" />
                            Add Your First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {vehicles.map((v, idx) => {
                                const statusCfg = getStatusConfig(v);
                                return (
                                    <motion.div
                                        key={v.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: idx * 0.07 }}
                                        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group border border-slate-100 hover:-translate-y-1 ${statusCfg.borderAccent}`}
                                    >
                                        {/* Corner Ribbon */}
                                        <div className={`corner-ribbon ${statusCfg.ribbonBg} text-white`}>
                                            {v.is_verified ? 'VERIFIED' : v.has_inspection_booked ? 'PENDING' : 'UNLISTED'}
                                        </div>

                                        {/* Vehicle Image */}
                                        <div className="relative h-52 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                                            {v.images && v.images.length > 0 ? (
                                                <img
                                                    src={v.images[0].image_url}
                                                    alt={`${v.brand} ${v.model}`}
                                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            ) : (
                                                <span className="text-6xl">🚙</span>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center gap-1.5 ${statusCfg.badgeBg} text-white backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow`}>
                                                    {statusCfg.icon}
                                                    {statusCfg.label}
                                                </span>
                                            </div>

                                            {/* Trust Score Chip */}
                                            {v.trust_score && (
                                                <div className="absolute top-3 right-3 bg-white/95 border border-slate-200 px-2.5 py-1 rounded shadow-sm flex items-center gap-1 text-[11px] font-black text-slate-800">
                                                    <BarChart3 className="w-3.5 h-3.5 text-[#002c6c]" />
                                                    {v.trust_score}
                                                    <span className="text-slate-400 font-normal">/100</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex-1">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight truncate">
                                                    {v.brand} {v.model}
                                                </h3>
                                                <span className="text-xs font-bold text-slate-400 shrink-0 ml-2">{v.manufacturing_year}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate mb-4">{v.variant}</p>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <Gauge className="w-3.5 h-3.5 text-[#002c6c] shrink-0" />
                                                    <span>{v.mileage.toLocaleString('en-IN')} km</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <Fuel className="w-3.5 h-3.5 text-[#002c6c] shrink-0" />
                                                    <span>{v.fuel_type}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 col-span-2 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-[#002c6c] shrink-0" />
                                                    <span>{v.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                                                <div>
                                                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Asking Price</span>
                                                    <span className="text-lg font-black text-slate-900">
                                                        ₹{parseFloat(v.asking_price).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                {v.fair_market_value && (
                                                    <div className="text-right">
                                                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">AI FMV</span>
                                                        <span className="text-sm font-bold text-[#002c6c]">
                                                            ₹{parseFloat(v.fair_market_value).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dark Navy Action Footer */}
                                        <div className="bg-[#002244] px-4 py-3 flex items-center gap-2">
                                            <Link
                                                to={`/status/${v.id}`}
                                                className="flex-1 text-center py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-[11px] uppercase tracking-wider transition"
                                            >
                                                Track Timeline
                                            </Link>
                                            {v.is_verified ? (
                                                <Link
                                                    to={`/vehicle/${v.id}`}
                                                    className="flex-1 text-center py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1"
                                                >
                                                    Live Listing <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            ) : !v.has_inspection_booked ? (
                                                <button
                                                    onClick={() => handleBookInspection(v.id)}
                                                    className="flex-1 py-2 bg-amber-400/90 hover:bg-amber-400 text-slate-900 rounded font-bold text-[11px] uppercase tracking-wider transition"
                                                >
                                                    Book Mechanic
                                                </button>
                                            ) : (
                                                <span className="flex-1 text-center py-2 bg-amber-400/20 text-amber-300 rounded font-bold text-[11px] uppercase tracking-wider">
                                                    Awaiting Mechanic
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVehicle(v.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 rounded transition"
                                                title="Remove listing"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* ── INCOMING OFFERS SECTION ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
                <div
                    className="bg-[#002244] rounded-t-xl px-6 py-4 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setOffersExpanded(!offersExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-400 rounded-full" />
                        <h2 className="text-white font-black text-lg uppercase tracking-tight">
                            Incoming Buyer Offers
                        </h2>
                        {pendingOffers.length > 0 && (
                            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {pendingOffers.length} Pending
                            </span>
                        )}
                    </div>
                    <button className="text-white/60 hover:text-white transition">
                        {offersExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                <AnimatePresence>
                    {offersExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
                                {offers.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                            <Tag className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                            No offers yet. Verified vehicles with high Trust Scores typically attract offers within 48 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {offers.map((offer, idx) => {
                                            const v = offer.vehicle_details;
                                            const askingNum = parseFloat(v?.asking_price || '0');
                                            const offerNum = parseFloat(offer.offer_amount);
                                            const offerPct = askingNum > 0 ? Math.min((offerNum / askingNum) * 100, 100) : 0;
                                            const isAbove = offerNum >= askingNum;

                                            return (
                                                <motion.div
                                                    key={offer.id}
                                                    initial={{ opacity: 0, x: -12 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.07 }}
                                                    className="p-6 flex flex-col md:flex-row md:items-center gap-6"
                                                >
                                                    {/* Vehicle Thumb */}
                                                    <div className="w-24 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                                        {v?.images && v.images.length > 0 ? (
                                                            <img src={v.images[0].image_url} alt="car" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-2xl">🚙</div>
                                                        )}
                                                    </div>

                                                    {/* Vehicle & Offer Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-black text-base text-slate-900 uppercase truncate">
                                                            {v ? `${v.brand} ${v.model}` : 'Vehicle Offer'}
                                                        </h3>
                                                        <p className="text-[11px] text-slate-500 mb-2">
                                                            Asking: ₹{askingNum.toLocaleString('en-IN')}
                                                        </p>

                                                        {/* Offer vs Asking bar */}
                                                        <div className="mb-2">
                                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                                <span>Offer vs Asking</span>
                                                                <span className={isAbove ? 'text-emerald-600' : 'text-amber-600'}>
                                                                    {offerPct.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${isAbove ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                                                    style={{ width: `${offerPct}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {offer.message && (
                                                            <p className="text-[11px] text-slate-500 italic bg-slate-50 rounded px-2 py-1 max-w-sm truncate">
                                                                "{offer.message}"
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Offer Amount Box */}
                                                    <div className="bg-[#002c6c]/5 border border-[#002c6c]/15 px-6 py-4 rounded-xl text-center shrink-0">
                                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Offered</span>
                                                        <span className="text-2xl font-black text-[#002c6c] tracking-tight">
                                                            ₹{offerNum.toLocaleString('en-IN')}
                                                        </span>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-col gap-2 shrink-0">
                                                        {offer.status === 'PENDING' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleOfferStatus(offer.id, 'ACCEPTED')}
                                                                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition shadow-sm uppercase tracking-wider"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOfferStatus(offer.id, 'REJECTED')}
                                                                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-lg text-xs transition uppercase tracking-wider"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                    Decline
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-center ${offer.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                                {offer.status}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default SellerDashboard;
