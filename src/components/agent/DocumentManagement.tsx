import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, Check, X, Eye, Shield, AlertTriangle, Download } from 'lucide-react';
import { format } from 'date-fns';

interface StudentDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_verified: boolean;
  ai_fraud_score: number;
  blockchain_hash: string;
  created_at: string;
  verification_notes: string;
  application: {
    application_number: string;
    first_name: string;
    last_name: string;
  };
}

interface StudentApplication {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
}

const DocumentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'academic_transcript', label: 'Academic Transcript' },
    { value: 'diploma', label: 'Diploma/Certificate' },
    { value: 'recommendation_letter', label: 'Recommendation Letter' },
    { value: 'personal_statement', label: 'Personal Statement' },
    { value: 'language_certificate', label: 'Language Certificate' },
    { value: 'financial_proof', label: 'Financial Proof' },
    { value: 'medical_certificate', label: 'Medical Certificate' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDocuments();
    fetchApplications();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const { data, error } = await supabase
        .from('student_documents')
        .select(`
          *,
          application:student_applications(
            application_number,
            first_name,
            last_name
          )
        `)
        .in('application_id', 
          await supabase
            .from('student_applications')
            .select('id')
            .eq('agent_id', agentProfile.id)
            .then(res => res.data?.map(app => app.id) || [])
        )
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
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const { data, error } = await supabase
        .from('student_applications')
        .select('id, application_number, first_name, last_name')
        .eq('agent_id', agentProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const getVerificationBadge = (document: StudentDocument) => {
    if (document.is_verified) {
      return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Verified</Badge>;
    }
    
    if (document.ai_fraud_score && document.ai_fraud_score > 0.7) {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High Risk</Badge>;
    }
    
    if (document.ai_fraud_score && document.ai_fraud_score > 0.3) {
      return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Medium Risk</Badge>;
    }
    
    return <Badge variant="secondary">Pending</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = documentTypeFilter === 'all' || doc.document_type === documentTypeFilter;
    const matchesVerification = 
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && doc.is_verified) ||
      (verificationFilter === 'pending' && !doc.is_verified) ||
      (verificationFilter === 'high_risk' && doc.ai_fraud_score > 0.7);
    
    return matchesType && matchesVerification;
  });

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">Upload and manage student documents</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Student Documents</DialogTitle>
              <DialogDescription>
                Upload documents for student applications
              </DialogDescription>
            </DialogHeader>
            <DocumentUploadForm 
              applications={applications}
              onSuccess={() => {
                setShowUploadDialog(false);
                fetchDocuments();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Documents</CardTitle>
                  <CardDescription>
                    {documents.length} total documents uploaded
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Document Types</SelectItem>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="high_risk">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{doc.document_name}</div>
                            {doc.blockchain_hash && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Blockchain verified
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {doc.application.first_name} {doc.application.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {doc.application.application_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDocumentTypeLabel(doc.document_type)}
                      </TableCell>
                      <TableCell>
                        {formatFileSize(doc.file_size)}
                      </TableCell>
                      <TableCell>
                        {getVerificationBadge(doc)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(doc.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No documents match your filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documents.filter(d => !d.is_verified).length}
                </div>
                <p className="text-sm text-muted-foreground">Documents awaiting verification</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Fraud Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.ai_fraud_score > 0.7).length}
                </div>
                <p className="text-sm text-muted-foreground">High-risk documents detected</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Secured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.blockchain_hash).length}
                </div>
                <p className="text-sm text-muted-foreground">Documents with blockchain verification</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
              <CardDescription>Documents requiring manual review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter(d => !d.is_verified || d.ai_fraud_score > 0.3)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{doc.document_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.application.first_name} {doc.application.last_name} - {getDocumentTypeLabel(doc.document_type)}
                          </div>
                          {doc.ai_fraud_score > 0.3 && (
                            <div className="text-sm text-orange-600">
                              AI Fraud Score: {(doc.ai_fraud_score * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVerificationBadge(doc)}
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {documents.filter(d => !d.is_verified || d.ai_fraud_score > 0.3).length === 0 && (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">All documents verified!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
              <CardDescription>Ensure all required documents are collected per student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applications.slice(0, 5).map((app) => {
                  const studentDocs = documents.filter(d => d.application.application_number === app.application_number);
                  const requiredDocs = ['passport', 'academic_transcript', 'personal_statement'];
                  const completedDocs = requiredDocs.filter(type => 
                    studentDocs.some(doc => doc.document_type === type)
                  );
                  
                  return (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">{app.first_name} {app.last_name}</div>
                          <div className="text-sm text-muted-foreground">{app.application_number}</div>
                        </div>
                        <Badge variant={completedDocs.length === requiredDocs.length ? 'default' : 'secondary'}>
                          {completedDocs.length}/{requiredDocs.length} Complete
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {requiredDocs.map((docType) => {
                          const hasDoc = studentDocs.some(doc => doc.document_type === docType);
                          return (
                            <div key={docType} className={`p-2 rounded text-sm flex items-center gap-2 ${
                              hasDoc ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {hasDoc ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              {getDocumentTypeLabel(docType)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Document Upload Form Component
const DocumentUploadForm = ({ applications, onSuccess }: { 
  applications: StudentApplication[], 
  onSuccess: () => void 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [customDocumentType, setCustomDocumentType] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'academic_transcript', label: 'Academic Transcript' },
    { value: 'diploma', label: 'Diploma/Certificate' },
    { value: 'recommendation_letter', label: 'Recommendation Letter' },
    { value: 'personal_statement', label: 'Personal Statement' },
    { value: 'language_certificate', label: 'Language Certificate' },
    { value: 'financial_proof', label: 'Financial Proof' },
    { value: 'medical_certificate', label: 'Medical Certificate' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedApplication || !documentType) return;
    
    // If "Other" is selected, require custom document type
    if (documentType === 'other' && !customDocumentType.trim()) {
      toast({
        title: "Error",
        description: "Please specify the document type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Upload file to storage with application ID as folder
      const fileName = `${selectedApplication}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Use custom document type if "Other" is selected
      const finalDocumentType = documentType === 'other' ? customDocumentType : documentType;

      // Save document record
      const { error: dbError } = await supabase
        .from('student_documents')
        .insert([{
          application_id: selectedApplication,
          document_type: finalDocumentType,
          document_name: file.name,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
      onSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Student Application</Label>
        <Select value={selectedApplication} onValueChange={setSelectedApplication}>
          <SelectTrigger>
            <SelectValue placeholder="Select student application" />
          </SelectTrigger>
          <SelectContent>
            {applications.map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.first_name} {app.last_name} - {app.application_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Document Type</Label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {documentType === 'other' && (
        <div>
          <Label>Specify Document Type</Label>
          <Input
            placeholder="e.g., Birth Certificate, Marriage Certificate"
            value={customDocumentType}
            onChange={(e) => setCustomDocumentType(e.target.value)}
          />
        </div>
      )}

      <div>
        <Label>Document File</Label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading || !file || !selectedApplication || !documentType}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentManagement;