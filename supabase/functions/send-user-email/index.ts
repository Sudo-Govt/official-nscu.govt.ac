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

    console.log('Sending email via cPanel API from:', emailAccount.email_address);

    // Get cPanel credentials from environment
    const cpanelHost = Deno.env.get('CPANEL_HOST');
    const cpanelUsername = Deno.env.get('CPANEL_USERNAME');
    const cpanelToken = Deno.env.get('CPANEL_API_TOKEN');

    if (!cpanelHost || !cpanelUsername || !cpanelToken) {
      throw new Error('cPanel credentials not configured');
    }

    // Prepare email content
    const emailBody = email.body_html || email.body;
    
    // Send email using cPanel API
    const cpanelApiUrl = `https://${cpanelHost}:2083/execute/Email/send_message`;
    
    const formData = new URLSearchParams();
    formData.append('from', emailAccount.email_address);
    formData.append('to', email.to_email);
    formData.append('subject', email.subject);
    formData.append('text', email.body);
    formData.append('html', emailBody);
    
    if (email.cc) {
      formData.append('cc', email.cc);
    }
    if (email.bcc) {
      formData.append('bcc', email.bcc);
    }

    console.log('Calling cPanel API:', cpanelApiUrl);

    const response = await fetch(cpanelApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `cpanel ${cpanelUsername}:${cpanelToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();
    console.log('cPanel API Response:', result);

    if (!response.ok || result.errors) {
      throw new Error(result.errors || `cPanel API error: ${response.status}`);
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

    console.log('Email sent successfully via cPanel API');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully via cPanel API' }),
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
