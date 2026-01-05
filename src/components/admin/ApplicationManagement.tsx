import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

interface StudentApplication {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string;
  status: string;
  admission_year: number;
  admission_month: number;
  created_at: string;
  review_notes?: string;
  approved_fee?: number;
  payment_status?: string;
  payment_code?: string;
  course: {
    course_name: string;
    degree_type: string;
    college: string;
  };
  agent_profiles: {
    agent_id: string;
    contact_info?: any;
  };
}

const ApplicationManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [approvedFee, setApprovedFee] = useState<string>('1500');
  const [reviewAction, setReviewAction] = useState<'accept' | 'reject' | 'hold'>('accept');
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select(`
          *,
          course:courses(course_name, degree_type, college),
          agent_profiles(agent_id, contact_info)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'enrolled': return 'default';
      case 'submitted': return 'secondary';
      case 'pending': return 'secondary';
      case 'in_review': return 'outline';
      case 'on_hold': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleReviewApplication = (application: StudentApplication) => {
    setSelectedApplication(application);
    setReviewNotes(application.review_notes || '');
    setApprovedFee(application.approved_fee?.toString() || '1500');
    setReviewDialogOpen(true);
  };

  const handleSaveReview = async () => {
    if (!selectedApplication) return;

    try {
      const newStatus = reviewAction === 'accept' ? 'accepted' : reviewAction === 'reject' ? 'rejected' : 'on_hold';
      const feeAmount = parseFloat(approvedFee) || 1500;
      
      const updateData: Record<string, any> = {
        status: newStatus,
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id
      };

      // Only set approved_fee when accepting
      if (reviewAction === 'accept') {
        updateData.approved_fee = feeAmount;
      }

      const { error } = await supabase
        .from('student_applications')
        .update(updateData)
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: reviewAction === 'accept' 
          ? `Application approved with fee $${feeAmount} USD` 
          : `Application ${reviewAction}ed successfully`
      });

      setReviewDialogOpen(false);
      setSelectedApplication(null);
      setReviewNotes('');
      setApprovedFee('1500');
      fetchApplications();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('student_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application deleted successfully"
      });

      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive"
      });
    }
  };

  const handleViewDocuments = async (application: StudentApplication) => {
    setSelectedApplication(application);
    setDocumentsDialogOpen(true);
    setLoadingDocuments(true);

    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDownloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('student-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Application Management</h2>
          <p className="text-muted-foreground">Review and manage all student applications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                {applications.length} total applications
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application #</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Intake</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-sm">
                    {app.application_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {app.first_name} {app.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {app.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.course?.course_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.course?.college}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {app.agent_profiles?.agent_id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.admission_year, app.admission_month - 1), 'MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app.payment_status === 'completed' ? (
                      <div className="space-y-1">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          Payment Successful
                        </Badge>
                        {app.payment_code && (
                          <div className="text-xs font-mono text-muted-foreground">
                            {app.payment_code}
                          </div>
                        )}
                      </div>
                    ) : app.approved_fee ? (
                      <div className="text-sm">
                        <span className="font-medium">${app.approved_fee}</span>
                        <span className="text-muted-foreground ml-1">USD</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReviewApplication(app)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocuments(app)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteApplication(app.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No applications match your filters'
                  : 'No applications found'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review and update the status of this application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  {selectedApplication.first_name} {selectedApplication.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedApplication.application_number}
                </p>
              </div>

              <div>
                <Label>Action</Label>
                <Select value={reviewAction} onValueChange={(value: 'accept' | 'reject' | 'hold') => setReviewAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accept">Accept Application</SelectItem>
                    <SelectItem value="hold">Put On Hold</SelectItem>
                    <SelectItem value="reject">Reject Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewAction === 'accept' && (
                <div>
                  <Label>Application Fee (USD)</Label>
                  <Input
                    type="number"
                    value={approvedFee}
                    onChange={(e) => setApprovedFee(e.target.value)}
                    placeholder="1500"
                    min="0"
                    step="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This fee will be used when the agent generates the payment link
                  </p>
                </div>
              )}

              <div>
                <Label>Review Notes</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this review..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveReview}>
                  {reviewAction === 'accept' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Documents</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>
                  Documents for {selectedApplication.first_name} {selectedApplication.last_name} 
                  ({selectedApplication.application_number})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingDocuments ? (
              <div className="text-center py-8">Loading documents...</div>
            ) : documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.document_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {doc.document_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(doc.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {doc.is_verified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadDocument(doc.file_path, doc.document_name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationManagement;