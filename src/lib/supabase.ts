import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Configured only when both env vars are present (see .env.example). */
export const isSupabaseConfigured = Boolean(url && key);

/** Shared Supabase client, or null until the project is configured. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string)
  : null;

/** The table that stores love-form submissions. */
export const SUBMISSIONS_TABLE = "love_submissions";
