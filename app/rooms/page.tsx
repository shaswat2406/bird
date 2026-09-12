'use client';

import { useState } from 'react';
import {
  Video,
  Sparkles,
  Plus,
  ArrowRight,
  Loader2,
  Users,
  Clock,
  Code2,
  Binary,
  Calculator,
  Globe,
  Cpu,
  Database,
  Flame
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface RoomTheme {
  type: 'DSA' | 'MATH' | 'WEB' | 'OS' | 'DBMS' | 'GLOBAL';
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
  floatingPills: string[];
  watermarkPattern: string;
}

export const getRoomTheme = (identifier: string): RoomTheme => {
  const id = identifier.toLowerCase();

  if (id.includes('dsa') || id.includes('tree') || id.includes('algo') || id.includes('cse205') || id.includes('leetcode')) {
    return {
      type: 'DSA',
      bgGradient: 'from-emerald-950/40 via-orange-950/20 to-black/80',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      badgeText: '🌲 DSA & Algorithms',
      icon: Binary,
      floatingPills: ['O(log N)', 'AVL_Tree', 'DFS/BFS', 'BinarySearch'],
      watermarkPattern: `
        <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-emerald-400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="20" r="8" stroke-width="2" />
          <circle cx="30" cy="50" r="8" stroke-width="2" />
          <circle cx="70" cy="50" r="8" stroke-width="2" />
          <circle cx="20" cy="80" r="8" stroke-width="2" />
          <circle cx="40" cy="80" r="8" stroke-width="2" />
          <line x1="44" y1="26" x2="36" y2="44" stroke-width="2" />
          <line x1="56" y1="26" x2="64" y2="44" stroke-width="2" />
          <line x1="27" y1="58" x2="23" y2="72" stroke-width="2" />
          <line x1="33" y1="58" x2="37" y2="72" stroke-width="2" />
        </svg>
      `
    };
  }

  if (id.includes('math') || id.includes('calc') || id.includes('mth') || id.includes('algebra') || id.includes('discrete')) {
    return {
      type: 'MATH',
      bgGradient: 'from-purple-950/40 via-indigo-950/20 to-black/80',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      badgeText: '📐 Mathematics & Calculus',
      icon: Calculator,
      floatingPills: ['∫ f(x)dx', 'det(A-λI)=0', 'π ≈ 3.1415', '∑ 1/n²'],
      watermarkPattern: `
        <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-purple-400" viewBox="0 0 100 100" fill="none">
          <path d="M20 50 Q 50 10, 80 50 T 140 50" stroke-width="2" />
          <path d="M20 70 Q 50 30, 80 70 T 140 70" stroke-width="2" />
          <circle cx="50" cy="50" r="35" stroke-width="1.5" stroke-dasharray="4 4" />
        </svg>
      `
    };
  }

  if (id.includes('web') || id.includes('react') || id.includes('next') || id.includes('int219') || id.includes('frontend')) {
    return {
      type: 'WEB',
      bgGradient: 'from-cyan-950/40 via-blue-950/20 to-black/80',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      badgeText: '⚡ Full-Stack Web',
      icon: Globe,
      floatingPills: ['<React />', 'Next.js 14', 'Tailwind', 'SSR/Hydrate'],
      watermarkPattern: `
        <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-cyan-400" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="16" stroke-width="2" />
          <ellipse cx="50" cy="50" rx="40" ry="16" transform="rotate(60 50 50)" stroke-width="2" />
          <ellipse cx="50" cy="50" rx="40" ry="16" transform="rotate(120 50 50)" stroke-width="2" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </svg>
      `
    };
  }

  if (id.includes('os') || id.includes('kernel') || id.includes('cse316') || id.includes('deadlock') || id.includes('process')) {
    return {
      type: 'OS',
      bgGradient: 'from-amber-950/40 via-red-950/20 to-black/80',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      badgeText: '💻 OS & Kernel Systems',
      icon: Cpu,
      floatingPills: ['Deadlock()', 'Mutex/Lock', 'Fork/Exec', 'Paging/VM'],
      watermarkPattern: `
        <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-amber-400" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="25" width="50" height="50" rx="6" stroke-width="2" />
          <circle cx="50" cy="50" r="12" stroke-width="2" />
          <line x1="10" y1="35" x2="25" y2="35" stroke-width="2" />
          <line x1="10" y1="65" x2="25" y2="65" stroke-width="2" />
          <line x1="75" y1="35" x2="90" y2="35" stroke-width="2" />
          <line x1="75" y1="65" x2="90" y2="65" stroke-width="2" />
        </svg>
      `
    };
  }

  if (id.includes('dbms') || id.includes('sql') || id.includes('database') || id.includes('cse320')) {
    return {
      type: 'DBMS',
      bgGradient: 'from-blue-950/40 via-teal-950/20 to-black/80',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
      badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      badgeText: '🗄️ Database & SQL',
      icon: Database,
      floatingPills: ['ACID:Lock', 'B+ Tree', 'PostgreSQL', 'JOIN ON'],
      watermarkPattern: `
        <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-blue-400" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="25" rx="35" ry="12" stroke-width="2" />
          <path d="M15 25 v50 c0 7 15 12 35 12 s35 -5 35 -12 v-50" stroke-width="2" />
          <path d="M15 50 c0 7 15 12 35 12 s35 -5 35 -12" stroke-width="2" />
        </svg>
      `
    };
  }

  // Default Global Silent Lounge
  return {
    type: 'GLOBAL',
    bgGradient: 'from-orange-950/40 via-amber-950/20 to-black/80',
    borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    badgeText: '🧘 24/7 Deep Work',
    icon: Sparkles,
    floatingPills: ['25m Sprint', 'Lo-Fi Beats', 'Zen Mode', '+5 🪙 Reward'],
    watermarkPattern: `
      <svg class="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 stroke-orange-400" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke-width="2" />
        <path d="M50 20 L50 50 L70 65" stroke-width="2" />
      </svg>
    `
  };
};

const PUBLIC_ROOMS = [
  {
    id: 'cse205-dsa-sprint',
    title: 'CSE205: Data Structures & Algorithms Sprint',
    courseCode: 'CSE205',
    activeCount: 14,
    remainingMinutes: 19,
    tags: ['Trees', 'C++', 'AVL Rotations', 'LeetCode'],
  },
  {
    id: 'mth166-calculus-pod',
    title: 'MTH166: Engineering Mathematics & Calculus Marathon',
    courseCode: 'MTH166',
    activeCount: 11,
    remainingMinutes: 4,
    tags: ['Eigenvalues', 'Integrals', 'Matrix Theory'],
  },
  {
    id: 'int219-frontend-lab',
    title: 'INT219: Full-Stack Web Development & Next.js Hub',
    courseCode: 'INT219',
    activeCount: 9,
    remainingMinutes: 12,
    tags: ['React', 'Next.js 14', 'Tailwind', 'Realtime'],
  },
  {
    id: 'cse316-os-deadlock-prep',
    title: 'CSE316: Operating Systems & Kernel Deadlock War-Room',
    courseCode: 'CSE316',
    activeCount: 8,
    remainingMinutes: 16,
    tags: ['Coffman Conditions', 'Bankers Algo', 'Process Sync'],
  },
  {
    id: 'cse320-dbms-sql-guild',
    title: 'CSE320: DBMS & Transaction ACID Mastery',
    courseCode: 'CSE320',
    activeCount: 6,
    remainingMinutes: 8,
    tags: ['PostgreSQL', '2PL Lock', 'CAP Theorem', 'B+ Trees'],
  },
  {
    id: 'global-focus-silent',
    title: '24/7 Deep Work & Lo-Fi Silent Lounge',
    courseCode: 'GLOBAL',
    activeCount: 28,
    remainingMinutes: 24,
    tags: ['Camera On', 'Lo-Fi Rain', 'No Talking', 'Zen'],
  },
];

export default function RoomsDirectoryPage() {
  const router = useRouter();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinRoom = (roomId: string) => {
    setJoiningId(roomId);
    router.push(`/rooms/${roomId}`);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomInput.trim()) return;
    const cleanId = customRoomInput.trim().toLowerCase().replace(/\s+/g, '-');
    router.push(`/rooms/${encodeURIComponent(cleanId)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      {/* Top Hero Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl glass-panel border border-orange-500/20 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            Synchronized Academic Stages
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Course-Themed Public Study Rooms
          </h1>
          <p className="text-zinc-500 dark:text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Every study room features a customized visual theme for its subject (<strong className="text-emerald-400">DSA Trees</strong>, <strong className="text-purple-400">Math Calculus</strong>, <strong className="text-cyan-400">Web Dev</strong>, <strong className="text-amber-400">OS Systems</strong>). Join with video & mic to earn <strong className="text-orange-500 font-bold">+5 Bounty Credits</strong> per cycle!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-xl shadow-orange-600/25 transition hover:scale-105 shrink-0 z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Custom Room</span>
        </button>
      </div>

      {/* Grid of Subject-Themed Study Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLIC_ROOMS.map((room) => {
          const theme = getRoomTheme(room.id + ' ' + room.title);
          const IconComp = theme.icon;

          return (
            <div
              key={room.id}
              className={`rounded-3xl bg-gradient-to-br ${theme.bgGradient} border ${theme.borderColor} p-6 flex flex-col justify-between space-y-6 shadow-2xl transition duration-300 hover:scale-[1.02] group relative overflow-hidden`}
            >
              {/* Themed SVG Watermark */}
              <div
                dangerouslySetInnerHTML={{ __html: theme.watermarkPattern }}
                className="pointer-events-none"
              />

              <div className="space-y-3 z-10">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 ${theme.badgeBg}`}>
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{theme.badgeText}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {room.activeCount} Live
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {room.remainingMinutes}m
                    </span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-black text-white group-hover:text-orange-400 transition leading-snug">
                  {room.title}
                </h2>
              </div>

              {/* Subject Characteristic Pills */}
              <div className="flex flex-wrap gap-1.5 z-10">
                {theme.floatingPills.map((pill) => (
                  <span
                    key={pill}
                    className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-zinc-300 font-bold"
                  >
                    ⚡ {pill}
                  </span>
                ))}
              </div>

              {/* Join Action Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between z-10">
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  +5 🪙 Per Sprint
                </span>

                <button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={joiningId === room.id}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-600/25 transition hover:scale-105 disabled:opacity-50 cursor-pointer"
                >
                  {joiningId === room.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Entering...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Join Room</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Create Custom Room with Dynamic Theme Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-orange-500/30 p-7 shadow-2xl space-y-5 text-left text-zinc-900 dark:text-white relative">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-lg">Launch Custom Study Room</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Include keywords like <strong className="text-emerald-400">DSA</strong>, <strong className="text-purple-400">Math</strong>, <strong className="text-cyan-400">Web</strong>, or <strong className="text-amber-400">OS</strong> to automatically generate a tailored dynamic visual theme!
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <input
                type="text"
                required
                placeholder="e.g. CSE205-AVL-Tree-Study-Group or Math-Calculus-Squad"
                value={customRoomInput}
                onChange={(e) => setCustomRoomInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 font-bold"
              />

              {/* Dynamic Theme Preview Pill */}
              {customRoomInput.trim() && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs flex items-center justify-between">
                  <span className="text-zinc-400">Detected Theme:</span>
                  <span className="font-black text-orange-400">
                    {getRoomTheme(customRoomInput).badgeText}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-xl shadow-orange-600/30 transition hover:scale-[1.02]"
              >
                🚀 Enter & Start Study Stage
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}