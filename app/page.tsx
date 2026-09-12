'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  Code2,
  Search,
  Trophy,
  Brain,
  Flame,
  FileText,
  ShieldCheck,
  Video,
  Zap,
  GraduationCap,
  Calculator,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Terminal,
  Play
} from 'lucide-react';

const LIVE_CAMPUS_FEED = [
  { student: 'Shaswat (3rd Yr CSE)', action: 'solved doubt on AVL Trees in CSE205', reward: '+35 🪙', time: 'Just now' },
  { student: 'Priya (2nd Yr CSE)', action: 'finished 25m Pomodoro Focus Sprint', reward: '+5 🪙', time: '1m ago' },
  { student: 'Aman (3rd Yr CSE)', action: 'solved Day #42 Daily DSA Challenge', reward: '+15 🪙', time: '3m ago' },
  { student: 'Rohan (1st Yr IT)', action: 'posted doubt on INT219 React SSR', reward: '50 🪙 Bounty', time: '5m ago' },
  { student: 'Kavya (4th Yr CSE)', action: 'unlocked "Deep Focus Monk" Badge', reward: '🏆 Honor', time: '7m ago' },
  { student: 'Dev (2nd Yr CSE)', action: 'started Live Room "CSE316 Deadlock Prep"', reward: '🟢 6 Online', time: '9m ago' },
];

