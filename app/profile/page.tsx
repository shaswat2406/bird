'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserCredits } from '@/hooks/useUserCredits';
import { createClient } from '@/lib/supabase/client';
import {
  Brain,
  Flame,
  Trophy,
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Share2,
  Award,
  TrendingUp,
  Target,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';

// Generates an 18-week (approx 4.5 months) GitHub-style contribution matrix
const generateHeatmapData = () => {
  const weeks = 18;
  const daysPerWeek = 7;
  const data = [];
  const today = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const weekDays = [];
    for (let d = 0; d < daysPerWeek; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      // Realistic study pattern
      const dayOfWeek = date.getDay();
      const rand = Math.random();
      let intensity = 0;
      let count = 0;

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (rand > 0.15) {
          intensity = rand > 0.7 ? 4 : rand > 0.45 ? 3 : rand > 0.25 ? 2 : 1;
          count = intensity * 2 + Math.floor(rand * 3);
        }
      } else {
        if (rand > 0.35) {
          intensity = rand > 0.6 ? 3 : rand > 0.3 ? 2 : 1;
          count = intensity * 2;
        }
      }

      weekDays.push({
        date: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        intensity,
        count,
      });
    }
    data.push(weekDays);
  }
  return data;
};

const BADGES = [
  {
    id: 'first_doubt',
    title: 'Code Alchemist',
    category: 'Marketplace',
    icon: '⚡',
    description: 'Solved your first academic doubt with 100% acceptance.',
    unlocked: true,
    progress: 100,
  },
  {
    id: 'pomodoro_centurion',
    title: 'Deep Focus Monk',
    category: 'Study Stamina',
    icon: '🧘',
    description: 'Completed 20+ synchronized Pomodoro focus sprints.',
    unlocked: true,
    progress: 100,
  },
  {
    id: 'bounty_hunter',
    title: 'LPU Bounty Hunter',
    category: 'Credits',
    icon: '🎯',
    description: 'Earned over 250+ bounty credits helping peers.',
    unlocked: true,
    progress: 100,
  },
  {
    id: 'night_owl',
    title: 'Midnight Coder',
    category: 'Consistency',
    icon: '🌙',
    description: 'Finished a 3+ hour focus sprint past midnight.',
    unlocked: true,
    progress: 100,
  },
  {
    id: 'campus_mentor',
    title: 'Department Mentor',
    category: 'Leadership',
    icon: '👑',
    description: 'Solve 20 peer doubts (14/20 completed).',
    unlocked: false,
    progress: 70,
  },
  {
    id: 'speed_demon',
    title: 'Sub-15m Answer',
    category: 'Speed',
    icon: '🚀',
    description: 'Provide an accepted solution in under 15 minutes.',
    unlocked: false,
    progress: 40,
  },
];

const COURSE_PROGRESS = [
  { course: 'CSE205: Data Structures & Algorithms', mastery: 88, hours: 24.5, doubtsSolved: 7, color: 'from-orange-500 to-amber-500' },
  { course: 'INT219: Frontend Web Architecture', mastery: 78, hours: 19.0, doubtsSolved: 4, color: 'from-blue-500 to-cyan-500' },
  { course: 'CSE316: Operating Systems & Kernel', mastery: 64, hours: 14.2, doubtsSolved: 3, color: 'from-emerald-500 to-teal-500' },
  { course: 'MTH166: Engineering Mathematics', mastery: 45, hours: 9.5, doubtsSolved: 1, color: 'from-purple-500 to-indigo-500' },
];

const RECENT_ACTIVITIES = [
  {
    id: '1',
    title: 'Accepted Answer on "AVL Tree Left-Rotation in C++"',
    type: 'BOUNTY',
    course: 'CSE205',
    reward: '+35 🪙',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Completed 25m Pomodoro Focus Sprint',
    type: 'FOCUS',
    course: 'Solo Station',
    reward: '+5 🪙',
    time: '4 hours ago',
  },
  {
    id: '3',
    title: 'Hosted Live Study Stage "Midterm DSA Prep"',
    type: 'ROOM',
    course: 'Group Stage',
    reward: '+10 🪙',
    time: 'Yesterday',
  },
  {
    id: '4',
    title: 'Unlocked Badge: Deep Focus Monk',
    type: 'ACHIEVEMENT',
    course: 'Campus Award',
    reward: 'Badge',
    time: '2 days ago',
  },
];

