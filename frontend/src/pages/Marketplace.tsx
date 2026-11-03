import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, Star, Gauge, Fuel, MapPin, RotateCcw, ArrowUpDown } from 'lucide-react';

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    variant: string;
    manufacturing_year: number;
    fuel_type: string;
    transmission: string;
    mileage: number;
    location: string;
    asking_price: string;
    trust_score: number | null;
    fair_market_value: string | null;
    images?: Array<{ image_url: string }>;
}

const Marketplace = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFuel, setSelectedFuel] = useState('All');
    const [selectedTransmission, setSelectedTransmission] = useState('All');
    const [minTrustScore, setMinTrustScore] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState('trust_score');

    useEffect(() => {
        fetchMarketplace();
    }, [sortBy]);

    const fetchMarketplace = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (sortBy) params.sort_by = sortBy;
            const res = await api.get('/vehicles/', { params });
            setVehicles(res.data);
        } catch (err) {
            console.error("Error fetching marketplace", err);
        } finally {
            setLoading(false);
        }
    };

    // Client-side instant filtering
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const matchesSearch = 
                !searchTerm ||
                v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.variant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFuel = selectedFuel === 'All' || v.fuel_type.toLowerCase() === selectedFuel.toLowerCase();
            const matchesTrans = selectedTransmission === 'All' || v.transmission.toLowerCase() === selectedTransmission.toLowerCase();
            const matchesTrust = !minTrustScore || (v.trust_score !== null && v.trust_score >= minTrustScore);
            const matchesPrice = !maxPrice || parseFloat(v.asking_price) <= parseFloat(maxPrice);

            return matchesSearch && matchesFuel && matchesTrans && matchesTrust && matchesPrice;
        });
    }, [vehicles, searchTerm, selectedFuel, selectedTransmission, minTrustScore, maxPrice]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedFuel('All');
        setSelectedTransmission('All');
        setMinTrustScore(0);
        setMaxPrice('');
        setSortBy('trust_score');
    };

    const hasActiveFilters = searchTerm || selectedFuel !== 'All' || selectedTransmission !== 'All' || minTrustScore > 0 || maxPrice !== '';

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header Banner */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    100% Certified Mechanic & AI Inspected
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Verified Vehicle Marketplace
                </h1>
                <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                    Every car listed here has completed multi-point diagnostic checks, validated ownership history, and dynamic AI Trust Scoring.
                </p>
            </motion.div>

            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-10 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search make, model, variant, or city..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-slate-800 text-sm font-medium transition"
                        />
                    </div>

                    {/* Fuel Type */}
                    <div className="w-full sm:w-44">
                        <select
                            value={selectedFuel}
                            onChange={(e) => setSelectedFuel(e.target.value)}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="All">All Fuel Types</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="CNG">CNG</option>
                        </select>
                    </div>

                    {/* Transmission */}
                    <div className="w-full sm:w-44">
                        <select
                            value={selectedTransmission}
                            onChange={(e) => setSelectedTransmission(e.target.value)}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="All">All Transmissions</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>

                    {/* Trust Score Filter */}
                    <div className="w-full sm:w-44">
                        <select
                            value={minTrustScore}
                            onChange={(e) => setMinTrustScore(Number(e.target.value))}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value={0}>Any Trust Score</option>
                            <option value={85}>★ 85+ Trust Score</option>
                            <option value={90}>★ 90+ Pristine</option>
                            <option value={95}>★ 95+ Top Tier</option>
                        </select>
                    </div>

                    {/* Sorting */}
                    <div className="w-full sm:w-48">
                        <div className="relative">
                            <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium text-slate-700 cursor-pointer"
                            >
                                <option value="trust_score">Highest Trust Score</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="mileage_low">Lowest Mileage</option>
                                <option value="newest">Newest Listed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter info & Reset button */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-blue-600" />
                        <span>Showing <strong className="text-slate-800">{filteredVehicles.length}</strong> verified vehicles</span>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-800 transition py-1 px-2.5 rounded-lg hover:bg-blue-50"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-32 space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            ) : filteredVehicles.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-16 text-center rounded-3xl shadow-sm border border-slate-200"
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">No Verified Vehicles Match Your Criteria</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
                        Try clearing or adjusting your search parameters to explore other verified listings.
                    </p>
                    <button
                        onClick={handleResetFilters}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                    >
                        Reset All Filters
                    </button>
                </motion.div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredVehicles.map((v) => (
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                            }}
                            key={v.id} 
                            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
                        >
                            {/* Card Image Area */}
                            <div className="relative h-56 bg-slate-100 overflow-hidden">
                                {v.images && v.images.length > 0 && v.images[0].image_url ? (
                                    <img 
                                        src={v.images[0].image_url} 
                                        alt={`${v.brand} ${v.model}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            if (target.nextElementSibling) {
                                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-medium bg-gradient-to-br from-slate-100 to-slate-200" 
                                    style={{ display: (v.images && v.images.length > 0 && v.images[0].image_url) ? 'none' : 'flex' }}
                                >
                                    <svg className="w-14 h-14 text-slate-300 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                                        <circle cx="7.5" cy="14.5" r="1.5"/>
                                        <circle cx="16.5" cy="14.5" r="1.5"/>
                                    </svg>
                                    <span className="text-xs font-semibold text-slate-500 uppercase">{v.brand} {v.model}</span>
                                </div>

                                {/* Trust Score Badge */}
                                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/40">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="font-extrabold text-slate-900 text-xs">
                                        {v.trust_score ? `${v.trust_score}/100` : 'N/A'}
                                    </span>
                                </div>

                                {/* Verified Tag */}
                                <div className="absolute top-3.5 left-3.5">
                                    <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-extrabold text-2xl text-slate-900 capitalize tracking-tight group-hover:text-blue-600 transition-colors">
                                            {v.brand} {v.model}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                            {v.manufacturing_year}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium mb-4 truncate">{v.variant}</p>

                                    {/* Quick Spec Pills */}
                                    <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Gauge className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{v.mileage.toLocaleString('en-IN')} km</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Fuel className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{v.fuel_type} • {v.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 col-span-2 truncate">
                                            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span>{v.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div>
                                    <div className="pt-2 border-t border-slate-100 flex items-end justify-between mb-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Fair Market Value</p>
                                            <span className="font-black text-2xl text-blue-600 tracking-tight">
                                                ₹{parseFloat(v.fair_market_value || v.asking_price).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        {v.fair_market_value && (
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                Ask: ₹{parseFloat(v.asking_price).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>

                                    <Link 
                                        to={`/vehicle/${v.id}`} 
                                        className="block text-center w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                    >
                                        Inspect Vehicle & Offer →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Marketplace;
