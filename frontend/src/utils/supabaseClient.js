import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create a Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
