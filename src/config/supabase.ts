import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase no arquivo .env!');
}

// Passamos o <Database> como Generic. 
// A partir de agora, todo 'supabase.from()' terá autocomplete perfeito!
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);