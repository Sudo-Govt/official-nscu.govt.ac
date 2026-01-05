import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Download, Trash2, FileText, Loader2, Plus, User, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Student {
  id: string;
  name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  address: string;
  course_name: string;
  specialization: string;
  exam_format: string;
  cgpa: number;
  created_at: string;
  updated_at: string;
}

interface GeneratedDocument {
  id: string;
  student_id: string;
  doc_type: string;
  json_content: string;
  created_at: string;
  access_level?: string;
  accessible_to?: string[];
  is_public?: boolean;
}

interface UserProfile {
  user_id: string;
  full_name: string;
}

interface NewStudent {
  name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  address: string;
  course_name: string;
  specialization: string;
  exam_format: string;
  cgpa: number;
}

const HIGHER_EDUCATION_DOCS = [
  'Admission Offer Letter', 'Admission Confirmation Receipt', 'Course Registration Acknowledgment',
  'Fee Payment Receipt', 'ID Card (College/University)', 'Enrollment Certificate', 'Semester Admit Card',
  'Internal Assessment Report', 'Semester Marksheet', 'Consolidated Marksheet', 'Attendance Certificate',
  'Internship/Training Certificate', 'Industrial Visit Certificate', 'Character Certificate',
  'Conduct Certificate', 'Bonafide Certificate', 'Migration Certificate', 'Transfer Certificate',
  'Provisional Degree Certificate', 'Degree Award Recommendation Letter', 'No-Dues Certificate',
  'Library Clearance Certificate', 'Hostel Clearance Certificate', 'Practical/Project Submission Certificate',
  'Viva/Oral Examination Certificate', 'Course Completion Certificate', 'Recommendation Letter',
  'Placement Record/Certificate', 'Training & Development Certificate', 'Student Achievement Certificate'
];

const SECONDARY_EDUCATION_DOCS = [
  'Admission Confirmation Letter', 'Fee Receipt / Payment Acknowledgment', 'Student ID Card',
  'Attendance Certificate', 'Conduct Certificate', 'Transfer Certificate (TC)', 'Character Certificate',
  'Bonafide Certificate', 'School Leaving Certificate', 'Examination Admit Card', 'Internal Assessment Report',
  'Progress Report (Class-wise)', 'Yearly Report Card', 'Co-curricular Participation Certificate',
  'Sports Participation Certificate', 'Merit Certificate', 'Detention/Promotion Letter',
  'Parent-Teacher Meeting Record', 'Library Clearance Certificate', 'No-Dues Certificate',
  'Provisional Certificate', 'Subject-wise Grade Sheet', 'Medical Fitness Certificate',
  'Fee Concession/Scholarship Certificate', 'Duplicate Report Card Issuance Letter',
  'Migration Certificate', 'Enrollment Confirmation Slip', 'Student Achievement Record',
  'Extra-Curricular Activity Certificate', 'Academic Progress Summary'
];

const DOC_CATEGORIES = [
  { 
    name: 'Higher Education', 
    docs: HIGHER_EDUCATION_DOCS 
  },
  { 
    name: 'Secondary Education', 
    docs: SECONDARY_EDUCATION_DOCS 
  }
];

