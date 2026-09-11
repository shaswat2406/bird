'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Trophy,
  Award,
  Flame,
  Sparkles,
  Shield,
  Medal,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface StudentRank {
  id: string;
  rank: number;
  full_name: string;
  avatar_url: string;
  course: string;
  credits: number;
  badges: string[];
  doubtsSolved: number;
}

const BADGES_DEFINITIONS = [
  { id: 'algo-knight', name: '🌳 Algorithm Knight', desc: 'Solved 3+ CSE205 doubts', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/40 text-orange-400' },
  { id: 'web-maestro', name: '⚛️ Full-Stack Maestro', desc: 'Top INT219 Web Dev Solver', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400' },
  { id: 'focus-guru', name: '🧠 Deep Focus Guru', desc: 'Completed 10+ Pomodoro Sprints', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-400' },
  { id: 'benefactor', name: '🪙 Top Benefactor', desc: 'Awarded 100+ credits in bounties', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400' },
];

export default function LeaderboardPage() {
  const supabase = createClient();
  const [leaderboard, setLeaderboard] = useState<StudentRank[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('ALL');

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('credits', { ascending: false })
        .limit(20);

      if (profiles && profiles.length > 0) {
        const formatted: StudentRank[] = profiles.map((p, index) => {
          const badges: string[] = [];
          if (p.credits >= 150) badges.push('🌳 Algorithm Knight');
          if (p.credits >= 120) badges.push('🧠 Deep Focus Guru');
          if (index < 3) badges.push('🪙 Top Benefactor');

          return {
            id: p.id,
            rank: index + 1,
            full_name: p.full_name || 'LPU Student',
            avatar_url: p.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`,
            course: p.course || 'B.Tech CSE',
            credits: p.credits,
            badges: badges.length > 0 ? badges : ['🌱 Rising Scholar'],
            doubtsSolved: Math.floor(p.credits / 25),
          };
        });

        setLeaderboard(formatted);
        if (user) {
          const myProfile = formatted.find((p) => p.id === user.id);
          setCurrentUser(myProfile || null);
        }
      }
      setLoading(false);
    }

    loadLeaderboard();
  }, [supabase]);

  const topThree = leaderboard.slice(0, 3);
  const restLeaderboard = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-zinc-200 dark:border-orange-500/20 backdrop-blur-2xl shadow-xl dark:shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
            <Trophy className="w-3.5 h-3.5 text-orange-500" />
            LPU Hall of Fame
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Campus Leaderboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm max-w-xl">
            Top academic solvers and deep studiers across Lovely Professional University. Solve doubts and complete focus sprints to climb the ranks.
          </p>
        </div>

        {/* Current User Stats Card */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 shadow-lg flex items-center gap-4 shrink-0">
            <img
              src={currentUser.avatar_url}
              alt="You"
              className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-orange-500"
            />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">Your Standing</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                  Rank #{currentUser.rank}
                </span>
                <span className="text-xs font-mono font-bold text-amber-500">
                  {currentUser.credits} 🪙
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podium (Top 3 Solvers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        
        {/* Silver Medal (#2) */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 flex flex-col items-center text-center space-y-4 shadow-lg relative group">
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-black uppercase flex items-center gap-1">
              🥈 2nd Place
            </div>
            <img
              src={topThree[1].avatar_url}
              alt={topThree[1].full_name}
              className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-400 mt-2"
            />
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">{topThree[1].full_name}</h3>
              <p className="text-xs text-zinc-500">{topThree[1].course}</p>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
              +{topThree[1].credits} 🪙 Credits
            </div>
          </div>
        )}

        {/* Gold Medal (#1) - Center & Taller */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-500/50 flex flex-col items-center text-center space-y-4 shadow-2xl relative scale-105 group">
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase flex items-center gap-1 shadow-lg shadow-amber-500/30">
              👑 Champion • #1
            </div>
            <div className="relative mt-2">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-md opacity-80" />
              <img
                src={topThree[0].avatar_url}
                alt={topThree[0].full_name}
                className="relative w-24 h-24 rounded-full bg-zinc-900 border-4 border-amber-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{topThree[0].full_name}</h3>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-bold">{topThree[0].course}</p>
            </div>
            <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-mono font-black text-base shadow-lg">
              +{topThree[0].credits} 🪙 Credits
            </div>
          </div>
        )}

        {/* Bronze Medal (#3) */}
        {topThree[2] && (
          <div className="order-3 md:order-3 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 flex flex-col items-center text-center space-y-4 shadow-lg relative group">
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 text-xs font-black uppercase flex items-center gap-1">
              🥉 3rd Place
            </div>
            <img
              src={topThree[2].avatar_url}
              alt={topThree[2].full_name}
              className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-amber-700 mt-2"
            />
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">{topThree[2].full_name}</h3>
              <p className="text-xs text-zinc-500">{topThree[2].course}</p>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
              +{topThree[2].credits} 🪙 Credits
            </div>
          </div>
        )}

      </div>

      {/* Ranks 4+ List */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-orange-500" />
          Campus Solvers Ranking
        </h2>

        <div className="rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 divide-y divide-zinc-100 dark:divide-white/5 overflow-hidden shadow-xl">
          {leaderboard.map((student) => (
            <div
              key={student.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition"
            >
              <div className="flex items-center gap-4">
                <span className={`w-7 text-center font-black text-sm ${
                  student.rank === 1 ? 'text-amber-500 text-lg' :
                  student.rank === 2 ? 'text-zinc-400 text-base' :
                  student.rank === 3 ? 'text-amber-700 text-base' :
                  'text-zinc-400 dark:text-zinc-600'
                }`}>
                  #{student.rank}
                </span>

                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                  className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-200 dark:border-white/10"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">{student.full_name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-500 font-medium">
                      {student.course}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {student.badges.map((b) => (
                      <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/20">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-black text-amber-500 text-sm">{student.credits} 🪙</p>
                  <p className="text-[10px] text-zinc-400">{student.doubtsSolved} doubts solved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Badges Showcase */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Unlockable Campus Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES_DEFINITIONS.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl bg-gradient-to-br ${badge.color} border space-y-2`}
            >
              <p className="font-black text-sm">{badge.name}</p>
              <p className="text-xs opacity-80">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}