import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = rawSupabaseUrl?.replace(/\/rest\/v1\/?$/i, '');

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null