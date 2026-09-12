'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Coffee,
  Brain,
  Music,
  ExternalLink,
  Volume2,
  Tv,
  FileText,
  Upload,
  BookOpen,
  Maximize2,
  Minimize2,
  FileUp,
  X,
  Sliders,
  Settings,
  Bell,
  Check
} from 'lucide-react';

interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
}

const YOUTUBE_PRESETS = [
  { name: '🎧 Lofi Girl Chill Beats', urlId: 'jfKfPfyJRdk' },
  { name: '🌧️ Cozy Rainy Coffee Shop', urlId: '5qap5aO4i9A' },
  { name: '🌃 Synthwave Cyberpunk Radio', urlId: '4xDzrJKXOOY' },
  { name: '🎻 Classical Music for Studying', urlId: 'mIYzp5rcTvU' },
];

const SAMPLE_COURSE_DOCS = [
  {
    name: '📘 CSE205: DSA Quick Reference Guide',
    content: `CSE205 — Data Structures & Algorithms Quick Reference
=====================================================
1. Asymptotic Complexity:
   - Binary Search: O(log n)
   - QuickSort: O(n log n) avg, O(n^2) worst
   - MergeSort: O(n log n) worst, O(n) space
   - Hash Table: O(1) avg insert/search

2. Self-Balancing BST (AVL Trees):
   - Balance Factor = Height(Left) - Height(Right)
   - Must be in {-1, 0, 1}
   - Rotations: Left (LL), Right (RR), Left-Right (LR), Right-Left (RL)

3. Graph Algorithms:
   - Dijkstra: Non-negative edge shortest path O((V + E) log V)
   - Bellman-Ford: Handles negative edges O(V * E)
   - Floyd-Warshall: All-pairs shortest path O(V^3)`
  },
  {
    name: '📙 INT219: Next.js & React Cheat Sheet',
    content: `INT219 — Full-Stack Web Development Sheet
=========================================
1. Next.js 14 App Router:
   - Server Components by default (fast initial load, zero client JS bundle)
   - Add 'use client' directive for hooks (useState, useEffect, browser APIs)
   - Layouts: persist state across page transitions
   - Server Actions: mutate data with 'use server'

2. Supabase Client Setup:
   - Browser Client: createBrowserClient(URL, ANON_KEY)
   - Realtime Subscriptions: supabase.channel('channel_name').on(...).subscribe()
   - Row Level Security (RLS): auth.uid() = user_id policies`
  },
  {
    name: '📐 MTH166: Engineering Calculus & Linear Algebra',
    content: `MTH166 — Mathematics Formula Sheet
====================================
1. Eigenvalues & Eigenvectors:
   - Characteristic Equation: det(A - lambda * I) = 0
   - Trace(A) = Sum of eigenvalues
   - Det(A) = Product of eigenvalues
   - Cayley-Hamilton: Every square matrix satisfies its own characteristic equation

2. Complex Integration:
   - Cauchy's Integral Formula: f(z0) = (1 / 2*pi*i) * integral( f(z) / (z - z0) dz )
   - Residue Theorem: integral( f(z) dz ) = 2*pi*i * Sum(Residues)`
  }
];

