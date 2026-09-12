'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Sparkles,
  Wifi,
  Zap,
  Volume2,
  Clock,
  BookOpen,
  Coffee,
  Building2,
  Compass,
  ArrowRight,
  Video,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';

interface CampusSpot {
  id: string;
  name: string;
  category: 'ACADEMIC' | 'LIBRARY' | 'FOOD' | 'HOSTEL' | 'RECREATION';
  coordinates: { x: number; y: number }; // percentage on 1000x700 map canvas
  description: string;
  recommendedFor: string;
  noiseLevel: 'Silent (15 dB)' | 'Quiet (30 dB)' | 'Moderate (45 dB)' | 'Lively (65 dB)';
  wifiSpeed: string;
  outlets: 'Abundant (Every Desk)' | 'Good (Window Seats)' | 'Limited';
  operatingHours: string;
  studyTips: string[];
}

const CAMPUS_SPOTS: CampusSpot[] = [
  {
    id: 'block-34',
    name: 'Block 34 (School of Computer Science & Engineering)',
    category: 'ACADEMIC',
    coordinates: { x: 380, y: 260 },
    description: 'The epicenter of coding at LPU. Houses cutting-edge Mac labs, Cloud Computing clusters, and AI research stations.',
    recommendedFor: 'Hackathons, DSA coding sprints, peer group project debugging.',
    noiseLevel: 'Moderate (45 dB)',
    wifiSpeed: '380 Mbps (5GHz eduroam)',
    outlets: 'Abundant (Every Desk)',
    operatingHours: '08:00 AM – 09:00 PM',
    studyTips: [
      'Floors 2 & 3 have open developer pods with whiteboards.',
      'Ground floor foyer is great for quick doubt resolution before lectures.'
    ]
  },
  {
    id: 'central-library',
    name: 'LPU Central Library (Knowledge Resource Centre)',
    category: 'LIBRARY',
    coordinates: { x: 500, y: 350 },
    description: '4-story multi-tiered silent study sanctum equipped with AC reading halls, e-book terminals, and academic journals.',
    recommendedFor: 'Exam preparation, deep focus sprints, research paper writing.',
    noiseLevel: 'Silent (15 dB)',
    wifiSpeed: '420 Mbps (Fiber Optic)',
    outlets: 'Abundant (Every Desk)',
    operatingHours: '08:00 AM – Midnight',
    studyTips: [
      'Floor 3 cubicles have dedicated power outlets and zero ambient noise.',
      'Floor 1 reference section has all university prescribed textbooks (CSE205, INT219, MTH166).'
    ]
  },
  {
    id: 'uni-mall',
    name: 'Uni-Mall & Cafe Study Lounge',
    category: 'FOOD',
    coordinates: { x: 620, y: 440 },
    description: '3-floor lifestyle hub with CCD, Subway, food courts, bookshops, and express printing kiosks.',
    recommendedFor: 'Casual study sessions, group project brainstorming with coffee.',
    noiseLevel: 'Lively (65 dB)',
    wifiSpeed: '220 Mbps',
    outlets: 'Good (Window Seats)',
    operatingHours: '09:00 AM – 10:30 PM',
    studyTips: [
      '2nd floor coffee corners have relaxed seating for evening revision.',
      'Express print shops on Ground Floor are lifesavers before 9 AM assignment deadlines.'
    ]
  },
  {
    id: 'block-36-38',
    name: 'Block 36 & 38 (Engineering & Robotics Labs)',
    category: 'ACADEMIC',
    coordinates: { x: 300, y: 380 },
    description: 'Home to embedded systems, electronics, IoT testing rigs, and mechanical workshops.',
    recommendedFor: 'Hardware debugging, robotics projects, physics assignments.',
    noiseLevel: 'Moderate (45 dB)',
    wifiSpeed: '310 Mbps',
    outlets: 'Abundant (Every Desk)',
    operatingHours: '08:30 AM – 07:30 PM',
    studyTips: [
      'Open design labs on 4th floor are ideal for collaborative tech teams.'
    ]
  },
  {
    id: 'unipolis',
    name: 'Baldev Raj Mittal Unipolis & Open Arena',
    category: 'RECREATION',
    coordinates: { x: 520, y: 200 },
    description: 'Massive iconic covered amphitheatre hosting university hackathons, tech fests, and cultural summits.',
    recommendedFor: 'Open-air reading, hackathon final stages, evening relaxation.',
    noiseLevel: 'Lively (65 dB)',
    wifiSpeed: '290 Mbps',
    outlets: 'Limited',
    operatingHours: 'Open 24/7',
    studyTips: [
      'Shaded stepped seating is very breezy for evening flashcard revision.'
    ]
  },
  {
    id: 'bh-hostels',
    name: 'Boys Hostels (BH-1 to BH-7 Complex)',
    category: 'HOSTEL',
    coordinates: { x: 180, y: 220 },
    description: 'Residential towers with 24/7 late-night study rooms, LAN gaming setups, and night canteens.',
    recommendedFor: 'Late night midnight coding sprints, hostel study circles.',
    noiseLevel: 'Quiet (30 dB)',
    wifiSpeed: '250 Mbps (LAN + Wi-Fi)',
    outlets: 'Abundant (Every Desk)',
    operatingHours: '24/7 for Residents',
    studyTips: [
      'Common study rooms on Ground Floor stay illuminated all night during end-terms.'
    ]
  },
  {
    id: 'gh-hostels',
    name: 'Girls Hostels (GH-1 to GH-6 Complex)',
    category: 'HOSTEL',
    coordinates: { x: 780, y: 240 },
    description: 'Secure multi-story residential campus with dedicated quiet study halls and garden pavilions.',
    recommendedFor: 'Group study, peer doubt sessions, weekend exam prep.',
    noiseLevel: 'Quiet (30 dB)',
    wifiSpeed: '260 Mbps',
    outlets: 'Abundant (Every Desk)',
    operatingHours: '24/7 for Residents',
    studyTips: [
      'Air-conditioned reading halls on 1st floor have high-speed uninterrupted power backup.'
    ]
  },
  {
    id: 'sports-complex',
    name: 'Indoor Sports Arena & Olympic Pool',
    category: 'RECREATION',
    coordinates: { x: 720, y: 520 },
    description: 'State-of-the-art sports complex with badminton courts, gym, squash, and swimming pool.',
    recommendedFor: 'Pomodoro study breaks, physical fitness, mental recharge.',
    noiseLevel: 'Lively (65 dB)',
    wifiSpeed: '180 Mbps',
    outlets: 'Limited',
    operatingHours: '06:00 AM – 09:00 PM',
    studyTips: [
      'A 30-minute swim or workout between study sessions significantly boosts memory retention.'
    ]
  }
];

