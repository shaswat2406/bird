'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePomodoroSync(roomId: string) {
  const supabase = useMemo(() => createClient(), []);
  
  // Customizable sprint duration (default: 25 minutes = 1500 seconds)
  const [totalDuration, setTotalDuration] = useState<number>(1500);
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [pomodoroState, setPomodoroState] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const rewardedRef = useRef(false);

  // 1. Ticking countdown timer (1 second intervals)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // 2. Real-time Multi-User Sync via Supabase Broadcast
  useEffect(() => {
    const channel = supabase.channel(`timer_sync:${roomId}`);

    channel.on('broadcast', { event: 'timer_reset' }, ({ payload }: any) => {
      setTotalDuration(payload.seconds);
      setTimeLeft(payload.seconds);
      setPomodoroState(payload.state);
      setIsRunning(true);
      setIsCompleted(false);
      rewardedRef.current = false;
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  // 3. Start Custom Focus Sprint (customizable seconds)
  const startFocusSprint = useCallback((seconds = 1500) => {
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setPomodoroState('FOCUS');
    setIsRunning(true);
    setIsCompleted(false);
    rewardedRef.current = false;

    // Broadcast new custom timer state to everyone in the room
    const channel = supabase.channel(`timer_sync:${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'timer_reset',
      payload: { seconds, state: 'FOCUS' },
    });
  }, [roomId, supabase]);

  // 4. Start Custom Break (customizable seconds)
  const startBreak = useCallback((seconds = 300) => {
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setPomodoroState('BREAK');
    setIsRunning(true);
    setIsCompleted(false);

    const channel = supabase.channel(`timer_sync:${roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'timer_reset',
      payload: { seconds, state: 'BREAK' },
    });
  }, [roomId, supabase]);

  // 5. Claim Focus Reward
  const claimReward = useCallback(async () => {
    if (rewardedRef.current || pomodoroState !== 'FOCUS') return;

    try {
      rewardedRef.current = true;
      const { data } = await supabase.rpc('award_pomodoro_credits', {
        p_room_id: '00000000-0000-0000-0000-000000000001',
      });
      return data;
    } catch (err) {
      console.error('Failed to claim focus reward:', err);
    }
  }, [pomodoroState, supabase]);

  return {
    timeLeft,
    totalDuration,
    pomodoroState,
    isCompleted,
    isRunning,
    startFocusSprint,
    startBreak,
    claimReward,
    room: {
      pomodoro_state: pomodoroState,
      cycle_duration_seconds: totalDuration,
    },
  };
}