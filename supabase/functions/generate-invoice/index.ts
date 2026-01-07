import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceRequest {
  application_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { application_id }: InvoiceRequest = await req.json();

    if (!application_id) {
      return new Response(
        JSON.stringify({ error: 'application_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating invoice for application:', application_id);

    // Fetch application details with course info
    const { data: application, error: appError } = await supabase
      .from('student_applications')
      .select(`
        *,
        course:courses(course_name, course_code, degree_type, college)
      `)
      .eq('id', application_id)
      .single();

    if (appError || !application) {
      console.error('Error fetching application:', appError);
      return new Response(
        JSON.stringify({ error: 'Application not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only generate invoice for completed payments
    if (application.payment_status !== 'completed') {
      return new Response(
        JSON.stringify({ error: 'Payment not completed for this application' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the payment date
    const paymentDate = application.payment_completed_at 
      ? new Date(application.payment_completed_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    // Generate invoice HTML
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Invoice - ${application.payment_code}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { opacity: 0.9; }
    .invoice-meta { display: flex; justify-content: space-between; padding: 20px 30px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .invoice-meta div { }
    .invoice-meta .label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    .invoice-meta .value { font-size: 16px; font-weight: 600; color: #1e293b; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e2e8f0; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .detail-item { }
    .detail-item .label { font-size: 12px; color: #94a3b8; margin-bottom: 2px; }
    .detail-item .value { font-size: 14px; color: #334155; }
    .payment-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .payment-box .amount { font-size: 32px; font-weight: 700; color: #166534; }
    .payment-box .currency { font-size: 16px; color: #22c55e; margin-left: 5px; }
    .payment-code { background: #1e3a5f; color: white; padding: 15px; border-radius: 6px; text-align: center; margin-top: 15px; }
    .payment-code .label { font-size: 12px; opacity: 0.8; margin-bottom: 5px; }
    .payment-code .code { font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 2px; }
    .footer { background: #f8fafc; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center; }
    .footer p { font-size: 12px; color: #64748b; }
    .status-badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    @media print { body { background: white; padding: 0; } .invoice { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>North South Caribbean University</h1>
      <p>Official Payment Receipt</p>
    </div>
    
    <div class="invoice-meta">
      <div>
        <div class="label">Invoice Number</div>
        <div class="value">${application.payment_code}</div>
      </div>
      <div>
        <div class="label">Payment Date</div>
        <div class="value">${paymentDate}</div>
      </div>
      <div>
        <div class="label">Status</div>
        <div class="value"><span class="status-badge">Paid</span></div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Student Information</div>
        <div class="details-grid">
          <div class="detail-item">
            <div class="label">Full Name</div>
            <div class="value">${application.first_name || ''} ${application.last_name || ''}</div>
          </div>
          <div class="detail-item">
            <div class="label">Email Address</div>
            <div class="value">${application.email}</div>
          </div>
          <div class="detail-item">
            <div class="label">Application Number</div>
            <div class="value">${application.application_number || 'N/A'}</div>
          </div>
          <div class="detail-item">
            <div class="label">Nationality</div>
            <div class="value">${application.nationality || 'N/A'}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Program Details</div>
        <div class="details-grid">
          <div class="detail-item">
            <div class="label">Program / Course</div>
            <div class="value">${application.course?.course_name || application.program || 'N/A'}</div>
          </div>
          <div class="detail-item">
            <div class="label">College</div>
            <div class="value">${application.course?.college || 'N/A'}</div>
          </div>
          <div class="detail-item">
            <div class="label">Degree Type</div>
            <div class="value">${application.course?.degree_type || 'N/A'}</div>
          </div>
          <div class="detail-item">
            <div class="label">Course Code</div>
            <div class="value">${application.course?.course_code || 'N/A'}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Payment Summary</div>
        <div class="payment-box">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 14px; color: #166534; margin-bottom: 5px;">Application Fee</div>
              <div>
                <span class="amount">${application.approved_fee?.toLocaleString() || '0'}</span>
                <span class="currency">USD</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #16a34a;">Payment Method</div>
              <div style="font-size: 14px; color: #166534; font-weight: 500;">Razorpay</div>
            </div>
          </div>
        </div>
        
        <div class="payment-code">
          <div class="label">Payment Confirmation Code</div>
          <div class="code">${application.payment_code}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an official receipt from North South Caribbean University.</p>
      <p style="margin-top: 5px;">For queries, contact admissions@nscu.edu • www.nscu.edu</p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('Invoice generated successfully for:', application.payment_code);

    return new Response(
      JSON.stringify({ 
        success: true,
        invoice_html: invoiceHtml,
        payment_code: application.payment_code,
        student_name: `${application.first_name || ''} ${application.last_name || ''}`.trim(),
        amount: application.approved_fee
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate invoice' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