export const DocGenTab = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<{[studentId: string]: string[]}>({});
  const [selectedCategory, setSelectedCategory] = useState<{[studentId: string]: string}>({});
  const [selectionMode, setSelectionMode] = useState<{[studentId: string]: 'all' | 'none' | 'manual'}>({});
  const [isGenerating, setIsGenerating] = useState<{[studentId: string]: boolean}>({});
  const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [documentAccess, setDocumentAccess] = useState<{[studentId: string]: {
    access_level: string;
    accessible_to: string[];
    is_public: boolean;
  }}>({});
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    address: '',
    course_name: '',
    specialization: '',
    exam_format: 'Semester',
    cgpa: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, documentsResponse, usersResponse] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('documents_generated').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name').in('role', ['student', 'admission_agent', 'faculty'])
      ]);

      if (studentsResponse.error) throw studentsResponse.error;
      if (documentsResponse.error) throw documentsResponse.error;
      if (usersResponse.error) throw usersResponse.error;

      setStudents(studentsResponse.data || []);
      setDocuments(documentsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      // Error handled via toast
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createStudent = async () => {
    if (!newStudent.name || !newStudent.father_name || !newStudent.mother_name || 
        !newStudent.dob || !newStudent.address || !newStudent.course_name || 
        !newStudent.specialization) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingStudent(true);
    try {
      // Generate student_id
      const studentId = 'STU' + Date.now();
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...newStudent,
          student_id: studentId,
          enrollment_year: new Date().getFullYear(),
          program: newStudent.course_name,
          user_id: user?.user_id || ''
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Student created successfully"
      });

      setNewStudent({
        name: '',
        father_name: '',
        mother_name: '',
        dob: '',
        address: '',
        course_name: '',
        specialization: '',
        exam_format: 'Semester',
        cgpa: 0
      });
      setShowCreateStudent(false);
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive"
      });
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const handleSelectionModeChange = (studentId: string, mode: 'all' | 'none' | 'manual') => {
    setSelectionMode(prev => ({ ...prev, [studentId]: mode }));
    
    const category = selectedCategory[studentId];
    if (!category) return;
    
    const categoryDocs = DOC_CATEGORIES.find(c => c.name === category)?.docs || [];
    
    if (mode === 'all') {
      setSelectedDocs(prev => ({ ...prev, [studentId]: [...categoryDocs] }));
    } else if (mode === 'none') {
      setSelectedDocs(prev => ({ ...prev, [studentId]: [] }));
    }
  };

  const handleCategoryChange = (studentId: string, category: string) => {
    setSelectedCategory(prev => ({ ...prev, [studentId]: category }));
    setSelectionMode(prev => ({ ...prev, [studentId]: 'none' }));
    setSelectedDocs(prev => ({ ...prev, [studentId]: [] }));
  };

  const handleDocTypeChange = (studentId: string, docType: string, checked: boolean) => {
    setSelectedDocs(prev => {
      const studentDocs = prev[studentId] || [];
      if (checked) {
        return { ...prev, [studentId]: [...studentDocs, docType] };
      } else {
        return { ...prev, [studentId]: studentDocs.filter(d => d !== docType) };
      }
    });
    setSelectionMode(prev => ({ ...prev, [studentId]: 'manual' }));
  };

  const generateDocuments = async (studentId: string) => {
    const docTypes = selectedDocs[studentId];
    
    if (!docTypes || docTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one document type",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, [studentId]: true }));

    try {
      const requestBody = { 
        studentId, 
        docTypes,
        accessControl: documentAccess[studentId] || {
          access_level: 'admin_only',
          accessible_to: [],
          is_public: false
        }
      };
      
      const { data, error } = await supabase.functions.invoke('generate-document', {
        body: requestBody
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: data.message
        });
        fetchData(); // Refresh documents
        setSelectedDocs(prev => ({ ...prev, [studentId]: [] })); // Clear selection
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate documents",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const previewDocument = (doc: GeneratedDocument) => {
    setPreviewDoc(doc);
  };

  const downloadDocument = (doc: GeneratedDocument) => {
    try {
      // Parse JSON content
      let jsonData;
      try {
        jsonData = JSON.parse(doc.json_content);
      } catch {
        // If it's not valid JSON, treat as plain text
        jsonData = { content: doc.json_content };
      }

      // Create downloadable JSON file
      const dataStr = JSON.stringify(jsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Generate filename
      const student = students.find(s => s.id === doc.student_id);
      const cleanDocType = doc.doc_type.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanStudentName = student?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Student';
      const fileName = `${cleanStudentName}_${cleanDocType}.json`;
      
      // Download file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('documents_generated')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const getStudentDocuments = (studentId: string) => {
    return documents.filter(doc => doc.student_id === studentId);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Create Student Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create Student Record
            <Button
              onClick={() => setShowCreateStudent(!showCreateStudent)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showCreateStudent ? 'Cancel' : 'Add Student'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCreateStudent && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student-name">Student Name *</Label>
                <Input
                  id="student-name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="father-name">Father's Name *</Label>
                <Input
                  id="father-name"
                  value={newStudent.father_name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, father_name: e.target.value }))}
                  placeholder="Enter father's name"
                />
              </div>
              <div>
                <Label htmlFor="mother-name">Mother's Name *</Label>
                <Input
                  id="mother-name"
                  value={newStudent.mother_name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, mother_name: e.target.value }))}
                  placeholder="Enter mother's name"
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={newStudent.dob}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, dob: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="course">Course Name *</Label>
                <Input
                  id="course"
                  value={newStudent.course_name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, course_name: e.target.value }))}
                  placeholder="e.g., Bachelors of Technology"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={newStudent.specialization}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="exam-format">Exam Format</Label>
                <Select
                  value={newStudent.exam_format}
                  onValueChange={(value) => setNewStudent(prev => ({ ...prev, exam_format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester">Semester</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={newStudent.cgpa}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, cgpa: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., 8.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={newStudent.address}
                onChange={(e) => setNewStudent(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
            <Button
              onClick={createStudent}
              disabled={isCreatingStudent}
              className="w-full"
            >
              {isCreatingStudent ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Student...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Create Student
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Document Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {students.map((student) => {
            const studentDocs = getStudentDocuments(student.id);
            const selectedDocTypes = selectedDocs[student.id] || [];
            const isGeneratingForStudent = isGenerating[student.id];

            return (
              <Card key={student.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {student.id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {student.course_name} - {student.specialization}
                      </p>
                    </div>
                    <Badge variant="outline">{student.exam_format}</Badge>
                  </div>

                  {/* Category Selection */}
                  <div className="mb-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Select Document Category:</p>
                      <RadioGroup
                        value={selectedCategory[student.id] || ''}
                        onValueChange={(value) => handleCategoryChange(student.id, value)}
                        className="flex gap-6"
                      >
                        {DOC_CATEGORIES.map((category) => (
                          <div key={category.name} className="flex items-center space-x-2">
                            <RadioGroupItem value={category.name} id={`${student.id}-${category.name}`} />
                            <Label htmlFor={`${student.id}-${category.name}`} className="cursor-pointer">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {selectedCategory[student.id] && (
                      <>
                        {/* Selection Mode */}
                        <div>
                          <p className="text-sm font-medium mb-2">Selection Mode:</p>
                          <RadioGroup
                            value={selectionMode[student.id] || 'none'}
                            onValueChange={(value: 'all' | 'none' | 'manual') => 
                              handleSelectionModeChange(student.id, value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id={`${student.id}-all`} />
                              <Label htmlFor={`${student.id}-all`} className="cursor-pointer">
                                Select All
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="none" id={`${student.id}-none`} />
                              <Label htmlFor={`${student.id}-none`} className="cursor-pointer">
                                Select None
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="manual" id={`${student.id}-manual`} />
                              <Label htmlFor={`${student.id}-manual`} className="cursor-pointer">
                                Manual Selection
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Manual Document Selection */}
                        {selectionMode[student.id] === 'manual' && (
                          <div>
                            <p className="text-sm font-medium mb-2">Select Specific Documents:</p>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                              {DOC_CATEGORIES.find(c => c.name === selectedCategory[student.id])?.docs.map((docType) => (
                                <div key={docType} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${student.id}-${docType}`}
                                    checked={selectedDocTypes.includes(docType)}
                                    onCheckedChange={(checked) => 
                                      handleDocTypeChange(student.id, docType, checked as boolean)
                                    }
                                  />
                                  <label 
                                    htmlFor={`${student.id}-${docType}`} 
                                    className="text-xs cursor-pointer"
                                  >
                                    {docType}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Access Control Settings */}
                  <div className="mb-4 space-y-4 p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">Document Access Control:</p>
                    
                    <div>
                      <Label className="text-sm">Access Level:</Label>
                      <Select
                        value={documentAccess[student.id]?.access_level || 'admin_only'}
                        onValueChange={(value) => setDocumentAccess(prev => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            access_level: value,
                            accessible_to: prev[student.id]?.accessible_to || [],
                            is_public: prev[student.id]?.is_public || false
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin_only">Admin Only</SelectItem>
                          <SelectItem value="student_specific">Specific Users</SelectItem>
                          <SelectItem value="public">Public Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {documentAccess[student.id]?.access_level === 'student_specific' && (
                      <div>
                        <Label className="text-sm">Select Users:</Label>
                        <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                          {users.map((user) => (
                            <div key={user.user_id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${student.id}-user-${user.user_id}`}
                                checked={(documentAccess[student.id]?.accessible_to || []).includes(user.user_id)}
                                onCheckedChange={(checked) => {
                                  setDocumentAccess(prev => ({
                                    ...prev,
                                    [student.id]: {
                                      ...prev[student.id],
                                      access_level: prev[student.id]?.access_level || 'student_specific',
                                      accessible_to: checked 
                                        ? [...(prev[student.id]?.accessible_to || []), user.user_id]
                                        : (prev[student.id]?.accessible_to || []).filter(id => id !== user.user_id),
                                      is_public: prev[student.id]?.is_public || false
                                    }
                                  }));
                                }}
                              />
                              <Label htmlFor={`${student.id}-user-${user.user_id}`} className="text-xs cursor-pointer">
                                {user.full_name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {documentAccess[student.id]?.access_level === 'public' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${student.id}-public`}
                          checked={documentAccess[student.id]?.is_public || false}
                          onCheckedChange={(checked) => {
                            setDocumentAccess(prev => ({
                              ...prev,
                              [student.id]: {
                                ...prev[student.id],
                                access_level: prev[student.id]?.access_level || 'public',
                                accessible_to: prev[student.id]?.accessible_to || [],
                                is_public: checked as boolean
                              }
                            }));
                          }}
                        />
                        <Label htmlFor={`${student.id}-public`} className="text-sm">
                          Make documents publicly accessible
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={() => generateDocuments(student.id)}
                    disabled={isGeneratingForStudent || selectedDocTypes.length === 0}
                    className="mb-4"
                  >
                    {isGeneratingForStudent ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Documents
                      </>
                    )}
                  </Button>

                  {/* Generated Documents */}
                  {studentDocs.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Generated Documents:</p>
                      <div className="space-y-2">
                        {studentDocs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <Badge variant="secondary" className="mr-2">
                                {doc.doc_type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => previewDocument(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadDocument(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {students.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found. Add students first in the Students tab.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              Document Preview - {previewDoc?.doc_type}
            </DialogTitle>
            {previewDoc && (
              <Button
                onClick={() => downloadDocument(previewDoc)}
                className="ml-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            )}
          </DialogHeader>
          {previewDoc && (
            <div className="mt-4">
              <pre className="p-6 bg-gray-50 border rounded-lg text-sm overflow-auto max-h-[600px] whitespace-pre-wrap">
                {JSON.stringify(JSON.parse(previewDoc.json_content), null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};