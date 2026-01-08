import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  FileText, 
  ArrowRight,
  Clock,
  BookOpen,
  CreditCard,
  Home,
  Library,
  Calendar,
  Wrench,
  Heart,
  MessageSquare,
  GraduationCap,
  DollarSign,
  Users,
  Package,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import MySubmissions from '@/pages/forms/MySubmissions';

interface FormTemplate {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  icon: string | null;
  estimated_time: string | null;
  is_popular: boolean;
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  academic: { label: 'Academic Services', icon: <BookOpen className="h-5 w-5" /> },
  student_services: { label: 'Student Services', icon: <GraduationCap className="h-5 w-5" /> },
  financial: { label: 'Financial Services', icon: <DollarSign className="h-5 w-5" /> },
  hostel: { label: 'Hostel & Accommodation', icon: <Home className="h-5 w-5" /> },
  library: { label: 'Library Services', icon: <Library className="h-5 w-5" /> },
  facilities: { label: 'Facilities & IT', icon: <Wrench className="h-5 w-5" /> },
  events: { label: 'Events & Activities', icon: <Calendar className="h-5 w-5" /> },
  lost_found: { label: 'Lost & Found', icon: <Package className="h-5 w-5" /> },
  health_safety: { label: 'Health & Safety', icon: <Heart className="h-5 w-5" /> },
  complaints: { label: 'Complaints & Feedback', icon: <MessageSquare className="h-5 w-5" /> },
  hr: { label: 'Human Resources', icon: <Users className="h-5 w-5" /> },
};

const iconMap: Record<string, React.ReactNode> = {
  'file-text': <FileText className="h-4 w-4" />,
  'book': <BookOpen className="h-4 w-4" />,
  'credit-card': <CreditCard className="h-4 w-4" />,
  'calendar': <Calendar className="h-4 w-4" />,
  'home': <Home className="h-4 w-4" />,
  'dollar-sign': <DollarSign className="h-4 w-4" />,
};

const FormsSection = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Fetch forms based on user's role access level
        const accessLevels: ('public' | 'student' | 'faculty' | 'staff' | 'admin' | 'all_authenticated')[] = ['all_authenticated'];
        if (user?.role === 'student' || user?.role === 'alumni') {
          accessLevels.push('student');
        }
        if (user?.role === 'faculty') {
          accessLevels.push('faculty', 'staff');
        }
        if (user?.role === 'staff' || user?.role === 'admin' || user?.role === 'superadmin') {
          accessLevels.push('staff', 'admin');
        }

        const { data, error } = await supabase
          .from('form_templates')
          .select('*')
          .eq('status', 'published')
          .in('access_level', accessLevels)
          .order('is_popular', { ascending: false })
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
  }, [user]);

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularForms = forms.filter(f => f.is_popular).slice(0, 6);

  const groupedForms = filteredForms.reduce((acc, form) => {
    const category = form.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(form);
    return acc;
  }, {} as Record<string, FormTemplate[]>);

  const displayedForms = selectedCategory 
    ? { [selectedCategory]: groupedForms[selectedCategory] || [] }
    : groupedForms;

  return (
    <Tabs defaultValue="all-forms" className="space-y-6">
      <TabsList>
        <TabsTrigger value="all-forms">All Forms</TabsTrigger>
        <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
      </TabsList>

      <TabsContent value="all-forms" className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Popular Forms */}
        {!searchQuery && !selectedCategory && popularForms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Access
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularForms.map((form) => (
                <Link key={form.id} to={`/forms/${form.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="p-3 rounded-full bg-primary/10 text-primary mx-auto mb-2 w-fit">
                        {iconMap[form.icon || 'file-text'] || <FileText className="h-5 w-5" />}
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{form.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = groupedForms[key]?.length || 0;
                if (count === 0) return null;
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="flex items-center gap-2"
                  >
                    {config.icon}
                    {config.label}
                    <Badge variant="secondary" className="ml-1">{count}</Badge>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        )}

        {/* Forms by Category */}
        {!loading && (
          <div className="space-y-8">
            {Object.entries(displayedForms).map(([categoryKey, categoryForms]) => {
              if (!categoryForms || categoryForms.length === 0) return null;
              const config = categoryConfig[categoryKey];
              
              return (
                <div key={categoryKey}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {config?.icon || <FileText className="h-5 w-5" />}
                    </div>
                    <h3 className="text-lg font-semibold">{config?.label || categoryKey}</h3>
                    <Badge variant="secondary">{categoryForms.length}</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryForms.map((form) => (
                      <Link key={form.id} to={`/forms/${form.slug}`}>
                        <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{form.title}</h4>
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
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No forms found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="my-submissions">
        <MySubmissions />
      </TabsContent>
    </Tabs>
  );
};

export default FormsSection;
