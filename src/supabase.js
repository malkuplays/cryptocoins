import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe: export a dummy client if keys are missing to prevent entire app crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Using dummy client.');
}

let authToken = null;
export const setAuthToken = (token) => { authToken = token; };

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options) => {
          const headers = new Headers(options?.headers || {});
          if (authToken) {
            headers.set('Authorization', `Bearer ${authToken}`);
          }
          return fetch(url, { ...options, headers });
        }
      }
    })
  : { 
      from: () => ({ 
        upsert: () => ({ select: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) }) }),
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: new Error('Supabase client not initialized') }) }) })
      }),
      functions: { invoke: () => ({ data: null, error: new Error('Supabase functions not initialized') }) }
    };
