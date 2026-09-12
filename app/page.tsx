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
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center space-y-16">
      
      {/* Hero Badge */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Lovely Professional University • Campus Super-App
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
          Focus Together. <br />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
            Solve Doubts. Ace CSE.
          </span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The ultimate academic collaborative ecosystem for LPU students. Join synchronized WebRTC study rooms, get peer-verified solutions with bounty credits, solve Daily DSA challenges, and search high-yield CSE notes.
        </p>

        {/* Hero Call-to-Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/doubts"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-600/25 transition hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Doubt Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dsa"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white/10 hover:bg-zinc-800 dark:hover:bg-white/20 text-white font-black text-xs sm:text-sm border border-zinc-700 dark:border-white/10 transition hover:scale-105 shadow-md"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Daily DSA Arena (+15 🪙)</span>
          </Link>

          <Link
            href="/focus"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm border border-zinc-200 dark:border-white/5 transition"
          >
            <Brain className="w-4 h-4 text-orange-500" />
            <span>Solo Focus & PDF</span>
          </Link>
        </div>
      </div>

      {/* Live Campus Ticker Bar */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black">
            🪙
          </div>
          <div>
            <p className="text-lg font-black text-zinc-900 dark:text-white">100 Credits</p>
            <p className="text-[11px] text-zinc-400 font-medium">Free on 1-Click Signup</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black">
            ⚡
          </div>
          <div>
            <p className="text-lg font-black text-zinc-900 dark:text-white">Sub-15m</p>
            <p className="text-[11px] text-zinc-400 font-medium">Average Solution Time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
            ⏱️
          </div>
          <div>
            <p className="text-lg font-black text-zinc-900 dark:text-white">25m Sprints</p>
            <p className="text-[11px] text-zinc-400 font-medium">+5 Credits per cycle</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-black">
            🎓
          </div>
          <div>
            <p className="text-lg font-black text-zinc-900 dark:text-white">8+ Courses</p>
            <p className="text-[11px] text-zinc-400 font-medium">CSE205, INT219, CSE316...</p>
          </div>
        </div>
      </div>

      {/* 6 High-Yield Platform Pillar Cards */}
      <div className="space-y-6 w-full text-left">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Everything You Need to Rank #1 in Class
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Engineered for high-performing engineering students at Lovely Professional University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: Doubt Marketplace */}
          <Link
            href="/doubts"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-orange-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-orange-500 transition">
              Academic Doubt Marketplace
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Post questions with escrow bounty credits. Smart duplicate detection prevents reposts, and accepted solutions transfer bounties atomically.
            </p>
          </Link>

          {/* Card 2: Daily DSA Arena */}
          <Link
            href="/dsa"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-emerald-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-emerald-500 transition">
              Daily DSA Problem Arena
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Solve LeetCode-style university problems with live in-browser compiler, multi-language sandbox (C++, Python, Java, JS), and claim +15 credits.
            </p>
          </Link>

          {/* Card 3: NexusSearch Knowledge Engine */}
          <Link
            href="/search"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-cyan-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-cyan-500 transition">
              NexusSearch CSE Engine
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Search any computer science concept across CSE205, CSE316, INT219, CSE320 with instant complexity charts, ASCII diagrams, and code snippets.
            </p>
          </Link>

          {/* Card 4: Solo Focus & PDF Reader */}
          <Link
            href="/focus"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-amber-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-amber-500 transition">
              Solo Focus & PDF Station
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Upload your lecture slides or open preloaded course sheets side-by-side with an active Pomodoro timer, checklist, and Lo-Fi study beats.
            </p>
          </Link>

          {/* Card 5: Synchronized Group Rooms */}
          <Link
            href="/rooms"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-blue-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-blue-500 transition">
              Synchronized Group Video Rooms
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              WebRTC video stages, synchronized Pomodoro timers via Supabase Broadcast, live chat, shared whiteboard, and raise hand for micro-doubts.
            </p>
          </Link>

          {/* Card 6: Profile & Study Heatmap */}
          <Link
            href="/profile"
            className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 hover:border-purple-500/40 hover:scale-[1.02] transition shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-purple-500 transition">
              Campus Heatmap & Badges
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Track study streaks on an 18-week GitHub-style heatmap, view course mastery progress bars, unlock campus badges, and export student cards.
            </p>
          </Link>

        </div>
      </div>

    </div>
  );
}