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
    console.log('Email username for cPanel:', emailUsername);

    // Try to create email account via cPanel API
    const cpanelApiToken = Deno.env.get('CPANEL_API_TOKEN');
    const cpanelUsername = Deno.env.get('CPANEL_USERNAME');
    const cpanelHost = Deno.env.get('CPANEL_HOST') || 'mail.nscu.govt.ac'; // cPanel server hostname
    
    let cpanelAccountCreated = false;
    let cpanelError = null;

    try {
      // Use UAPI2 format which is more reliable for email operations
      const cpanelUrl = `https://${cpanelHost}:2083/json-api/cpanel`;
      
      const requestBody = {
        cpanel_jsonapi_user: cpanelUsername,
        cpanel_jsonapi_apiversion: '2',
        cpanel_jsonapi_module: 'Email',
        cpanel_jsonapi_func: 'addpop',
        email: emailUsername,
        password: defaultPassword,
        quota: 1024,
        domain: 'nscu.govt.ac'
      };

      console.log('Calling cPanel UAPI2 at:', cpanelHost);
      console.log('cPanel API parameters:', {
        email: emailUsername,
        domain: 'nscu.govt.ac',
        quota: 1024
      });
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      // Use POST with form data for UAPI2
      const formData = new URLSearchParams(requestBody as any);
      const cpanelResponse = await fetch(cpanelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const cpanelResult = await cpanelResponse.json();
      console.log('cPanel UAPI2 response:', cpanelResult);

      // UAPI2 returns result in cpanelresult.data
      if (cpanelResponse.ok && cpanelResult?.cpanelresult?.data?.result === 1) {
        cpanelAccountCreated = true;
        console.log('cPanel account created successfully via UAPI2');
      } else {
        const errorMsg = cpanelResult?.cpanelresult?.data?.reason || JSON.stringify(cpanelResult);
        cpanelError = `cPanel API error: ${errorMsg}`;
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