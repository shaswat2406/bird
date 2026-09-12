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
  Tv
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

export default function SoloFocusPage() {
  const supabase = createClient();

  // Pomodoro State
  const [mode, setMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS');
  const [duration, setDuration] = useState(1500); // 25 mins default
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // YouTube Player State
  const [currentVideoId, setCurrentVideoId] = useState(YOUTUBE_PRESETS[0].urlId);
  const [customUrl, setCustomUrl] = useState('');

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
        { id: '1', text: 'Complete CSE205 Data Structures Lab', completed: false },
        { id: '2', text: 'Review INT219 Next.js Components', completed: true },
      ]);
    }
  }, []);

  // Save Tasks on Change
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
      if (mode === 'FOCUS') {
        setCompletedSessions((c) => c + 1);
        // Award credits for solo completion
        supabase.rpc('award_pomodoro_credits', { p_room_id: '00000000-0000-0000-0000-000000000001' });
        alert('🎉 Focus sprint finished! +5 Credits awarded to your balance.');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, supabase]);

  const setTimerMode = (newMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setMode(newMode);
    setIsActive(false);
    let sec = 1500;
    if (newMode === 'SHORT_BREAK') sec = 300;
    if (newMode === 'LONG_BREAK') sec = 900;
    setDuration(sec);
    setTimeLeft(sec);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
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
    // Extract YouTube ID
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
            Solo Deep Work Sanctuary
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Personal Focus Station
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pomodoro timer, background study streams, and your interactive task checklist.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-white/10">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Sprints Completed Today: <strong className="text-orange-500 font-black">{completedSessions}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Pomodoro + Task List | Right YouTube Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Pomodoro + To-Do List (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Master Pomodoro Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10">
              <button
                onClick={() => setTimerMode('FOCUS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'FOCUS'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🧠 25m Focus
              </button>
              <button
                onClick={() => setTimerMode('SHORT_BREAK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'SHORT_BREAK'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                ☕ 5m Short Break
              </button>
              <button
                onClick={() => setTimerMode('LONG_BREAK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'LONG_BREAK'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🌴 15m Long Break
              </button>
            </div>

            {/* Giant Circular Countdown */}
            <div className="relative w-64 h-64 flex items-center justify-center">
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
                <span className="text-6xl font-mono font-black text-zinc-900 dark:text-white tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold mt-1">
                  {isActive ? (mode === 'FOCUS' ? '● Deep Focus' : '● Rest Time') : 'Paused'}
                </span>
              </div>
            </div>

            {/* Play/Pause & Reset Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTimer}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-600/25 transition hover:scale-105"
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isActive ? 'Pause Sprint' : 'Start Focus'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Complete this 25m cycle to earn <strong className="text-orange-500">+5 credits</strong>.
            </p>
          </div>

          {/* Interactive Study To-Do Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-orange-500" />
                Session Study Tasks ({tasks.filter((t) => t.completed).length}/{tasks.length})
              </h2>
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new task (e.g. Finish CSE205 BST Problem)..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                    task.completed
                      ? 'bg-zinc-50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 opacity-60'
                      : 'bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        task.completed
                          ? 'line-through text-zinc-400'
                          : 'text-zinc-800 dark:text-zinc-200'
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

              {tasks.length === 0 && (
                <p className="text-center py-6 text-xs text-zinc-400">
                  No tasks added yet. Add your study goals for this session!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Embedded YouTube Lo-Fi & Study Music Player (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-500" />
                Background Study Stream
              </h2>
            </div>

            {/* Responsive Embedded YouTube iFrame */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-white/10 shadow-lg">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&mute=0&controls=1&loop=1`}
                title="Study Stream"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Stream Preset Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Curated Study Streams</p>
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

            {/* Custom YouTube URL Input */}
            <form onSubmit={handleCustomYoutube} className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Play Custom Lecture / Music</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube Video URL..."
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

        </div>

      </div>

    </div>
  );
}