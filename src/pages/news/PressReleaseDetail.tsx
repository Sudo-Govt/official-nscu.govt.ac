import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Calendar, User, ArrowLeft, Share2, Download, Printer, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getPressReleaseById } from '@/data/pressReleases';
import { toast } from 'sonner';

const PressReleaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const release = id ? getPressReleaseById(id) : undefined;

  useSEO({
    title: release ? `${release.title} | NSCU Press Release` : "Press Release | NSCU Delaware",
    description: release?.summary || "Official press release from The New States Continental University",
    keywords: release ? `${release.category}, NSCU news, press release, ${release.year}` : "press release, NSCU"
  });

  if (!release) {
    return (
      <PageLayout title="Press Release Not Found" description="">
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Press Release Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested press release could not be found.</p>
          <Button onClick={() => navigate('/news/press-releases')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Press Releases
          </Button>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: release.title,
        text: release.summary,
        url: window.location.href
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(release.title);
    const body = encodeURIComponent(`${release.summary}\n\nRead more: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <PageLayout title="" description="">
      {/* Newspaper-style header */}
      <div className="bg-background border-b-2 border-primary py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/news/press-releases')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Releases
          </Button>
        </div>
      </div>

      <article className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Article header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="font-mono">
                  {release.refCode}
                </Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {release.category}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
                {release.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(release.date)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {release.author}
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed font-medium border-l-4 border-primary pl-4 italic">
                {release.summary}
              </p>
            </div>

            {/* Featured image */}
            {release.image && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={release.image} 
                  alt={release.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article content */}
            <Card className="mb-8">
              <CardContent className="pt-8">
                <div className="prose prose-lg max-w-none">
                  {release.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Quote section */}
                {release.quote && (
                  <div className="mt-8 border-l-4 border-primary bg-muted/30 p-6 rounded-r-lg">
                    <blockquote className="text-lg italic text-foreground mb-4">
                      "{release.quote.text}"
                    </blockquote>
                    <footer className="text-sm">
                      <strong className="text-primary">{release.quote.attribution}</strong>
                      <br />
                      <span className="text-muted-foreground">{release.quote.title}</span>
                    </footer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                Released at {formatTime(release.date)}
              </span>
            </div>

            {/* Footer info */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-primary mb-3">Media Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Office of Communications</p>
                    <p className="text-muted-foreground">The New States Continental University</p>
                    <p className="text-muted-foreground">Delaware, USA</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone: (302) 857-6060</p>
                    <p className="text-muted-foreground">Email: press@nscu.edu</p>
                    <p className="text-muted-foreground">Web: www.nscu.edu</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground">
                  © {release.year} The New States Continental University. All rights reserved. 
                  This press release may be reproduced with proper attribution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>
    </PageLayout>
  );
};

export default PressReleaseDetail;
