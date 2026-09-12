'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useUserCredits() {
  const supabase = useMemo(() => createClient(), []);
  const [credits, setCredits] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) return;

        setUserId(user.id);

        const { data } = await supabase
          .from('profiles')
          .select('credits, full_name')
          .eq('id', user.id)
          .single();

        if (!isMounted) return;

        if (data) {
          setCredits(data.credits);
          setUserName(data.full_name || '');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    // Use a unique channel instance ID to prevent cached subscribed channel collisions
    const channelId = `profile-credits-${userId}-${Math.random().toString(36).substring(2, 8)}`;
    const channel = supabase.channel(channelId);

    channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            setCredits(payload.new.credits);
            setUserName(payload.new.full_name ?? '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return { credits, userId, userName, setCredits };
}