import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wrench, 
    CheckCircle2, 
    Clock, 
    Sparkles, 
    Gauge, 
    Fuel, 
    MapPin, 
    Sliders
} from 'lucide-react';

interface Inspection {
    id: number;
    status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
    scheduled_date?: string | null;
    engine_score?: number | null;
    transmission_score?: number | null;
    exterior_score?: number | null;
    interior_score?: number | null;
    electrical_score?: number | null;
    mechanic_notes?: string;
    created_at: string;
    mechanic_name?: string;
    vehicle_details?: {
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
        seller_username?: string;
        images?: Array<{ image_url: string }>;
    };
}

const MechanicDashboard = () => {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    // Inspection Studio Modal State
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
    const [scores, setScores] = useState({
        engine: 90,
        transmission: 90,
        electrical: 90,
        exterior: 85,
        interior: 88,
    });
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inspections/mechanic/');
            setInspections(res.data);
        } catch (err) {
            console.error("Error fetching inspections", err);
        } finally {
            setLoading(false);
        }
    };

    const openInspectionModal = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setScores({
            engine: inspection.engine_score || 90,
            transmission: inspection.transmission_score || 90,
            electrical: inspection.electrical_score || 90,
            exterior: inspection.exterior_score || 85,
            interior: inspection.interior_score || 88,
        });
        setNotes(inspection.mechanic_notes || 'All mechanical checkpoints inspected and verified against AutoTrust standards.');
    };

    const applyPreset = (preset: 'pristine' | 'good' | 'average') => {
        if (preset === 'pristine') {
            setScores({ engine: 96, transmission: 95, electrical: 98, exterior: 92, interior: 95 });
            setNotes('Showroom condition. Engine compression optimal, battery health excellent, suspension tight with zero abnormal noises.');
        } else if (preset === 'good') {
            setScores({ engine: 88, transmission: 87, electrical: 90, exterior: 84, interior: 86 });
            setNotes('Well-maintained pre-owned vehicle. Drivetrain responds crisply. Normal age-consistent exterior minor swirl marks.');
        } else {
            setScores({ engine: 75, transmission: 76, electrical: 80, exterior: 72, interior: 74 });
            setNotes('Standard operating condition with minor preventative maintenance recommended for brake pads and fluid refresh.');
        }
    };

    const handleClaimInspection = async (id: number) => {
        try {
            await api.post(`/inspections/claim/${id}/`);
            fetchInspections();
            alert("Inspection claimed successfully! You can now conduct the diagnostic.");
        } catch (err) {
            alert("Failed to claim inspection.");
        }
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInspection) return;

        try {
            setIsSubmitting(true);
            await api.put(`/inspections/mechanic/${selectedInspection.id}/`, {
                status: 'COMPLETED',
                engine_score: scores.engine,
                transmission_score: scores.transmission,
                electrical_score: scores.electrical,
                exterior_score: scores.exterior,
                interior_score: scores.interior,
                mechanic_notes: notes
            });

            setSelectedInspection(null);
            fetchInspections();
            alert("Diagnostic report submitted! AutoTrust AI Engine has synthesized the Trust Score and updated Market Valuation.");
        } catch (err: any) {
            console.error("Failed to submit inspection", err);
            alert(err.response?.data?.detail || "Failed to submit diagnostic report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const pendingList = inspections.filter((i) => i.status !== 'COMPLETED');
    const completedList = inspections.filter((i) => i.status === 'COMPLETED');

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-600';
        if (score >= 75) return 'text-blue-600';
        return 'text-amber-600';
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-blue-200">
                        <Wrench className="w-3.5 h-3.5" />
                        Certified Inspection Portal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Mechanic Diagnostics Studio</h1>
                    <p className="text-sm text-slate-500 mt-1">Review vehicle physical inspection requests, enter diagnostic checklist scores, and trigger AI valuation.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Pending Requests ({pendingList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Completed ({completedList.length})
                    </button>
                </div>
            </div>

            {/* List Content */}
            {loading ? (
                <div className="py-20 text-center font-bold text-slate-500">Loading Assigned Inspections...</div>
            ) : activeTab === 'pending' ? (
                pendingList.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Pending Inspection Requests</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">All vehicle inspection requests are up to date. New bookings from sellers will automatically appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingList.map((insp) => {
                            const v = insp.vehicle_details;
                            return (
                                <motion.div 
                                    key={insp.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
                                                {insp.status}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                Inspection #{insp.id}
                                            </span>
                                        </div>

                                        {/* Vehicle Header */}
                                        <div className="flex gap-4 items-center mb-4">
                                            <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                                {v?.images && v.images.length > 0 ? (
                                                    <img src={v.images[0].image_url} alt="car" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="w-full h-full flex items-center justify-center text-3xl">🚙</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-extrabold text-xl text-slate-900 truncate">
                                                    {v ? `${v.brand} ${v.model}` : `Vehicle #${insp.id}`}
                                                </h3>
                                                <p className="text-xs text-slate-500 truncate">{v?.variant || 'Standard Trim'}</p>
                                                <p className="text-xs font-semibold text-blue-600 mt-1">₹{parseFloat(v?.asking_price || '0').toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>

                                        {/* Specs preview */}
                                        {v && (
                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-6">
                                                <div className="flex items-center gap-1 truncate">
                                                    <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    <span>{v.mileage.toLocaleString('en-IN')} km</span>
                                                </div>
                                                <div className="flex items-center gap-1 truncate">
                                                    <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    <span>{v.fuel_type}</span>
                                                </div>
                                                <div className="flex items-center gap-1 col-span-2 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                    <span>{v.location}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => openInspectionModal(insp)}
                                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                            <Sliders className="w-4 h-4" />
                                            Open Diagnostic Studio & Score
                                        </button>
                                        {insp.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleClaimInspection(insp.id)}
                                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition"
                                            >
                                                Claim Task First
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )
            ) : (
                completedList.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm">No completed reports in this session yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedList.map((insp) => {
                            const v = insp.vehicle_details;
                            return (
                                <motion.div 
                                    key={insp.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Completed & Verified
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">#{insp.id}</span>
                                    </div>

                                    <div className="flex gap-4 items-center mb-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                            {v?.images && v.images.length > 0 ? (
                                                <img src={v.images[0].image_url} alt="car" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="w-full h-full flex items-center justify-center text-2xl">🚙</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-extrabold text-lg text-slate-900 truncate">
                                                {v ? `${v.brand} ${v.model}` : `Vehicle #${insp.id}`}
                                            </h3>
                                            <p className="text-xs text-slate-500 truncate">{v?.variant}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-5 gap-1.5 text-center bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Engine</span>
                                            <span className="font-black text-xs text-slate-800">{insp.engine_score}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Trans</span>
                                            <span className="font-black text-xs text-slate-800">{insp.transmission_score}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Elec</span>
                                            <span className="font-black text-xs text-slate-800">{insp.electrical_score}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Ext</span>
                                            <span className="font-black text-xs text-slate-800">{insp.exterior_score}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Int</span>
                                            <span className="font-black text-xs text-slate-800">{insp.interior_score}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 mb-4">
                                        "{insp.mechanic_notes}"
                                    </p>

                                    <button
                                        onClick={() => openInspectionModal(insp)}
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                                    >
                                        Re-evaluate / Modify Scores
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Diagnostic Studio Modal */}
            <AnimatePresence>
                {selectedInspection && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 border border-slate-100 max-h-[90vh] overflow-y-auto"
                        >
                            <button 
                                onClick={() => setSelectedInspection(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg"
                            >
                                ✕
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">
                                        Multi-point Diagnostic Studio
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Inspecting {selectedInspection.vehicle_details?.brand} {selectedInspection.vehicle_details?.model} ({selectedInspection.vehicle_details?.variant})
                                    </p>
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div className="mb-6">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Quick Preset Templates
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('pristine')}
                                        className="py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
                                    >
                                        ★ Showroom Pristine
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('good')}
                                        className="py-2 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-100 transition"
                                    >
                                        ✓ Clean Pre-Owned
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('average')}
                                        className="py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition"
                                    >
                                        ⚠ Needs Minor Work
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitReport} className="space-y-5">
                                {/* Sliders */}
                                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span className="text-slate-700">1. Engine Health & Cylinder Compression (Weight 30%)</span>
                                            <span className={`font-black ${getScoreColor(scores.engine)}`}>{scores.engine}/100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="40"
                                            max="100"
                                            value={scores.engine}
                                            onChange={(e) => setScores({ ...scores, engine: Number(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span className="text-slate-700">2. Transmission & Drivetrain Shifts (Weight 25%)</span>
                                            <span className={`font-black ${getScoreColor(scores.transmission)}`}>{scores.transmission}/100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="40"
                                            max="100"
                                            value={scores.transmission}
                                            onChange={(e) => setScores({ ...scores, transmission: Number(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span className="text-slate-700">3. Electrical Systems & OBD-II ECU Scan (Weight 15%)</span>
                                            <span className={`font-black ${getScoreColor(scores.electrical)}`}>{scores.electrical}/100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="40"
                                            max="100"
                                            value={scores.electrical}
                                            onChange={(e) => setScores({ ...scores, electrical: Number(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span className="text-slate-700">4. Exterior Body, Paint & Underchassis (Weight 15%)</span>
                                            <span className={`font-black ${getScoreColor(scores.exterior)}`}>{scores.exterior}/100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="40"
                                            max="100"
                                            value={scores.exterior}
                                            onChange={(e) => setScores({ ...scores, exterior: Number(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span className="text-slate-700">5. Cabin Ergonomics, Seats & A/C Cooling (Weight 15%)</span>
                                            <span className={`font-black ${getScoreColor(scores.interior)}`}>{scores.interior}/100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="40"
                                            max="100"
                                            value={scores.interior}
                                            onChange={(e) => setScores({ ...scores, interior: Number(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Notes Textarea */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Mechanic Diagnostic Observations & Technical Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Note component conditions, remaining brake/tire life, or cosmetic observations..."
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {isSubmitting ? 'Evaluating & Running AI Valuation...' : 'Submit Diagnostic & Execute AI Valuation Engine'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MechanicDashboard;
