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

    const { email_account_id } = await req.json();

    // Get email account details
    const { data: emailAccount, error: accountError } = await supabaseClient
      .from('email_accounts')
      .select('*')
      .eq('id', email_account_id)
      .single();

    if (accountError || !emailAccount) {
      throw new Error('Email account not found');
    }

    console.log('Testing cPanel API connection for:', emailAccount.email_address);

    // Get cPanel credentials
    const cpanelHost = Deno.env.get('CPANEL_HOST');
    const cpanelUsername = Deno.env.get('CPANEL_USERNAME');
    const cpanelToken = Deno.env.get('CPANEL_API_TOKEN');

    const testResults = {
      email: emailAccount.email_address,
      method: 'cPanel API',
      cpanel_host: cpanelHost,
      connection_successful: false,
      authentication_successful: false,
      test_email_sent: false,
      error_details: null as string | null,
    };

    if (!cpanelHost || !cpanelUsername || !cpanelToken) {
      throw new Error('cPanel credentials not configured in environment');
    }

    try {
      // Test sending via cPanel API
      const cpanelApiUrl = `https://${cpanelHost}:2083/execute/Email/send_message`;
      
      const formData = new URLSearchParams();
      formData.append('from', emailAccount.email_address);
      formData.append('to', emailAccount.email_address); // Send test email to self
      formData.append('subject', 'cPanel API Connection Test - Success');
      formData.append('text', 'This is a test email to verify your cPanel API configuration is working correctly.');
      formData.append('html', `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">✓ cPanel API Connection Test Successful</h2>
          <p>Your email account <strong>${emailAccount.email_address}</strong> is configured correctly and can send emails via cPanel API.</p>
          <p style="color: #6b7280; font-size: 14px;">
            Method: cPanel API<br>
            Host: ${cpanelHost}<br>
            Tested at: ${new Date().toLocaleString()}
          </p>
        </div>
      `);

      console.log('Attempting cPanel API connection to:', cpanelApiUrl);
      testResults.connection_successful = true;

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

      if (!response.ok) {
        throw new Error(`cPanel API error: ${response.status} - ${JSON.stringify(result)}`);
      }

      if (result.errors) {
        throw new Error(`cPanel API errors: ${result.errors}`);
      }

      testResults.authentication_successful = true;
      testResults.test_email_sent = true;

      console.log('Test email sent successfully via cPanel API');

    } catch (error: any) {
      console.error('cPanel API test failed:', error);
      testResults.error_details = error.message;
      
      // Provide specific error guidance
      if (error.message.includes('401') || error.message.includes('authentication')) {
        testResults.error_details = 'Authentication failed. Please verify cPanel API token is correct.';
      } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
        testResults.error_details = `Cannot connect to cPanel host: ${cpanelHost}. Check if the host is correct.`;
      } else if (error.message.includes('timeout')) {
        testResults.error_details = 'Connection timeout. The cPanel server may be temporarily unavailable.';
      }
    }

    return new Response(
      JSON.stringify({ 
        success: testResults.test_email_sent,
        results: testResults,
        message: testResults.test_email_sent 
          ? 'cPanel API test successful! Check the inbox for test email.'
          : 'cPanel API test failed. See error details.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: testResults.test_email_sent ? 200 : 400
      }
    );

  } catch (error) {
    console.error('Error in test-smtp-connection:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to test connection'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
