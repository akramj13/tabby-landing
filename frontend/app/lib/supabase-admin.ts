import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role client for server-only work (signing storage uploads, resolving
// public URLs). Never import this from a client component — it carries the key
// that bypasses RLS.
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase service role environment variables are not set");
    }
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
