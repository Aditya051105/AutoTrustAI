import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, 
    Check, 
    Clock, 
    ShieldCheck, 
    Sparkles, 
    Car, 
    Wrench,
    FileCheck2,
    Store
} from 'lucide-react';

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    variant: string;
    manufacturing_year: number;
    asking_price: string;
    is_verified: boolean;
    has_inspection_booked: boolean;
    trust_score: number | null;
    fair_market_value: string | null;
    images?: Array<{ image_url: string }>;
}

const VehicleStatus = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicleStatus();
    }, [id]);

    const fetchVehicleStatus = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/vehicles/${id}/`);
            setVehicle(res.data);
        } catch (err) {
            console.error("Error fetching vehicle status", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-20 font-bold text-slate-500">Loading Vehicle Lifecycle Tracking...</div>;
    if (!vehicle) return <div className="text-center p-20 text-red-500 font-bold">Vehicle not found or unauthorized.</div>;

    const stages = [
        {
            title: "1. Vehicle Registered & Gallery Uploaded",
            desc: "Technical specs, odometer readings, and gallery photos uploaded to AutoTrust registry.",
            icon: Car,
            completed: true
        },
        {
            title: "2. Certified Mechanic Physical Inspection",
            desc: vehicle.has_inspection_booked 
                ? (vehicle.is_verified || !!vehicle.trust_score
                    ? "Multi-point physical inspection completed by certified AutoTrust technician."
                    : "Inspection booked. Authorized technician assigned to verify engine, transmission, body and diagnostics.")
                : "Awaiting inspection booking by seller.",
            icon: Wrench,
            completed: vehicle.is_verified || !!vehicle.trust_score
        },
        {
            title: "3. AI Neural Diagnostic & Valuation Synthesis",
            desc: vehicle.trust_score 
                ? `AI Engine generated Trust Score: ${vehicle.trust_score}/100 and calculated Fair Market Value.`
                : "Awaiting physical diagnostic metrics to run algorithmic pricing model.",
            icon: Sparkles,
            completed: !!vehicle.trust_score
        },
        {
            title: "4. AutoTrust Verification Certificate Issued",
            desc: vehicle.is_verified 
                ? "Vehicle passed all quality thresholds (Trust Score >= 70) and is certified for buyers."
                : "Pending multi-point score verification.",
            icon: FileCheck2,
            completed: vehicle.is_verified
        },
        {
            title: "5. Live on AutoTrust Marketplace",
            desc: vehicle.is_verified
                ? "Published to thousands of premium verified buyers with full inspection report transparency."
                : "Vehicle will automatically appear on the marketplace once verified.",
            icon: Store,
            completed: vehicle.is_verified
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <Link to="/seller" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 mb-6 transition">
                <ChevronLeft className="w-4 h-4" />
                Back to Garage
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200"
            >
                {/* Vehicle Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 mb-10 border-b border-slate-100">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                            {vehicle.images && vehicle.images.length > 0 ? (
                                <img src={vehicle.images[0].image_url} alt="car" className="w-full h-full object-cover" />
                            ) : (
                                <span className="w-full h-full flex items-center justify-center text-3xl">🚙</span>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Vehicle #{vehicle.id}</span>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{vehicle.brand} {vehicle.model}</h1>
                            <p className="text-xs text-slate-500 font-medium">{vehicle.variant} • {vehicle.manufacturing_year}</p>
                        </div>
                    </div>

                    <div>
                        {vehicle.is_verified ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Verified ★ {vehicle.trust_score}/100
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-amber-600" />
                                In Progress
                            </span>
                        )}
                    </div>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-4 sm:pl-8">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[27px] sm:left-[43px] top-6 bottom-6 w-0.5 bg-slate-200" />

                    <div className="space-y-10">
                        {stages.map((stage, idx) => {
                            const IconComponent = stage.icon;
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative z-10 flex items-start gap-5 sm:gap-6"
                                >
                                    {/* Icon Circle */}
                                    <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-white transition-all duration-300 shadow-sm ${
                                        stage.completed ? 'bg-blue-600 shadow-blue-500/20' : 'bg-slate-200 text-slate-400'
                                    }`}>
                                        {stage.completed ? (
                                            <Check className="w-6 h-6 stroke-[3]" />
                                        ) : (
                                            <IconComponent className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="pt-1.5">
                                        <h3 className={`text-base font-extrabold mb-1 ${stage.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {stage.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-lg">
                                            {stage.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Final Verified Banner */}
                {vehicle.is_verified && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-3xl border border-blue-200 text-center"
                    >
                        <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-black text-slate-900 text-2xl mb-1">Vehicle Verification Complete</h4>
                        <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                            This vehicle has met all physical inspection criteria, OBD diagnostic standards, and AI valuation checks.
                        </p>
                        <Link 
                            to={`/vehicle/${vehicle.id}`} 
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition"
                        >
                            View Live Marketplace Listing →
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default VehicleStatus;
