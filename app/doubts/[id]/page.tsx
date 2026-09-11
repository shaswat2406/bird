'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AskQuestionModal from '@/components/AskQuestionModal';
import { Plus, CheckCircle2, Sparkles, Filter, RefreshCw, Search, ChevronRight, Flame } from 'lucide-react';

const COURSES = ['ALL', 'CSE205', 'INT219', 'MTH166', 'CSE316', 'CHE110', 'PHY109'];

export default function DoubtsPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<any[]>([]);
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [minBounty, setMinBounty] = useState(20);
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

      const { data } = await query;
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

  // Client-side Instant Filter & Search
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.course_code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBounty = q.bounty >= minBounty;
      return matchesSearch && matchesBounty;
    });
  }, [questions, searchQuery, minBounty]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      
      {/* Header Banner with Glow */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            LPU Doubt Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Academic Bounty Exchange
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg">
            Solve peers’ problems to earn bounties, or spend credits to get verified answers with code blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuestions}
            className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 transition"
            title="Refresh feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-orange-600/30 transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ask Doubt (-20 🪙)
          </button>
        </div>
      </div>

      {/* Dynamic Search & Bounty Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doubts by title, keyword, or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Min Bounty Filter Slider */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 px-4">
          <span className="text-xs font-bold text-zinc-400 shrink-0">Min Bounty:</span>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={minBounty}
            onChange={(e) => setMinBounty(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <span className="text-xs font-mono font-black text-amber-400 shrink-0">+{minBounty} 🪙</span>
        </div>
      </div>

      {/* Course Code Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        {COURSES.map((code) => (
          <button
            key={code}
            onClick={() => setFilterCourse(code)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              filterCourse === code
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20 scale-105'
                : 'bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <Link
            href={`/doubts/${q.id}`}
            key={q.id}
            className="block p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/50 hover:bg-white/[0.04] transition duration-300 shadow-xl group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg text-xs font-black bg-orange-500/15 text-orange-400 border border-orange-500/30">
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
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(q.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                  {q.title}
                </h2>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{q.body}</p>
              </div>

              {/* Glowing Bounty Badge */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/40 text-amber-300 text-sm font-black shadow-lg shadow-amber-500/10">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>+{q.bounty} 🪙</span>
                </div>
                <div className="text-zinc-500 group-hover:text-orange-400 transition flex items-center text-xs font-bold">
                  <span>Solve & Earn</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {!loading && filteredQuestions.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <p className="text-zinc-500 text-sm">No doubts match your search filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCourse('ALL'); }}
              className="mt-3 text-xs text-orange-400 font-bold hover:underline"
            >
              Reset Filters
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