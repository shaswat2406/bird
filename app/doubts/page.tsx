'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AskQuestionModal from '@/components/AskQuestionModal';
import { Plus, CheckCircle2, Sparkles, Filter, RefreshCw, MessageSquare, Flame, ChevronRight } from 'lucide-react';

const COURSES = ['ALL', 'CSE205', 'INT219', 'MTH166', 'CSE316', 'CHE110', 'PHY109'];

export default function DoubtsPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<any[]>([]);
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterCourse !== 'ALL') {
        query = query.eq('course_code', filterCourse);
      }

      const { data, error } = await query;
      if (data) setQuestions(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterCourse]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-white to-slate-100 dark:from-white/[0.04] dark:to-transparent border border-slate-200 dark:border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            LPU Doubt Exchange
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Solve Doubts. Earn Credits.
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-xl">
            Place bounties on hard academic problems or earn passive credits by writing verified step-by-step solutions.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchQuestions}
            className="p-3 rounded-2xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-zinc-300 transition"
            title="Refresh feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ask Doubt (-20 🪙)
          </button>
        </div>
      </div>

      {/* Course Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        {COURSES.map((code) => (
          <button
            key={code}
            onClick={() => setFilterCourse(code)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              filterCourse === code
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-zinc-400 dark:border-white/5 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {questions.map((q) => (
          <Link
            href={`/doubts/${q.id}`}
            key={q.id}
            className="block p-6 rounded-3xl bg-white/80 border border-slate-200 hover:border-orange-500/40 hover:bg-slate-50 transition duration-300 shadow-xl group dark:bg-white/[0.02] dark:border-white/5 dark:hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {q.course_code}
                  </span>
                  {q.is_solved ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                      ● Open Bounty
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-zinc-500">
                    {new Date(q.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-400 transition">
                  {q.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{q.body}</p>
              </div>

              {/* Bounty Pill */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-sm font-extrabold shadow-lg shadow-amber-500/10">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>+{q.bounty} 🪙</span>
                </div>
                <div className="text-slate-500 group-hover:text-orange-400 transition flex items-center text-xs font-semibold dark:text-zinc-500">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {!loading && questions.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-white/[0.01]">
            <p className="text-slate-500 dark:text-zinc-500 text-sm">No doubts posted under this course code yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-xs text-orange-400 font-bold hover:underline"
            >
              + Place the first bounty
            </button>
          </div>
        )}
      </div>

      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuestions}
      />
    </div>
  );
}