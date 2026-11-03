import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Wrench, 
  Gauge, 
  ArrowRight, 
  Tag,
  Smartphone,
  Cpu,
  Award,
  SlidersHorizontal,
  Zap,
  Car,
  Wind
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
  fair_market_value: string | null;
  trust_score: number | null;
  location: string;
  images?: Array<{ image_url: string }>;
}

const SEGMENT_TABS = ['All', 'SUVs', 'Sedans', 'Electric'] as const;
type SegmentTab = typeof SEGMENT_TABS[number];

const FUEL_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] as const;
type FuelOption = typeof FUEL_OPTIONS[number];

const Home = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Customized section state
  const [activeSegment, setActiveSegment] = useState<SegmentTab>('All');
  const [selectedFuels, setSelectedFuels] = useState<FuelOption[]>([]);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [transmission, setTransmission] = useState<'Any' | 'Manual' | 'Automatic'>('Any');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles/');
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles for showroom", err);
    }
  };

  // Hero carousel vehicles (use verified inventory or default showcase items)
  const heroVehicles = vehicles.length > 0 ? vehicles.slice(0, 4) : [
    {
      id: 1,
      brand: 'Ford',
      model: 'EcoSport',
      variant: 'Titanium S 1.5L Automatic',
      manufacturing_year: 2022,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      mileage: 24000,
      asking_price: '980000',
      fair_market_value: '995000',
      trust_score: 96,
      location: 'Bengaluru, KA',
      images: [{ image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=85' }]
    }
  ];

  const currentHero = heroVehicles[activeHeroIndex] || heroVehicles[0];

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % heroVehicles.length);
  };

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + heroVehicles.length) % heroVehicles.length);
  };

  // Segment filter helper
  const getSegmentVehicles = () => {
    let filtered = vehicles;
    if (activeSegment === 'SUVs') {
      filtered = vehicles.filter(v => ['EcoSport', 'Creta', 'Fortuner', 'Tucson', 'Kia Seltos'].some(k => v.model.toLowerCase().includes(k.toLowerCase())) || v.variant?.toLowerCase().includes('suv'));
    } else if (activeSegment === 'Sedans') {
      filtered = vehicles.filter(v => ['Camry', 'City', '3 Series', 'Verna', 'Octavia', 'Ciaz'].some(k => v.model.toLowerCase().includes(k.toLowerCase())));
    } else if (activeSegment === 'Electric') {
      filtered = vehicles.filter(v => v.fuel_type === 'Electric');
    }
    return filtered.slice(0, 4);
  };

  const handleFuelToggle = (fuel: FuelOption) => {
    setSelectedFuels(prev =>
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const handleCustomSearch = () => {
    const params = new URLSearchParams();
    if (selectedFuels.length === 1) params.set('fuel_type', selectedFuels[0]);
    if (maxPrice < 5000000) params.set('max_price', String(maxPrice));
    if (transmission !== 'Any') params.set('transmission', transmission);
    navigate(`/marketplace?${params.toString()}`);
  };


  const gridVehicles = vehicles.length >= 8 
    ? vehicles.slice(0, 8) 
    : vehicles;

  // Corner ribbon styles
  const getRibbonBadge = (idx: number) => {
    if (idx % 3 === 0) {
      return { text: 'CERTIFIED', bg: 'bg-red-600' };
    } else if (idx % 3 === 1) {
      return { text: 'AI VERIFIED', bg: 'bg-emerald-600' };
    } else {
      return { text: 'TOP SCORE', bg: 'bg-blue-600' };
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#f4f6f8]">
      {/* 1. HERO SHOWCASE SECTION (Dark Angular Geometric Automotive Studio) */}
      <section className="relative w-full bg-gradient-to-b from-[#111721] via-[#1a2332] to-[#243042] text-white pt-12 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Subtle geometric perspective lines & background lights */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="50%" y2="40%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 8" />
            <line x1="100%" y1="100%" x2="50%" y2="40%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 8" />
            <polygon points="10%,0% 90%,0% 80%,40% 20%,40%" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
          </svg>
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
            {/* Left Automotive Typography */}
            <div className="lg:col-span-5 text-left space-y-4">
              <motion.div
                key={`title-${currentHero.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-blue-300 bg-white/10 px-2.5 py-1 rounded">
                    Certified Pre-Owned Showcase
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {currentHero.trust_score ? `${currentHero.trust_score}/100 Trust Score` : '96/100'}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  {currentHero.brand} {currentHero.model}
                </h1>
                <p className="text-blue-200 font-extrabold text-sm tracking-widest uppercase mt-1">
                  {currentHero.variant}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-md font-normal">
                  Multi-point physical inspection passed. Engine compression, electronic diagnostics, and mechanical health certified with 0 active trouble codes.
                </p>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/vehicle/${currentHero.id}`}
                    className="bg-[#002c6c] hover:bg-[#001f4d] border border-blue-400/40 text-white px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-blue-500/20"
                  >
                    View Diagnostic Report
                  </Link>
                  <Link
                    to="/marketplace"
                    className="text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition"
                  >
                    Explore All Vehicles <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Showcase Vehicle with Studio Reflection */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentHero.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full max-w-2xl h-[320px] sm:h-[400px] flex items-center justify-center"
                >
                  <img
                    src={currentHero.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=85'}
                    alt={`${currentHero.brand} ${currentHero.model}`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
                  />
                  {/* Subtle studio floor light reflection */}
                  <div className="absolute -bottom-4 left-1/4 right-1/4 h-6 bg-blue-400/20 blur-xl rounded-full" />
                </motion.div>
              </AnimatePresence>

              {/* Carousel Next/Prev Controls */}
              {heroVehicles.length > 1 && (
                <div className="absolute right-0 flex flex-col gap-2 z-20">
                  <button
                    onClick={handlePrevHero}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition"
                    title="Previous showcase vehicle"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextHero}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition"
                    title="Next showcase vehicle"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRIC RIBBON STRIP (White Card Bar Matching the Mockup) */}
      <div className="w-full max-w-6xl -mt-10 px-4 z-20">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 py-4 px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 text-slate-800">
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5 pr-2 pt-2 md:pt-0">
            <div className="p-2.5 bg-blue-50 text-[#002c6c] rounded-lg">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 leading-none">
                ₹{parseFloat(currentHero.fair_market_value || currentHero.asking_price).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Fair Market Value
              </span>
            </div>
            <span className="text-slate-300 font-bold ml-auto hidden md:inline">+</span>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5 md:px-4 pt-2 md:pt-0">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 leading-none">
                {currentHero.trust_score || 96}/100
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AI Trust Score
              </span>
            </div>
            <span className="text-slate-300 font-bold ml-auto hidden md:inline">+</span>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5 md:px-4 pt-2 md:pt-0">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 leading-none">
                150-Point
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mechanic Verified
              </span>
            </div>
            <span className="text-slate-300 font-bold ml-auto hidden md:inline">+</span>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5 pl-2 pt-2 md:pt-0">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 leading-none">
                100% Escrow
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                7-Day Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FEATURED INVENTORY GRID ("SELECT YOUR VERIFIED VEHICLE") */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#002c6c] text-white flex items-center justify-center font-serif italic font-bold text-xs border border-slate-300">
              AT
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Select Your Verified Vehicle
            </h2>
          </div>
          <div className="w-24 h-0.5 bg-[#002c6c] mx-auto rounded-full mt-1 mb-2" />
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            Choose from thoroughly tested pre-owned inventory with guaranteed condition reports.
          </p>
        </div>

        {/* 8-Card Grid (4 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridVehicles.map((v, idx) => {
            const ribbon = getRibbonBadge(idx);
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
              >
                {/* Corner Diagonal Ribbon */}
                <div className={`corner-ribbon ${ribbon.bg} text-white`}>
                  {ribbon.text}
                </div>

                {/* Car Image Area */}
                <div>
                  <div className="relative h-44 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden p-3">
                    {v.images && v.images.length > 0 && v.images[0].image_url ? (
                      <img
                        src={v.images[0].image_url}
                        alt={`${v.brand} ${v.model}`}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-5xl">🚙</span>
                    )}

                    {/* Trust Score Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-slate-200 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{v.trust_score || 90}</span>
                    </div>
                  </div>

                  {/* Car Card Body */}
                  <div className="p-4 text-left">
                    <h3 className="font-extrabold text-base text-slate-900 uppercase truncate">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mb-3">{v.variant} • {v.manufacturing_year}</p>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg mb-3">
                      <span>{v.fuel_type}</span>
                      <span>•</span>
                      <span>{v.transmission}</span>
                      <span>•</span>
                      <span>{v.mileage.toLocaleString('en-IN')} km</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Fair Market Value</span>
                        <span className="font-black text-base text-[#002c6c]">
                          ₹{parseFloat(v.fair_market_value || v.asking_price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-4 pt-0">
                  <Link
                    to={`/vehicle/${v.id}`}
                    className="block text-center w-full bg-[#002c6c] hover:bg-[#001f4d] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-[#002c6c] text-[#002c6c] font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
          >
            Browse Full 100+ Vehicle Inventory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. CUSTOMIZED SECTION */}

      {/* 4A. "Build Your Search" Filter Widget */}
      <section className="w-full bg-gradient-to-br from-[#001830] via-[#002244] to-[#002c6c] py-16 px-4 sm:px-8 relative overflow-hidden">
        {/* Background geometry */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100%,0 100%,100% 40%,100%" fill="rgba(255,255,255,0.04)" />
            <line x1="0" y1="0" x2="60%" y2="100%" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="5 12" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded mb-3">
              <SlidersHorizontal className="w-4 h-4 text-blue-300" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Personalized For You</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
              Build Your Search
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Filter by fuel, price, and transmission to find your perfect certified match.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Fuel Type Toggles */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-3">Fuel Type</p>
              <div className="flex flex-wrap gap-2">
                {FUEL_OPTIONS.map((fuel) => {
                  const fuelIcons: Record<string, React.ReactNode> = {
                    Electric: <Zap className="w-3.5 h-3.5" />,
                    Petrol: <Gauge className="w-3.5 h-3.5" />,
                    Diesel: <Car className="w-3.5 h-3.5" />,
                    Hybrid: <Wind className="w-3.5 h-3.5" />,
                    CNG: <Wind className="w-3.5 h-3.5" />,
                  };
                  const active = selectedFuels.includes(fuel);
                  return (
                    <button
                      key={fuel}
                      onClick={() => handleFuelToggle(fuel)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition ${
                        active
                          ? 'bg-white text-[#002c6c] border-white shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {fuelIcons[fuel]}
                      {fuel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Max Budget</p>
                <span className="text-white font-black text-sm">
                  ₹{(maxPrice / 100000).toFixed(1)}L
                  {maxPrice >= 5000000 && <span className="text-blue-300 font-normal text-xs ml-1">(No Limit)</span>}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹2L</span>
                <span>₹50L+</span>
              </div>
            </div>

            {/* Transmission Radio */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-3">Transmission</p>
              <div className="flex gap-2">
                {(['Any', 'Manual', 'Automatic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransmission(t)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition ${
                      transmission === t
                        ? 'bg-white text-[#002c6c] border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={handleCustomSearch}
                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#002c6c] font-black px-8 py-3.5 rounded-lg text-sm uppercase tracking-wider transition shadow-lg hover:-translate-y-0.5"
              >
                Find Matching Vehicles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4B. Featured By Segment */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-[#002c6c] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                Featured By Segment
              </h2>
            </div>
            <p className="text-xs text-slate-500 pl-3">Curated picks across popular vehicle categories</p>
          </div>

          {/* Segment Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {SEGMENT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSegment(tab)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                  activeSegment === tab
                    ? 'bg-[#002c6c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Segment Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {getSegmentVehicles().length > 0 ? getSegmentVehicles().map((v, idx) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <div className="relative h-44 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-3 overflow-hidden">
                  {v.images && v.images.length > 0 ? (
                    <img
                      src={v.images[0].image_url}
                      alt={`${v.brand} ${v.model}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-5xl">🚙</span>
                  )}
                  {v.trust_score && (
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded shadow border border-slate-200 flex items-center gap-1 text-[10px] font-bold text-slate-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {v.trust_score}
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 bg-[#002c6c] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    {v.fuel_type}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase truncate">{v.brand} {v.model}</h3>
                  <p className="text-[10px] text-slate-500 truncate mb-2">{v.variant} • {v.manufacturing_year}</p>
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
                    <span className="font-black text-sm text-[#002c6c]">
                      ₹{parseFloat(v.fair_market_value || v.asking_price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <Link
                    to={`/vehicle/${v.id}`}
                    className="block text-center w-full bg-[#002c6c] hover:bg-[#001f4d] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-4 py-14 text-center text-slate-400 font-semibold text-sm">
                No {activeSegment === 'All' ? 'vehicles' : activeSegment} in inventory yet.{' '}
                <Link to="/marketplace" className="text-[#002c6c] font-bold hover:underline">Browse all →</Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link
            to={`/marketplace${activeSegment !== 'All' ? `?segment=${activeSegment}` : ''}`}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-[#002c6c] text-[#002c6c] font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
          >
            Browse All {activeSegment !== 'All' ? activeSegment : 'Vehicles'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. VALUE PILLARS (3-Column Feature Cards with Circular Icon Badges) */}
      <section className="w-full bg-[#eef2f6] border-y border-slate-200 py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-[#002c6c] text-[#002c6c] flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base uppercase text-slate-900 tracking-tight mb-1.5">
                  150-Point Inspection
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every vehicle undergoes rigorous hands-on diagnostic testing by certified technicians covering engine compression, transmission, electronics, and underchassis.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-[#002c6c] text-[#002c6c] flex items-center justify-center shrink-0 shadow-md">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base uppercase text-slate-900 tracking-tight mb-1.5">
                  Neural AI Valuation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our algorithmic valuation engine factors in diagnostic metrics, historical usage, and market cohorts to synthesize dynamic 0-100 Trust Scores and Fair Market Values.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-[#002c6c] text-[#002c6c] flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base uppercase text-slate-900 tracking-tight mb-1.5">
                  Buyer Escrow & Warranty
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct peer-to-peer offers secured by escrow holding, complete RTO registration title transfer assistance, and 7-day mechanical return warranty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECONDARY FEATURED SPOTLIGHT (Lower Studio Banner from Mockup) */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#002c6c] bg-blue-50 px-2.5 py-1 rounded">
                Verified Spotlight Pick
              </span>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
                Tesla Model 3 Long Range
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                High-voltage battery state-of-health certified at 98.4%. All autopilot radar sensors calibrated, whisper-quiet dual motor drivetrain, and clean single-owner documentation.
              </p>

              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#002c6c]">₹38,50,000</span>
                <span className="text-xs text-slate-400 line-through">₹39,20,000 FMV</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ★ 95 Trust Score
                </span>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/vehicle/3"
                  className="bg-[#002c6c] hover:bg-[#001f4d] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Inspect Vehicle
                </Link>
                <Link
                  to="/marketplace"
                  className="text-xs font-bold uppercase text-slate-700 hover:text-[#002c6c] tracking-wider transition flex items-center gap-1"
                >
                  Compare All Models &gt;
                </Link>
              </div>
            </div>

            {/* Right Studio Car Render */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="relative w-full max-w-xl h-64 sm:h-80 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1000&auto=format&fit=crop&q=80"
                  alt="Spotlight Vehicle"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
