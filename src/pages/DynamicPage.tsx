import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import DOMPurify from "dompurify";

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
}

interface ContentBlock {
  id: string;
  block_type: string;
  block_key: string | null;
  position: number;
  content: Record<string, any>;
  custom_css: string | null;
  is_active: boolean;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch page
        const { data: pageData, error: pageError } = await supabase
          .from("cms_pages")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (pageError || !pageData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setPage(pageData);

        // Fetch content blocks
        const { data: blocksData, error: blocksError } = await supabase
          .from("cms_content_blocks")
          .select("*")
          .eq("page_id", pageData.id)
          .eq("is_active", true)
          .order("position");

        if (blocksError) throw blocksError;

        const typedBlocks: ContentBlock[] = (blocksData || []).map((b) => ({
          ...b,
          content:
            b.content && typeof b.content === "object" && !Array.isArray(b.content)
              ? (b.content as Record<string, any>)
              : {},
        }));

        setBlocks(typedBlocks);
      } catch (error) {
        console.error("Error fetching page:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const renderBlock = (block: ContentBlock) => {
    const { content, custom_css, block_type } = block;
    const scopeClass = `cms-block-${block.id.slice(0, 8)}`;

    switch (block_type) {
      case "hero":
        return (
          <div key={block.id} className={`${scopeClass} relative py-16 bg-primary text-primary-foreground`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
              {content.subtitle && (
                <p className="text-xl opacity-90 mb-6">{content.subtitle}</p>
              )}
              {content.cta_text && content.cta_link && (
                <a
                  href={content.cta_link}
                  className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {content.cta_text}
                </a>
              )}
            </div>
          </div>
        );

      case "hero_stats":
        const stats = [
          { title: content.stat1_title, value: content.stat1_value },
          { title: content.stat2_title, value: content.stat2_value },
          { title: content.stat3_title, value: content.stat3_value },
          { title: content.stat4_title, value: content.stat4_value },
        ].filter((s) => s.title && s.value);

        return (
          <div key={block.id} className={`${scopeClass} py-12 bg-muted`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.title}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "overview":
        return (
          <div key={block.id} className={`${scopeClass} py-12`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {content.heading && (
                    <h2 className="text-2xl font-bold mb-4">{content.heading}</h2>
                  )}
                  {content.paragraph && (
                    <p className="text-muted-foreground leading-relaxed">
                      {content.paragraph}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => {
                    const title = content[`sidebar_title${i}`];
                    const text = content[`sidebar_content${i}`];
                    if (!title) return null;
                    return (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{text}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "content":
        return (
          <div key={block.id} className={`${scopeClass} py-12`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4">
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(content.body || ""),
                }}
              />
            </div>
          </div>
        );

      case "departments":
      case "programs":
      case "features":
        const items = Array.isArray(content.items) ? content.items : [];
        return (
          <div key={block.id} className={`${scopeClass} py-12 bg-muted/50`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4">
              {content.title && (
                <h2 className="text-2xl font-bold mb-8 text-center">{content.title}</h2>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: any, i: number) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {item.name || item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description || item.students ? `${item.students} students` : ""}
                      </p>
                      {item.href && (
                        <a
                          href={item.href}
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          Learn more →
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "cta":
        return (
          <div key={block.id} className={`${scopeClass} py-16 bg-primary text-primary-foreground`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
              {content.subtitle && (
                <p className="text-lg opacity-90 mb-6">{content.subtitle}</p>
              )}
              {content.button_text && content.button_link && (
                <a
                  href={content.button_link}
                  className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {content.button_text}
                </a>
              )}
            </div>
          </div>
        );

      case "custom_html":
        return (
          <div key={block.id} className={scopeClass}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content.html || ""),
              }}
            />
          </div>
        );

      case "research_centers":
      case "alumni":
        const listItems = Array.isArray(content.items) ? content.items : [];
        return (
          <div key={block.id} className={`${scopeClass} py-12`}>
            {custom_css && <style>{`.${scopeClass} { ${custom_css} }`}</style>}
            <div className="container mx-auto px-4">
              {content.title && (
                <h2 className="text-2xl font-bold mb-6">{content.title}</h2>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {listItems.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-medium">{item.name || item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={block.id} className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <Badge variant="outline">Unknown block: {block_type}</Badge>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="space-y-8">
          <Skeleton className="h-48 w-full" />
          <div className="container mx-auto px-4 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !page) {
    return (
      <PageLayout title="Page Not Found" description="The requested page could not be found.">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page "/{slug}" does not exist or is not published.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      {/* SEO Meta */}
      <title>{page.meta_title || page.title}</title>
      <meta name="description" content={page.meta_description || page.description || ""} />

      {/* Render blocks without PageLayout wrapper for full-width blocks */}
      <div className="min-h-screen">
        {blocks.length > 0 ? (
          blocks.map(renderBlock)
        ) : (
          <PageLayout title={page.title} description={page.description || ""}>
            <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
              <p>This page has no content blocks yet.</p>
              <p className="text-sm mt-2">Add content in the Site Editor.</p>
            </div>
          </PageLayout>
        )}
      </div>
    </>
  );
};

export default DynamicPage;
