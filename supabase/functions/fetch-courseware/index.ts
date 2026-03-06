import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST mode: return files assigned to this student from DB
    if (action === "list") {
      const { data: files, error: filesError } = await supabase
        .from("student_courseware")
        .select("*")
        .eq("student_user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (filesError) {
        return new Response(JSON.stringify({ error: filesError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ files: files || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STREAM mode: proxy the file from the PHP API
    const filePath = url.searchParams.get("file");
    if (!filePath) {
      return new Response(JSON.stringify({ error: "Missing file parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the student has access to this file
    const { data: access } = await supabase
      .from("student_courseware")
      .select("id")
      .eq("student_user_id", userId)
      .eq("file_path", filePath)
      .eq("is_active", true)
      .maybeSingle();

    if (!access) {
      // Also check admin access
      const { data: adminCheck } = await supabase.rpc("is_admin");
      if (!adminCheck) {
        return new Response(
          JSON.stringify({ error: "Access denied to this file" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const apiToken = Deno.env.get("COURSEWARE_API_TOKEN");
    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call the external PHP API
    const apiUrl = `https://govt.ac?file=${encodeURIComponent(filePath)}&token=${encodeURIComponent(apiToken)}`;
    const apiResponse = await fetch(apiUrl);

    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch file from server",
          status: apiResponse.status,
        }),
        {
          status: apiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back with correct content type
    const contentType =
      apiResponse.headers.get("Content-Type") || "application/octet-stream";
    const contentDisposition = apiResponse.headers.get("Content-Disposition");

    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": contentType,
    };

    if (contentDisposition) {
      responseHeaders["Content-Disposition"] = contentDisposition;
    }

    const contentLength = apiResponse.headers.get("Content-Length");
    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    // Support range requests for video streaming
    responseHeaders["Accept-Ranges"] = "bytes";

    return new Response(apiResponse.body, {
      status: apiResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("fetch-courseware error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
