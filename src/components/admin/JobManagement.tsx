import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, Plus, Edit, Trash2, Eye, ExternalLink, Download, 
  Search, Filter, CheckCircle, XCircle, Clock, User 
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
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

interface JobApplication {
  id: string;
  tracking_number: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  resume_path: string | null;
  resume_filename: string | null;
  created_at: string;
  education: any;
  experience: any;
  technical_skills: string[] | null;
  nationality: string;
  preferred_work_mode: string | null;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<any> }> = {
  submitted: { label: 'Submitted', variant: 'secondary', icon: Clock },
  under_review: { label: 'Under Review', variant: 'default', icon: Eye },
  shortlisted: { label: 'Shortlisted', variant: 'default', icon: CheckCircle },
  interviewed: { label: 'Interviewed', variant: 'default', icon: User },
  selected: { label: 'Selected', variant: 'default', icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
};

const JobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('postings');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for job creation/editing
  const [formData, setFormData] = useState({
    title: '',
    job_type: 'full-time',
    description: '',
    location: '',
    department: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    requirements: '',
    benefits: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  };

  const handleCreateJob = async () => {
    try {
      const slug = generateSlug(formData.title);
      const { error } = await supabase.from('job_postings').insert({
        title: formData.title,
        job_type: formData.job_type,
        description: formData.description,
        location: formData.location || null,
        department: formData.department || null,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        salary_currency: formData.salary_currency,
        requirements: formData.requirements.split('\n').filter(Boolean),
        benefits: formData.benefits.split('\n').filter(Boolean),
        slug,
        expires_at: formData.expires_at || null,
      });

      if (error) throw error;

      toast({ title: 'Job Created', description: 'The job posting has been created successfully.' });
      setIsDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;
    try {
      const { error } = await supabase.from('job_postings').update({
        title: formData.title,
        job_type: formData.job_type,
        description: formData.description,
        location: formData.location || null,
        department: formData.department || null,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        salary_currency: formData.salary_currency,
        requirements: formData.requirements.split('\n').filter(Boolean),
        benefits: formData.benefits.split('\n').filter(Boolean),
        expires_at: formData.expires_at || null,
      }).eq('id', selectedJob.id);

      if (error) throw error;

      toast({ title: 'Job Updated' });
      setIsDialogOpen(false);
      setSelectedJob(null);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const { error } = await supabase.from('job_postings').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Job Deleted' });
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from('job_postings').update({ is_active: !isActive }).eq('id', id);
      if (error) throw error;
      toast({ title: isActive ? 'Job Deactivated' : 'Job Activated' });
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('job_applications').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Status Updated' });
      fetchApplications();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDownloadResume = async (path: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage.from('job-resumes').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to download resume', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', job_type: 'full-time', description: '', location: '', department: '',
      salary_min: '', salary_max: '', salary_currency: 'USD', requirements: '', benefits: '', expires_at: '',
    });
  };

  const openEditDialog = (job: JobPosting) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      job_type: job.job_type,
      description: job.description,
      location: job.location || '',
      department: job.department || '',
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      salary_currency: job.salary_currency,
      requirements: job.requirements?.join('\n') || '',
      benefits: job.benefits?.join('\n') || '',
      expires_at: job.expires_at ? job.expires_at.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const filteredApplications = applications.filter(app =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tracking_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getJobTitle = (jobId: string) => jobs.find(j => j.id === jobId)?.title || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6" /> Job Management
          </h2>
          <p className="text-muted-foreground">Create and manage job postings and applications</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="postings">Job Postings ({jobs.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="postings" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Job Postings</CardTitle>
                <CardDescription>Manage your organization's job openings</CardDescription>
              </div>
              <Dialog open={isDialogOpen && !selectedJob} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" /> Create Job</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Job Posting</DialogTitle>
                    <DialogDescription>Fill in the details for the new job opening</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title *</Label>
                        <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Job Type *</Label>
                        <Select value={formData.job_type} onValueChange={v => setFormData(p => ({ ...p, job_type: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description *</Label>
                      <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Location</Label>
                        <Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Input value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Min Salary</Label>
                        <Input type="number" value={formData.salary_min} onChange={e => setFormData(p => ({ ...p, salary_min: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Max Salary</Label>
                        <Input type="number" value={formData.salary_max} onChange={e => setFormData(p => ({ ...p, salary_max: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select value={formData.salary_currency} onValueChange={v => setFormData(p => ({ ...p, salary_currency: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Requirements (one per line)</Label>
                      <Textarea value={formData.requirements} onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label>Benefits (one per line)</Label>
                      <Textarea value={formData.benefits} onChange={e => setFormData(p => ({ ...p, benefits: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label>Application Deadline</Label>
                      <Input type="date" value={formData.expires_at} onChange={e => setFormData(p => ({ ...p, expires_at: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateJob} disabled={!formData.title || !formData.description}>Create Job</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{job.job_type.replace('-', ' ')}</Badge></TableCell>
                      <TableCell>{job.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={job.is_active ? 'default' : 'secondary'}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{applications.filter(a => a.job_id === job.id).length}</TableCell>
                      <TableCell>{format(new Date(job.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="ghost" asChild>
                          <a href={`/careers/${job.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleToggleActive(job.id, job.is_active)}>
                          {job.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!selectedJob} onOpenChange={(open) => { if (!open) { setSelectedJob(null); resetForm(); } }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Job Posting</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Same form fields as create */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title *</Label>
                    <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Job Type *</Label>
                    <Select value={formData.job_type} onValueChange={v => setFormData(p => ({ ...p, job_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Min Salary</Label>
                    <Input type="number" value={formData.salary_min} onChange={e => setFormData(p => ({ ...p, salary_min: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Max Salary</Label>
                    <Input type="number" value={formData.salary_max} onChange={e => setFormData(p => ({ ...p, salary_max: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select value={formData.salary_currency} onValueChange={v => setFormData(p => ({ ...p, salary_currency: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Requirements (one per line)</Label>
                  <Textarea value={formData.requirements} onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))} rows={3} />
                </div>
                <div>
                  <Label>Benefits (one per line)</Label>
                  <Textarea value={formData.benefits} onChange={e => setFormData(p => ({ ...p, benefits: e.target.value }))} rows={3} />
                </div>
                <div>
                  <Label>Application Deadline</Label>
                  <Input type="date" value={formData.expires_at} onChange={e => setFormData(p => ({ ...p, expires_at: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
                <Button onClick={handleUpdateJob}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Applications</CardTitle>
                  <CardDescription>Review and manage candidate applications</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search applications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map(app => {
                    const StatusIcon = statusConfig[app.status]?.icon || Clock;
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs">{app.tracking_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.full_name}</div>
                            <div className="text-xs text-muted-foreground">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getJobTitle(app.job_id)}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[app.status]?.variant || 'secondary'} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[app.status]?.label || app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(app.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          {app.resume_path ? (
                            <Button size="sm" variant="ghost" onClick={() => handleDownloadResume(app.resume_path!, app.resume_filename || 'resume.pdf')}>
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select value={app.status} onValueChange={v => handleUpdateApplicationStatus(app.id, v)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="interviewed">Interviewed</SelectItem>
                              <SelectItem value="selected">Selected</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobManagement;
