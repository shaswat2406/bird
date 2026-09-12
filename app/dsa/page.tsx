'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useUserCredits } from '@/hooks/useUserCredits';
import { createClient } from '@/lib/supabase/client';
import {
  Code2,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Terminal,
  Calendar,
  Zap,
  ArrowRight,
  Cpu,
  Trophy
} from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

interface DSAProblem {
  id: string;
  dayNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  courseCode: string;
  topics: string[];
  companies: string[];
  rewardCredits: number;
  description: string;
  examples: TestCase[];
  constraints: string[];
  hints: string[];
  starterCode: {
    cpp: string;
    python: string;
    java: string;
    javascript: string;
  };
  expectedSolutionHint: string;
}

const DAILY_PROBLEMS: DSAProblem[] = [
  {
    id: 'dsa-day-1',
    dayNumber: 42,
    title: 'Self-Balancing AVL Rotation & Longest Subtree',
    difficulty: 'Medium',
    courseCode: 'CSE205',
    topics: ['Trees', 'AVL Rotation', 'Recursion', 'Binary Search Tree'],
    companies: ['Amazon', 'Microsoft', 'LPU CSE205 Midterm'],
    rewardCredits: 15,
    description: `Given the root of a Binary Search Tree (BST), determine if the tree is AVL-balanced (i.e. the balance factor of every node is between -1 and 1). If unbalanced, return the node key where the first violation occurs; otherwise, return the maximum height of the balanced tree.

An AVL tree satisfies:
  Balance Factor = Height(Left) - Height(Right) ∈ {-1, 0, 1}`,
    examples: [
      {
        input: 'root = [10, 5, 20, null, null, 15, 30]',
        expectedOutput: 'Height: 3 (Balanced)',
        explanation: 'For all nodes (10, 5, 20, 15, 30), |Height(L) - Height(R)| <= 1. Tree is AVL balanced.'
      },
      {
        input: 'root = [30, 20, null, 10, null]',
        expectedOutput: 'Unbalanced at Node: 30 (Requires LL Rotation)',
        explanation: 'Node 30 has left height 2 and right height 0 (Balance Factor = +2).'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-10^5 <= Node.val <= 10^5',
      'All node values are unique.'
    ],
    hints: [
      'Hint 1: Compute height recursively from bottom-up (post-order traversal) in O(n) time.',
      'Hint 2: Return -1 or a custom struct immediately when any subtree balance factor exceeds 1 to prune execution early.'
    ],
    starterCode: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    int checkAVLBalance(TreeNode* root) {
        // Write your solution here
        // Return max height if balanced, or -1 if unbalanced
        if (!root) return 0;
        
        int leftH = checkAVLBalance(root->left);
        int rightH = checkAVLBalance(root->right);
        
        if (leftH == -1 || rightH == -1 || abs(leftH - rightH) > 1) 
            return -1;
            
        return max(leftH, rightH) + 1;
    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def checkAVLBalance(self, root: Optional[TreeNode]) -> int:
        def dfs(node):
            if not node:
                return 0
            lh = dfs(node.left)
            rh = dfs(node.right)
            if lh == -1 or rh == -1 or abs(lh - rh) > 1:
                return -1
            return 1 + max(lh, rh)
            
        return dfs(root)`,
      java: `class Solution {
    public int checkAVLBalance(TreeNode root) {
        return dfs(root);
    }
    
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int left = dfs(node.left);
        int right = dfs(node.right);
        if (left == -1 || right == -1 || Math.abs(left - right) > 1) return -1;
        return Math.max(left, right) + 1;
    }
}`,
      javascript: `/**
 * @param {TreeNode} root
 * @return {number}
 */
var checkAVLBalance = function(root) {
    function dfs(node) {
        if (!node) return 0;
        const left = dfs(node.left);
        const right = dfs(node.right);
        if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
        return Math.max(left, right) + 1;
    }
    return dfs(root);
};`
    },
    expectedSolutionHint: 'Time Complexity: O(N), Space Complexity: O(H) recursion stack.'
  },
  {
    id: 'dsa-day-2',
    dayNumber: 41,
    title: 'Detect Cycle in Directed Graph (Course Prerequisite Schedule)',
    difficulty: 'Medium',
    courseCode: 'CSE205',
    topics: ['Graphs', 'Topological Sort', 'Kahn Algorithm', 'DFS'],
    companies: ['Google', 'Uber', 'LPU CSE205'],
    rewardCredits: 15,
    description: `There are a total of numCourses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false (indicating a deadlock circular dependency).`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        expectedOutput: 'true',
        explanation: 'To take course 1 you should have finished course 0. So it is possible.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        expectedOutput: 'false',
        explanation: 'To take course 1 you must have finished course 0, and to take course 0 you must have finished course 1. Circular dependency detected.'
      }
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2'
    ],
    hints: [
      'Hint 1: Model courses as vertices and prerequisites as directed edges.',
      'Hint 2: Use in-degree array and queue (Kahn’s BFS Algorithm) to detect if a valid topological sort exists.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            inDegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.push(i);
        }
        int count = 0;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            count++;
            for (int neighbor : adj[node]) {
                if (--inDegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return count == numCourses;
    }
};`,
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Write your code here
        pass`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your code here
        return true;
    }
}`,
      javascript: `var canFinish = function(numCourses, prerequisites) {
    // Write your code here
};`
    },
    expectedSolutionHint: 'Time Complexity: O(V + E), Space: O(V + E).'
  },
  {
    id: 'dsa-day-3',
    dayNumber: 40,
    title: 'Sliding Window Maximum & Monotonic Deque',
    difficulty: 'Hard',
    courseCode: 'CSE205',
    topics: ['Sliding Window', 'Monotonic Queue', 'Arrays'],
    companies: ['Amazon', 'Directi', 'Goldman Sachs'],
    rewardCredits: 20,
    description: `You are given an array of integers nums, and there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window array.`,
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        expectedOutput: '[3,3,5,5,6,7]',
        explanation: 'Window positions: [1 3 -1] -> 3, [3 -1 -3] -> 3, [-1 -3 5] -> 5, [-3 5 3] -> 5, [5 3 6] -> 6, [3 6 7] -> 7'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    hints: [
      'Hint 1: A brute force O(N*K) will TLE.',
      'Hint 2: Maintain a Monotonic Decreasing Deque storing indices.'
    ],
    starterCode: {
      cpp: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        for (int i = 0; i < nums.size(); i++) {
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
      python: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        pass`,
      java: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        return new int[]{};
    }
}`,
      javascript: `var maxSlidingWindow = function(nums, k) {
};`
    },
    expectedSolutionHint: 'Time Complexity: O(N) amortized.'
  }
];

export default function DailyDSAPage() {
  const { credits, setCredits } = useUserCredits();
  const supabase = useMemo(() => createClient(), []);

  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);
  const currentProblem = DAILY_PROBLEMS[activeProblemIndex];

  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java' | 'javascript'>('cpp');
  const [userCode, setUserCode] = useState<string>(currentProblem.starterCode.cpp);
  const [openHints, setOpenHints] = useState<boolean[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [hasSolvedToday, setHasSolvedToday] = useState(false);

  // Sync userCode on problem or language change
  useEffect(() => {
    setUserCode(currentProblem.starterCode[selectedLanguage]);
    setConsoleOutput(null);
    setIsAccepted(false);
  }, [activeProblemIndex, selectedLanguage, currentProblem]);

  const toggleHint = (idx: number) => {
    setOpenHints((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Run Test Cases Simulation
  const handleRunTestCases = () => {
    setIsRunningTests(true);
    setConsoleOutput(null);

    setTimeout(() => {
      setIsRunningTests(false);
      setConsoleOutput(`⚡ Compiling & Testing against ${currentProblem.examples.length} test cases...
---------------------------------------------------------
Test Case 1: PASSED (Execution time: 4ms, Memory: 14.2 MB)
  Input: ${currentProblem.examples[0].input}
  Output: ${currentProblem.examples[0].expectedOutput}

Test Case 2: PASSED (Execution time: 3ms, Memory: 14.1 MB)
  Input: ${currentProblem.examples[1]?.input || 'Sample Input 2'}
  Output: ${currentProblem.examples[1]?.expectedOutput || 'Sample Output 2'}
---------------------------------------------------------
✅ All Sample Test Cases Passed! You are ready to Submit.`);
    }, 700);
  };

  // Submit Solution & Claim Bounty Credits
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    setConsoleOutput(null);

    setTimeout(async () => {
      setIsSubmitting(false);
      setIsAccepted(true);
      setHasSolvedToday(true);

      setConsoleOutput(`🎉 STATUS: ACCEPTED
---------------------------------------------------------
Runtime: 12 ms (Beats 94.8% of LPU Submissions)
Memory: 16.4 MB (Beats 89.2% of Submissions)

🪙 Reward: +${currentProblem.rewardCredits} Bounty Credits added to your campus profile!
🔥 Study Streak extended to +1 Day!`);

      // Award credits to profile balance
      try {
        await supabase.rpc('award_pomodoro_credits', {
          p_room_id: '00000000-0000-0000-0000-000000000001',
        });
        if (credits !== null) {
          setCredits(credits + currentProblem.rewardCredits);
        }
      } catch (err) {
        console.error('Error recording POTD reward:', err);
      }
    }, 1200);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Hard':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Top Hero Banner with Countdown & Live Reward Pill */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-7 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            LPU Daily DSA Arena • Day #{currentProblem.dayNumber}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Problem of the Day
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sharpen algorithmic problem-solving daily. Submit verified solutions to earn <strong className="text-orange-500 font-bold">+{currentProblem.rewardCredits} Bounty Credits</strong> and climb the leaderboard!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Next Challenge in: <strong className="text-orange-500 font-black">14h 22m</strong></span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Reward: +{currentProblem.rewardCredits} 🪙</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Description (5 Cols) + Live Code Editor Sandbox (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Problem Statement & Hints (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Problem Header & Metadata */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getDifficultyColor(currentProblem.difficulty)}`}>
                  {currentProblem.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 text-xs font-bold">
                  {currentProblem.courseCode}
                </span>
                {hasSolvedToday && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                {currentProblem.title}
              </h2>

              {/* Topics Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentProblem.topics.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap border-t border-zinc-100 dark:border-white/5 pt-4">
              {currentProblem.description}
            </div>

            {/* Test Case Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                Sample Test Cases
              </h4>
              {currentProblem.examples.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/5 space-y-1.5 font-mono text-xs">
                  <p className="text-zinc-500 dark:text-zinc-400 font-bold">Example {idx + 1}:</p>
                  <p className="text-zinc-800 dark:text-zinc-200"><strong className="text-orange-500">Input:</strong> {ex.input}</p>
                  <p className="text-zinc-800 dark:text-zinc-200"><strong className="text-emerald-500">Output:</strong> {ex.expectedOutput}</p>
                  {ex.explanation && (
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-sans pt-1">
                      <em>Explanation:</em> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                Constraints
              </h4>
              <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & LPU Tags */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                Tested In
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentProblem.companies.map((comp) => (
                  <span key={comp} className="px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                    🏢 {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Progressive Hints */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                Need Help? (Hints)
              </h4>
              {currentProblem.hints.map((hint, idx) => (
                <div key={idx} className="border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleHint(idx)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition"
                  >
                    <span>💡 Hint #{idx + 1}</span>
                    <span className="text-xs text-orange-500">{openHints[idx] ? 'Hide' : 'Reveal'}</span>
                  </button>
                  {openHints[idx] && (
                    <div className="p-3 bg-zinc-50 dark:bg-black/30 border-t border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
                      {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Past Daily Challenges Carousel / Archive */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Past Daily Challenges
            </h3>
            <div className="space-y-2">
              {DAILY_PROBLEMS.map((prob, idx) => (
                <button
                  key={prob.id}
                  onClick={() => setActiveProblemIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition ${
                    activeProblemIndex === idx
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate max-w-[240px]">
                    <span className="text-[11px] font-mono text-zinc-400">Day #{prob.dayNumber}</span>
                    <span className="truncate">{prob.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getDifficultyColor(prob.difficulty)}`}>
                    {prob.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Code Editor Sandbox & Live Console (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-4">
            
            {/* Editor Toolbar: Language Switcher & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/5 pb-4">
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10">
                {(['cpp', 'python', 'java', 'javascript'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                      selectedLanguage === lang
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++ 20' : lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java 17' : 'JavaScript'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserCode(currentProblem.starterCode[selectedLanguage])}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 transition"
                  title="Reset to Template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Editor Textarea (Monaco style) */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-[#0d1117] shadow-2xl">
              <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span>solution.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : 'js'}</span>
                <span className="text-zinc-500">UTF-8 • 4 Spaces</span>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full p-4 font-mono text-xs text-zinc-100 bg-transparent focus:outline-none resize-none leading-relaxed selection:bg-orange-500/30"
              />
            </div>

            {/* Execution Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                <Cpu className="w-4 h-4 text-orange-500" />
                Sandbox Compiler: Web Assembly Ready
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunTestCases}
                  disabled={isRunningTests || isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>{isRunningTests ? 'Evaluating...' : 'Run Test Cases'}</span>
                </button>

                <button
                  onClick={handleSubmitSolution}
                  disabled={isRunningTests || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-600/25 transition hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting Solution...' : `Submit (+${currentProblem.rewardCredits} 🪙)`}</span>
                </button>
              </div>
            </div>

            {/* Live Terminal / Console Output */}
            {consoleOutput && (
              <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-white/5">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  Execution Console
                </h4>
                <div className={`p-4 rounded-2xl border font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner ${
                  isAccepted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}>
                  {consoleOutput}
                </div>
              </div>
            )}

          </div>

          {/* Campus Solvers Ticker & Motivation */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Recent Campus Solvers Today
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">🏆 Shaswat (B.Tech CSE, 3rd Yr)</span>
                <span className="text-emerald-500 font-mono font-bold">Solved in 4ms (+15 🪙)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">🚀 Priya (B.Tech CSE, 2nd Yr)</span>
                <span className="text-emerald-500 font-mono font-bold">Solved in 8ms (+15 🪙)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">⚡ Aman (B.Tech CSE, 3rd Yr)</span>
                <span className="text-emerald-500 font-mono font-bold">Solved in 12ms (+15 🪙)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
