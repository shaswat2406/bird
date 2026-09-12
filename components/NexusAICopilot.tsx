'use client';

import { useState, useEffect, useRef } from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Code2,
  HelpCircle,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  codeSnippet?: string;
  complexity?: { time: string; space: string };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  timestamp: string;
}

const KNOWLEDGE_RESPONSES: Record<string, {
  text: string;
  codeSnippet?: string;
  complexity?: { time: string; space: string };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}> = {
  avl: {
    text: `### 🌲 AVL Tree Left-Rotation (LL / RR Case)
An **AVL Tree** is a self-balancing Binary Search Tree where the Balance Factor for any node is strictly in \`{-1, 0, 1}\`.

**Balance Factor:**
$$\\text{BF}(Node) = \\text{Height}(\\text{Left}) - \\text{Height}(\\text{Right})$$

When a node becomes right-heavy (BF = -2) due to insertion in the right subtree of its right child, perform a **Single Left Rotation**:
1. Right child becomes new sub-root.
2. Left child of right child becomes new right child of previous root.
3. Recalculate heights in $O(1)$ time.`,
    codeSnippet: `Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;

    // Perform rotation
    y->left = x;
    x->right = T2;

    // Update heights
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;

    return y; // New root of subtree
}`,
    complexity: { time: 'O(1) Rotation, O(log N) Search/Insert', space: 'O(1) Auxiliary' },
  },
  deadlock: {
    text: `### 💻 Operating System Deadlocks & Coffman Conditions (CSE316)
A **Deadlock** is a state where two or more processes are permanently blocked waiting for resources held by each other.

**The 4 Coffman Conditions (Must hold simultaneously):**
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** A process holds $\\ge 1$ resource while waiting for more.
3. **No Preemption:** Resources can only be voluntarily released.
4. **Circular Wait:** Closed loop of dependency ($P_0 \\rightarrow P_1 \\rightarrow P_0$).

🔥 **LPU Exam Tip:** To prevent deadlock, breaking **Circular Wait** by assigning universal numerical ordering to resources is the most practical real-world technique.`,
    complexity: { time: "Banker's Algorithm: O(N * M^2)", space: 'O(N * M)' },
  },
  quiz: {
    text: `🎯 **Here is your Campus Rapid-Fire MCQ Challenge!**\nTest your recall and earn **+5 Bounty Credits** on correct answer:`,
    quiz: {
      question: 'In a directed graph with V vertices and E edges, what is the time complexity of Kahn’s Topological Sort algorithm using an adjacency list and in-degree array?',
      options: [
        'A) O(V^2)',
        'B) O(V + E)',
        'C) O(E log V)',
        'D) O(V * E)'
      ],
      correctIndex: 1,
      explanation: "Kahn's Algorithm visits every vertex and processes every outgoing edge exactly once using a queue, resulting in O(V + E) time."
    }
  },
  eli5: {
    text: `### 👶 ELI5: Next.js Server Components vs Client Components
Imagine ordering food at the **LPU Uni-Mall Food Court**:

- **Server Component (The Kitchen):** The chef chops the vegetables, cooks the meal, and plates it. Your computer doesn't need to cook—you just receive the hot, ready-to-eat meal (HTML). Zero extra work on your phone!
- **Client Component (The Interactive Self-Serve Soda Fountain):** You press the physical button on the machine to dispense ice and soda (\`onClick\`, \`useState\`). This requires you to physically interact with it!

**Rule of Thumb:** Use Server Components for fetching data from database, and add \`'use client'\` only when you need interactive buttons, forms, or animations!`,
  }
};

