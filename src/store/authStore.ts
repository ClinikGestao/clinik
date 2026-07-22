import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  tenantId: string | null;
  role: string | null;
  isInitialized: boolean;
  setAuth: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  user: null,
  tenantId: null,
  role: null,
  isInitialized: false,

  setAuth: (session: Session | null) => {
    if (!session) {
      set({ session: null, user: null, tenantId: null, role: null, isInitialized: true });
      return;
    }

    const user = session.user;
    const tenantId = user.app_metadata?.tenant_id || null; 
    const role = user.user_metadata?.role_profile || null;

    set({ session, user, tenantId, role, isInitialized: true });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, tenantId: null, role: null });
  },
}));