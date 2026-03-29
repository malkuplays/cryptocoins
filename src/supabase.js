import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe: export a dummy client if keys are missing to prevent entire app crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Using dummy client.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      from: () => ({ 
        upsert: () => ({ select: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) }) }),
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) })
      }) 
    };
