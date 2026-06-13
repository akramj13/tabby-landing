-- IP-based rate limiting for the feedback server actions (issue creation and
-- screenshot upload-URL minting). Counters are written only by the service-role
-- key, so they stay durable across Vercel's serverless instances and cold starts.

create table if not exists public.rate_limits (
  key          text primary key,
  count        int  not null default 0,
  window_start timestamptz not null default now()
);

-- Atomic check-and-increment within a fixed window. Returns true if the request
-- is allowed (count after increment <= p_max). When the existing window has
-- expired, the counter resets to 1 and the window restarts.
create or replace function public.check_rate_limit(
  p_key text, p_max int, p_window_seconds int
) returns boolean
language plpgsql
security definer
as $$
declare v_count int;
begin
  insert into public.rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case when r.window_start < now() - make_interval(secs => p_window_seconds)
                 then 1 else r.count + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds)
                        then now() else r.window_start end
  returning r.count into v_count;
  return v_count <= p_max;
end;
$$;
