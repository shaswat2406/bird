'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Sparkles,
  Check,
  ShieldCheck,
  CornerDownRight,
  ArrowLeft,
  MessageSquare,
  Flame,
  CheckCircle2,
  Calendar,
  Send,
  Code2
} from 'lucide-react';

export default function DoubtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params?.id as string;
  const supabase = createClient();

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    if (!questionId) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // 1. Fetch Question
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (qError) throw qError;
      setQuestion(qData);

      // 2. Fetch Answers
      const { data: aData, error: aError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('created_at', { ascending: true });

      if (aError) {
        console.warn('Answers fetch warning:', aError);
      } else {
        setAnswers(aData || []);
      }
    } catch (err: any) {
      console.error('Error loading question:', err);
      setErrorMsg(err.message || 'Failed to load question details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionId]);

  // Post Solution Action
  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please Sign In first from the top navbar to post an answer.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('answers').insert({
        question_id: questionId,
        user_id: user.id,
        body: newAnswer.trim(),
      });

      if (error) throw error;
      setNewAnswer('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error submitting answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Accept Solution Action (Atomic Bounty Transfer via RPC)
  const handleAcceptAnswer = async (answerId: string) => {
    if (!confirm('Accept this solution and transfer the bounty credits to this student?')) return;

    try {
      const { error } = await supabase.rpc('accept_solution', {
        p_question_id: questionId,
        p_answer_id: answerId,
      });

      if (error) throw error;
      alert('🎉 Solution accepted! Bounty credits transferred.');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to accept solution');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Loading doubt details from Supabase...</p>
      </div>
    );
  }

  if (errorMsg || !question) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 space-y-2">
          <p className="font-bold text-sm">Could not find this question.</p>
          <p className="text-xs text-zinc-400">{errorMsg || 'This question may have been deleted.'}</p>
        </div>
        <Link
          href="/doubts"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doubts Marketplace
        </Link>
      </div>
    );
  }

  const isAuthor = currentUserId === question.user_id;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      
      {/* Back Button */}
      <Link
        href="/doubts"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-bold transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Doubts
      </Link>

      {/* Main Question Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-6">
        
        {/* Top Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
              {question.course_code}
            </span>

            {question.is_solved ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            ) : (
              <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                ● Open Bounty
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-black shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Bounty: +{question.bounty} 🪙</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
          {question.title}
        </h1>

        {/* Question Body / Code Block */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/5 font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap overflow-x-auto">
          {question.body}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-white/5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Posted on {new Date(question.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Answers ({answers.length})
        </h2>

        {answers.length === 0 && (
          <div className="text-center py-12 rounded-3xl border border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01] p-6 space-y-2">
            <p className="text-xs font-semibold text-zinc-500">No solutions submitted yet.</p>
            <p className="text-[11px] text-zinc-400">Be the first to solve this doubt and claim the <strong className="text-amber-500 font-bold">+{question.bounty} 🪙 bounty</strong>!</p>
          </div>
        )}

        {answers.map((ans) => (
          <div
            key={ans.id}
            className={`p-6 rounded-3xl border transition shadow-lg space-y-4 ${
              ans.is_accepted
                ? 'bg-emerald-500/[0.04] border-emerald-500/40 shadow-emerald-500/5'
                : 'bg-white dark:bg-white/[0.02] border-zinc-200 dark:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Student Solution
                </span>
                <span className="text-[10px] text-zinc-400">
                  • {new Date(ans.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {ans.is_accepted && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" /> Accepted Solution
                  </span>
                )}

                {/* Author-only Accept Button */}
                {isAuthor && !question.is_solved && !ans.is_accepted && (
                  <button
                    onClick={() => handleAcceptAnswer(ans.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition hover:scale-105"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept Solution (+{question.bounty} 🪙)
                  </button>
                )}
              </div>
            </div>

            {/* Answer Content */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/5 font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {ans.body}
            </div>
          </div>
        ))}
      </div>

      {/* Post Your Answer Box */}
      <form onSubmit={handlePostAnswer} className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <CornerDownRight className="w-4 h-4 text-orange-500" />
          Write Your Solution (Code & Markdown Supported)
        </h3>

        <textarea
          rows={5}
          required
          placeholder="Provide step-by-step logic and paste working code snippets..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 font-mono"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Bounty will be awarded if the author accepts your solution.
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-orange-600/25 transition hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Posting Solution...' : 'Post Solution'}
          </button>
        </div>
      </form>

    </div>
  );
}