-- 2024-03-31 Create Global Bonus RPC
-- Admin-only mass distribution of coins

CREATE OR REPLACE FUNCTION public.apply_global_bonus(arg_amount numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- 1. Cap protection
  IF arg_amount > 10000 THEN
    RAISE EXCEPTION 'Bonus amount is too high (Max 10000).';
  END IF;

  -- 2. Set bypass to allow the trigger update for the balance column
  PERFORM set_config('app.rpc_bypass', 'true', true);

  -- 3. Apply bonus to all onboarded users ONLY
  UPDATE public.players
  SET mining_balance = COALESCE(mining_balance, 0) + arg_amount
  WHERE is_onboarded = true;
END;
$function$;

-- API Revocation (Security)
REVOKE EXECUTE ON FUNCTION public.apply_global_bonus(numeric) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.apply_global_bonus(numeric) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_global_bonus(numeric) TO service_role, postgres;
