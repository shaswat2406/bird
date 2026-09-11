'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUserCredits } from '@/hooks/useUserCredits';
import {
  Sparkles,
  BookOpen,
  Video,
  LogIn,
  LogOut,
  X,
  Flame,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Trophy,
  Brain
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const { credits, userName, userId } = useUserCredits();
  const supabase = createClient();

  // Dark / Light Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('studynexus_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('studynexus_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Ambient Audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleFocusAudio = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15;

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        audioCtxRef.current = ctx;
        setIsPlayingAudio(true);
      } catch (err) {
        console.error('Audio synth error:', err);
      }
    }
  };

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const demoEmail = `student_${Math.floor(Math.random() * 100000)}@lpu.in`;
    const demoPass = 'LpuHackathon2026!';

    try {
      const { error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPass,
        options: {
          data: { full_name: 'LPU Student', course: 'B.Tech CSE' },
        },
      });

      if (error) throw error;
      setIsAuthModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || 'LPU Student', course: 'B.Tech CSE' },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setIsAuthModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#06070a]/85 backdrop-blur-2xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-600/30">
              Ψ
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                LPU StudyNexus
              </span>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider -mt-1">
                Campus Hub
              </span>
            </div>
          </Link>

          {/* SINGLE CLEAN NAVIGATION BAR */}
          <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-inner">
            <Link
              href="/doubts"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-500" />
              <span>Doubt Market</span>
            </Link>

            <Link
              href="/rooms"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition"
            >
              <Video className="w-3.5 h-3.5 text-amber-500" />
              <span>Group Rooms</span>
            </Link>

            <Link
              href="/focus"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition"
            >
              <Brain className="w-3.5 h-3.5 text-orange-500" />
              <span>Solo Focus</span>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>Hall of Fame</span>
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-300 hover:text-orange-500 transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Ambient Rain Audio */}
            <button
              onClick={toggleFocusAudio}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-300 animate-pulse'
                  : 'bg-zinc-100 dark:bg-white/[0.03] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
              }`}
              title="Toggle Lo-Fi Study Rain Sound"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{isPlayingAudio ? 'Lo-Fi Rain: ON' : 'Lo-Fi Rain'}</span>
            </button>

            {/* User Profile & Credits */}
            {userId ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-amber-300 text-xs font-black shadow-sm">
                  <Flame className="w-4 h-4 text-orange-500 dark:text-amber-400 animate-pulse" />
                  <span>{credits !== null ? `${credits} 🪙` : '100 🪙'}</span>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{userName || 'LPU Student'}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                  </p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:text-red-500 text-zinc-500 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-orange-600/30 transition hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0b0d13] border border-zinc-200 dark:border-orange-500/20 p-6 shadow-2xl relative space-y-4 text-zinc-900 dark:text-white">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center font-black text-orange-500 text-2xl mx-auto mb-2">
                Ψ
              </div>
              <h2 className="text-xl font-black">Join StudyNexus</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Get 100 free bounty credits instantly.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-black shadow-xl shadow-orange-600/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              ⚡ Instant 1-Click Login (+100 🪙)
            </button>

            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-700 text-[11px]">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-white/5" />
              <span>OR EMAIL SIGN IN</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-white/5" />
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {isSignUp && (
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                />
              )}
              <input
                type="email"
                required
                placeholder="student@lpu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold transition"
              >
                {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}