import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application_id, razorpay_payment_id, razorpay_payment_link_status } = await req.json();

    if (!application_id) {
      return new Response(
        JSON.stringify({ error: "Application ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate payment status from Razorpay (basic validation)
    // In production, you should verify with Razorpay API using signature
    if (razorpay_payment_link_status !== 'paid' && !razorpay_payment_id) {
      return new Response(
        JSON.stringify({ error: "Payment not confirmed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Fetch the application to check current status
    const { data: application, error: fetchError } = await supabaseAdmin
      .from("student_applications")
      .select("id, first_name, last_name, payment_status, payment_code, course:courses(course_name)")
      .eq("id", application_id)
      .single();

    if (fetchError || !application) {
      console.error("Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If payment already completed, return existing code
    if (application.payment_status === "completed" && application.payment_code) {
      return new Response(
        JSON.stringify({
          success: true,
          payment_code: application.payment_code,
          student_name: `${application.first_name} ${application.last_name}`,
          course_name: (application.course as any)?.course_name || "N/A",
          already_completed: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate new payment code using database function
    const { data: codeData, error: codeError } = await supabaseAdmin.rpc("generate_payment_code");

    if (codeError) {
      console.error("Code generation error:", codeError);
      return new Response(
        JSON.stringify({ error: "Failed to generate payment code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newPaymentCode = codeData as string;

    // Update application with payment details using service role (bypasses RLS)
    const { error: updateError } = await supabaseAdmin
      .from("student_applications")
      .update({
        payment_status: "completed",
        payment_code: newPaymentCode,
        payment_completed_at: new Date().toISOString(),
        status: "enrolled",
        razorpay_payment_id: razorpay_payment_id || null,
      })
      .eq("id", application_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_code: newPaymentCode,
        student_name: `${application.first_name} ${application.last_name}`,
        course_name: (application.course as any)?.course_name || "N/A",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
