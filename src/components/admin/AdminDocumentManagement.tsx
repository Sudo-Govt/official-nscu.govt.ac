import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Download, Eye, FileText, Search, Shield, Trash2, Upload, Users } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
  target_audience: string;
  target_user_id?: string;
  is_public: boolean;
  source: 'documents' | 'student_documents';
}

interface StudentDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  application_id: string;
  is_verified: boolean;
  created_at: string;
  student_name?: string;
}

export default function AdminDocumentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Visibility settings
  const [isPublic, setIsPublic] = useState(false);
  const [visibleToStudents, setVisibleToStudents] = useState(false);
  const [visibleToFaculty, setVisibleToFaculty] = useState(false);
  const [visibleToAgents, setVisibleToAgents] = useState(false);
  const [visibleToAlumni, setVisibleToAlumni] = useState(false);
  const [specificUserId, setSpecificUserId] = useState('');

  // Upload fields
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAudience, setUploadAudience] = useState('all');

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const fetchAllDocuments = async () => {
    setLoading(true);
    try {
      // Fetch from documents table
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      // Get uploader names
      const uploaderIds = [...new Set(docs?.map(d => d.uploaded_by).filter(Boolean))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', uploaderIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      // Fetch from student_documents table
      const { data: studentDocs, error: studentDocsError } = await supabase
        .from('student_documents')
        .select(`
          *,
          application:student_applications (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (studentDocsError) throw studentDocsError;

      // Transform documents
      const transformedDocs: Document[] = (docs || []).map(doc => ({
        id: doc.id,
        title: doc.title,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_size: doc.file_size,
        file_type: doc.file_type || '',
        category: doc.category,
        uploaded_by: doc.uploaded_by || '',
        uploader_name: profileMap.get(doc.uploaded_by) || 'Unknown',
        created_at: doc.created_at,
        target_audience: doc.target_audience || 'all',
        target_user_id: doc.target_user_id || undefined,
        is_public: doc.is_public || false,
        source: 'documents'
      }));

      setDocuments(transformedDocs);
      setStudentDocuments(studentDocs || []);
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

  const handleDownload = async (filePath: string, fileName: string) => {
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
      console.error('Error downloading:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (docId: string, tableName: 'documents' | 'student_documents') => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
      fetchAllDocuments();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const openVisibilityDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setIsPublic(doc.is_public);
    setVisibleToStudents(doc.target_audience === 'students' || doc.target_audience === 'all');
    setVisibleToFaculty(doc.target_audience === 'faculty' || doc.target_audience === 'all');
    setVisibleToAgents(doc.target_audience === 'agents' || doc.target_audience === 'all');
    setVisibleToAlumni(doc.target_audience === 'alumni' || doc.target_audience === 'all');
    setSpecificUserId(doc.target_user_id || '');
    setVisibilityDialogOpen(true);
  };

  const handleUpdateVisibility = async () => {
    if (!selectedDoc) return;

    let targetAudience = 'all';
    if (!visibleToStudents && !visibleToFaculty && !visibleToAgents && !visibleToAlumni) {
      targetAudience = 'none';
    } else if (visibleToStudents && !visibleToFaculty && !visibleToAgents && !visibleToAlumni) {
      targetAudience = 'students';
    } else if (!visibleToStudents && visibleToFaculty && !visibleToAgents && !visibleToAlumni) {
      targetAudience = 'faculty';
    } else if (!visibleToStudents && !visibleToFaculty && visibleToAgents && !visibleToAlumni) {
      targetAudience = 'agents';
    } else if (!visibleToStudents && !visibleToFaculty && !visibleToAgents && visibleToAlumni) {
      targetAudience = 'alumni';
    }

    try {
      const { error } = await supabase
        .from('documents')
        .update({
          is_public: isPublic,
          target_audience: targetAudience,
          target_user_id: specificUserId || null
        })
        .eq('id', selectedDoc.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visibility settings updated"
      });
      setVisibilityDialogOpen(false);
      fetchAllDocuments();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadTitle || !uploadCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}_${uploadFile.name}`;
      const filePath = `admin-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          title: uploadTitle,
          description: uploadDescription,
          file_name: uploadFile.name,
          file_path: filePath,
          file_size: uploadFile.size,
          file_type: uploadFile.type,
          category: uploadCategory,
          target_audience: uploadAudience,
          uploaded_by: user?.user_id,
          is_public: uploadAudience === 'all'
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
      setUploadDialogOpen(false);
      resetUploadForm();
      fetchAllDocuments();
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  const resetUploadForm = () => {
    setUploadTitle('');
    setUploadDescription('');
    setUploadCategory('');
    setUploadFile(null);
    setUploadAudience('all');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Document Management System</CardTitle>
              <CardDescription className="text-base mt-2">
                Manage all documents with granular visibility controls
              </CardDescription>
            </div>
            <Button onClick={() => setUploadDialogOpen(true)} size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] h-12">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="student-services">Student Services</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General Documents ({documents.length})</TabsTrigger>
              <TabsTrigger value="student">Student Application Documents ({studentDocuments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading documents...
                        </TableCell>
                      </TableRow>
                    ) : filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No documents found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-muted-foreground">{doc.file_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.category}</Badge>
                          </TableCell>
                          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                          <TableCell>{doc.uploader_name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant={doc.is_public ? "default" : "secondary"}>
                                {doc.is_public ? "Public" : "Private"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {doc.target_audience}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openVisibilityDialog(doc)}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc.file_path, doc.file_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id, 'documents')}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="student">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No student documents found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <p className="font-medium">{doc.document_name}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.document_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {doc.student_name || 'N/A'}
                          </TableCell>
                          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                          <TableCell>
                            <Badge variant={doc.is_verified ? "default" : "secondary"}>
                              {doc.is_verified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc.file_path, doc.document_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id, 'student_documents')}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Visibility Control Dialog */}
      <Dialog open={visibilityDialogOpen} onOpenChange={setVisibilityDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Document Visibility</DialogTitle>
            <DialogDescription>
              Control who can view and access this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label htmlFor="public" className="text-base font-medium">
                Make document publicly accessible
              </Label>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Visible to user roles:</Label>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="students"
                    checked={visibleToStudents}
                    onCheckedChange={(checked) => setVisibleToStudents(checked as boolean)}
                  />
                  <Label htmlFor="students">Students</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="faculty"
                    checked={visibleToFaculty}
                    onCheckedChange={(checked) => setVisibleToFaculty(checked as boolean)}
                  />
                  <Label htmlFor="faculty">Faculty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agents"
                    checked={visibleToAgents}
                    onCheckedChange={(checked) => setVisibleToAgents(checked as boolean)}
                  />
                  <Label htmlFor="agents">Admission Agents</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alumni"
                    checked={visibleToAlumni}
                    onCheckedChange={(checked) => setVisibleToAlumni(checked as boolean)}
                  />
                  <Label htmlFor="alumni">Alumni</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificUser">Restrict to specific user (Optional)</Label>
              <Input
                id="specificUser"
                placeholder="Enter user ID"
                value={specificUserId}
                onChange={(e) => setSpecificUserId(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setVisibilityDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateVisibility}>
                Update Visibility
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Add a new document to the system with visibility controls
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="student-services">Student Services</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="transcript">Transcript</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Select value={uploadAudience} onValueChange={setUploadAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="agents">Agents Only</SelectItem>
                    <SelectItem value="alumni">Alumni Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileUpload}>
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
