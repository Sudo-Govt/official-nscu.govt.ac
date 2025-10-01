import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { full_name, user_id } = await req.json();
    
    console.log('Creating email account for:', full_name, user_id);

    // Generate email address from full name
    const emailUsername = generateEmailUsername(full_name);
    const emailAddress = `${emailUsername}@nscu.govt.ac`;
    const defaultPassword = generateRandomPassword();

    console.log('Generated email:', emailAddress);

    // Try to create email account via cPanel API
    const cpanelApiToken = Deno.env.get('CPANEL_API_TOKEN');
    const cpanelUsername = Deno.env.get('CPANEL_USERNAME');
    const cpanelHost = Deno.env.get('CPANEL_HOST') || 'mail.nscu.govt.ac'; // cPanel server hostname
    
    let cpanelAccountCreated = false;
    let cpanelError = null;

    try {
      const cpanelUrl = `https://${cpanelHost}:2083/execute/Email/add_pop`;
      const params = new URLSearchParams({
        email: emailUsername,
        password: defaultPassword,
        quota: '1024', // 1GB quota
        domain: 'nscu.govt.ac'
      });

      console.log('Calling cPanel API at:', cpanelHost, 'with username:', cpanelUsername);

      // Use cPanel API token authentication format
      const cpanelResponse = await fetch(`${cpanelUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const cpanelResult = await cpanelResponse.json();
      console.log('cPanel response:', cpanelResult);

      if (cpanelResponse.ok && cpanelResult.status) {
        cpanelAccountCreated = true;
        console.log('cPanel account created successfully');
      } else {
        cpanelError = `cPanel API error: ${JSON.stringify(cpanelResult)}`;
        console.error(cpanelError);
      }
    } catch (error) {
      cpanelError = `cPanel connection failed: ${error.message}`;
      console.error(cpanelError);
    }

    // Store email account in database (even if cPanel fails)
    const { data: emailAccount, error: dbError } = await supabaseClient
      .from('email_accounts')
      .insert({
        user_id: user_id || user.id,
        email_address: emailAddress,
        email_password: defaultPassword,
        display_name: full_name,
        quota_mb: 1024,
        cpanel_account_created: cpanelAccountCreated,
        is_active: true
      })
      .select()
      .single();

    if (dbError) throw dbError;

    console.log('Email account created successfully:', emailAccount.id);

    return new Response(
      JSON.stringify({
        success: true,
        email_address: emailAddress,
        password: defaultPassword,
        cpanel_created: cpanelAccountCreated,
        cpanel_error: cpanelError,
        message: cpanelAccountCreated 
          ? 'Email account created successfully' 
          : 'Email account created in database. cPanel setup pending - please contact your system administrator.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating email account:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateEmailUsername(fullName: string): string {
  // Clean the input - remove any existing email domain if present
  let cleanName = fullName.toLowerCase().trim();
  if (cleanName.includes('@')) {
    cleanName = cleanName.split('@')[0]; // Remove email domain
  }
  
  // Split into parts
  const parts = cleanName.split(/[\s.]+/).filter(p => p.length > 0);
  
  if (parts.length >= 2) {
    const firstName = parts[0].replace(/[^a-z]/g, '');
    const lastName = parts[parts.length - 1].replace(/[^a-z]/g, '');
    
    // Use firstname.lastname format
    return `${firstName}.${lastName}`;
  }
  
  // Fallback: just use the cleaned name
  return cleanName.replace(/[^a-z]/g, '') || 'user' + Date.now();
}

function generateRandomPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}