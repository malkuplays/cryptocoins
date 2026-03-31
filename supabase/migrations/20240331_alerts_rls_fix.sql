-- 2024-03-31 Fix Alerts RLS Policy
-- Telegram ID handling

DROP POLICY IF EXISTS "Users can view their own alerts" ON public.alerts;

CREATE POLICY "Users can view their own alerts" ON public.alerts
FOR SELECT USING (
    player_id = (current_setting('request.jwt.claims', true)::json ->> 'sub')
);
