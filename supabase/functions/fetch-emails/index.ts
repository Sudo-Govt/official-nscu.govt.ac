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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Starting email fetch for all users...');

    // Get all active email accounts
    const { data: emailAccounts, error: accountsError } = await supabaseClient
      .from('email_accounts')
      .select('*')
      .eq('is_active', true);

    if (accountsError) throw accountsError;

    console.log(`Found ${emailAccounts?.length || 0} email accounts to sync`);

    let totalFetched = 0;

    for (const account of emailAccounts || []) {
      try {
        console.log(`Fetching emails for ${account.email_address}...`);

        // Note: IMAP implementation would go here
        // For now, this is a placeholder that would use a Deno IMAP library
        // Since Deno IMAP support is limited, you might need to:
        // 1. Use a third-party email API (like Nylas, SendGrid Inbound Parse)
        // 2. Run a separate Node.js service for IMAP
        // 3. Use cPanel's email forwarding to a webhook
        
        // Placeholder: Simulate fetching emails
        const newEmails = await fetchEmailsViaIMAP(account);
        
        if (newEmails.length > 0) {
          // Get inbox folder
          const { data: inboxFolder } = await supabaseClient
            .from('email_folders')
            .select('id')
            .eq('user_id', account.user_id)
            .eq('type', 'inbox')
            .single();

          // Insert new emails
          const { error: insertError } = await supabaseClient
            .from('emails')
            .insert(
              newEmails.map(email => ({
                ...email,
                user_id: account.user_id,
                email_account_id: account.id,
                folder_id: inboxFolder?.id,
                email_type: 'inbox',
                status: 'received'
              }))
            );

          if (insertError) {
            console.error(`Error inserting emails for ${account.email_address}:`, insertError);
          } else {
            totalFetched += newEmails.length;
            console.log(`Inserted ${newEmails.length} emails for ${account.email_address}`);
          }
        }

        // Update last synced timestamp
        await supabaseClient
          .from('email_accounts')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', account.id);

      } catch (error) {
        console.error(`Error processing account ${account.email_address}:`, error);
        continue;
      }
    }

    console.log(`Email fetch complete. Total emails fetched: ${totalFetched}`);

    return new Response(
      JSON.stringify({
        success: true,
        accounts_processed: emailAccounts?.length || 0,
        emails_fetched: totalFetched
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function fetchEmailsViaIMAP(account: any): Promise<any[]> {
  // IMAP implementation for premium12-2.web-hosting.com
  console.log(`Fetching IMAP emails for ${account.email_address} from premium12-2.web-hosting.com`);
  
  try {
    // Note: Deno has limited native IMAP support. For production, consider:
    // 1. Using a Node.js-based IMAP library via npm: prefix
    // 2. Using email forwarding to a webhook endpoint
    // 3. Using cPanel API to fetch emails
    // 4. Using a third-party email API service
    
    // This is a placeholder that shows the correct configuration
    // In production, you would use a library like:
    // import { ImapFlow } from 'npm:imapflow@1.0.150';
    
    /*
    const client = new ImapFlow({
      host: 'premium12-2.web-hosting.com',
      port: 993,
      secure: true, // Use SSL/TLS
      auth: {
        user: account.email_address,
        pass: account.email_password
      },
      logger: false
    });

    await client.connect();
    
    // Select INBOX
    await client.mailboxOpen('INBOX');
    
    // Fetch unseen messages or messages since last sync
    const lastSync = account.last_synced_at 
      ? new Date(account.last_synced_at) 
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    const messages = [];
    
    // Search for messages
    for await (const msg of client.fetch(
      { since: lastSync },
      { 
        envelope: true, 
        bodyStructure: true,
        source: true 
      }
    )) {
      messages.push({
        message_id: msg.envelope.messageId,
        from_email: msg.envelope.from?.[0]?.address || '',
        from_name: msg.envelope.from?.[0]?.name || '',
        to_email: msg.envelope.to?.[0]?.address || account.email_address,
        to_name: msg.envelope.to?.[0]?.name || '',
        subject: msg.envelope.subject || '(No Subject)',
        body: msg.source?.toString() || '',
        body_html: msg.source?.toString() || '',
        snippet: msg.envelope.subject?.substring(0, 200) || '',
        received_at: msg.envelope.date?.toISOString() || new Date().toISOString(),
        has_attachments: false // Would need to parse bodyStructure
      });
    }
    
    await client.logout();
    
    console.log(`Fetched ${messages.length} emails for ${account.email_address}`);
    return messages;
    */
    
    console.log('IMAP fetching is not yet fully implemented. Configure with premium12-2.web-hosting.com:993');
    return [];
    
  } catch (error) {
    console.error(`IMAP error for ${account.email_address}:`, error);
    throw error;
  }
}