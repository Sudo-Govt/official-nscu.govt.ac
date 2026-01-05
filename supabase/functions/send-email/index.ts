import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helper
function validateEmailId(emailId: unknown): string {
  if (!emailId || typeof emailId !== 'string') {
    throw new Error('Invalid emailId: must be a non-empty string');
  }
  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(emailId)) {
    throw new Error('Invalid emailId: must be a valid UUID');
  }
  return emailId;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('No user found');
    }

    const body = await req.json();
    const emailId = validateEmailId(body.emailId);

    // Fetch the email to send
    const { data: email, error: emailError } = await supabaseClient
      .from('emails')
      .select('*')
      .eq('id', emailId)
      .single();

    if (emailError || !email) {
      throw new Error('Email not found');
    }

    // Use service role to access SMTP settings securely
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch SMTP settings using service role
    const { data: smtpSettings, error: smtpError } = await serviceClient
      .from('smtp_settings')
      .select('smtp_host, smtp_port, smtp_user, from_email, from_name, use_tls')
      .single();

    if (smtpError || !smtpSettings) {
      throw new Error('SMTP settings not configured');
    }

    // Get encryption key from secrets
    const smtpPasswordSecret = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPasswordSecret) {
      throw new Error('SMTP_PASSWORD secret not configured. Please set it in your backend secrets.');
    }

    // Sending email via SMTP (no sensitive data logged)

    // Send email using SMTP with proper STARTTLS configuration
    const client = new SMTPClient({
      connection: {
        hostname: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        tls: false, // Start without TLS
        auth: {
          username: smtpSettings.smtp_user,
          password: smtpPasswordSecret,
        },
      },
    });

    try {
      await client.send({
        from: `${smtpSettings.from_name} <${smtpSettings.from_email}>`,
        to: email.to_email,
        cc: email.cc || undefined,
        bcc: email.bcc || undefined,
        subject: email.subject,
        content: email.body,
        html: email.body,
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
        email_type: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', emailId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
