import Link from 'next/link';
import { Sparkles, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center text-center space-y-10">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        Built for LPU Students
      </div>

      {/* Main Hero Header */}
      <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl">
        Focus Together. <br />
        <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
          Solve Doubts. Earn Credits.
        </span>
      </h1>

      <p className="text-slate-600 dark:text-zinc-400 text-base max-w-xl">
        Join synchronized Pomodoro focus rooms, earn credits passively, and spend them to get verified solutions for your university coursework.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/doubts"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/20 transition"
        >
          <BookOpen className="w-4 h-4" />
          Browse Doubt Marketplace
          <ArrowRight className="w-4 h-4" />
        </Link>
       <Link
  href="/rooms/global-focus"
  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-200 font-bold text-sm transition"
>
  <Clock className="w-4 h-4 text-amber-400" />
  Enter Focus Room
</Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200 space-y-2 dark:bg-zinc-900/40 dark:border-zinc-800">
          <Clock className="w-6 h-6 text-orange-400 mb-2" />
          <h3 className="text-slate-900 dark:text-white font-bold">Synchronized Timers</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400">Lock into 25-minute Pomodoro sprints shared across campus with zero clock drift.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200 space-y-2 dark:bg-zinc-900/40 dark:border-zinc-800">
          <Sparkles className="w-6 h-6 text-amber-400 mb-2" />
          <h3 className="text-slate-900 dark:text-white font-bold">Credit Economy</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400">Earn +5 credits per focus cycle. Spend credits to place bounties on tricky academic doubts.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200 space-y-2 dark:bg-zinc-900/40 dark:border-zinc-800">
          <Users className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="text-slate-900 dark:text-white font-bold">Live Presence</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400">See who is studying in your course room in real-time using Supabase Presence.</p>
        </div>
      </div>
    </div>
  );
}