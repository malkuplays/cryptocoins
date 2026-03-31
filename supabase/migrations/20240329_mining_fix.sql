-- 2024-03-31 Mining Synchronization Fix
-- This migration refactors the mining engine to fetch dynamic rates from app_settings
-- and ensures newly verified users start mining immediately.

CREATE OR REPLACE FUNCTION public.sync_mining_progress()
 RETURNS players
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id text;
  v_player public.players;
  v_rate numeric;
  v_elapsed_seconds numeric;
  v_earnings numeric;
  v_now timestamp with time zone := NOW();
  v_tier_min numeric;
  v_tier_max numeric;
BEGIN
  -- Extract user ID from JWT custom claims (Telegram ID)
  v_user_id := current_setting('request.jwt.claims', true)::json->>'sub';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Load basic user info
  SELECT * FROM public.players WHERE id = v_user_id INTO v_player;

  IF v_player IS NULL THEN
    RAISE EXCEPTION 'Player record not found';
  END IF;

  -- Guard: Only mine if onboarded
  IF NOT v_player.is_onboarded THEN
    RETURN v_player;
  END IF;

  -- Fetch dynamic rates from app_settings
  SELECT (value::numeric) INTO v_tier_min FROM public.app_settings WHERE key = v_player.plan_tier || '_min';
  SELECT (value::numeric) INTO v_tier_max FROM public.app_settings WHERE key = v_player.plan_tier || '_max';

  -- Set average rate based on tier
  IF v_tier_min IS NOT NULL AND v_tier_max IS NOT NULL THEN
     v_rate := (v_tier_min + v_tier_max) / 2.0;
  ELSE
     -- Hardcoded fallbacks matching SettingsContext.jsx
     v_rate := CASE 
       WHEN v_player.plan_tier = 'whale'     THEN 275.0
       WHEN v_player.plan_tier = 'pro'       THEN 170.0
       WHEN v_player.plan_tier = 'starter'   THEN 146.0
       WHEN v_player.plan_tier = 'legendary' THEN 750.0
       ELSE 7.5 -- 'free'
     END;
  END IF;

  -- Apply multipliers if mining_power is set
  IF v_player.mining_power > 1.0 THEN
      v_rate := v_rate * v_player.mining_power;
  END IF;

  -- Calculate time elapsed
  v_elapsed_seconds := EXTRACT(EPOCH FROM (v_now - COALESCE(v_player.last_mining_update, v_player.last_sync, v_player.created_at, v_now)));
  v_elapsed_seconds := LEAST(v_elapsed_seconds, 168 * 3600); -- Max 7 days

  -- Calculate earnings
  v_earnings := (v_elapsed_seconds / 3600.0) * v_rate;

  -- Enable RPC bypass
  PERFORM set_config('app.rpc_bypass', 'true', true);

  -- Update balance
  UPDATE public.players
  SET 
    mining_balance = COALESCE(mining_balance, 0) + v_earnings,
    last_mining_update = v_now,
    last_sync = v_now
  WHERE id = v_user_id
  RETURNING * INTO v_player;

  RETURN v_player;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_user_id(arg_user_id text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  PERFORM set_config('app.rpc_bypass', 'true', true);

  UPDATE public.players 
  SET 
    is_verified = true,
    last_mining_update = NOW() 
  WHERE id = arg_user_id AND last_mining_update IS NULL; 
  
  UPDATE public.players 
  SET is_verified = true 
  WHERE id = arg_user_id;
END;
$function$;
