import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";

// Resolves the caller's IP from the proxy headers Vercel sets. x-forwarded-for
// can hold a comma-separated chain (client, proxy1, ...); the first hop is the
// originating client.
async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

// Returns true if the request is within the limit (allowed), false if it should
// be rejected. Fails OPEN on any error: a Supabase blip must not block legit
// users, and the same outage would already break submission downstream.
export async function checkRateLimit(
  bucket: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const ip = await getClientIp();
    const { data, error } = await getSupabaseAdmin().rpc("check_rate_limit", {
      p_key: `${bucket}:${ip}`,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return data === true;
  } catch {
    return true;
  }
}