export default function NexusAICopilot() {
  const { credits, setCredits } = useUserCredits();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '👋 Hey there! I am **NexusAI 2.0**, your campus academic copilot. Ask me any CSE doubt, request code templates, or say **"quiz me"** for bonus credits!',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+Space or Ctrl+K to toggle Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.code === 'Space') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (query?: string) => {
    const textToSend = query || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!query) setInputText('');
    setIsTyping(true);
    setSelectedQuizOption(null);
    setQuizAnswered(false);

    // AI Response Generator
    setTimeout(() => {
      setIsTyping(false);
      const lower = textToSend.toLowerCase();

      let matchedData = KNOWLEDGE_RESPONSES.avl;
      if (lower.includes('deadlock') || lower.includes('coffman') || lower.includes('os') || lower.includes('cse316')) {
        matchedData = KNOWLEDGE_RESPONSES.deadlock;
      } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('mcq') || lower.includes('flashcard')) {
        matchedData = KNOWLEDGE_RESPONSES.quiz;
      } else if (lower.includes('eli5') || lower.includes('simple') || lower.includes('next') || lower.includes('server')) {
        matchedData = KNOWLEDGE_RESPONSES.eli5;
      } else if (lower.includes('avl') || lower.includes('tree') || lower.includes('rotation') || lower.includes('dsa')) {
        matchedData = KNOWLEDGE_RESPONSES.avl;
      } else {
        matchedData = {
          text: `### 🤖 NexusAI Solution: "${textToSend}"\nHere is the verified algorithmic approach:\n\n1. **Core Intuition:** Break the problem into sub-problems using Dynamic Programming or Divide & Conquer.\n2. **Edge Cases:** Handle empty input, single element, and integer overflow.\n3. **Optimal Complexity:** Target $O(N \\log N)$ time or $O(N)$ with HashMap lookup.\n\n*Need a code template or a quiz? Click one of the quick chips below!*`,
          complexity: { time: 'O(N log N) / O(N)', space: 'O(N)' },
        };
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: matchedData.text,
        codeSnippet: matchedData.codeSnippet,
        complexity: matchedData.complexity,
        quiz: matchedData.quiz,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 650);
  };

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuizChoice = (optionIdx: number, correctIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIdx);
    setQuizAnswered(true);

    if (optionIdx === correctIdx) {
      if (credits !== null) {
        setCredits(credits + 5);
      }
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-orange-600/40 hover:scale-110 transition-all group border-2 border-white/20 animate-float-badge"
          title="Open NexusAI Campus Copilot (Ctrl+K)"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-bold">Ask NexusAI</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-black/20 text-[10px] font-mono text-amber-200">
            Ctrl+K
          </span>
        </button>
      )}

      {/* Floating Copilot Modal Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh] rounded-3xl glass-panel border-2 border-orange-500/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-600/20 via-amber-600/10 to-transparent border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-lg shadow-md shadow-orange-600/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                    NexusAI Copilot
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black">
                    v2.4 Online
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">LPU CSE Knowledge Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSendMessage('Explain AVL Tree Left Rotation in C++')}
              className="px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition shrink-0"
            >
              🌲 AVL Rotations
            </button>
            <button
              onClick={() => handleSendMessage('Quiz me on Graph Topological Sort')}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition shrink-0"
            >
              🎯 Rapid Quiz (+5 🪙)
            </button>
            <button
              onClick={() => handleSendMessage('OS Deadlock Coffman Conditions')}
              className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition shrink-0"
            >
              💻 OS Deadlock
            </button>
            <button
              onClick={() => handleSendMessage('Explain Next.js Server vs Client components ELI5')}
              className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition shrink-0"
            >
              👶 ELI5 Web Dev
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white shadow-md rounded-br-none'
                      : 'bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Complexity Pill */}
                  {msg.complexity && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-orange-500/30 text-[11px] font-mono flex items-center justify-between gap-2 text-orange-300">
                      <span>⏱️ {msg.complexity.time}</span>
                      <span>📦 {msg.complexity.space}</span>
                    </div>
                  )}

                  {/* Code Snippet Box */}
                  {msg.codeSnippet && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1117] font-mono text-[11px]">
                      <div className="bg-[#161b22] px-3 py-1.5 flex items-center justify-between text-zinc-400 border-b border-zinc-800">
                        <span>C++ 20 Solution</span>
                        <button
                          onClick={() => handleCopy(msg.codeSnippet!, idx)}
                          className="flex items-center gap-1 hover:text-orange-400 transition"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-3 overflow-x-auto text-zinc-200 whitespace-pre">
                        {msg.codeSnippet}
                      </div>
                    </div>
                  )}

                  {/* Interactive MCQ Quiz */}
                  {msg.quiz && (
                    <div className="mt-3 p-3 rounded-2xl bg-zinc-900 border border-amber-500/30 text-zinc-200 space-y-2.5">
                      <p className="font-bold text-xs text-amber-400">{msg.quiz.question}</p>
                      
                      <div className="space-y-1.5">
                        {msg.quiz.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizOption === optIdx;
                          const isCorrect = optIdx === msg.quiz!.correctIndex;
                          let btnStyle = 'bg-black/50 border-zinc-700 hover:border-orange-500/50 text-zinc-300';

                          if (quizAnswered) {
                            if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                            else if (isSelected) btnStyle = 'bg-red-950/80 border-red-500 text-red-300';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizAnswered}
                              onClick={() => handleQuizChoice(optIdx, msg.quiz!.correctIndex)}
                              className={`w-full text-left p-2 rounded-xl text-[11px] border transition ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizAnswered && (
                        <div className={`p-2.5 rounded-xl text-[11px] border ${
                          selectedQuizOption === msg.quiz.correctIndex
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                          {selectedQuizOption === msg.quiz.correctIndex ? (
                            <p className="font-bold">🎉 Correct! +5 Bounty Credits awarded to your balance.</p>
                          ) : (
                            <p><strong>Incorrect!</strong> Correct answer was Option B.</p>
                          )}
                          <p className="text-zinc-400 text-[10px] mt-1">{msg.quiz.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 w-24">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/40 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about DSA, OS, Web Dev, or type 'quiz'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
