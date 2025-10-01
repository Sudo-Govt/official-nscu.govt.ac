import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    const { emailId } = await req.json();

    // Fetch the email to send
    const { data: email, error: emailError } = await supabaseClient
      .from('emails')
      .select('*')
      .eq('id', emailId)
      .single();

    if (emailError || !email) {
      throw new Error('Email not found');
    }

    // Fetch SMTP settings
    const { data: smtpSettings, error: smtpError } = await supabaseClient
      .from('smtp_settings')
      .select('*')
      .single();

    if (smtpError || !smtpSettings) {
      throw new Error('SMTP settings not configured');
    }

    // Log SMTP settings for debugging
    console.log('Attempting to send email via SMTP:', {
      host: smtpSettings.smtp_host,
      port: smtpSettings.smtp_port,
      user: smtpSettings.smtp_user,
      tls: smtpSettings.use_tls,
    });

    // Send email using SMTP with proper STARTTLS configuration
    const client = new SMTPClient({
      connection: {
        hostname: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        tls: false, // Start without TLS
        auth: {
          username: smtpSettings.smtp_user,
          password: smtpSettings.smtp_password,
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

      console.log('Email sent successfully to:', email.to_email);
      await client.close();
    } catch (smtpError) {
      console.error('SMTP send error:', smtpError);
      await client.close();
      throw new Error(`SMTP Error: ${smtpError.message}`);
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
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
