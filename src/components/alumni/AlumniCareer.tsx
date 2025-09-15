import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, MapPin, Clock, DollarSign, Plus, ExternalLink, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AlumniCareer = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostingJob, setIsPostingJob] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    job_type: '',
    location: '',
    remote_ok: false,
    salary_min: '',
    salary_max: '',
    application_url: '',
    application_email: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchMentorships();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_jobs')
        .select(`
          *,
          profiles:posted_by (full_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorships = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('alumni_mentorship')
        .select(`
          *,
          mentor:mentor_id (full_name),
          mentee:mentee_id (full_name)
        `)
        .or(`mentor_id.eq.${user.user_id},mentee_id.eq.${user.user_id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mentorships:', error);
        return;
      }

      setMentorships(data || []);
    } catch (error) {
      console.error('Error fetching mentorships:', error);
    }
  };

  const handlePostJob = async () => {
    if (!user?.user_id) return;

    try {
      const { error } = await supabase
        .from('alumni_jobs')
        .insert([{
          ...jobForm,
          posted_by: user.user_id,
          salary_min: jobForm.salary_min ? parseInt(jobForm.salary_min) : null,
          salary_max: jobForm.salary_max ? parseInt(jobForm.salary_max) : null
        }]);

      if (error) throw error;

      toast.success('Job posted successfully!');
      setIsPostingJob(false);
      setJobForm({
        title: '',
        company: '',
        description: '',
        requirements: '',
        job_type: '',
        location: '',
        remote_ok: false,
        salary_min: '',
        salary_max: '',
        application_url: '',
        application_email: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    }
  };

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Post Job Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Center</h2>
          <p className="text-muted-foreground">Job opportunities and career development</p>
        </div>
        <Dialog open={isPostingJob} onOpenChange={setIsPostingJob}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post a Job Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                    placeholder="Tech Corp Inc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                  placeholder="List the required skills, experience, and qualifications..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type</Label>
                  <Select value={jobForm.job_type} onValueChange={(value) => setJobForm({...jobForm, job_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="New York, NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary-min">Salary Min ($)</Label>
                  <Input
                    id="salary-min"
                    type="number"
                    value={jobForm.salary_min}
                    onChange={(e) => setJobForm({...jobForm, salary_min: e.target.value})}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label htmlFor="salary-max">Salary Max ($)</Label>
                  <Input
                    id="salary-max"
                    type="number"
                    value={jobForm.salary_max}
                    onChange={(e) => setJobForm({...jobForm, salary_max: e.target.value})}
                    placeholder="120000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="application-url">Application URL</Label>
                  <Input
                    id="application-url"
                    value={jobForm.application_url}
                    onChange={(e) => setJobForm({...jobForm, application_url: e.target.value})}
                    placeholder="https://company.com/careers/job-id"
                  />
                </div>
                <div>
                  <Label htmlFor="application-email">Application Email</Label>
                  <Input
                    id="application-email"
                    type="email"
                    value={jobForm.application_email}
                    onChange={(e) => setJobForm({...jobForm, application_email: e.target.value})}
                    placeholder="jobs@company.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote-ok"
                  checked={jobForm.remote_ok}
                  onChange={(e) => setJobForm({...jobForm, remote_ok: e.target.checked})}
                />
                <Label htmlFor="remote-ok">Remote work available</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPostingJob(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePostJob}>
                  Post Job
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-lg text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {job.job_type}
                      </Badge>
                      {formatSalary(job.salary_min, job.salary_max) && (
                        <p className="text-sm font-medium text-green-600">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                      {job.remote_ok && " (Remote OK)"}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Posted by {job.profiles?.full_name}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex space-x-2">
                    {job.application_url && (
                      <Button variant="default" asChild>
                        <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                    )}
                    {job.application_email && (
                      <Button variant="outline" asChild>
                        <a href={`mailto:${job.application_email}`}>
                          Email Application
                        </a>
                      </Button>
                    )}
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to post a job opportunity for fellow alumni!
            </p>
            <Button onClick={() => setIsPostingJob(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mentorship Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mentorship Program</CardTitle>
        </CardHeader>
        <CardContent>
          {mentorships.length > 0 ? (
            <div className="space-y-4">
              {mentorships.map((mentorship) => (
                <div key={mentorship.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {mentorship.mentor_id === user?.user_id 
                        ? `Mentoring ${mentorship.mentee?.full_name}`
                        : `Mentored by ${mentorship.mentor?.full_name}`
                      }
                    </h4>
                    <Badge variant={
                      mentorship.status === 'active' ? 'default' : 
                      mentorship.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {mentorship.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {mentorship.program_type} mentorship
                  </p>
                  {mentorship.goals && (
                    <p className="text-sm">{mentorship.goals}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the Mentorship Program</h3>
              <p className="text-muted-foreground mb-4">
                Connect with fellow alumni as a mentor or mentee
              </p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline">
                  Become a Mentor
                </Button>
                <Button>
                  Find a Mentor
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniCareer;