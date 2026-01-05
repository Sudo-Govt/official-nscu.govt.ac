import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  course_id?: string;
  application_id?: string;
  callback_url?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { 
      amount, 
      currency = 'INR', 
      description, 
      customer_name, 
      customer_email,
      customer_phone,
      course_id,
      application_id,
      callback_url
    } = body;

    // Validate required fields
    if (!amount || !description || !customer_name || !customer_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, description, customer_name, customer_email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Amount must be in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay payment link
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const paymentLinkPayload: Record<string, unknown> = {
      amount: amountInPaise,
      currency: currency,
      description: description,
      customer: {
        name: customer_name,
        email: customer_email,
        ...(customer_phone && { contact: customer_phone })
      },
      notify: {
        sms: !!customer_phone,
        email: true
      },
      reminder_enable: true,
      notes: {
        course_id: course_id || '',
        application_id: application_id || '',
        created_at: new Date().toISOString()
      },
      expire_by: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days expiry
    };

    if (callback_url) {
      paymentLinkPayload.callback_url = callback_url;
      paymentLinkPayload.callback_method = 'get';
    }

    console.log('Creating Razorpay payment link for:', { 
      amount: amountInPaise, 
      currency, 
      customer_email,
      course_id 
    });

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentLinkPayload)
    });

    const razorpayData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('Razorpay API error:', razorpayData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create payment link', 
          details: razorpayData.error?.description || 'Unknown error' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment link created successfully:', razorpayData.id);

    return new Response(
      JSON.stringify({
        success: true,
        payment_link_id: razorpayData.id,
        payment_link_url: razorpayData.short_url,
        amount: amount,
        currency: currency,
        status: razorpayData.status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
