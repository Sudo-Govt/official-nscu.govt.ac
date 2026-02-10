import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DOMAIN = "https://nscu.govt.ac";
const TODAY = new Date().toISOString().split("T")[0];

// Static pages with their priority and changefreq
const STATIC_PAGES: Array<{ loc: string; priority: string; changefreq: string }> = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/home/welcome", priority: "0.8", changefreq: "weekly" },
  { loc: "/home/fast-facts", priority: "0.7", changefreq: "monthly" },
  { loc: "/home/virtual-tour", priority: "0.8", changefreq: "monthly" },
  { loc: "/home/news", priority: "0.9", changefreq: "daily" },
  { loc: "/home/emergency", priority: "0.9", changefreq: "daily" },
  // About
  { loc: "/about/history-mission", priority: "0.8", changefreq: "monthly" },
  { loc: "/about/leadership", priority: "0.7", changefreq: "monthly" },
  { loc: "/about/accreditation", priority: "0.8", changefreq: "monthly" },
  { loc: "/about/campus-map", priority: "0.6", changefreq: "monthly" },
  { loc: "/about/sustainability", priority: "0.6", changefreq: "monthly" },
  { loc: "/about/diversity-inclusion", priority: "0.7", changefreq: "monthly" },
  // Academics
  { loc: "/academics/school-arts", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/school-science", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/college-engineering", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/college-arts-sciences", priority: "0.8", changefreq: "monthly" },
  { loc: "/academics/school-business", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/college-health-sciences", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/school-medicine", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/school-law", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/college-education", priority: "0.9", changefreq: "monthly" },
  { loc: "/academics/school-public-health", priority: "0.8", changefreq: "monthly" },
  { loc: "/academics/school-social-work", priority: "0.8", changefreq: "monthly" },
  { loc: "/academics/college-veterinary-medicine", priority: "0.8", changefreq: "monthly" },
  { loc: "/academics/course-catalog", priority: "0.9", changefreq: "weekly" },
  { loc: "/academics/academic-calendar", priority: "0.8", changefreq: "weekly" },
  { loc: "/academics/phd-programs", priority: "0.9", changefreq: "monthly" },
  // Departments (static)
  { loc: "/departments/english-literature", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/history", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/biology", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/computer-science", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/business-administration", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/engineering", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/health-sciences", priority: "0.8", changefreq: "monthly" },
  { loc: "/departments/liberal-arts", priority: "0.8", changefreq: "monthly" },
  // Programs (static)
  { loc: "/programs/bachelor-arts-english", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-arts-history", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-fine-arts-creative-writing", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/bachelor-science-biology", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/bachelor-engineering", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-business-administration", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/bachelor-nursing", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/doctor-medicine", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-social-work", priority: "0.8", changefreq: "monthly" },
  { loc: "/programs/bachelor-fine-arts", priority: "0.8", changefreq: "monthly" },
  { loc: "/programs/bachelor-pharmacy", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/doctor-pharmacy", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-pharmacy", priority: "0.9", changefreq: "monthly" },
  { loc: "/programs/master-medicine", priority: "0.9", changefreq: "monthly" },
  // Admissions
  { loc: "/admissions/undergraduate", priority: "0.9", changefreq: "weekly" },
  { loc: "/admissions/graduate", priority: "0.9", changefreq: "weekly" },
  { loc: "/admissions/international", priority: "0.9", changefreq: "weekly" },
  { loc: "/admissions/transfer", priority: "0.8", changefreq: "weekly" },
  { loc: "/admissions/financial-aid", priority: "0.9", changefreq: "weekly" },
  { loc: "/admissions/tours", priority: "0.8", changefreq: "weekly" },
  { loc: "/apply", priority: "1.0", changefreq: "weekly" },
  { loc: "/apply/fast-track", priority: "0.9", changefreq: "weekly" },
  // Student Life
  { loc: "/student-life/housing", priority: "0.8", changefreq: "monthly" },
  { loc: "/student-life/dining", priority: "0.7", changefreq: "monthly" },
  { loc: "/student-life/health-wellness", priority: "0.8", changefreq: "monthly" },
  { loc: "/student-life/career-services", priority: "0.9", changefreq: "monthly" },
  { loc: "/student-life/organizations", priority: "0.7", changefreq: "monthly" },
  { loc: "/student-life/recreation", priority: "0.7", changefreq: "monthly" },
  { loc: "/student-life/artsculture", priority: "0.7", changefreq: "monthly" },
  // Campus Life
  { loc: "/campus-life/fitness-centers", priority: "0.6", changefreq: "monthly" },
  { loc: "/campus-life/greek-life", priority: "0.6", changefreq: "monthly" },
  { loc: "/campus-life/intramurals", priority: "0.6", changefreq: "monthly" },
  // Research
  { loc: "/research/office", priority: "0.8", changefreq: "monthly" },
  { loc: "/research/undergraduate", priority: "0.7", changefreq: "monthly" },
  { loc: "/research/funding", priority: "0.8", changefreq: "monthly" },
  { loc: "/research/core-facilities", priority: "0.7", changefreq: "monthly" },
  { loc: "/research/technology-transfer", priority: "0.7", changefreq: "monthly" },
  { loc: "/research/centers", priority: "0.7", changefreq: "monthly" },
  // Alumni
  { loc: "/alumni/association", priority: "0.7", changefreq: "monthly" },
  { loc: "/alumni/benefits", priority: "0.7", changefreq: "monthly" },
  { loc: "/alumni/events", priority: "0.8", changefreq: "weekly" },
  { loc: "/alumni/career-networking", priority: "0.7", changefreq: "monthly" },
  { loc: "/alumni/give-back", priority: "0.7", changefreq: "monthly" },
  { loc: "/alumni/directory", priority: "0.6", changefreq: "monthly" },
  // Colleges
  { loc: "/colleges/full-fledged", priority: "0.8", changefreq: "monthly" },
  { loc: "/colleges/offshore", priority: "0.8", changefreq: "monthly" },
  { loc: "/colleges/study-centers", priority: "0.7", changefreq: "monthly" },
  // International
  { loc: "/international/programs", priority: "0.8", changefreq: "monthly" },
  { loc: "/international/collaborations", priority: "0.7", changefreq: "monthly" },
  // Affiliation
  { loc: "/affiliation/nscu-affiliation", priority: "0.8", changefreq: "monthly" },
  // Athletics
  { loc: "/athletics", priority: "0.7", changefreq: "weekly" },
  // Campus
  { loc: "/campus/facilities", priority: "0.7", changefreq: "monthly" },
  // Faculty
  { loc: "/faculty/directory", priority: "0.7", changefreq: "monthly" },
  // Events
  { loc: "/events/calendar", priority: "0.8", changefreq: "daily" },
  // News
  { loc: "/news/university-news", priority: "0.9", changefreq: "daily" },
  { loc: "/news/press-releases", priority: "0.8", changefreq: "weekly" },
  // Services
  { loc: "/services/libraries", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/writing-center", priority: "0.7", changefreq: "monthly" },
  { loc: "/services/it-help-desk", priority: "0.7", changefreq: "monthly" },
  { loc: "/services/parking-transportation", priority: "0.6", changefreq: "monthly" },
  { loc: "/services/disability-services", priority: "0.7", changefreq: "monthly" },
  { loc: "/services/international", priority: "0.7", changefreq: "monthly" },
  { loc: "/services/multicultural-affairs", priority: "0.7", changefreq: "monthly" },
  { loc: "/services/veterans", priority: "0.7", changefreq: "monthly" },
  // Resources
  { loc: "/resources/student-handbook", priority: "0.6", changefreq: "monthly" },
  { loc: "/resources/academic-policies", priority: "0.6", changefreq: "monthly" },
  { loc: "/resources/campus-safety", priority: "0.7", changefreq: "monthly" },
  { loc: "/resources/emergency-info", priority: "0.8", changefreq: "monthly" },
  { loc: "/resources/title-ix", priority: "0.7", changefreq: "monthly" },
  // Legal
  { loc: "/legal/privacy-policy", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/terms-of-use", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/terms-disclaimer", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/payment-policy", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/terms-conditions", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/refund-policy", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/disclaimer", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/grievance", priority: "0.5", changefreq: "monthly" },
  { loc: "/legal/shipping-policy", priority: "0.4", changefreq: "monthly" },
  // Forms & Portal
  { loc: "/forms", priority: "0.6", changefreq: "weekly" },
  { loc: "/portal/mynscu", priority: "0.5", changefreq: "monthly" },
  // Transparency
  { loc: "/transparency", priority: "0.7", changefreq: "monthly" },
  { loc: "/transparency/annual-reports", priority: "0.7", changefreq: "monthly" },
  { loc: "/transparency/financial-statements", priority: "0.7", changefreq: "monthly" },
  { loc: "/transparency/accreditation", priority: "0.7", changefreq: "monthly" },
  // Misc
  { loc: "/contact", priority: "0.8", changefreq: "monthly" },
  { loc: "/courses", priority: "0.9", changefreq: "weekly" },
  { loc: "/careers", priority: "0.7", changefreq: "weekly" },
  { loc: "/sitemap", priority: "0.5", changefreq: "monthly" },
];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${DOMAIN}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;
}

function buildSitemapIndex(sitemaps: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${s}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "index";
  const page = parseInt(url.searchParams.get("page") || "0");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (type === "index") {
      // Count courses to determine number of course sitemap pages
      const { count } = await supabase
        .from("academic_courses")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("is_visible_on_website", true);

      const coursePages = Math.ceil((count || 0) / 5000);
      const funcUrl = `${supabaseUrl}/functions/v1/generate-sitemap`;

      const sitemaps = [
        `${funcUrl}?type=static`,
        `${funcUrl}?type=faculties`,
        `${funcUrl}?type=departments`,
      ];

      for (let i = 0; i < coursePages; i++) {
        sitemaps.push(`${funcUrl}?type=courses&page=${i}`);
      }

      return new Response(buildSitemapIndex(sitemaps), {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    }

    if (type === "static") {
      const entries = STATIC_PAGES.map(p => urlEntry(p.loc, TODAY, p.changefreq, p.priority));
      return new Response(buildSitemap(entries), {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    }

    if (type === "faculties") {
      const { data: faculties } = await supabase
        .from("academic_faculties")
        .select("slug, updated_at")
        .eq("is_active", true);

      const entries = (faculties || []).map(f =>
        urlEntry(`/faculty/${f.slug}`, f.updated_at?.split("T")[0] || TODAY, "monthly", "0.8")
      );
      return new Response(buildSitemap(entries), {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    }

    if (type === "departments") {
      const { data: depts } = await supabase
        .from("academic_departments")
        .select("slug, updated_at")
        .eq("is_active", true);

      const entries = (depts || []).map(d =>
        urlEntry(`/department/${d.slug}`, d.updated_at?.split("T")[0] || TODAY, "monthly", "0.7")
      );
      return new Response(buildSitemap(entries), {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    }

    if (type === "courses") {
      const from = page * 5000;
      const to = from + 4999;

      const { data: courses } = await supabase
        .from("academic_courses")
        .select("slug, updated_at")
        .eq("is_active", true)
        .eq("is_visible_on_website", true)
        .order("created_at", { ascending: true })
        .range(from, to);

      const entries = (courses || []).map(c =>
        urlEntry(`/courses/${c.slug}`, c.updated_at?.split("T")[0] || TODAY, "weekly", "0.7")
      );
      return new Response(buildSitemap(entries), {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    }

    return new Response("Invalid type", { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500, headers: corsHeaders });
  }
});
