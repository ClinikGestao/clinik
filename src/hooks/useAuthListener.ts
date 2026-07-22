import { useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';

export function useAuthListener() {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuth(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth]);
}