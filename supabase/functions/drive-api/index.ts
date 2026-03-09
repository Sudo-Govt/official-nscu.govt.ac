import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DRIVE_API_BASE =
  "https://en.nscu.govt.ac/15346245624674568ghjdf45w6345634gsdfg3t45634turti78/45yjtyj767i678e65w5esgjgkuilo9o674562345325656ysgsfdgdghmfyuio/data.php";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const driveToken = Deno.env.get("DRIVE_API_TOKEN");
    if (!driveToken) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: missing DRIVE_API_TOKEN" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Public ping - no auth needed
    if (action === "ping") {
      const apiUrl = `${DRIVE_API_BASE}?action=ping&token=${encodeURIComponent(driveToken)}`;
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other actions require authentication
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Check if user is admin for admin-only actions
    const isAdminAction = ["library_categories", "create_category"].includes(action || "") ||
      (url.searchParams.get("scope") === "library" && action === "upload") ||
      (url.searchParams.get("scope") === "library" && action === "delete");

    if (isAdminAction) {
      const { data: adminCheck } = await supabase.rpc("is_admin");
      if (!adminCheck) {
        return new Response(JSON.stringify({ error: "Admin access required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Build the external API URL
    const params = new URLSearchParams();
    params.set("token", driveToken);
    if (action) params.set("action", action);

    const scope = url.searchParams.get("scope") || "user";
    params.set("scope", scope);

    if (scope === "user") {
      params.set("user_id", userId);
    }

    for (const key of ["path", "folder", "category"]) {
      const val = url.searchParams.get(key);
      if (val) params.set(key, val);
    }

    const apiUrl = `${DRIVE_API_BASE}?${params.toString()}`;

    // For file uploads, forward the body as multipart
    if (action === "upload" && req.method === "POST") {
      const formData = await req.formData();
      const resp = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For downloads, stream the response
    if (action === "download") {
      const resp = await fetch(apiUrl);
      if (!resp.ok) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: resp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const responseHeaders: Record<string, string> = { ...corsHeaders };
      const ct = resp.headers.get("Content-Type");
      if (ct) responseHeaders["Content-Type"] = ct;
      const cd = resp.headers.get("Content-Disposition");
      if (cd) responseHeaders["Content-Disposition"] = cd;
      const cl = resp.headers.get("Content-Length");
      if (cl) responseHeaders["Content-Length"] = cl;
      responseHeaders["Accept-Ranges"] = "bytes";

      return new Response(resp.body, {
        status: resp.status,
        headers: responseHeaders,
      });
    }

    // For delete actions
    if (action === "delete") {
      const resp = await fetch(apiUrl, { method: "POST" });
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: GET requests (list, quota, library_categories, etc.)
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("drive-api error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
