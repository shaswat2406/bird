'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Zap,
  CheckCircle,
  Copy,
  ExternalLink,
  Tag,
  ArrowRight,
  Clock,
  Flame,
  HelpCircle,
  FileText,
  Check
} from 'lucide-react';

interface CSETopic {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: 'DSA' | 'OS' | 'WEB' | 'DBMS' | 'NETWORKS' | 'AI';
  summary: string;
  detailedExplanation: string;
  complexity?: {
    time: string;
    space: string;
    best?: string;
    worst?: string;
  };
  examRelevance: string; // e.g. "High (5-10 Marks in End-Term)"
  keyPoints: string[];
  codeSnippets: {
    language: 'cpp' | 'python' | 'java' | 'javascript';
    label: string;
    code: string;
  }[];
  visualDiagram?: string;
  relatedTopics: string[];
}

const CSE_KNOWLEDGE_BASE: CSETopic[] = [
  {
    id: 'avl-trees',
    title: 'AVL Tree (Self-Balancing Binary Search Tree)',
    courseCode: 'CSE205',
    courseName: 'Data Structures & Algorithms',
    category: 'DSA',
    summary: 'A self-balancing BST where the height difference (Balance Factor) between left and right subtrees cannot exceed 1 for any node.',
    detailedExplanation: `An AVL tree maintains O(log n) height by performing tree rotations whenever an insertion or deletion causes a node's Balance Factor to become > 1 or < -1.\n\nBalance Factor = Height(Left Subtree) - Height(Right Subtree)\nPermissible values: {-1, 0, 1}.\n\nWhen unbalanced, four rotation cases are evaluated:\n1. Left-Left (LL) Case -> Single Right Rotation\n2. Right-Right (RR) Case -> Single Left Rotation\n3. Left-Right (LR) Case -> Left Rotate Left Child, then Right Rotate Root\n4. Right-Left (RL) Case -> Right Rotate Right Child, then Left Rotate Root`,
    complexity: {
      time: 'O(log n) for Search, Insert, Delete',
      space: 'O(n)',
      best: 'O(1) for Root check',
      worst: 'O(log n) guaranteed',
    },
    examRelevance: '🔥 Extremely High (5-10 Marks in CSE205 Midterm & Endterm)',
    keyPoints: [
      'Strictly balanced compared to Red-Black trees, making lookups faster.',
      'Rotations take O(1) time and modify pointers locally.',
      'Balance factor is stored in each node or calculated from child heights.'
    ],
    codeSnippets: [
      {
        language: 'cpp',
        label: 'C++',
        code: `struct Node {
    int key, height;
    Node *left, *right;
    Node(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(Node* n) { return n ? n->height : 0; }
int getBalance(Node* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    return x;
}`
      },
      {
        language: 'python',
        label: 'Python',
        code: `class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

def right_rotate(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x`
      }
    ],
    visualDiagram: `      y (Unbalanced)               x
     / \\                         /   \\
    x   T3   -- Right Rotate ->  T1    y
   / \\                               / \\
  T1  T2                            T2  T3`,
    relatedTopics: ['Red-Black Trees', 'Binary Search Tree', 'B-Trees', 'Heap Data Structure']
  },
  {
    id: 'dijkstra-algorithm',
    title: "Dijkstra's Shortest Path Algorithm",
    courseCode: 'CSE205',
    courseName: 'Data Structures & Algorithms',
    category: 'DSA',
    summary: 'Greedy algorithm for finding the single-source shortest path in weighted graphs with non-negative edge weights using a Min-Priority Queue.',
    detailedExplanation: `Dijkstra solves the single-source shortest path problem. It maintains a distance array initialized to infinity (and 0 for source). At each step, it extracts the unvisited vertex with minimum distance from the priority queue and relaxes all its adjacent edges.\n\nRelaxation Condition:\nif (dist[u] + weight(u, v) < dist[v]) {\n    dist[v] = dist[u] + weight(u, v);\n}\n\nNote: Fails on graphs with negative edge weights (use Bellman-Ford instead).`,
    complexity: {
      time: 'O((V + E) log V) with Min-Heap',
      space: 'O(V + E)',
      best: 'O((V + E) log V)',
      worst: 'O(V^2) with Adjacency Matrix',
    },
    examRelevance: '🔥 High (Standard CSE205 / GATE question)',
    keyPoints: [
      'Greedy choice property: once a node is visited, its shortest distance is finalized.',
      'Cannot handle negative cycle or negative weights.',
      'Uses priority_queue / Min-Heap for optimal performance.'
    ],
    codeSnippets: [
      {
        language: 'cpp',
        label: 'C++',
        code: `vector<int> dijkstra(int V, vector<vector<pair<int,int>>>& adj, int src) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(V, 1e9);
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first, weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
      }
    ],
    visualDiagram: `Src [0] --(4)--> A [4]
 |               |  \\(2)
(1)             (3)  --> Dest [6]
 v               v
 B [1] --(2)--> C [3]`,
    relatedTopics: ['Bellman-Ford Algorithm', 'Floyd-Warshall', 'A* Search Algorithm', 'Prim Algorithm']
  },
  {
    id: 'deadlock-coffman-conditions',
    title: 'Operating System Deadlocks & Coffman Conditions',
    courseCode: 'CSE316',
    courseName: 'Operating Systems',
    category: 'OS',
    summary: 'A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.',
    detailedExplanation: `Deadlock occurs when 4 necessary and sufficient conditions (Coffman Conditions) hold simultaneously:\n\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n2. Hold and Wait: A process is holding at least one resource and waiting to acquire additional resources held by other processes.\n3. No Preemption: Resources cannot be forcibly taken; only released voluntarily.\n4. Circular Wait: A closed chain of processes exists such that P0 waits for P1, P1 waits for P2 ... and Pn waits for P0.\n\nRemedies:\n- Deadlock Prevention (invalidate at least 1 Coffman condition)\n- Deadlock Avoidance (Banker's Algorithm for safe state)\n- Deadlock Detection & Recovery`,
    complexity: {
      time: "Banker's Algorithm: O(N * M^2)",
      space: 'O(N * M) for Allocation & Need matrices',
    },
    examRelevance: '🔥 Guaranteed Question in CSE316 Midterm/Endterm',
    keyPoints: [
      "Breaking 'Circular Wait' is commonly achieved by assigning global order IDs to resources.",
      "Banker's algorithm ensures system never enters an unsafe state.",
      'Resource Allocation Graph (RAG) with a cycle implies deadlock if single instances of resources exist.'
    ],
    codeSnippets: [
      {
        language: 'cpp',
        label: 'C++ Banker Check',
        code: `bool isSafe(int n, int m, vector<int>& avail, vector<vector<int>>& maxm, vector<vector<int>>& allot) {
    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            need[i][j] = maxm[i][j] - allot[i][j];

    vector<bool> finish(n, false);
    vector<int> work = avail;
    int count = 0;

    while (count < n) {
        bool found = false;
        for (int p = 0; p < n; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < m; j++)
                    if (need[p][j] > work[j]) break;
                if (j == m) {
                    for (int k = 0; k < m; k++) work[k] += allot[p][k];
                    finish[p] = true;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) return false; // System Unsafe!
    }
    return true; // System Safe!
}`
      }
    ],
    visualDiagram: ` [Process P1] -- Holds --> [Resource R1]
      ^                            |
   Waits For                    Waits For
      |                            v
 [Resource R2] <-- Holds -- [Process P2]
   >>> CIRCULAR WAIT DETECTED <<<`,
    relatedTopics: ['Bankers Algorithm', 'Process Scheduling', 'Semaphores & Mutex', 'Paging & Virtual Memory']
  },
  {
    id: 'nextjs-server-vs-client',
    title: 'Next.js 14 App Router: Server vs Client Components',
    courseCode: 'INT219',
    courseName: 'Full-Stack Web Development',
    category: 'WEB',
    summary: 'The mental model behind React Server Components (RSC) by default versus interactive Client Components with "use client".',
    detailedExplanation: `In Next.js 14 App Router, every component in the /app directory is a React Server Component (RSC) by default.\n\nKey Differences:\n- Server Components:\n  * Render only on the server, producing zero JavaScript bundle sent to the client.\n  * Can directly access backend DBs, file systems, and sensitive API secrets securely.\n  * Cannot use browser APIs, useState, useEffect, or event listeners (onClick).\n\n- Client Components ('use client'):\n  * Rendered on client (and pre-rendered on server for HTML hydration).\n  * Required for state, effects, DOM listeners, audio, camera, canvas, and local storage.\n\nBoundary Rule: Pass Server Components as children/props into Client Components to keep performance optimal.`,
    examRelevance: '🔥 Core Question for INT219 Web Dev Exam & Hackathons',
    keyPoints: [
      "'use client' defines the boundary between server-only and client-interactive code.",
      'Server Actions use "use server" for direct type-safe RPCs without writing custom API routes.',
      'SSR + RSC drastically improves First Contentful Paint (FCP) and SEO.'
    ],
    codeSnippets: [
      {
        language: 'javascript',
        label: 'React / Next.js',
        code: `// 1. Server Component (Default)
import db from '@/lib/db';

export default async function CourseList() {
  const courses = await db.query('SELECT * FROM courses');
  return <div>{courses.map(c => <p key={c.id}>{c.name}</p>)}</div>;
}

// 2. Client Component (Interactive)
'use client';
import { useState } from 'react';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Clicked: {count}</button>;
}`
      }
    ],
    visualDiagram: `Client Request -> Next.js Server
  |--> [Server Component] (Fetches DB / Strips JS) -> Fast HTML/RSC Payload
  |--> [Client Boundary ('use client')] -> Hydrated React Interactive DOM`,
    relatedTopics: ['React Hooks', 'SSR vs SSG vs ISR', 'Supabase Realtime SSR', 'Tailwind CSS Grid']
  },
  {
    id: 'dbms-acid-cap-theorem',
    title: 'ACID Properties & CAP Theorem in Databases',
    courseCode: 'CSE320',
    courseName: 'Database Management Systems',
    category: 'DBMS',
    summary: 'The fundamental transaction guarantees (Atomicity, Consistency, Isolation, Durability) and the CAP tradeoff in distributed systems.',
    detailedExplanation: `1. ACID Properties for Relational DBMS:\n- Atomicity: All or nothing execution (via write-ahead logs / rollback).\n- Consistency: Transactions preserve all database integrity constraints.\n- Isolation: Concurrent transactions execute without cross-interference (Serializable, Repeatable Read, Read Committed).\n- Durability: Once committed, updates survive system crashes (persisted to disk/WAL).\n\n2. CAP Theorem (Brewer's Theorem for Distributed Systems):\nA distributed data store can simultaneously provide at most two out of three guarantees:\n- Consistency (C): Every read receives the most recent write or an error.\n- Availability (A): Every request receives a non-error response without guarantee of latest data.\n- Partition Tolerance (P): System continues operating despite network packet loss/split.\nIn real distributed networks, P is mandatory -> choice is CP (e.g. MongoDB, CockroachDB) vs AP (e.g. Cassandra, DynamoDB).`,
    examRelevance: '🔥 Essential CSE320 / Technical Interview Topic',
    keyPoints: [
      'Two-Phase Locking (2PL) guarantees serializability in ACID transactions.',
      'Isolation levels tradeoff throughput for consistency (Dirty Reads -> Non-repeatable Reads -> Phantom Reads).',
      'PostgreSQL & MySQL InnoDB default to Read Committed / Repeatable Read.'
    ],
    codeSnippets: [
      {
        language: 'cpp',
        label: 'SQL / Transaction',
        code: `-- PostgreSQL Row-Locked Atomic Transfer
BEGIN;
  SELECT balance FROM profiles WHERE id = 'user_a' FOR UPDATE;
  UPDATE profiles SET credits = credits - 50 WHERE id = 'user_a';
  UPDATE profiles SET credits = credits + 50 WHERE id = 'user_b';
COMMIT;`
      }
    ],
    relatedTopics: ['B+ Trees Indexing', 'Database Normalization', 'Two-Phase Commit', 'Distributed Systems']
  },
  {
    id: 'tcp-three-way-handshake',
    title: 'TCP 3-Way Handshake & Congestion Control',
    courseCode: 'CSE325',
    courseName: 'Computer Networks',
    category: 'NETWORKS',
    summary: 'The connection establishment procedure between client and server using SYN, SYN-ACK, and ACK packets before reliable data transfer.',
    detailedExplanation: `TCP establishes reliable connection over unreliable IP network via a 3-way handshake:\n\nStep 1: Client -> Server: SYN (Synchronize Sequence Number = X)\nStep 2: Server -> Client: SYN-ACK (Seq = Y, Ack = X + 1)\nStep 3: Client -> Server: ACK (Ack = Y + 1, Connection ESTABLISHED)\n\nTCP Congestion Control Stages:\n1. Slow Start (exponential window growth: 1, 2, 4, 8...)\n2. Congestion Avoidance (linear growth once reaching ssthresh)\n3. Fast Retransmit & Fast Recovery (on receiving 3 duplicate ACKs)`,
    complexity: {
      time: '1.5 RTT (Round Trip Time) for connection setup',
      space: 'Buffer window scaled based on Bandwidth-Delay Product (BDP)',
    },
    examRelevance: '🔥 10-Mark Core Topic in CSE325 End-Term',
    keyPoints: [
      'Prevents stale duplicate packets from initiating bogus connections.',
      'SYN flood attacks exploit half-open connections (mitigated via SYN cookies).',
      'TCP uses sliding window protocol for flow control.'
    ],
    codeSnippets: [
      {
        language: 'python',
        label: 'Python Socket',
        code: `import socket

# Server Socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8080))
server.listen(5)
print("Listening for TCP Handshakes on port 8080...")

client, addr = server.accept() # Completes 3-way handshake
print(f"Connection established with {addr}")`
      }
    ],
    visualDiagram: `CLIENT                             SERVER
  |                                   |
  | ----- [1. SYN, Seq=X] ----------> | (LISTEN -> SYN_RCVD)
  |                                   |
  | <---- [2. SYN-ACK, Ack=X+1, Seq=Y] - |
  |                                   |
  | ----- [3. ACK, Ack=Y+1] --------> | (ESTABLISHED)
  |                                   |
  | ====== DATA TRANSFER BEGINS ===== |`,
    relatedTopics: ['OSI Model vs TCP/IP', 'UDP vs TCP', 'DNS Resolution', 'HTTP/3 over QUIC']
  }
];

const CATEGORIES = [
  { id: 'ALL', label: '🌐 All Topics' },
  { id: 'DSA', label: '🌳 Data Structures (CSE205)' },
  { id: 'OS', label: '💻 Operating Systems (CSE316)' },
  { id: 'WEB', label: '⚡ Web Dev (INT219)' },
  { id: 'DBMS', label: '🗄️ DBMS (CSE320)' },
  { id: 'NETWORKS', label: '📡 Networks (CSE325)' },
];

export default function CSESearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<CSETopic | null>(null);
  const [activeCodeLang, setActiveCodeLang] = useState<string>('cpp');
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return CSE_KNOWLEDGE_BASE.filter((topic) => {
      const matchesCat = selectedCategory === 'ALL' || topic.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesText =
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.courseCode.toLowerCase().includes(q) ||
        topic.relatedTopics.some((r) => r.toLowerCase().includes(q));

      return matchesCat && matchesText;
    });
  }, [query, selectedCategory]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeelingLucky = () => {
    const randomTopic = CSE_KNOWLEDGE_BASE[Math.floor(Math.random() * CSE_KNOWLEDGE_BASE.length)];
    setSelectedTopic(randomTopic);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Hero Google-Style Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Campus CSE Knowledge Engine
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
          Nexus<span className="text-orange-500">Search</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Instant answers, code templates, algorithmic time complexities, and LPU exam-yield notes for all Computer Science subjects.
        </p>

        {/* Big Glowing Google-like Search Bar */}
        <div className="relative pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search CSE concepts, algorithms, OS deadlocks, exam formulas... (Press '/' to focus)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white dark:bg-white/[0.04] border-2 border-zinc-200 dark:border-white/10 hover:border-orange-500/50 focus:border-orange-500 text-zinc-900 dark:text-white text-sm shadow-xl focus:outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-20 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white font-bold px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleFeelingLucky}
              title="Open a random high-yield topic"
              className="absolute right-3 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lucky</span>
            </button>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                  : 'bg-zinc-100 dark:bg-white/[0.03] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS & KNOWLEDGE VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Results Feed (5 or 12 Cols depending on selection) */}
        <div className={selectedTopic ? 'lg:col-span-5 space-y-3' : 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
          {filteredTopics.length === 0 ? (
            <div className="col-span-full text-center py-16 p-8 rounded-3xl bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5">
              <HelpCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No matching topics found</h3>
              <p className="text-xs text-zinc-400 mt-1">Try searching for "AVL", "Dijkstra", "Deadlock", "Next.js", or "TCP".</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/40 shadow-lg'
                      : 'bg-white dark:bg-white/[0.02] border-zinc-200 dark:border-white/10 hover:border-orange-500/30 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-[11px] font-black text-orange-600 dark:text-orange-400">
                      {topic.courseCode}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {topic.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white leading-snug">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      Exam High-Yield
                    </span>
                    <span className="text-orange-500 font-bold flex items-center gap-1 group">
                      Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Google Knowledge Panel Detail (7 Cols) */}
        {selectedTopic && (
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-2xl space-y-6 sticky top-20">
            
            {/* Topic Header & Meta */}
            <div className="space-y-2 border-b border-zinc-200 dark:border-white/5 pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-orange-600 text-white text-xs font-black">
                    {selectedTopic.courseCode}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    {selectedTopic.courseName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {selectedTopic.title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>

            {/* Complexity & Exam Badges */}
            {selectedTopic.complexity && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Time Complexity</span>
                  <span className="text-xs font-mono font-black text-orange-600 dark:text-orange-400">
                    {selectedTopic.complexity.time}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Auxiliary Space</span>
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {selectedTopic.complexity.space}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Exam Yield</span>
                  <span className="text-xs font-black text-amber-500">
                    {selectedTopic.examRelevance.split(' ')[0]} Verified
                  </span>
                </div>
              </div>
            )}

            {/* Deep-Dive Detailed Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                Concept Explanation & Rules
              </h4>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {selectedTopic.detailedExplanation}
              </div>
            </div>

            {/* Visual ASCII / Architecture Diagram */}
            {selectedTopic.visualDiagram && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  Visual Architecture / Flow
                </h4>
                <div className="p-4 rounded-2xl bg-zinc-900 dark:bg-black border border-zinc-800 font-mono text-[11px] text-emerald-400 whitespace-pre overflow-x-auto shadow-inner">
                  {selectedTopic.visualDiagram}
                </div>
              </div>
            )}

            {/* Code Implementation Tabs */}
            {selectedTopic.codeSnippets.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-500" />
                    Code Implementation
                  </h4>
                  <button
                    onClick={() => handleCopyCode(selectedTopic.codeSnippets[0].code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:text-orange-500 text-xs font-bold transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-900">
                  <div className="p-4 font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre leading-relaxed">
                    {selectedTopic.codeSnippets[0].code}
                  </div>
                </div>
              </div>
            )}

            {/* Key Exam Takeaways */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Key Takeaways for Midterm & Endterm
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                {selectedTopic.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions: Ask Doubt & Open in Focus Hub */}
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.relatedTopics.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setQuery(rel)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition"
                  >
                    #{rel}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/doubts"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Doubt on this</span>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
