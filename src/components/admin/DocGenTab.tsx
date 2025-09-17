import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2, FileText, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
  html_content: string;
  created_at: string;
}

const DOC_TYPES = ['Higher Education', 'Secondary Education'];

export const DocGenTab = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<{[studentId: string]: string[]}>({});
  const [isGenerating, setIsGenerating] = useState<{[studentId: string]: boolean}>({});
  const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, documentsResponse] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('documents_generated').select('*').order('created_at', { ascending: false })
      ]);

      if (studentsResponse.error) throw studentsResponse.error;
      if (documentsResponse.error) throw documentsResponse.error;

      setStudents(studentsResponse.data || []);
      setDocuments(documentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      const { data, error } = await supabase.functions.invoke('generate-document', {
        body: { studentId, docTypes }
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
    } catch (error) {
      console.error('Error generating documents:', error);
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
      // Create a temporary div to render HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = doc.html_content;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.fontFamily = 'Times, serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      document.body.appendChild(tempDiv);

      // Initialize jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 15;
      let yPosition = margin;

      // Set font for PDF
      pdf.setFont('Times', 'normal');
      pdf.setFontSize(12);

      // Extract and format text content
      const textContent = tempDiv.innerText || tempDiv.textContent || '';
      const lines = pdf.splitTextToSize(textContent, pageWidth - (margin * 2));

      // Add content to PDF with proper formatting
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 10) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });

      // Clean up
      document.body.removeChild(tempDiv);

      // Generate filename
      const student = students.find(s => s.id === doc.student_id);
      const cleanDocType = doc.doc_type.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanStudentName = student?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Student';
      const fileName = `${cleanStudentName}_${cleanDocType}.pdf`;
      
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading document:', error);
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
    } catch (error) {
      console.error('Error deleting document:', error);
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

                  {/* Document Type Selection */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Select Document Types:</p>
                    <div className="flex flex-wrap gap-4">
                      {DOC_TYPES.map((docType) => (
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
                            className="text-sm cursor-pointer"
                          >
                            {docType}
                          </label>
                        </div>
                      ))}
                    </div>
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
                Download PDF
              </Button>
            )}
          </DialogHeader>
          {previewDoc && (
            <div className="mt-4">
              <div 
                className="p-8 bg-white text-black border rounded-lg shadow-lg min-h-[600px]"
                style={{
                  fontFamily: 'Times, serif',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  maxWidth: '210mm',
                  margin: '0 auto'
                }}
                dangerouslySetInnerHTML={{ __html: previewDoc.html_content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};