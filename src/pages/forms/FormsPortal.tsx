import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  FileText, 
  GraduationCap, 
  Globe, 
  Users, 
  MapPin, 
  HelpCircle,
  ArrowRight,
  Clock,
  LogIn
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormTemplate {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  access_level: string;
  icon: string | null;
  estimated_time: string | null;
  is_popular: boolean;
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  admission: { 
    label: 'Prospective Students', 
    icon: <GraduationCap className="h-6 w-6" />,
    description: 'Applications for undergraduate, graduate, and international programs'
  },
  partnership: { 
    label: 'Partnerships & Recruitment', 
    icon: <Users className="h-6 w-6" />,
    description: 'Agent recruitment and institutional partnership applications'
  },
  visitor: { 
    label: 'Visitors & Alumni', 
    icon: <MapPin className="h-6 w-6" />,
    description: 'Campus tours, visitor passes, and alumni services'
  },
  inquiry: { 
    label: 'General Inquiries', 
    icon: <HelpCircle className="h-6 w-6" />,
    description: 'Contact forms, feedback, and general questions'
  },
};

const iconMap: Record<string, React.ReactNode> = {
  'graduation-cap': <GraduationCap className="h-5 w-5" />,
  'book-open': <FileText className="h-5 w-5" />,
  'globe': <Globe className="h-5 w-5" />,
  'users': <Users className="h-5 w-5" />,
  'map-pin': <MapPin className="h-5 w-5" />,
  'help-circle': <HelpCircle className="h-5 w-5" />,
  'file-text': <FileText className="h-5 w-5" />,
};

const FormsPortal = () => {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data, error } = await supabase
          .from('form_templates')
          .select('*')
          .eq('status', 'published')
          .eq('access_level', 'public')
          .order('sort_order');

        if (error) throw error;
        setForms(data || []);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedForms = filteredForms.reduce((acc, form) => {
    const category = form.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(form);
    return acc;
  }, {} as Record<string, FormTemplate[]>);

  const popularForms = forms.filter(f => f.is_popular);

  return (
    <PageLayout 
      title="NSCU Forms Portal" 
      description="Access application and inquiry forms"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Forms Portal</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access all NSCU application and inquiry forms. Current students, faculty, and staff can access additional forms through the dashboard.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search forms by name or category..."
              className="pl-12 pr-4 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button asChild variant="outline" size="lg">
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Student/Staff Login
            </Link>
          </Button>
        </div>

        {/* Popular Forms */}
        {!searchQuery && popularForms.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="mr-3 h-6 w-6 text-primary" />
              Popular Forms
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularForms.map((form) => (
                <Link key={form.id} to={`/forms/${form.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          {iconMap[form.icon || 'file-text'] || <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{form.title}</h3>
                          {form.estimated_time && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {form.estimated_time}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Forms by Category */}
        {!loading && (
          <div className="space-y-12">
            {Object.entries(categoryConfig).map(([categoryKey, categoryInfo]) => {
              const categoryForms = groupedForms[categoryKey];
              if (!categoryForms || categoryForms.length === 0) return null;

              return (
                <div key={categoryKey}>
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{categoryInfo.label}</CardTitle>
                          <CardDescription>{categoryInfo.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {categoryForms.length} {categoryForms.length === 1 ? 'form' : 'forms'}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryForms.map((form) => (
                      <Link key={form.id} to={`/forms/${form.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                  {iconMap[form.icon || 'file-text'] || <FileText className="h-5 w-5" />}
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-1">{form.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {form.description}
                                  </p>
                                  {form.estimated_time && (
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {form.estimated_time}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && searchQuery && filteredForms.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No forms found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all categories above.
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-16 p-6 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground">
            Current NSCU Students, Faculty & Staff: Access additional internal forms through your{' '}
            <Link to="/dashboard" className="text-primary font-medium hover:underline">
              Dashboard →
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default FormsPortal;
