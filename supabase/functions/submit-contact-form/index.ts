import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { flow, type, topics, fullName, isdCode, phone, email, country, message, captcha } = await req.json();

    // Get client IP and user agent
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Rate limit check

    // Check rate limiting
    const { data: rateLimit, error: rateLimitError } = await supabaseClient
      .from('contact_rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .single();

    const now = new Date();

    // Check if IP is blocked
    if (rateLimit?.blocked_until && new Date(rateLimit.blocked_until) > now) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many failed attempts. Please try again later.',
          blocked_until: rateLimit.blocked_until 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check submission rate (5 per hour)
    if (rateLimit) {
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const lastSubmission = new Date(rateLimit.last_submission_at);

      if (rateLimit.submission_count >= 5 && lastSubmission > hourAgo) {
        return new Response(
          JSON.stringify({ error: 'Too many submissions. Please try again in an hour.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Reset count if last submission was over an hour ago
      if (lastSubmission <= hourAgo) {
        await supabaseClient
          .from('contact_rate_limits')
          .update({ submission_count: 1, last_submission_at: now.toISOString() })
          .eq('ip_address', ip);
      } else {
        await supabaseClient
          .from('contact_rate_limits')
          .update({ 
            submission_count: rateLimit.submission_count + 1, 
            last_submission_at: now.toISOString() 
          })
          .eq('ip_address', ip);
      }
    } else {
      // Create new rate limit record
      await supabaseClient
        .from('contact_rate_limits')
        .insert({ ip_address: ip, submission_count: 1, last_submission_at: now.toISOString() });
    }

    // Validate captcha for non-academic flow
    if (flow === 'non-academic' && captcha) {
      const { a, b, sumAnswer, c, d, diffAnswer } = captcha;
      const correctSum = a + b;
      const correctDiff = c - d;

      if (sumAnswer !== correctSum || diffAnswer !== correctDiff) {
        // Increment captcha fail count
        const newFailCount = (rateLimit?.captcha_fail_count || 0) + 1;
        
        if (newFailCount >= 5) {
          // Block IP for 30 minutes
          const blockedUntil = new Date(now.getTime() + 30 * 60 * 1000);
          await supabaseClient
            .from('contact_rate_limits')
            .upsert({ 
              ip_address: ip, 
              captcha_fail_count: newFailCount,
              blocked_until: blockedUntil.toISOString()
            });
          
          return new Response(
            JSON.stringify({ error: 'Too many failed captcha attempts. Blocked for 30 minutes.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        await supabaseClient
          .from('contact_rate_limits')
          .upsert({ ip_address: ip, captcha_fail_count: newFailCount });

        return new Response(
          JSON.stringify({ error: 'Captcha incorrect — please try again.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Reset captcha fail count on success
      if (rateLimit) {
        await supabaseClient
          .from('contact_rate_limits')
          .update({ captcha_fail_count: 0 })
          .eq('ip_address', ip);
      }
    }

    // Sanitize inputs
    const sanitizedData = {
      flow,
      type: type || null,
      topics: topics ? JSON.stringify(topics) : null,
      full_name: fullName.trim().substring(0, 100),
      isd_code: isdCode.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase().substring(0, 255),
      country: country?.trim().substring(0, 100) || null,
      message: message?.trim().substring(0, 2500) || null,
      captcha_data: captcha ? JSON.stringify(captcha) : null,
      ip_address: ip,
      user_agent: userAgent.substring(0, 500),
      status: 'pending'
    };

    // Insert submission
    const { data: submission, error: insertError } = await supabaseClient
      .from('contact_submissions')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Log submission ID for tracking (non-sensitive)

    // Send email notification to dia@nscu.govt.ac
    const emailSubject = flow === 'academic' 
      ? `New Academic Inquiry - ${type}`
      : `New Non-Academic Inquiry - ${topics?.join(', ')}`;

    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Flow:</strong> ${flow}</p>
      ${type ? `<p><strong>Type:</strong> ${type}</p>` : ''}
      ${topics ? `<p><strong>Topics:</strong> ${topics.join(', ')}</p>` : ''}
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${isdCode} ${phone}</p>
      ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Note: Email sending would require configuring SMTP or using a service like Resend

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: flow === 'academic' 
          ? 'Thanks — we received your academic inquiry. We\'ll respond within 3 business days.'
          : 'Thank you. Your request is submitted — our team will reach out within 5 business days.',
        submissionId: submission.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ 
        error: 'Submission failed. Try again or contact support@nscu.edu'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});