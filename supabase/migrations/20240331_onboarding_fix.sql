-- 2024-03-31 Onboarding Fix & Referral Recovery
-- This migration creates the secure RPC for profile completion and 
-- repairs users stuck in an incomplete onboarding state.

CREATE OR REPLACE FUNCTION public.complete_profile_setup(
    arg_full_name text,
    arg_dob text,
    arg_email text,
    arg_whatsapp text
)
RETURNS public.players
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_user_id text;
    v_player public.players;
BEGIN
    -- 1. Extract user ID from JWT custom claims (Telegram ID)
    v_user_id := current_setting('request.jwt.claims', true)::json->>'sub';
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Verify payment state
    SELECT * FROM public.players WHERE id = v_user_id INTO v_player;
    IF v_player IS NULL THEN
        RAISE EXCEPTION 'Player not found';
    END IF;

    IF v_player.payment_status IS DISTINCT FROM 'approved' THEN
        RAISE EXCEPTION 'Account must be approved before completing profile.';
    END IF;

    -- 3. Enable rpc_bypass to update the protected is_onboarded column
    PERFORM set_config('app.rpc_bypass', 'true', true);

    -- 4. Update the profile and mark as onboarded
    UPDATE public.players
    SET 
        full_name = arg_full_name,
        dob = arg_dob::date, -- FIX: Explicit type cast from text to date
        email = arg_email,
        whatsapp_number = arg_whatsapp,
        profile_completed = true,
        is_onboarded = true
    WHERE id = v_user_id
    RETURNING * INTO v_player;

    RETURN v_player;
END;
$function$;

-- 2. Security
REVOKE ALL ON FUNCTION public.complete_profile_setup(text, text, text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_profile_setup(text, text, text, text) TO authenticated, service_role;

-- 3. REPAIR SCRIPT: Fix stuck users
DO $$ 
BEGIN
  PERFORM set_config('app.rpc_bypass', 'true', true);

  UPDATE public.players
  SET is_onboarded = true
  WHERE payment_status = 'approved' 
    AND is_onboarded = false 
    AND full_name IS NOT NULL 
    AND whatsapp_number IS NOT NULL;
END $$;
