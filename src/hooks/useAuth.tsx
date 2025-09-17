import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for guest mode first
    const guestMode = localStorage.getItem('guest_mode');
    if (guestMode === 'true') {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        // Clear guest mode if user signs in normally
        if (session) {
          localStorage.removeItem('guest_mode');
          setIsGuest(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Handle guest mode
    if (isGuest) {
      localStorage.removeItem('guest_mode');
      setIsGuest(false);
      return { error: null };
    }

    // Handle normal auth
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  const signInAsGuest = () => {
    localStorage.setItem('guest_mode', 'true');
    setIsGuest(true);
    setLoading(false);
  };

  return {
    user,
    session,
    loading,
    signOut,
    signInAsGuest,
    isAuthenticated: !!user || isGuest,
    isGuest,
  };
};