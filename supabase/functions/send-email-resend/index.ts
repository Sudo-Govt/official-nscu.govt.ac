import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  body: string;
  html_body?: string;
  cc?: string;
  bcc?: string;
  from_name?: string;
  from_email?: string;
  reply_to?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    type?: string;
  }>;
  save_to_db?: boolean;
  user_id?: string;
  priority?: string;
  scheduled_at?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-email-resend function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      subject,
      body,
      html_body,
      cc,
      bcc,
      from_name = "NSCU University",
      from_email = "noreply@nscu.govt.ac",
      reply_to,
      attachments,
      save_to_db = true,
      user_id,
      priority = "normal",
      scheduled_at,
    }: EmailRequest = await req.json();

    console.log("Sending email to:", to, "Subject:", subject);

    // Validate required fields
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare email data for Resend
    const emailData: any = {
      from: `${from_name} <${from_email}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      text: body,
    };

    // Add HTML body if provided
    if (html_body) {
      emailData.html = html_body;
    }

    // Add CC if provided
    if (cc) {
      emailData.cc = cc.split(",").map((e: string) => e.trim());
    }

    // Add BCC if provided
    if (bcc) {
      emailData.bcc = bcc.split(",").map((e: string) => e.trim());
    }

    // Add reply-to if provided
    if (reply_to) {
      emailData.reply_to = reply_to;
    }

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      emailData.attachments = attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        type: att.type,
      }));
    }

    // Check if this is a scheduled email
    if (scheduled_at) {
      // For scheduled emails, we'll save to DB but not send yet
      console.log("Scheduling email for:", scheduled_at);
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send(emailData);
    console.log("Resend response:", emailResponse);

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: emailResponse.error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database if requested
    if (save_to_db && user_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const toEmail = Array.isArray(to) ? to[0] : to;

      const { error: dbError } = await supabase.from("emails").insert({
        user_id,
        from_email,
        from_name,
        to_email: toEmail,
        subject,
        body: html_body || body,
        cc,
        bcc,
        email_type: "sent",
        status: "sent",
        sent_at: new Date().toISOString(),
        priority,
        is_read: true,
        is_starred: false,
        is_deleted: false,
        is_archived: false,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail the request, email was sent successfully
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message_id: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email-resend function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