export default function LPUMapPage() {
  const [selectedSpot, setSelectedSpot] = useState<CampusSpot>(CAMPUS_SPOTS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [startNavId, setStartNavId] = useState<string>('bh-hostels');
  const [endNavId, setEndNavId] = useState<string>('block-34');
  const [isNavigating, setIsNavigating] = useState(false);

  const filteredSpots = CAMPUS_SPOTS.filter((spot) => {
    if (activeCategory === 'ALL') return true;
    return spot.category === activeCategory;
  });

  const startSpot = CAMPUS_SPOTS.find((s) => s.id === startNavId) || CAMPUS_SPOTS[0];
  const endSpot = CAMPUS_SPOTS.find((s) => s.id === endNavId) || CAMPUS_SPOTS[1];

  // Calculate approximate walking minutes based on distance
  const distancePx = Math.sqrt(
    Math.pow(endSpot.coordinates.x - startSpot.coordinates.x, 2) +
    Math.pow(endSpot.coordinates.y - startSpot.coordinates.y, 2)
  );
  const walkingMinutes = Math.max(2, Math.round(distancePx / 60));

  const getNoiseBadge = (noise: string) => {
    if (noise.includes('Silent')) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (noise.includes('Quiet')) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (noise.includes('Moderate')) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-7 rounded-3xl glass-panel border border-orange-500/20 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            LPU Interactive Campus Explorer
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Campus Map & Live Study Zone Locator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-300 max-w-2xl leading-relaxed">
            Find the quietest study hubs, Mac coding labs, high-speed WiFi zones, and power outlets across Lovely Professional University.
          </p>
        </div>

        {/* Quick Nav Route Selector */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 shadow-xl space-y-3 w-full lg:w-80 shrink-0 z-10 text-left font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold">
              <Navigation className="w-3.5 h-3.5" /> Walking Navigator
            </span>
            <span className="text-emerald-400 font-bold">~{walkingMinutes} min walk</span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-400 font-sans block mb-1">From:</label>
              <select
                value={startNavId}
                onChange={(e) => {
                  setStartNavId(e.target.value);
                  setIsNavigating(true);
                }}
                className="w-full p-2 rounded-xl bg-black/60 border border-zinc-700 text-zinc-200 text-xs focus:outline-none focus:border-orange-500"
              >
                {CAMPUS_SPOTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name.split('(')[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-sans block mb-1">To:</label>
              <select
                value={endNavId}
                onChange={(e) => {
                  setEndNavId(e.target.value);
                  setIsNavigating(true);
                }}
                className="w-full p-2 rounded-xl bg-black/60 border border-zinc-700 text-zinc-200 text-xs focus:outline-none focus:border-orange-500"
              >
                {CAMPUS_SPOTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name.split('(')[0]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: '🌐 All Landmarks' },
          { id: 'ACADEMIC', label: '💻 Academic Blocks (CSE/Eng)' },
          { id: 'LIBRARY', label: '📚 Central Library' },
          { id: 'FOOD', label: '☕ Uni-Mall & Cafes' },
          { id: 'HOSTEL', label: '🏨 Residential Hostels' },
          { id: 'RECREATION', label: '🏟️ Sports & Arenas' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              activeCategory === cat.id
                ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-105'
                : 'glass-panel text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MAIN GRID: Interactive Vector Map Canvas (7 Cols) + Location Detail Panel (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: 2D Interactive Vector Campus Map (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel border border-zinc-200 dark:border-white/10 p-4 sm:p-6 shadow-2xl space-y-3 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-200 dark:border-white/5">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" />
              LPU Main Grand Highway Campus (NH-1 Phagwara)
            </span>
            <span className="text-[11px] font-mono text-orange-400">Click any pin to inspect</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#0a0d14] border border-zinc-800 shadow-inner">
            
            {/* Campus Roads & Walkways Grid */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grand Trunk Road (GT Road Top Corridor) */}
              <path d="M 0 80 L 1000 80" stroke="#1f2937" strokeWidth="24" />
              <path d="M 0 80 L 1000 80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="16 16" />

              {/* Main Central Spine Boulevard */}
              <path d="M 500 80 L 500 650" stroke="#1e293b" strokeWidth="28" />
              <path d="M 500 80 L 500 650" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="10 10" />

              {/* West Campus Ring Road */}
              <path d="M 180 120 L 180 500 L 400 500 L 400 600" stroke="#1e293b" strokeWidth="16" />

              {/* East Campus Ring Road */}
              <path d="M 750 120 L 750 480 L 600 480 L 600 600" stroke="#1e293b" strokeWidth="16" />

              {/* Connector Pathways */}
              <path d="M 180 260 L 500 260 L 780 260" stroke="#0f172a" strokeWidth="12" />
              <path d="M 300 380 L 500 350 L 720 440" stroke="#0f172a" strokeWidth="12" />

              {/* Campus Green Lawns / Parks */}
              <rect x="240" y="140" width="100" height="80" rx="16" fill="#064e3b" opacity="0.3" />
              <rect x="640" y="140" width="80" height="80" rx="16" fill="#064e3b" opacity="0.3" />
              <circle cx="500" cy="460" r="45" fill="#064e3b" opacity="0.25" />

              {/* Animated Walking Navigation Path */}
              {isNavigating && (
                <g>
                  <path
                    d={`M ${startSpot.coordinates.x} ${startSpot.coordinates.y} Q ${(startSpot.coordinates.x + endSpot.coordinates.x)/2} ${(startSpot.coordinates.y + endSpot.coordinates.y)/2 - 30} ${endSpot.coordinates.x} ${endSpot.coordinates.y}`}
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="animate-pulse"
                  />
                  <circle cx={startSpot.coordinates.x} cy={startSpot.coordinates.y} r="8" fill="#10b981" />
                  <circle cx={endSpot.coordinates.x} cy={endSpot.coordinates.y} r="8" fill="#f97316" />
                </g>
              )}
            </svg>

            {/* Interactive Campus Pins */}
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot.id === spot.id;
              const leftPercent = (spot.coordinates.x / 1000) * 100;
              const topPercent = (spot.coordinates.y / 700) * 100;

              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Glowing Radar Ping */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-orange-500/40 animate-ping" />
                  )}

                  {/* Pin Orb */}
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-125 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-orange-600 to-amber-500 border-white text-white scale-115 shadow-orange-500/50'
                        : 'bg-zinc-900/90 border-white/20 text-zinc-300 hover:border-orange-400'
                    }`}
                  >
                    {spot.category === 'ACADEMIC' && <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {spot.category === 'LIBRARY' && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
                    {spot.category === 'FOOD' && <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
                    {spot.category === 'HOSTEL' && <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />}
                    {spot.category === 'RECREATION' && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
                  </div>

                  {/* Label Tooltip */}
                  <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-black/90 border border-white/10 text-[10px] font-black whitespace-nowrap shadow-xl transition pointer-events-none ${
                    isSelected ? 'text-orange-400 scale-105' : 'text-zinc-300 opacity-80 group-hover:opacity-100'
                  }`}>
                    {spot.name.split('(')[0]}
                  </div>
                </div>
              );
            })}

          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> High-Speed Wi-Fi Active
            </span>
            <span>Scale: 600+ Acres Campus Grid</span>
          </div>

        </div>

        {/* RIGHT: Detailed Study Spot Information Drawer (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-panel border border-zinc-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-6 text-left">
          
          <div className="space-y-2 border-b border-zinc-200 dark:border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
                {selectedSpot.category}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-400">
                🕒 {selectedSpot.operatingHours}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
              {selectedSpot.name}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {selectedSpot.description}
            </p>
          </div>

          {/* Environmental Matrix Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-orange-500" /> Noise Level
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-black border inline-block ${getNoiseBadge(selectedSpot.noiseLevel)}`}>
                {selectedSpot.noiseLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-cyan-500" /> Wi-Fi Speed
              </span>
              <span className="text-xs font-mono font-black text-cyan-400">
                {selectedSpot.wifiSpeed}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Power Sockets
              </span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {selectedSpot.outlets}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Recommended For
              </span>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2">
                {selectedSpot.recommendedFor}
              </span>
            </div>
          </div>

          {/* Student Pro Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
              Insider Student Study Tips
            </h4>
            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              {selectedSpot.studyTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action: Open a Study Stage for this Location */}
          <div className="pt-2">
            <Link
              href={`/rooms/${encodeURIComponent(selectedSpot.id + '-study-sprint')}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-xl shadow-orange-600/30 transition hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live Study Room for {selectedSpot.name.split('(')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
