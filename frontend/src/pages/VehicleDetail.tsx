import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldCheck, 
    Star, 
    Gauge, 
    Fuel, 
    MapPin, 
    Calendar, 
    CheckCircle, 
    AlertTriangle, 
    ChevronLeft, 
    Sparkles, 
    Send,
    UserCheck,
    Wrench
} from 'lucide-react';

interface InspectionReport {
    id?: number;
    status: string;
    engine_score: number;
    transmission_score: number;
    exterior_score: number;
    interior_score: number;
    electrical_score: number;
    mechanic_notes: string;
}

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    variant: string;
    manufacturing_year: number;
    registration_year: number;
    fuel_type: string;
    transmission: string;
    mileage: number;
    color: string;
    number_of_owners: number;
    location: string;
    asking_price: string;
    is_verified: boolean;
    has_inspection_booked: boolean;
    trust_score: number | null;
    fair_market_value: string | null;
    recommended_selling_price: string | null;
    repair_estimate: string | null;
    seller_username?: string;
    seller_email?: string;
    seller_phone?: string;
    images?: Array<{ id: number; image_url: string; is_primary: boolean }>;
    latest_inspection?: InspectionReport | null;
}

const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Offer Modal State
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerAmount, setOfferAmount] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    const [submittingOffer, setSubmittingOffer] = useState(false);
    const [offerSuccessMsg, setOfferSuccessMsg] = useState('');

    useEffect(() => {
        fetchVehicleDetail();
    }, [id]);

    const fetchVehicleDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get(`/vehicles/${id}/`);
            setVehicle(res.data);
            if (res.data.asking_price) {
                setOfferAmount(Math.round(parseFloat(res.data.asking_price)).toString());
            }
        } catch (err: any) {
            console.error("Error fetching vehicle details", err);
            setError("Vehicle could not be found or has been removed.");
        } finally {
            setLoading(false);
        }
    };

    const handleOfferSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'BUYER') {
            alert("Only users with the BUYER role can submit purchase offers. You can switch your role in the profile menu.");
            return;
        }

        try {
            setSubmittingOffer(true);
            await api.post('/transactions/make-offer/', {
                vehicle: vehicle?.id,
                offer_amount: offerAmount,
                message: offerMessage
            });
            setOfferSuccessMsg("Offer sent to seller successfully! You can track status in your Buyer Dashboard.");
            setTimeout(() => {
                setShowOfferModal(false);
                setOfferSuccessMsg('');
            }, 2000);
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to submit offer. Please check your inputs.");
        } finally {
            setSubmittingOffer(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-semibold text-slate-500">Loading Full Inspection Data...</p>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-3xl shadow-sm border border-slate-200">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Vehicle Not Found</h2>
                <p className="text-slate-500 mb-6">{error || "The requested listing does not exist."}</p>
                <Link to="/marketplace" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];
    const activeImage = images[activeImageIndex]?.image_url || '';

    // Calculate score color
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    const getScoreBarColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 75) return 'bg-blue-600';
        return 'bg-amber-500';
    };

    const askingVal = parseFloat(vehicle.asking_price || '0');
    const fmvVal = parseFloat(vehicle.fair_market_value || vehicle.asking_price || '0');
    const priceDiff = askingVal - fmvVal;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between mb-6">
                <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>

                <div className="flex items-center gap-2">
                    <Link to={`/status/${vehicle.id}`} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5" />
                        Verification Timeline
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Gallery & Specifications */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Main Photo Gallery */}
                    <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200">
                        <div className="relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden bg-slate-100">
                            {activeImage ? (
                                <img 
                                    src={activeImage} 
                                    alt={`${vehicle.brand} ${vehicle.model}`} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-6xl mb-2">🚙</span>
                                    <span className="text-sm font-semibold">{vehicle.brand} {vehicle.model}</span>
                                </div>
                            )}

                            {/* Trust Badge overlay */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/40">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="font-black text-slate-900 text-sm">
                                    {vehicle.trust_score ? `${vehicle.trust_score}/100 Trust Score` : 'Inspection Pending'}
                                </span>
                            </div>

                            <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center gap-1.5 backdrop-blur-sm px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full shadow-md ${vehicle.is_verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                    <ShieldCheck className="w-4 h-4" />
                                    {vehicle.is_verified ? 'Verified Vehicle' : 'Inspection Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail selector */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vehicle Specifications Grid */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Technical Specifications</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Gauge className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Odometer</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.mileage.toLocaleString('en-IN')} km</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Fuel className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Powertrain</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.fuel_type} • {vehicle.transmission}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Model Year</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.manufacturing_year} (Reg {vehicle.registration_year})</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Ownership</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.number_of_owners} {vehicle.number_of_owners === 1 ? 'First Owner' : 'Previous Owners'}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Registered City</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.location}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-slate-400 font-bold">Exterior Color</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{vehicle.color}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing, AI Report & Make Offer */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Header Details Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="mb-4">
                            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">{vehicle.brand} Official</span>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{vehicle.brand} {vehicle.model}</h1>
                            <p className="text-slate-500 font-medium text-sm mt-0.5">{vehicle.variant}</p>
                        </div>

                        {/* Price Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 my-6">
                            <div className="flex items-baseline justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">AI Fair Market Value</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                                    {priceDiff <= 0 ? 'Priced At / Below Market' : 'Slight Premium'}
                                </span>
                            </div>
                            <div className="text-4xl font-black text-blue-600 tracking-tight">
                                ₹{fmvVal.toLocaleString('en-IN')}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs font-medium text-slate-600">
                                <span>Seller Asking Price:</span>
                                <strong className="text-slate-900 font-bold text-sm">₹{askingVal.toLocaleString('en-IN')}</strong>
                            </div>

                            {vehicle.recommended_selling_price && (
                                <div className="flex items-center justify-between mt-1 text-xs font-medium text-slate-500">
                                    <span>AI Suggested Benchmark:</span>
                                    <span>₹{parseFloat(vehicle.recommended_selling_price).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                        </div>

                        {/* Make Offer CTA */}
                        <button
                            onClick={() => setShowOfferModal(true)}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Make Instant Purchase Offer
                        </button>
                        
                        <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                            No immediate charge. The seller will review and respond directly.
                        </p>
                    </div>

                    {/* AI & Mechanic Diagnostic Report Card */}
                    {vehicle.latest_inspection && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-extrabold text-lg text-slate-900">AI Diagnostic Scorecard</h3>
                                </div>
                                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getScoreColor(vehicle.trust_score || 80)}`}>
                                    {vehicle.trust_score ? `${vehicle.trust_score}/100 Score` : 'Pending'}
                                </span>
                            </div>

                            {/* Component Sub-scores */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                        <span>Engine & Drivetrain Compression</span>
                                        <span>{vehicle.latest_inspection.engine_score}/100</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(vehicle.latest_inspection.engine_score)}`}
                                            style={{ width: `${vehicle.latest_inspection.engine_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                        <span>Transmission & Gear Engagement</span>
                                        <span>{vehicle.latest_inspection.transmission_score}/100</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(vehicle.latest_inspection.transmission_score)}`}
                                            style={{ width: `${vehicle.latest_inspection.transmission_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                        <span>Electrical, ECU & OBD-II Scan</span>
                                        <span>{vehicle.latest_inspection.electrical_score}/100</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(vehicle.latest_inspection.electrical_score)}`}
                                            style={{ width: `${vehicle.latest_inspection.electrical_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                        <span>Exterior Body, Paint & Chasis</span>
                                        <span>{vehicle.latest_inspection.exterior_score}/100</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(vehicle.latest_inspection.exterior_score)}`}
                                            style={{ width: `${vehicle.latest_inspection.exterior_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                        <span>Cabin, Air Conditioning & Interior</span>
                                        <span>{vehicle.latest_inspection.interior_score}/100</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(vehicle.latest_inspection.interior_score)}`}
                                            style={{ width: `${vehicle.latest_inspection.interior_score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mechanic's Notes */}
                            {vehicle.latest_inspection.mechanic_notes && (
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                    <span className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                        Inspector Diagnostic Observations
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-line">
                                        "{vehicle.latest_inspection.mechanic_notes}"
                                    </p>
                                </div>
                            )}

                            {/* Estimated Repair Cost */}
                            {vehicle.repair_estimate && parseFloat(vehicle.repair_estimate) > 0 ? (
                                <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
                                    <span>Estimated Maintenance / Repair Needs:</span>
                                    <span className="text-amber-900 font-extrabold">₹{parseFloat(vehicle.repair_estimate).toLocaleString('en-IN')}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>Clean condition: ₹0 urgent repair work identified</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Offer Modal */}
            <AnimatePresence>
                {showOfferModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-100"
                        >
                            <button 
                                onClick={() => setShowOfferModal(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg"
                            >
                                ✕
                            </button>

                            <h3 className="text-2xl font-black text-slate-900 mb-1">Submit Purchase Offer</h3>
                            <p className="text-xs text-slate-500 mb-6 font-medium">
                                For {vehicle.brand} {vehicle.model} ({vehicle.variant})
                            </p>

                            {offerSuccessMsg ? (
                                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center border border-emerald-200">
                                    {offerSuccessMsg}
                                </div>
                            ) : (
                                <form onSubmit={handleOfferSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Your Offer Amount (₹)
                                        </label>
                                        <input 
                                            type="number"
                                            required
                                            value={offerAmount}
                                            onChange={(e) => setOfferAmount(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-black text-xl text-slate-800 outline-none"
                                            placeholder="Enter offer amount..."
                                        />
                                        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                            <span>Fair Market: ₹{fmvVal.toLocaleString('en-IN')}</span>
                                            <span>Asking: ₹{askingVal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Message to Seller (Optional)
                                        </label>
                                        <textarea
                                            value={offerMessage}
                                            onChange={(e) => setOfferMessage(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm font-medium text-slate-800 outline-none"
                                            placeholder="Introduce yourself or mention your readiness to inspect/close..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingOffer}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 mt-2"
                                    >
                                        {submittingOffer ? 'Submitting Offer...' : 'Send Offer to Seller'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehicleDetail;
