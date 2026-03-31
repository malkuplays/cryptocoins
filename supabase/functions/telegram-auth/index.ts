import { create } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyTelegramWebAppData(initData: string, botToken: string): Promise<any | null> {
  // ... (rest of the function remains same)
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) return null;

    urlParams.delete('hash');
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    const encoder = new TextEncoder();
    
    const secretKeyMaterial = await crypto.subtle.importKey(
      "raw", encoder.encode("WebAppData"), 
      { name: "HMAC", hash: "SHA-256" }, 
      false, ["sign"]
    );
    const secretKeyBuffer = await crypto.subtle.sign("HMAC", secretKeyMaterial, encoder.encode(botToken));
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw", secretKeyBuffer, 
      { name: "HMAC", hash: "SHA-256" }, 
      false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(dataCheckString));
    
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (signatureHex === hash) {
      const userStr = urlParams.get('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  } catch (err) {
    console.error("Verification error:", err);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { initData } = await req.json();
    if (!initData) {
      return new Response(JSON.stringify({ error: 'Missing initData' }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const botToken = Deno.env.get('BOT_TOKEN');
    const jwtSecret = Deno.env.get('APP_JWT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!botToken || !jwtSecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Server configuration missing secrets' }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const tgUser = await verifyTelegramWebAppData(initData, botToken);
    
    if (!tgUser || !tgUser.id) {
      return new Response(JSON.stringify({ error: 'Invalid Telegram initialization data' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // SECURITY: Mark user as verified in the database server-side
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { error: verifyError } = await supabaseAdmin
      .from('players')
      .upsert({ 
        id: tgUser.id.toString(), 
        is_verified: true,
        username: tgUser.username,
        full_name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim()
      }, { onConflict: 'id' });

    if (verifyError) {
      console.error("Verification system failure:", verifyError);
      // We continue since setting verified shouldn't block the user login, 
      // but referral bonuses will correctly fail to trigger if this fails.
    }

    // Generate Supabase Custom JWT
    const payload = {
      role: 'authenticated',
      sub: tgUser.id.toString(),
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    };
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    return new Response(JSON.stringify({ access_token: jwt, user: tgUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
