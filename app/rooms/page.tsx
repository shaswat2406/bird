'use client';

import { useState } from 'react';
import { Video, Sparkles, Plus, ArrowRight, Loader2, Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PUBLIC_ROOMS = [
  {
    id: 'cse205-dsa-sprint',
    title: 'CSE205: Data Structures & Algorithms Sprint',
    courseCode: 'CSE205',
    activeCount: 14,
    remainingMinutes: 19,
    tags: ['Trees', 'C++', 'LeetCode', 'Exam Prep'],
  },
  {
    id: 'int219-frontend-lab',
    title: 'INT219: Full-Stack Web Development Hub',
    courseCode: 'INT219',
    activeCount: 9,
    remainingMinutes: 12,
    tags: ['React', 'Next.js', 'Tailwind', 'Projects'],
  },
  {
    id: 'mth166-calculus-pod',
    title: 'MTH166: Discrete Math & Calculus Marathon',
    courseCode: 'MTH166',
    activeCount: 7,
    remainingMinutes: 4,
    tags: ['Matrices', 'Calculus', 'Practice Sheets'],
  },
  {
    id: 'global-focus-silent',
    title: '24/7 Deep Work & Lo-Fi Silent Lounge',
    courseCode: 'GLOBAL',
    activeCount: 28,
    remainingMinutes: 24,
    tags: ['Camera On', 'Lo-Fi Rain', 'No Talking'],
  },
];

export default function RoomsDirectoryPage() {
  const router = useRouter();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoinRoom = (roomId: string) => {
    setJoiningId(roomId);
    router.push(`/rooms/${roomId}`);
  };

  const handleCreate = () => {
    const name = prompt('Enter your Custom Room Name (e.g. CSE320-Team-Alpha):', 'CSE205-Sprint');
    if (name) {
      router.push(`/rooms/${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black uppercase mb-2">
            <Video className="w-3.5 h-3.5 text-orange-400" />
            Live Study Stages
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Public Study Rooms</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Click <strong className="text-white font-semibold">Join Stage</strong> on any course to connect your video and start earning <strong className="text-amber-400">+5 credits</strong> per focus cycle.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs shadow-xl shadow-orange-600/20 transition hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Custom Room
        </button>
      </div>

      {/* Grid of Course Study Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {PUBLIC_ROOMS.map((room) => (
          <div
            key={room.id}
            className="rounded-3xl bg-white/[0.02] border border-white/10 hover:border-orange-500/50 p-7 flex flex-col justify-between space-y-6 shadow-2xl transition duration-300 group relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  {room.courseCode}
                </span>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {room.activeCount} Live
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {room.remainingMinutes}m
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-black text-white group-hover:text-orange-400 transition leading-snug">
                {room.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {room.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-zinc-400 font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                +5 🪙 Per 25m Focus
              </span>

              {/* Direct Clickable Action */}
              <button
                onClick={() => handleJoinRoom(room.id)}
                disabled={joiningId === room.id}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/25 transition duration-200 hover:scale-105 disabled:opacity-50 cursor-pointer"
              >
                {joiningId === room.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Entering Stage...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Join Stage</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}