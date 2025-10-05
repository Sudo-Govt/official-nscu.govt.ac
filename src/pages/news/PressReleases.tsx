import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Calendar, FileText, Search, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { pressReleases, getAllYears } from '@/data/pressReleases';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seoSchemas';

const PressReleases = () => {
  useSEO({
    title: "Press Releases - NSCU News & Announcements | GCHEA Accredited University",
    description: "Latest press releases and official announcements from New States Continental University (NSCU). Read about institutional developments, partnerships, research, and academic achievements since 2010.",
    keywords: "NSCU press releases, university news GCHEA accredited, NSCU announcements, institutional updates Belize, higher education news, NSCU partnerships, research announcements, academic achievements",
    canonical: "https://nscu.govt.ac/news/press-releases",
    structuredData: [
      generateWebPageSchema({
        name: "NSCU Press Releases",
        description: "Official press releases and news announcements from New States Continental University",
        url: "/news/press-releases"
      }),
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "News", url: "/news/press-releases" },
        { name: "Press Releases", url: "/news/press-releases" }
      ])
    ]
  });

  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const years = getAllYears();

  const filteredReleases = pressReleases
    .filter(pr => selectedYear === 'all' || pr.year === selectedYear)
    .filter(pr => 
      searchTerm === '' || 
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout 
      title="Press Releases" 
      description="Official announcements and institutional news from NSCU Delaware"
    >
      {/* Newspaper masthead style header */}
      <div className="bg-background border-b-4 border-primary py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-px bg-primary flex-1 max-w-xs"></div>
              <FileText className="h-8 w-8 text-primary" />
              <div className="h-px bg-primary flex-1 max-w-xs"></div>
            </div>
            <h1 className="text-5xl font-serif font-bold text-primary mb-2">The NSCU Chronicle</h1>
            <p className="text-lg text-muted-foreground italic">Official Press Releases & Institutional Announcements</p>
            <p className="text-sm text-muted-foreground mt-2">Established 2010 • Delaware, USA</p>
          </div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Search press releases..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {filteredReleases.length} {filteredReleases.length === 1 ? 'release' : 'releases'}
            </div>
          </div>
        </div>
      </div>

      {/* Press releases listing */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {filteredReleases.map((release) => (
                <Card key={release.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {release.refCode}
                        </Badge>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {release.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(release.date)}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{release.author}</span>
                    </div>
                    <Link to={`/news/press-release/${release.id}`}>
                      <h2 className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors leading-tight">
                        {release.title}
                      </h2>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {release.summary}
                    </p>
                    <Link to={`/news/press-release/${release.id}`}>
                      <Button variant="ghost" className="group">
                        Read Full Release
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReleases.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Press Releases Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or select a different year.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="bg-muted/30 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">About NSCU Press Releases</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The New States Continental University issues official press releases to communicate significant institutional developments, 
              academic achievements, research breakthroughs, and policy announcements. All press releases are archived and accessible 
              to the public, media representatives, and the broader academic community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-primary mb-2">Media Inquiries</h3>
                  <p className="text-sm text-muted-foreground">Office of Communications</p>
                  <p className="text-sm text-muted-foreground">Phone: (302) 857-6060</p>
                  <p className="text-sm text-muted-foreground">Email: press@nscu.edu</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-primary mb-2">Archive Access</h3>
                  <p className="text-sm text-muted-foreground">Complete archives available from 2010</p>
                  <p className="text-sm text-muted-foreground">All releases include reference codes</p>
                  <p className="text-sm text-muted-foreground">Searchable by year, category, and keyword</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PressReleases;
