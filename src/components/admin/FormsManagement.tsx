import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Search, Filter, Eye, CheckCircle, XCircle, Clock, 
  MessageSquare, Download, RefreshCw, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

interface FormSubmission {
  id: string;
  tracking_number: string;
  form_id: string;
  user_id: string | null;
  form_data: any;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  form_templates: {
    title: string;
    category: string;
  } | null;
  profiles: {
    full_name: string;
  } | null;
}

type SubmissionStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'requires_action';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: Clock },
  in_review: { label: 'In Review', variant: 'outline', icon: Eye },
  approved: { label: 'Approved', variant: 'default', icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  requires_action: { label: 'Needs Action', variant: 'outline', icon: AlertCircle },
};

const FormsManagement = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // First fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('form_submissions')
        .select(`
          *,
          form_templates (title, category)
        `)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Then fetch profiles for each submission that has a user_id
      const userIds = submissionsData?.filter(s => s.user_id).map(s => s.user_id) || [];
      let profilesMap: Record<string, { full_name: string }> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);
        
        profilesData?.forEach(p => {
          profilesMap[p.user_id] = { full_name: p.full_name };
        });
      }

      // Merge the data
      const mergedData = submissionsData?.map(sub => ({
        ...sub,
        profiles: sub.user_id ? profilesMap[sub.user_id] || null : null
      })) || [];

      setSubmissions(mergedData as FormSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch form submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, newStatus: SubmissionStatus, notes?: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Submission status changed to ${statusConfig[newStatus]?.label || newStatus}`,
      });

      fetchSubmissions();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update submission status',
        variant: 'destructive',
      });
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.form_templates?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sub.form_templates?.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    inReview: submissions.filter((s) => s.status === 'in_review').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const openDetail = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">In Review</p>
                <p className="text-xl font-bold">{stats.inReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Form Submissions</CardTitle>
              <CardDescription>Manage and review all form submissions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSubmissions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, form, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requires_action">Needs Action</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No submissions found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-sm">{submission.tracking_number}</TableCell>
                      <TableCell>{submission.form_templates?.title || 'Unknown Form'}</TableCell>
                      <TableCell>{submission.profiles?.full_name || 'Anonymous'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {submission.form_templates?.category || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        {submission.submitted_at
                          ? format(new Date(submission.submitted_at), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(submission)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submission Details
            </DialogTitle>
            <DialogDescription>
              Tracking: {selectedSubmission?.tracking_number}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Status and Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Form</p>
                    <p className="font-medium">{selectedSubmission.form_templates?.title}</p>
                  </div>
                  {getStatusBadge(selectedSubmission.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted By</p>
                    <p className="font-medium">{selectedSubmission.profiles?.full_name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted At</p>
                    <p className="font-medium">
                      {selectedSubmission.submitted_at
                        ? format(new Date(selectedSubmission.submitted_at), 'MMM d, yyyy h:mm a')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Form Data */}
                <div>
                  <p className="text-sm font-medium mb-3">Form Data</p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    {Object.entries(selectedSubmission.form_data || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-0">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-medium">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedSubmission.review_notes && (
                  <div>
                    <p className="text-sm font-medium mb-2">Review Notes</p>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded p-3">
                      {selectedSubmission.review_notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'in_review')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mark In Review
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormsManagement;
