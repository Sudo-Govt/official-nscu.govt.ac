import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helper
function validateEmailInput(email_id: unknown): string {
  if (!email_id || typeof email_id !== 'string') {
    throw new Error('Invalid email_id: must be a non-empty string');
  }
  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(email_id)) {
    throw new Error('Invalid email_id: must be a valid UUID');
  }
  return email_id;
}

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

    const body = await req.json();
    const email_id = validateEmailInput(body.email_id);

    // Get email details
    const { data: email, error: emailError } = await supabaseClient
      .from('emails')
      .select('*, email_accounts(*)')
      .eq('id', email_id)
      .single();

    if (emailError || !email) {
      throw new Error('Email not found');
    }

    // Get user's email account
    const { data: emailAccount, error: accountError } = await supabaseClient
      .from('email_accounts')
      .select('id, email_address, display_name, encrypted_password')
      .eq('user_id', user.id)
      .single();

    if (accountError || !emailAccount) {
      throw new Error('Email account not configured');
    }

    // Use service role to decrypt the password
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get encryption key from secrets
    const encryptionKey = Deno.env.get('EMAIL_ENCRYPTION_KEY');

    // Try to decrypt the password using database function if available
    let password: string | null = null;
    
    if (encryptionKey && emailAccount.encrypted_password) {
      try {
        const { data: decryptedData, error: decryptError } = await serviceClient.rpc(
          'decrypt_email_password',
          { 
            account_id: emailAccount.id, 
            encryption_key: encryptionKey 
          }
        );
        
        if (!decryptError && decryptedData) {
          password = decryptedData;
        }
      } catch {
        // Decryption failed, function may not exist
      }
    }

    if (!password) {
      throw new Error('Email password not available. Please reconfigure your email account.');
    }

    // Send email using SMTP
    const client = new SMTPClient({
      connection: {
        hostname: 'mail.nscu.govt.ac',
        port: 587,
        tls: false,
        auth: {
          username: emailAccount.email_address,
          password: password,
        },
      },
    });

    try {
      await client.send({
        from: `${emailAccount.display_name} <${emailAccount.email_address}>`,
        to: email.to_email,
        cc: email.cc || undefined,
        bcc: email.bcc || undefined,
        subject: email.subject,
        content: email.body,
        html: email.body_html || email.body,
      });

      // Email sent successfully
      await client.close();
    } catch (smtpError: unknown) {
      await client.close();
      throw new Error(`SMTP Error: ${smtpError instanceof Error ? smtpError.message : 'Unknown error'}`);
    }

    // Update email status
    const { error: updateError } = await supabaseClient
      .from('emails')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        email_type: 'sent'
      })
      .eq('id', email_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully via SMTP' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
