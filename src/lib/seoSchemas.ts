// SEO Schema generators for different page types

const baseUrl = 'https://nscu.govt.ac';

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${baseUrl}${item.url}`
  }))
});

export const generateCourseSchema = (course: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": course.provider,
    "sameAs": baseUrl
  },
  "url": `${baseUrl}${course.url}`
});

export const generateEducationalOrgDeptSchema = (dept: {
  name: string;
  description: string;
  url: string;
  parentOrganization?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": dept.name,
  "description": dept.description,
  "url": `${baseUrl}${dept.url}`,
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": dept.parentOrganization || "New States Continental University",
    "url": baseUrl
  }
});

export const generateArticleSchema = (article: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Organization",
    "name": article.author || "New States Continental University",
    "url": baseUrl
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "New States Continental University",
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/assets/images/nscu-logo.png`
    }
  },
  "image": article.image || `${baseUrl}/assets/images/nscu-logo.png`
});

export const generateWebPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": page.name,
  "description": page.description,
  "url": `${baseUrl}${page.url}`,
  "isPartOf": {
    "@type": "WebSite",
    "name": "New States Continental University",
    "url": baseUrl
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "New States Continental University"
  }
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.location
  },
  "organizer": {
    "@type": "Organization",
    "name": "New States Continental University",
    "url": baseUrl
  },
  "url": `${baseUrl}${event.url}`
});

export const generateTransparencySchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Transparency & Accountability Portal - NSCU",
  "description": "Access NSCU's institutional transparency portal featuring public records, blockchain credential verification, and annual reports.",
  "url": `${baseUrl}/transparency`,
  "mainEntity": {
    "@type": "CollegeOrUniversity",
    "name": "New States Continental University",
    "url": baseUrl
  }
});
