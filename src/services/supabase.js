import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_project_url' && 
  supabaseAnonKey !== 'your_anon_key' &&
  supabaseUrl.includes('supabase.co');

let supabase;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase not configured. Please set up your .env file.');
  supabase = null;
}

export { supabase, isConfigured };
