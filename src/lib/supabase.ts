import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Committed fallbacks so the deployed build works without host env vars. The
// anon key is public by design (it ships in the client bundle) and the table is
// guarded by Row Level Security — env vars still override these when present.
const FALLBACK_URL = "https://zppciwdypvxvsvsgbgse.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGNpd2R5cHZ4dnN2c2diZ3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTY4OTYsImV4cCI6MjA5OTk3Mjg5Nn0.PjspN_W6D01l7-deSJU8Wn8rQtK-Q_SkCAeL6oTxk0s";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

/** Configured only when both env vars are present (see .env.example). */
export const isSupabaseConfigured = Boolean(url && key);

/** Shared Supabase client, or null until the project is configured. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string)
  : null;

/** The table that stores love-form submissions. */
export const SUBMISSIONS_TABLE = "love_submissions";