export default function HomePage() {
  // Interactive Calculator State
  const [dailyHours, setDailyHours] = useState(3);
  const [doubtsSolvedWeekly, setDoubtsSolvedWeekly] = useState(5);

  // Calculate dynamics
  const monthlySprints = dailyHours * 2 * 30; // 2 Pomodoros per hour
  const focusCredits = monthlySprints * 5;
  const bountyCredits = doubtsSolvedWeekly * 4 * 35; // avg 35 credits per doubt
  const totalMonthlyCredits = focusCredits + bountyCredits;
  
  const scholarTier = 
    totalMonthlyCredits > 1200 ? '👑 Grandmaster Scholar (Top 1%)' :
    totalMonthlyCredits > 700 ? '⚡ Apex Campus Mentor (Top 5%)' :
    totalMonthlyCredits > 350 ? '🎯 Rising Bounty Hunter (Top 15%)' :
    '🌱 Active Scholar';

  // Feature Showcase Tabs
  const [activeTab, setActiveTab] = useState<'doubts' | 'dsa' | 'focus' | 'search' | 'rooms'>('doubts');

  return (
    <div className="relative min-h-screen space-y-20 pb-20 overflow-hidden">
      
      {/* Background Ambient Cyberpunk Grid & Lighting */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-20 flex flex-col items-center text-center space-y-8">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>Lovely Professional University • Campus Protocol</span>
        </div>

        {/* Big Impact Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.08] max-w-4xl">
          Focus Together. <br />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
            Solve Doubts. Ace CSE.
          </span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          The next-generation academic operating system for LPU engineers. Synchronized WebRTC focus stages, peer bounty doubt marketplace, LeetCode-style daily DSA arena, and Google-grade CSE knowledge engine.
        </p>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/doubts"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-600/30 transition hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Doubts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dsa"
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl glass-panel hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-black text-sm border border-zinc-200 dark:border-white/10 transition hover:scale-105 shadow-md"
          >
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>Daily DSA Arena (+15 🪙)</span>
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl glass-panel hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-bold text-sm border border-zinc-200 dark:border-white/10 transition hover:scale-105"
          >
            <Search className="w-4 h-4 text-cyan-500" />
            <span>CSE Search (/)</span>
          </Link>
        </div>

        {/* Realtime Marquee Activity Ticker */}
        <div className="w-full max-w-5xl overflow-hidden glass-panel rounded-2xl py-3 border border-zinc-200 dark:border-white/10 shadow-inner mt-6">
          <div className="animate-marquee items-center gap-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {LIVE_CAMPUS_FEED.concat(LIVE_CAMPUS_FEED).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 shrink-0 px-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <strong className="text-zinc-900 dark:text-white">{item.student}</strong>
                <span className="text-zinc-500 dark:text-zinc-400">{item.action}</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold font-mono">
                  {item.reward}
                </span>
                <span className="text-zinc-400 text-[10px]">• {item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 2. DYNAMIC INTERACTIVE CREDIT ROI & STUDY CALCULATOR */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-zinc-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
                  <Calculator className="w-3.5 h-3.5" />
                  Live Campus Credit Estimator
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Calculate Your Academic Bounty Potential
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Slide your daily focus stamina and weekly doubt answers to see your projected credit balance and campus tier ranking.
                </p>
              </div>

              {/* Slider 1: Daily Focus Hours */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" /> Daily Focus Study:
                  </span>
                  <span className="text-sm font-black text-orange-500">{dailyHours} Hours / Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-2 bg-zinc-200 dark:bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>1 hr (Light)</span>
                  <span>5 hrs (Pro)</span>
                  <span>10 hrs (Beast Mode)</span>
                </div>
              </div>

              {/* Slider 2: Weekly Doubts Solved */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Peer Doubts Solved:
                  </span>
                  <span className="text-sm font-black text-amber-500">{doubtsSolvedWeekly} Solutions / Week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={doubtsSolvedWeekly}
                  onChange={(e) => setDoubtsSolvedWeekly(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-200 dark:bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>0 doubts</span>
                  <span>10 doubts</span>
                  <span>20 doubts (Grandmaster)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Projected Output Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-600/15 via-amber-600/10 to-transparent border border-orange-500/30 space-y-6 shadow-xl text-center lg:text-left">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Projected Monthly Earnings
                </span>
                <div className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white font-mono flex items-center justify-center lg:justify-start gap-2">
                  <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                  <span>+{totalMonthlyCredits}</span>
                  <span className="text-2xl text-amber-400">🪙</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400">Predicted Scholar Status</span>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-xs sm:text-sm font-black text-zinc-900 dark:text-white shadow-sm">
                  {scholarTier}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 text-left">
                <div className="p-3 rounded-xl bg-white/60 dark:bg-black/40 border border-zinc-200 dark:border-white/5">
                  <p className="text-[10px] text-zinc-400 font-bold">Focus Sprints</p>
                  <p className="font-black text-zinc-900 dark:text-white text-sm">+{focusCredits} 🪙</p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 dark:bg-black/40 border border-zinc-200 dark:border-white/5">
                  <p className="text-[10px] text-zinc-400 font-bold">Bounty Transfers</p>
                  <p className="font-black text-zinc-900 dark:text-white text-sm">+{bountyCredits} 🪙</p>
                </div>
              </div>

              <Link
                href="/rooms"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg transition hover:scale-[1.02]"
              >
                <span>Start Earning Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE 5-TAB FEATURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Six Powerful Modules. One Unified Campus OS.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Click through the interactive showcase to preview core tools designed for 360-degree academic success.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'doubts', label: '💡 Doubt Marketplace', color: 'orange' },
            { id: 'dsa', label: '⚡ Daily DSA Arena', color: 'emerald' },
            { id: 'focus', label: '📖 Solo Focus & PDF', color: 'amber' },
            { id: 'search', label: '🔍 NexusSearch CSE', color: 'cyan' },
            { id: 'rooms', label: '📹 Group Study Stages', color: 'blue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition border ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/25 scale-105'
                  : 'glass-panel text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Preview Display */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-zinc-200 dark:border-white/10 shadow-2xl">
          {activeTab === 'doubts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
                  Peer-to-Peer Knowledge Economy
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Doubt Marketplace with Escrow Bounties
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Post urgent coursework questions with bounty credits. Smart duplicate detection stops repeated questions, and atomic PostgreSQL row-locks securely escrow credits until you accept an answer.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Instant debounced duplicate search prevents clutter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Real-time solution notifications via Supabase Realtime</span>
                  </div>
                </div>
                <Link
                  href="/doubts"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition shadow-md"
                >
                  <span>Open Doubt Market</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl font-mono text-xs space-y-3 text-left">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="text-orange-400 font-bold">CSE205 • 35 🪙 Bounty</span>
                  <span>Active Doubt #1204</span>
                </div>
                <h4 className="text-white font-bold text-sm">How to perform AVL Left-Rotation in C++?</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  "I am implementing self-balancing AVL Trees. After inserting into the right subtree of a right child, how do we update heights and pointers?"
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-400 text-[11px]">
                  ✓ Verified Solution by Top Solver (+35 🪙 Transferred)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dsa' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase">
                  Daily Problem of the Day
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  In-Browser Code Sandbox & DSA Arena
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Solve daily LeetCode-style algorithms across C++ 20, Python 3, Java 17, and JavaScript. Run instant test case evaluations and earn +15 credits per verified submission.
                </p>
                <Link
                  href="/dsa"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-md"
                >
                  <span>Solve Today's Challenge (+15 🪙)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0d1117] border border-zinc-800 shadow-2xl font-mono text-xs space-y-2 text-left">
                <div className="flex items-center justify-between text-zinc-400 text-[11px] border-b border-zinc-800 pb-2">
                  <span className="text-emerald-400 font-bold">● C++ 20 • Solution.cpp</span>
                  <span className="text-zinc-500">Day #42 POTD</span>
                </div>
                <div className="text-zinc-300 text-xs whitespace-pre">
{`int checkAVLBalance(TreeNode* root) {
    if (!root) return 0;
    int lh = checkAVLBalance(root->left);
    int rh = checkAVLBalance(root->right);
    if (lh == -1 || rh == -1 || abs(lh - rh) > 1)
        return -1;
    return max(lh, rh) + 1;
}`}
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-[11px] flex items-center justify-between">
                  <span>⚡ 2/2 Test Cases Passed (4ms)</span>
                  <span className="font-bold">+15 🪙 Awarded</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'focus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase">
                  Personal Deep Work Station
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  Built-in PDF Reader & Lo-Fi Beats
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Upload lecture slides or explore pre-loaded LPU cheat sheets side-by-side with synchronized 25-minute Pomodoro sprints and an interactive task checklist.
                </p>
                <Link
                  href="/focus"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition shadow-md"
                >
                  <span>Open Solo Focus Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-3 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>📘 CSE205_Lecture_Slides.pdf</span>
                  <span className="text-orange-500 font-mono">25:00 Focus</span>
                </div>
                <div className="p-4 rounded-xl bg-black/60 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  "AVL Tree Balance Factor = Height(L) - Height(R) ∈ &#123;-1, 0, 1&#125;
Rotations: LL, RR, LR, RL."
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>🎧 Playing: Lofi Girl Beats</span>
                  <span className="text-emerald-400 font-bold">+5 🪙 / 25m</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase">
                  Campus Knowledge Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  NexusSearch (Google for CSE Topics)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Search algorithms, OS deadlocks, database transactions, and computer networks with instant Big-O complexity badges, ASCII architecture diagrams, and LPU exam tips.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition shadow-md"
                >
                  <span>Search Concepts (/)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl font-mono text-xs space-y-3 text-left">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Dijkstra Shortest Path</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-orange-400">
                    Time: O((V + E) log V)
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-emerald-400">
                    Space: O(V + E)
                  </div>
                </div>
                <p className="text-[11px] text-amber-400 font-sans">
                  🔥 High Exam Yield (Frequently asked in CSE205 End-Term)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase">
                  Synchronized Study Stages
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  WebRTC Video Stages & Live Whiteboard
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Join synchronized course rooms with live presence, shared drawing canvas, sub-second chat, and raise hand for micro-doubts.
                </p>
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-md"
                >
                  <span>Enter Group Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-3 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="text-blue-400">🔴 Live Room: CSE205 Midterm Sprint</span>
                  <span className="text-emerald-400">8 Students</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-24 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                    📹 Shaswat (Host)
                  </div>
                  <div className="h-24 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                    📹 Priya
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 text-xs text-zinc-300 flex items-center justify-between">
                  <span>🎨 Shared Whiteboard Active</span>
                  <span className="text-orange-400 font-bold">18:42 Synced</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* 4. CAMPUS HALL OF FAME PODIUM PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-black uppercase">
            <Trophy className="w-3.5 h-3.5" />
            Hall of Fame
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Campus Leaderboard & Solver Legends
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Top engineering minds at Lovely Professional University recognized for academic mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* #2 Rank: Silver */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-300 dark:border-white/10 text-center space-y-4 shadow-xl order-2 md:order-1">
            <div className="w-16 h-16 rounded-2xl bg-zinc-300 dark:bg-zinc-700 mx-auto flex items-center justify-center text-2xl font-black text-white shadow-lg">
              🥈
            </div>
            <div>
              <h4 className="font-black text-base text-zinc-900 dark:text-white">Priya Sharma</h4>
              <p className="text-xs text-zinc-400">B.Tech CSE (2nd Year)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 font-mono text-xs font-black text-zinc-800 dark:text-zinc-200">
              680 🪙 • 22 Doubts Solved
            </div>
          </div>

          {/* #1 Rank: Gold Champion (Center Stage) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent border-2 border-amber-500/50 text-center space-y-4 shadow-2xl order-1 md:order-2 scale-105 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
              Campus Rank #1
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 to-amber-400 mx-auto flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-yellow-500/30">
              🥇
            </div>
            <div>
              <h4 className="font-black text-lg text-zinc-900 dark:text-white">Shaswat Sinha</h4>
              <p className="text-xs text-orange-500 font-bold">Grandmaster Scholar (CSE 3rd Yr)</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-sm font-black text-amber-500">
              1,240 🪙 • 42 Doubts Solved
            </div>
          </div>

          {/* #3 Rank: Bronze */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-300 dark:border-white/10 text-center space-y-4 shadow-xl order-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-700/60 mx-auto flex items-center justify-center text-2xl font-black text-white shadow-lg">
              🥉
            </div>
            <div>
              <h4 className="font-black text-base text-zinc-900 dark:text-white">Aman Verma</h4>
              <p className="text-xs text-zinc-400">B.Tech CSE (3rd Year)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 font-mono text-xs font-black text-zinc-800 dark:text-zinc-200">
              520 🪙 • 18 Doubts Solved
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-xs font-black text-orange-500 hover:text-orange-400 transition underline underline-offset-4"
          >
            <span>View Full Campus Hall of Fame Rankings →</span>
          </Link>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-600 to-orange-500 text-white text-center space-y-6 shadow-2xl shadow-orange-600/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Supercharge Your Academic Journey at LPU?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Join thousands of engineering peers today. Claim your 100 free bounty credits and start solving doubts in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/doubts"
              className="px-8 py-4 rounded-2xl bg-white text-orange-600 font-black text-sm shadow-xl hover:bg-zinc-100 transition hover:scale-105"
            >
              Get Started Free (+100 🪙)
            </Link>
            <Link
              href="/profile"
              className="px-8 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition"
            >
              View My Profile
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}