export default function SoloFocusPage() {
  const supabase = createClient();

  // Mode: Focus vs Break
  const [mode, setMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Web Audio Completion Chime
  const playCompletionChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  };

  // Right Panel Tab: 'media' (YouTube) vs 'pdf' (PDF Document Reader)
  const [rightPanelTab, setRightPanelTab] = useState<'pdf' | 'media'>('pdf');

  // YouTube Player State
  const [currentVideoId, setCurrentVideoId] = useState(YOUTUBE_PRESETS[0].urlId);
  const [customUrl, setCustomUrl] = useState('');

  // PDF Reader State
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [isPdfFullScreen, setIsPdfFullScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // To-Do List State with LocalStorage
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Load Tasks on Mount
  useEffect(() => {
    const saved = localStorage.getItem('studynexus_solo_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {}
    } else {
      setTasks([
        { id: '1', text: 'Read CSE205 AVL Tree Lecture Slides', completed: false },
        { id: '2', text: 'Solve 2 practice problems for INT219', completed: true },
      ]);
    }
  }, []);

  const saveTasks = (updated: TodoTask[]) => {
    setTasks(updated);
    localStorage.setItem('studynexus_solo_tasks', JSON.stringify(updated));
  };

  // Timer Countdown Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playCompletionChime();
      if (mode === 'FOCUS') {
        setCompletedSessions((c) => c + 1);
        supabase.rpc('award_pomodoro_credits', { p_room_id: '00000000-0000-0000-0000-000000000001' });
        alert('🎉 Focus sprint finished! +5 Credits awarded to your balance.');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, supabase]);

  const applyCustomMinutes = (customMins: number, newMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' = 'FOCUS') => {
    setMode(newMode);
    setIsActive(false);
    const secs = customMins * 60;
    if (newMode === 'FOCUS') setFocusMinutes(customMins);
    if (newMode === 'SHORT_BREAK') setShortBreakMinutes(customMins);
    if (newMode === 'LONG_BREAK') setLongBreakMinutes(customMins);
    setDuration(secs);
    setTimeLeft(secs);
  };

  const setTimerMode = (newMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setMode(newMode);
    setIsActive(false);
    let sec = focusMinutes * 60;
    if (newMode === 'SHORT_BREAK') sec = shortBreakMinutes * 60;
    if (newMode === 'LONG_BREAK') sec = longBreakMinutes * 60;
    setDuration(sec);
    setTimeLeft(sec);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  // Handle PDF File Upload (creates local Blob URL)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file);
      setUploadedPdfUrl(blobUrl);
      setPdfFileName(file.name);
      setRightPanelTab('pdf');
    } else if (file) {
      alert('Please upload a valid .pdf file');
    }
  };

  const handleClearPdf = () => {
    if (uploadedPdfUrl) URL.revokeObjectURL(uploadedPdfUrl);
    setUploadedPdfUrl(null);
    setPdfFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Todo Actions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };
    saveTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  // Custom YouTube Handler
  const handleCustomYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const match = customUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      setCurrentVideoId(match[1]);
      setCustomUrl('');
    } else {
      alert('Please enter a valid YouTube video URL');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
            <Brain className="w-3.5 h-3.5" />
            Personal Study Station & Document Reader
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Solo Deep Work Hub
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Upload lecture notes, run your Pomodoro sprints, and play background study music.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-white/10">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Sprints Completed Today: <strong className="text-orange-500 font-black">{completedSessions}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Pomodoro + To-Do List (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Master Pomodoro Card */}
          <div className="p-7 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10">
              <button
                onClick={() => setTimerMode('FOCUS')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'FOCUS'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🧠 {focusMinutes}m Focus
              </button>
              <button
                onClick={() => setTimerMode('SHORT_BREAK')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'SHORT_BREAK'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                ☕ {shortBreakMinutes}m Break
              </button>
              <button
                onClick={() => setTimerMode('LONG_BREAK')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'LONG_BREAK'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🌴 {longBreakMinutes}m Long
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-xl transition ${
                  isSettingsOpen
                    ? 'bg-zinc-800 text-orange-400'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-white'
                }`}
                title="Customize Timer Durations"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Focus Duration Presets */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[15, 25, 45, 50, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => applyCustomMinutes(mins, 'FOCUS')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                    focusMinutes === mins && mode === 'FOCUS'
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-600 dark:text-orange-400'
                      : 'bg-zinc-100 dark:bg-white/[0.03] border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Expandable Custom Settings Panel */}
            {isSettingsOpen && (
              <div className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 space-y-3.5 text-left text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-2 font-bold text-zinc-800 dark:text-zinc-200">
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-orange-500" />
                    Customize Pomodoro Stamina
                  </span>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="text-[10px] text-zinc-400 hover:text-white"
                  >
                    Done ✓
                  </button>
                </div>

                {/* Focus Minutes Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                    <span>Focus Sprint Duration:</span>
                    <span className="text-orange-500 font-mono font-black">{focusMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={focusMinutes}
                    onChange={(e) => applyCustomMinutes(Number(e.target.value), 'FOCUS')}
                    className="w-full accent-orange-500 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Short Break Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                    <span>Short Break Duration:</span>
                    <span className="text-amber-500 font-mono font-black">{shortBreakMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={shortBreakMinutes}
                    onChange={(e) => applyCustomMinutes(Number(e.target.value), 'SHORT_BREAK')}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Long Break Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                    <span>Long Break Duration:</span>
                    <span className="text-blue-500 font-mono font-black">{longBreakMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={longBreakMinutes}
                    onChange={(e) => applyCustomMinutes(Number(e.target.value), 'LONG_BREAK')}
                    className="w-full accent-blue-500 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Circular Countdown */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-orange-500 transition-all duration-1000 ease-linear"
                  strokeWidth="5"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 - (276.46 * progressPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-mono font-black text-zinc-900 dark:text-white tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold mt-1">
                  {isActive ? (mode === 'FOCUS' ? '● Deep Focus' : '● Rest Time') : 'Paused'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-600/25 transition hover:scale-105"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? 'Pause Sprint' : `Start Focus (${focusMinutes}m)`}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Earn <strong className="text-orange-500">+5 credits</strong> per finished sprint.
            </p>
          </div>

          {/* Interactive Study Tasks Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            <h2 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-orange-500" />
              Session Checklist ({tasks.filter((t) => t.completed).length}/{tasks.length})
            </h2>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add task (e.g. Read Unit 3 Slides)..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                    task.completed
                      ? 'bg-zinc-50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 opacity-60'
                      : 'bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-semibold truncate max-w-[200px] ${
                        task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="p-1 text-zinc-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PDF Reader & Study Media Hub (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            
            {/* Top Switcher: PDF Reader vs Lo-Fi Music Stream */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4">
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10">
                <button
                  onClick={() => setRightPanelTab('pdf')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    rightPanelTab === 'pdf'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Document Reader</span>
                </button>

                <button
                  onClick={() => setRightPanelTab('media')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    rightPanelTab === 'media'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Lo-Fi Music Stream</span>
                </button>
              </div>

              {rightPanelTab === 'pdf' && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: PDF READER VIEWPORT */}
            {rightPanelTab === 'pdf' && (
              <div className="space-y-4">
                
                {/* Uploaded PDF Active Banner */}
                {uploadedPdfUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-300">
                      <div className="flex items-center gap-2 truncate max-w-[280px]">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">{pdfFileName || 'Custom Lecture Notes.pdf'}</span>
                      </div>
                      <button
                        onClick={handleClearPdf}
                        className="p-1 hover:text-red-500 text-zinc-400 transition"
                        title="Close PDF"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Embedded Full PDF Viewer (Browser Native with Zoom & Page Navigation) */}
                    <div className="w-full h-[540px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-900 shadow-lg">
                      <iframe
                        src={`${uploadedPdfUrl}#toolbar=1&navpanes=0`}
                        title="PDF Document Viewer"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  /* Sample Course Notes Selector + Drag Drop Area */
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-orange-500/50 rounded-2xl p-6 text-center cursor-pointer bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition space-y-2"
                    >
                      <FileUp className="w-8 h-8 text-orange-500 mx-auto" />
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Click to upload your lecture PDF, slides, or assignment
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Supports all standard course PDFs with built-in zoom & page navigation
                      </p>
                    </div>

                    {/* Preloaded Course Reference Sheets */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Or Read Pre-Loaded Course Reference Sheets
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {SAMPLE_COURSE_DOCS.map((doc, idx) => (
                          <button
                            key={doc.name}
                            onClick={() => setSelectedDocIndex(idx)}
                            className={`p-3 rounded-xl text-left text-xs font-bold transition border ${
                              selectedDocIndex === idx
                                ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                                : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
                            }`}
                          >
                            {doc.name}
                          </button>
                        ))}
                      </div>

                      {/* Display Selected Course Document */}
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-black/60 border border-zinc-200 dark:border-white/10 font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto mt-3">
                        {SAMPLE_COURSE_DOCS[selectedDocIndex].content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: YOUTUBE MEDIA STREAM */}
            {rightPanelTab === 'media' && (
              <div className="space-y-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-white/10 shadow-lg">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&mute=0&controls=1&loop=1`}
                    title="Study Stream"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Curated Lo-Fi Stations</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {YOUTUBE_PRESETS.map((preset) => (
                      <button
                        key={preset.urlId}
                        onClick={() => setCurrentVideoId(preset.urlId)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left transition border ${
                          currentVideoId === preset.urlId
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                            : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCustomYoutube} className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Custom YouTube Video</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube video link..."
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white/10 hover:bg-zinc-800 text-white font-bold text-xs transition shrink-0"
                    >
                      Load
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
