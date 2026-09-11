'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { X, Sparkles, AlertCircle, Search, ExternalLink, CheckCircle2, Lightbulb } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COURSES = ['CSE205', 'INT219', 'MTH166', 'CSE316', 'CHE110', 'PHY109'];

export default function AskQuestionModal({ isOpen, onClose, onSuccess }: Props) {
  const supabase = createClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [courseCode, setCourseCode] = useState(COURSES[0]);
  const [bounty, setBounty] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Smart Duplicate State
  const [similarQuestions, setSimilarQuestions] = useState<any[]>([]);
  const [isSearchingDuplicates, setIsSearchingDuplicates] = useState(false);

  // Debounced search for similar existing questions
  useEffect(() => {
    if (!title.trim() || title.length < 4) {
      setSimilarQuestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingDuplicates(true);
      try {
        // Extract main search keywords
        const keywords = title
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .split(' ')
          .filter((w) => w.length > 3);

        if (keywords.length === 0) {
          setIsSearchingDuplicates(false);
          return;
        }

        const searchTerm = keywords[0]; // Match primary keyword

        const { data } = await supabase
          .from('questions')
          .select('id, title, course_code, is_solved, bounty')
          .eq('course_code', courseCode)
          .ilike('title', `%${searchTerm}%`)
          .limit(2);

        setSimilarQuestions(data || []);
      } catch (err) {
        console.error('Duplicate search error:', err);
      } finally {
        setIsSearchingDuplicates(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [title, courseCode, supabase]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please Sign In first from the top navbar before posting doubts.');
      }

      const { data, error: rpcError } = await supabase.rpc('post_question', {
        p_title: title,
        p_body: body,
        p_course_code: courseCode,
        p_bounty: Number(bounty),
      });

      if (rpcError) throw rpcError;

      setTitle('');
      setBody('');
      setSimilarQuestions([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Post doubt error:', err);
      setError(err.message || 'Failed to post doubt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0b0d14] border border-zinc-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Post Academic Bounty
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Ask an Academic Doubt</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Posting will place <strong className="text-amber-500 dark:text-amber-400 font-bold">{bounty} credits</strong> in Escrow as a bounty for the verified solver.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Course Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Course Code</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
            >
              {COURSES.map((code) => (
                <option key={code} value={code} className="bg-white dark:bg-zinc-900">{code}</option>
              ))}
            </select>
          </div>

          {/* Title Input with Smart Detection */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Doubt Title</label>
            <input
              type="text"
              required
              placeholder="e.g. How to implement AVL Tree rotation in C++?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {/* SMART DUPLICATE DETECTION BOX */}
          {similarQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-zinc-900 dark:text-amber-200 space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>💡 Similar Solved Questions Found (Credit Saver!)</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                A similar question was already asked in {courseCode}. You can view the answer for free without spending your credits:
              </p>
              <div className="space-y-1.5 pt-1">
                {similarQuestions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/doubts/${q.id}`}
                    target="_blank"
                    className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-black/30 border border-amber-500/20 hover:border-amber-400 text-xs font-semibold transition group"
                  >
                    <span className="truncate max-w-[280px] text-zinc-800 dark:text-zinc-200 group-hover:text-orange-500">
                      👉 {q.title}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 shrink-0 font-bold">
                      {q.is_solved ? 'Solved ✓' : 'Open'} <ExternalLink className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Description & Code */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description / Error Log (Markdown Supported)
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain what you tried, the expected output, and paste relevant code snippets..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          {/* Bounty Amount */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Bounty Amount (Min 20 Credits)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={20}
                step={5}
                value={bounty}
                onChange={(e) => setBounty(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs font-bold focus:outline-none focus:border-orange-500"
              />
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                🪙 {bounty} Credits
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex justify-end gap-3 border-t border-zinc-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-orange-600/25 transition hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Deducting & Posting...' : `Deduct ${bounty} 🪙 & Post`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}