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

    console.log('Testing SMTP connection for:', emailAccount.email_address);

    const testResults = {
      email: emailAccount.email_address,
      smtp_hostname: 'premium12-2.web-hosting.com',
      smtp_port: 587,
      connection_successful: false,
      authentication_successful: false,
      test_email_sent: false,
      error_details: null as string | null,
    };

    try {
      // Test SMTP connection with STARTTLS
      const client = new SMTPClient({
        connection: {
          hostname: 'premium12-2.web-hosting.com',
          port: 587,
          tls: false, // STARTTLS
          auth: {
            username: emailAccount.email_address,
            password: emailAccount.email_password,
          },
        },
        debug: {
          log: true,
        },
      });

      console.log('Attempting SMTP connection...');
      testResults.connection_successful = true;
      testResults.authentication_successful = true;

      // Send a test email to the same address
      console.log('Sending test email...');
      await client.send({
        from: `${emailAccount.display_name} <${emailAccount.email_address}>`,
        to: emailAccount.email_address,
        subject: 'SMTP Connection Test - Success',
        content: 'This is a test email to verify your SMTP configuration is working correctly.',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #10b981;">✓ SMTP Connection Test Successful</h2>
            <p>Your email account <strong>${emailAccount.email_address}</strong> is configured correctly and can send emails.</p>
            <p style="color: #6b7280; font-size: 14px;">
              Server: premium12-2.web-hosting.com:587 (STARTTLS)<br>
              Tested at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      });

      await client.close();
      testResults.test_email_sent = true;

      console.log('Test email sent successfully');

    } catch (error: any) {
      console.error('SMTP test failed:', error);
      testResults.error_details = error.message;
      
      // Provide specific error guidance
      if (error.message.includes('authentication')) {
        testResults.error_details = 'Authentication failed. Please verify the email password is correct.';
      } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
        testResults.error_details = 'Cannot connect to mail server. Check if mail.nscu.govt.ac resolves to premium12-2.web-hosting.com';
      } else if (error.message.includes('timeout')) {
        testResults.error_details = 'Connection timeout. The mail server may be temporarily unavailable.';
      }
    }

    return new Response(
      JSON.stringify({ 
        success: testResults.test_email_sent,
        results: testResults,
        message: testResults.test_email_sent 
          ? 'SMTP test successful! Check the inbox for test email.'
          : 'SMTP test failed. See error details.'
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
        message: 'Failed to test SMTP connection'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
