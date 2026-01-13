import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, MapPin, DollarSign, Building, Calendar, 
  ArrowLeft, CheckCircle, Share2, Bookmark 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface JobPosting {
  id: string;
  title: string;
  job_type: string;
  description: string;
  location: string | null;
  department: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  requirements: string[] | null;
  benefits: string[] | null;
  slug: string;
  created_at: string;
  expires_at: string | null;
}

const JobDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast({
        title: 'Job Not Found',
        description: 'The job posting you are looking for does not exist.',
        variant: 'destructive',
      });
      navigate('/careers');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `From ${formatter.format(min)}`;
    return `Up to ${formatter.format(max!)}`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: job?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!job) return null;

  return (
    <PageLayout title={job?.title || 'Job Details'}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <Link to="/careers" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Careers
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white">{job.job_type.replace('-', ' ')}</Badge>
                  {job.department && (
                    <Badge variant="outline" className="border-white/30 text-white">
                      {job.department}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-primary-foreground/90">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                  )}
                  {formatSalary(job.salary_min, job.salary_max, job.salary_currency) && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="secondary" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Link to={`/careers/${job.slug}/apply`}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Take the next step in your career journey by submitting your application today.
                  </p>
                  <Link to={`/careers/${job.slug}/apply`} className="block">
                    <Button className="w-full" size="lg">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply for This Position
                    </Button>
                  </Link>
                  <Separator />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Type</span>
                      <span className="font-medium capitalize">{job.job_type.replace('-', ' ')}</span>
                    </div>
                    {job.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{job.location}</span>
                      </div>
                    )}
                    {job.department && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department</span>
                        <span className="font-medium">{job.department}</span>
                      </div>
                    )}
                    {job.expires_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline</span>
                        <span className="font-medium">{format(new Date(job.expires_at), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default JobDetailPage;
