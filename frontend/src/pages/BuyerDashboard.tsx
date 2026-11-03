import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    ExternalLink, 
    ShieldCheck, 
    ChevronRight,
    ShoppingBag
} from 'lucide-react';

interface Offer {
    id: number;
    offer_amount: string;
    message: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    created_at: string;
    vehicle_details?: {
        id: number;
        brand: string;
        model: string;
        variant: string;
        manufacturing_year: number;
        asking_price: string;
        fair_market_value: string;
        location: string;
        images?: Array<{ image_url: string }>;
    };
}

const BuyerDashboard = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/transactions/my-offers/');
            setOffers(res.data);
        } catch (err) {
            console.error("Error fetching offers", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOffer = async (offerId: number) => {
        if (!window.confirm("Are you sure you want to withdraw this offer?")) return;
        try {
            await api.patch(`/transactions/cancel-offer/${offerId}/`, { status: 'CANCELLED' });
            alert("Offer withdrawn successfully.");
            fetchOffers();
        } catch (err) {
            alert("Failed to cancel offer.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Offer Accepted!
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase px-3 py-1 rounded-full">
                        Withdrawn
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Seller Review
                    </span>
                );
        }
    };

    if (loading) {
        return <div className="p-20 text-center font-bold text-slate-500">Loading your purchase activity...</div>;
    }

    const acceptedOffers = offers.filter((o) => o.status === 'ACCEPTED');

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Buyer Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Track purchase offers, review seller acceptances, and finalize secure vehicle purchases.</p>
                </div>
                <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md text-sm transition"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Verified Cars
                </Link>
            </div>

            {/* Accepted Offers Spotlight Banner */}
            {acceptedOffers.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-6 h-6" />
                        <h2 className="text-xl font-black tracking-tight">You have {acceptedOffers.length} Accepted Purchase Offer!</h2>
                    </div>
                    <p className="text-sm text-emerald-100 mb-6 max-w-2xl leading-relaxed">
                        The seller has accepted your terms. AutoTrust Escrow Protection secures your vehicle inspection guarantee, title transfer, and registration paperwork.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs font-medium">
                        <div>
                            <span className="block font-bold text-white mb-0.5">Step 1: Escrow Protection</span>
                            <span className="text-emerald-100">Deposit is safely held in escrow until test drive approval.</span>
                        </div>
                        <div>
                            <span className="block font-bold text-white mb-0.5">Step 2: Title Transfer</span>
                            <span className="text-emerald-100">AutoTrust facilitates official RTO vehicle handover.</span>
                        </div>
                        <div>
                            <span className="block font-bold text-white mb-0.5">Step 3: 7-Day Warranty</span>
                            <span className="text-emerald-100">Enjoy complete peace of mind with our mechanical guarantee.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Offers List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Submitted Purchase Offers</h2>
                    <span className="text-xs font-bold text-slate-400">{offers.length} Total</span>
                </div>

                {offers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🛒</div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No Offers Submitted Yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">Explore the marketplace and submit transparent purchase offers directly to sellers.</p>
                        <Link to="/marketplace" className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition">
                            Explore Verified Inventory <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {offers.map((offer) => {
                            const v = offer.vehicle_details;
                            return (
                                <motion.div 
                                    key={offer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
                                >
                                    {/* Vehicle Info */}
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20 h-20 bg-slate-200 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                                            {v?.images && v.images.length > 0 ? (
                                                <img src={v.images[0].image_url} alt="car" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="w-full h-full flex items-center justify-center text-3xl">🚙</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900">
                                                {v ? `${v.brand} ${v.model}` : `Vehicle #${offer.id}`}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium mb-1">
                                                {v?.variant} • {v?.location}
                                            </p>
                                            {offer.message && (
                                                <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 max-w-md">
                                                    "{offer.message}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Offer Pricing */}
                                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 text-center shrink-0">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Your Offer</span>
                                        <span className="text-2xl font-black text-blue-600 tracking-tight">
                                            ₹{parseFloat(offer.offer_amount).toLocaleString('en-IN')}
                                        </span>
                                        {v?.asking_price && (
                                            <span className="block text-[11px] text-slate-400 mt-0.5">
                                                Ask: ₹{parseFloat(v.asking_price).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status & Action */}
                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        {getStatusBadge(offer.status)}
                                        <div className="flex gap-2">
                                            {v?.id && (
                                                <Link 
                                                    to={`/vehicle/${v.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    View Car <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                            {offer.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleCancelOffer(offer.id)}
                                                    className="text-xs font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    Cancel Offer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