export default function ProfilePage() {
  const { credits, userName, userId } = useUserCredits();
  const supabase = createClient();

  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ date: string; count: number; formatted: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setHeatmap(generateHeatmapData());
  }, []);

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const displayName = userName || 'Aman Sharma';
  const displayCredits = credits !== null ? credits : 185;
  const displayRoll = '12204918';

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1:
        return 'bg-orange-500/25 dark:bg-orange-500/20 border-orange-500/30';
      case 2:
        return 'bg-orange-500/50 dark:bg-orange-500/45 border-orange-500/50';
      case 3:
        return 'bg-orange-500/75 dark:bg-orange-500/70 border-orange-500/80';
      case 4:
        return 'bg-orange-500 dark:bg-orange-400 border-amber-300';
      default:
        return 'bg-zinc-100 dark:bg-white/[0.04] border-zinc-200 dark:border-white/5';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Top Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-xl shadow-orange-600/30 border-2 border-white/20">
                {displayName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-2 border-white dark:border-[#06070a] shadow-md" title="Active Campus Scholar">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
                  Tier 3 Scholar
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Top 5% Solver
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span>B.Tech Computer Science & Engineering</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Roll: {displayRoll}</span>
              </p>

              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Lovely Professional University • Joined Spring Semester
              </p>
            </div>
          </div>

          {/* Quick Stats Pill + Share Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-amber-300 font-black text-sm shadow-sm">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <span>{displayCredits} 🪙 Bounty Credits</span>
            </div>

            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Profile</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* 4 Highlight KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Total Focus Time</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              67.2 <span className="text-xs font-bold text-zinc-400">hrs</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Doubts Solved</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              15 <span className="text-xs font-bold text-zinc-400">accepted</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Current Streak</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              9 <span className="text-xs font-bold text-zinc-400">days 🔥</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Badges Earned</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              4 <span className="text-xs font-bold text-zinc-400">/ 6 awards</span>
            </p>
          </div>
        </div>

      </div>

      {/* GITHUB-STYLE STUDY STREAK HEATMAP */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Study Activity & Focus Heatmap
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              142 study sessions & peer solutions logged in the last 4.5 months
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/5" />
              <div className="w-3 h-3 rounded-sm bg-orange-500/25 border border-orange-500/30" />
              <div className="w-3 h-3 rounded-sm bg-orange-500/50 border border-orange-500/50" />
              <div className="w-3 h-3 rounded-sm bg-orange-500/75 border border-orange-500/80" />
              <div className="w-3 h-3 rounded-sm bg-orange-500 border border-amber-300" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* The Matrix Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-[700px]">
            {heatmap.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day: any, dIdx: number) => (
                  <button
                    key={dIdx}
                    onClick={() => setSelectedCell(day)}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border transition-all hover:scale-125 hover:z-10 ${getIntensityColor(
                      day.intensity
                    )}`}
                    title={`${day.formatted}: ${day.count} focus sprints / doubt solutions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Cell Detail Banner */}
        {selectedCell && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-600 dark:text-orange-300 font-bold">
            <span>
              📅 {selectedCell.formatted} ({selectedCell.date}): <strong>{selectedCell.count} study activities completed</strong>
            </span>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* LOWER SECTION: Two Columns (Course Mastery + Badges Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Course Subject Mastery Breakdown (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Course Mastery & Focus Log
            </h3>
            <span className="text-xs font-bold text-zinc-400">Updated Real-Time</span>
          </div>

          <div className="space-y-4">
            {COURSE_PROGRESS.map((item) => (
              <div key={item.course} className="space-y-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[260px]">
                    {item.course}
                  </span>
                  <span className="font-black text-orange-600 dark:text-orange-400">
                    {item.mastery}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>⏱️ {item.hours} hrs logged</span>
                  <span>💡 {item.doubtsSolved} doubts answered</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Complete more 25m sprints to level up course mastery.</span>
            </div>
            <Link
              href="/focus"
              className="font-black text-orange-600 dark:text-orange-400 hover:underline shrink-0 ml-2"
            >
              Start Focus →
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Campus Badges & Achievement Showcase (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Campus Badges & Honors
            </h3>
            <span className="text-xs font-bold text-zinc-400">4 / 6 Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  badge.unlocked
                    ? 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/10 hover:border-orange-500/40 shadow-sm'
                    : 'bg-zinc-100/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-xl shrink-0">
                    {badge.icon}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                        {badge.title}
                      </h4>
                      {badge.unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {!badge.unlocked && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent Live Activity Stream */}
          <div className="pt-3 border-t border-zinc-100 dark:border-white/5 space-y-2.5">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
              Recent Activity Feed
            </h4>
            <div className="space-y-2">
              {RECENT_ACTIVITIES.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate max-w-[280px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate">
                      {act.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {act.reward}
                    </span>
                    <span className="text-[10px] text-zinc-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
