import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  structuredData?: object | object[];
  canonical?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

const setMetaTag = (attr: string, key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const useSEO = ({ 
  title, 
  description, 
  keywords, 
  structuredData, 
  canonical,
  image = 'https://nscu.govt.ac/lovable-uploads/53ad8b49-3b0c-4b4b-823c-b65ba66bb2e8.png',
  type = 'website',
  noindex = false,
  article,
}: SEOProps) => {
  useEffect(() => {
    // Title — append brand if not already present
    const fullTitle = title.includes('NSCU') ? title : `${title} | NSCU`;
    document.title = fullTitle;

    // Core meta
    setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // Robots
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', article ? 'article' : type);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:url', canonical || window.location.href);
    setMetaTag('property', 'og:site_name', 'New States Continental University');
    setMetaTag('property', 'og:locale', 'en_US');

    // Article-specific OG tags
    if (article) {
      if (article.publishedTime) setMetaTag('property', 'article:published_time', article.publishedTime);
      if (article.modifiedTime) setMetaTag('property', 'article:modified_time', article.modifiedTime);
      if (article.section) setMetaTag('property', 'article:section', article.section);
      article.tags?.forEach((tag, i) => setMetaTag('property', `article:tag:${i}`, tag));
    }

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@newstatesuni');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // Canonical URL
    const resolvedCanonical = canonical || window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = resolvedCanonical;

    // Structured data — support multiple schemas
    const existingScripts = document.querySelectorAll('script[data-page-structured-data="true"]');
    existingScripts.forEach(script => script.remove());

    if (structuredData) {
      const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-page-structured-data', 'true');
        script.setAttribute('data-schema-index', String(index));
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [title, description, keywords, structuredData, canonical, image, type, noindex, article]);
};
