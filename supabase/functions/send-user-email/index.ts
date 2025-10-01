import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { email_id } = await req.json();

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
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !emailAccount) {
      throw new Error('Email account not configured');
    }

    console.log('Sending email from:', emailAccount.email_address);

    // Send via SMTP using user's credentials
    const client = new SMTPClient({
      connection: {
        hostname: 'mail.govt.ac',
        port: 465,
        tls: true,
        auth: {
          username: emailAccount.email_address,
          password: emailAccount.email_password,
        },
      },
    });

    await client.send({
      from: `${emailAccount.display_name} <${emailAccount.email_address}>`,
      to: email.to_email,
      cc: email.cc || undefined,
      bcc: email.bcc || undefined,
      subject: email.subject,
      content: email.body,
      html: email.body_html || email.body,
    });

    await client.close();

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

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Update email with error
    const { email_id } = await req.json().catch(() => ({}));
    if (email_id) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );
        
        await supabaseClient
          .from('emails')
          .update({ 
            status: 'failed',
            error_message: error.message 
          })
          .eq('id', email_id);
      } catch (e) {
        console.error('Failed to update email error status:', e);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});