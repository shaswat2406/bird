'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { usePomodoroSync } from '@/hooks/usePomodoroSync';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  Users,
  Play,
  Coffee,
  Sparkles,
  Camera,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  PenTool,
  Hand,
  PhoneOff,
  Send,
  Trash2
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  avatar: string;
}

interface RaisedHand {
  id: string;
  studentName: string;
  topic: string;
  time: string;
}

export default function VideoStudyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const supabase = createClient();

  // Active Live Synchronized Pomodoro Timer
  const {
    timeLeft,
    pomodoroState,
    startFocusSprint,
    startBreak,
    isCompleted,
    claimReward
  } = usePomodoroSync(roomId);

  // Media Streams & Hardware Controls
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Super Sidebar State: 'none' | 'chat' | 'whiteboard' | 'hands'
  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'whiteboard' | 'hands' | 'none'>('chat');

  // Participants & Identity
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userName, setUserName] = useState('LPU Student');
  const [userAvatar, setUserAvatar] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const channelRef = useRef<any>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#f97316');
  const [penWidth, setPenWidth] = useState(3);

  // Raised Hands State
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>([]);
  const [myHandRaised, setMyHandRaised] = useState(false);

  // 1. Initialize Camera & Mic
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setIsVideoOn(true);
      setIsMicOn(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera/Mic permission denied or not found:', err);
    }
  };

  useEffect(() => {
    startMedia();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // 2. Realtime Multi-User Presence & Broadcast Channel
  useEffect(() => {
    let activeChannel: any;

    async function initPresence() {
      const { data: { user } } = await supabase.auth.getUser();
      const tabUniqueId = `user_${Math.random().toString(36).substring(2, 9)}`;
      const currentId = user ? `${user.id}_${tabUniqueId.substring(0, 4)}` : tabUniqueId;
      setCurrentSessionId(currentId);

      let displayName = user ? 'LPU Student' : `Student #${tabUniqueId.substring(5)}`;
      let displayAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentId}`;

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        if (profile) {
          displayName = profile.full_name;
          displayAvatar = profile.avatar_url || displayAvatar;
        }
      }
      setUserName(displayName);
      setUserAvatar(displayAvatar);

      activeChannel = supabase.channel(`room_sync:${roomId}`, {
        config: { presence: { key: currentId } },
      });

      // Presence Sync
      activeChannel.on('presence', { event: 'sync' }, () => {
        const state = activeChannel.presenceState();
        const list: Participant[] = [];
        for (const key in state) {
          const entry: any = state[key][0];
          if (entry) {
            list.push({
              id: key,
              name: entry.name || 'Student',
              avatar: entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${key}`,
              hasVideo: entry.hasVideo ?? true,
              hasAudio: entry.hasAudio ?? true,
            });
          }
        }
        setParticipants(list);
      });

      // Chat Messages
      activeChannel.on('broadcast', { event: 'chat_msg' }, ({ payload }: any) => {
        setMessages((prev) => [...prev, payload]);
      });

      // Raised Hands
      activeChannel.on('broadcast', { event: 'hand_raise' }, ({ payload }: any) => {
        setRaisedHands((prev) => [payload, ...prev]);
      });
      activeChannel.on('broadcast', { event: 'hand_lower' }, ({ payload }: any) => {
        setRaisedHands((prev) => prev.filter((h) => h.id !== payload.id));
      });

      // Whiteboard Sync
      activeChannel.on('broadcast', { event: 'wb_draw' }, ({ payload }: any) => {
        drawOnCanvas(payload.x0, payload.y0, payload.x1, payload.y1, payload.color, payload.width);
      });
      activeChannel.on('broadcast', { event: 'wb_clear' }, () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      });

      activeChannel.subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await activeChannel.track({
            name: displayName,
            hasVideo: true,
            hasAudio: true,
            avatar: displayAvatar,
          });
        }
      });

      channelRef.current = activeChannel;
    }

    initPresence();

    return () => {
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };
  }, [roomId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSidebar]);

  // Auto-Reward Credits on Timer Completion
  useEffect(() => {
    if (isCompleted && pomodoroState === 'FOCUS') {
      claimReward();
    }
  }, [isCompleted, pomodoroState, claimReward]);

  // Chat Send Action
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgPayload: ChatMessage = {
      id: Math.random().toString(),
      sender: userName,
      text: newMessage.trim(),
      avatar: userAvatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, msgPayload]);
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_msg',
      payload: msgPayload,
    });
    setNewMessage('');
  };

  // Raise Hand Action
  const handleToggleRaiseHand = () => {
    if (!myHandRaised) {
      const topic = prompt('What is your doubt or topic?', 'Quick help with tree traversal in C++') || 'General Academic Doubt';
      const handPayload: RaisedHand = {
        id: currentSessionId,
        studentName: userName,
        topic,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRaisedHands((prev) => [handPayload, ...prev]);
      setMyHandRaised(true);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'hand_raise',
        payload: handPayload,
      });
      setActiveSidebar('hands');
    } else {
      setRaisedHands((prev) => prev.filter((h) => h.id !== currentSessionId));
      setMyHandRaised(false);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'hand_lower',
        payload: { id: currentSessionId },
      });
    }
  };

  // Whiteboard Canvas Drawing Logic
  const drawOnCanvas = (x0: number, y0: number, x1: number, y1: number, color: string, width: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.setAttribute('data-last-x', String(e.clientX - rect.left));
    canvas.setAttribute('data-last-y', String(e.clientY - rect.top));
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    const x0 = Number(canvas.getAttribute('data-last-x') || x1);
    const y0 = Number(canvas.getAttribute('data-last-y') || y1);

    drawOnCanvas(x0, y0, x1, y1, penColor, penWidth);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb_draw',
      payload: { x0, y0, x1, y1, color: penColor, width: penWidth },
    });

    canvas.setAttribute('data-last-x', String(x1));
    canvas.setAttribute('data-last-y', String(y1));
  };

  const stopDrawing = () => setIsDrawing(false);

  const handleClearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'wb_clear',
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleMic = () => {
    if (!localStream) {
      startMedia();
      return;
    }
    localStream.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = async () => {
    if (!localStream) {
      await startMedia();
      return;
    }
    localStream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOn));
    setIsVideoOn(!isVideoOn);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
      setIsScreenSharing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const courseCodeFormatted = roomId.split('-')[0]?.toUpperCase() || 'STUDY';

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#06070a] text-white overflow-hidden">
      
      {/* Top HUD Bar */}
      <div className="h-16 border-b border-white/5 bg-[#0b0d14]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Exit to Lobby & Room Info */}
        <div className="flex items-center gap-4">
          <Link
            href="/rooms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-bold transition"
            title="Leave room and return to all rooms lobby"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Lobby</span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
              {courseCodeFormatted}
            </span>
            <div className="hidden md:block">
              <h1 className="font-bold text-xs sm:text-sm text-zinc-100">Live Video Study Room</h1>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {participants.length} Studiers Connected
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Ticking Synchronized Pomodoro Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-4 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xs text-zinc-400 uppercase font-black tracking-wider">
              {pomodoroState === 'FOCUS' ? '🧠 Focus:' : '☕ Break:'}
            </span>
            <span className="font-mono text-base font-black text-amber-400">
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => startFocusSprint(1500)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg transition"
            title="Restart 25m Focus Sprint"
          >
            <Play className="w-3.5 h-3.5" />
            <span>25m Focus</span>
          </button>

          <button
            onClick={() => startBreak(300)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-300 text-xs font-bold border border-white/10 transition"
            title="Take 5m Break"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>5m Break</span>
          </button>
        </div>

        {/* Right: Invite Button & Hang Up */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              copiedLink
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.04] border-white/10 text-zinc-200 hover:bg-white/10'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Invite Link'}</span>
          </button>

          <Link
            href="/rooms"
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
            title="Leave Call"
          >
            <PhoneOff className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Body: Video Grid + Collapsible Super Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left / Center Area: Video Tiles Grid */}
        <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto bg-[#06070a]">
          
          {/* Local User Tile (You) */}
          <div className="relative rounded-3xl bg-zinc-900/60 border border-white/10 overflow-hidden flex items-center justify-center min-h-[260px] shadow-2xl group">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
            />
            {!isVideoOn && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-orange-600/30">
                  {userName.charAt(0)}
                </div>
                <button
                  onClick={startMedia}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold border border-white/10 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-orange-400" />
                  Turn On Camera
                </button>
              </div>
            )}

            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10">
              <span>{userName} (You)</span>
              {!isMicOn && <MicOff className="w-3.5 h-3.5 text-red-400" />}
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              +5 🪙 on sprint
            </div>
          </div>

          {/* Remote Connected Peers */}
          {participants.filter((p) => p.id !== currentSessionId).map((p) => (
            <div
              key={p.id}
              className="relative rounded-3xl bg-zinc-900/40 border border-white/10 overflow-hidden flex items-center justify-center min-h-[260px] shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="flex flex-col items-center gap-3">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-orange-500/30 shadow-lg"
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Studying on Call
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10">
                {p.name}
              </div>
            </div>
          ))}

        </div>

        {/* Right Super Sidebar */}
        {activeSidebar !== 'none' && (
          <div className="w-80 sm:w-96 border-l border-white/10 bg-[#090b11] flex flex-col h-full shrink-0 animate-in slide-in-from-right duration-200">
            
            {/* Sidebar Tab Selector */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between gap-1 bg-white/[0.02]">
              <button
                onClick={() => setActiveSidebar('chat')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'chat'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat ({messages.length})
              </button>

              <button
                onClick={() => setActiveSidebar('whiteboard')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'whiteboard'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Whiteboard
              </button>

              <button
                onClick={() => setActiveSidebar('hands')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'hands'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                Hands ({raisedHands.length})
              </button>
            </div>

            {/* TAB 1: LIVE CHAT */}
            {activeSidebar === 'chat' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 text-xs space-y-1">
                      <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto" />
                      <p className="font-semibold text-zinc-400">Room Chat</p>
                      <p>Send messages, paste code snippets, or share notes with studiers.</p>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="font-bold text-zinc-300">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-xs text-zinc-200 leading-relaxed break-words">
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/[0.01] flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: WHITEBOARD CANVAS */}
            {activeSidebar === 'whiteboard' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden p-3 space-y-3">
                <div className="flex items-center justify-between bg-white/[0.03] p-2 rounded-xl border border-white/5 text-xs">
                  <div className="flex items-center gap-1.5">
                    {['#f97316', '#3b82f6', '#10b981', '#ec4899', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPenColor(color)}
                        className={`w-5 h-5 rounded-full border-2 transition ${
                          penColor === color ? 'scale-125 border-white' : 'border-transparent opacity-70'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleClearWhiteboard}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition text-[11px] font-bold flex items-center gap-1"
                    title="Clear Canvas"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>

                <div className="flex-1 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={350}
                    height={480}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 text-center font-mono">
                  Live shared canvas • Sketch trees & algorithms
                </p>
              </div>
            )}

            {/* TAB 3: RAISED HANDS */}
            {activeSidebar === 'hands' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase flex items-center gap-1.5">
                      <Hand className="w-4 h-4 text-amber-400" />
                      In-Room Micro-Bounties
                    </span>
                    <span className="text-xs font-mono font-bold">+10 🪙</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Stuck on code during focus? Raise hand to broadcast a quick question to studiers on call.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Active Raised Hands ({raisedHands.length})
                  </h3>

                  {raisedHands.length === 0 && (
                    <p className="text-xs text-zinc-500 text-center py-8">
                      No hands raised right now. Everyone is locked into focus!
                    </p>
                  )}

                  {raisedHands.map((h) => (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          ✋ {h.studentName}
                        </span>
                        <span className="text-[10px] text-zinc-500">{h.time}</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">"{h.topic}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Floating Bottom Media Bar with Sidebar Action Buttons */}
      <div className="h-20 border-t border-white/5 bg-[#0b0d14]/90 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0">
        
        {/* Left Status */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/5">
          <Users className="w-4 h-4 text-orange-400" />
          <span>{Math.max(1, participants.length)} Connected</span>
        </div>

        {/* Center Hardware Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-2xl transition border ${
              isMicOn
                ? 'bg-white/[0.05] hover:bg-white/10 text-white border-white/10'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
            title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-2xl transition border ${
              isVideoOn
                ? 'bg-white/[0.05] hover:bg-white/10 text-white border-white/10'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
            title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
          >
            {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-2xl transition border ${
              isScreenSharing
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-white/[0.05] hover:bg-white/10 text-white border-white/10'
            }`}
            title="Share Screen"
          >
            <ScreenShare className="w-5 h-5" />
          </button>
        </div>

        {/* Right Super Sidebar Toggles */}
        <div className="flex items-center gap-2">
          {/* Raise Hand Button */}
          <button
            onClick={handleToggleRaiseHand}
            className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition ${
              myHandRaised
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-bounce'
                : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title="Raise Hand for Help"
          >
            <Hand className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{myHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
          </button>

          {/* Whiteboard Toggle */}
          <button
            onClick={() => setActiveSidebar(activeSidebar === 'whiteboard' ? 'none' : 'whiteboard')}
            className={`p-3 rounded-xl border transition ${
              activeSidebar === 'whiteboard'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Whiteboard"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setActiveSidebar(activeSidebar === 'chat' ? 'none' : 'chat')}
            className={`p-3 rounded-xl border transition ${
              activeSidebar === 'chat'
                ? 'bg-orange-600 text-white border-orange-500'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Room Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}