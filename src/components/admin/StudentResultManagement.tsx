import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { generateCertificateNumber } from "@/utils/certificateGenerator";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Search, Loader2, Download, Link2, Eye, QrCode, X, Pencil } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { generateMarksheetHtml, type SubjectWithMarks } from "@/utils/marksheetGenerator";

interface StudentResult {
  id: string;
  student_name: string;
  enrollment_number: string;
  grade_level: string | null;
  examination: string;
  session: string;
  result_html: string;
  total_marks: string | null;
  percentage: string | null;
  school_name: string | null;
  certificate_id: string | null;
  marksheet_data_snapshot: any;
  result_url: string | null;
  created_at: string;
}

interface SubjectRow {
  subject_area: string;
  isced_code: string;
  subject_name: string;
  max_marks: number;
  marks_obtained: number;
  grade_override?: string;
}

const StudentResultManagement = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [editForm, setEditForm] = useState({
    examination: "",
    session: "",
    certificate_id: "",
    total_marks: "",
    percentage: "",
    school_name: "",
    issue_date: "",
    grading_system_name: "Standard",
  });
  const [editSubjects, setEditSubjects] = useState<SubjectRow[]>([]);

  // New result form
  const [studentName, setStudentName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [examination, setExamination] = useState("NSCU Examination");
  const [sessionYear, setSessionYear] = useState("2025-2026");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [certificateId, setCertificateId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradingSystemName, setGradingSystemName] = useState("Standard");
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([
    { subject_area: "", isced_code: "", subject_name: "", max_marks: 100, marks_obtained: 0 },
  ]);
  const [generating, setGenerating] = useState(false);

  const { toast } = useToast();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("student_results")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setResults((data as any) || []);
    setLoading(false);
  };

  const addSubjectRow = () => {
    setSubjectRows(prev => [...prev, { subject_area: "", isced_code: "", subject_name: "", max_marks: 100, marks_obtained: 0 }]);
  };

  const updateSubjectRow = (idx: number, field: keyof SubjectRow, value: string | number) => {
    setSubjectRows(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const removeSubjectRow = (idx: number) => {
    setSubjectRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerateResult = async () => {
    if (!studentName.trim() || !enrollmentNumber.trim() || subjectRows.length === 0) {
      toast({ title: "Error", description: "Please fill student name, enrollment number, and at least one subject.", variant: "destructive" });
      return;
    }
    setGenerating(true);

    try {
      const totalObtained = subjectRows.reduce((s, r) => s + r.marks_obtained, 0);
      const totalMax = subjectRows.reduce((s, r) => s + r.max_marks, 0);
      const pct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

      const validationCode = `NSCU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const html = generateMarksheetHtml({
        exam_level: examination,
        session_year: sessionYear,
        student_name: studentName,
        roll_number: enrollmentNumber,
        date_of_birth: "",
        gender: "",
        nationality: "",
        school_name: schoolName,
        subjects: subjectRows as SubjectWithMarks[],
        issue_date: issueDate,
        validation_code: validationCode,
        grading_system_name: gradingSystemName,
      });

      const snapshot = {
        subjects: subjectRows,
        student: { name: studentName, enrollment_number: enrollmentNumber, school_name: schoolName },
        issue_date: issueDate,
        validation_code: validationCode,
        grading_system_name: gradingSystemName,
      };

      const { data: resultData, error } = await supabase.from("student_results").insert([{
        student_name: studentName,
        enrollment_number: enrollmentNumber,
        grade_level: gradeLevel || null,
        examination,
        session: sessionYear,
        total_marks: `${totalObtained}/${totalMax}`,
        percentage: `${pct}%`,
        school_name: schoolName || null,
        result_html: html,
        certificate_id: certificateId || null,
        marksheet_data_snapshot: snapshot as any,
      }]).select().single();

      if (error) throw error;

      const qrUrl = getResultUrl(resultData.id);
      await supabase.from("qr_codes").insert({
        student_result_id: resultData.id,
        qr_url: qrUrl,
        qr_data: {
          student_name: studentName,
          enrollment_number: enrollmentNumber,
          examination,
          session: sessionYear,
        },
      } as any);

      // Save result URL
      await supabase.from("student_results").update({ result_url: qrUrl }).eq("id", resultData.id);

      toast({ title: "Result generated successfully!" });
      setDialogOpen(false);
      resetForm();
      fetchResults();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setStudentName("");
    setEnrollmentNumber("");
    setGradeLevel("");
    setExamination("NSCU Examination");
    setSessionYear("2025-2026");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setCertificateId("");
    setSchoolName("");
    setGradingSystemName("Standard");
    setSubjectRows([{ subject_area: "", isced_code: "", subject_name: "", max_marks: 100, marks_obtained: 0 }]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    const { error } = await supabase.from("student_results").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Result deleted" });
      fetchResults();
    }
  };

  const openEditDialog = (result: StudentResult) => {
    setSelectedResult(result);
    const snapshot = result.marksheet_data_snapshot as any;
    setEditForm({
      examination: result.examination,
      session: result.session,
      certificate_id: result.certificate_id || "",
      total_marks: result.total_marks || "",
      percentage: result.percentage || "",
      school_name: result.school_name || "",
      issue_date: snapshot?.issue_date || new Date().toISOString().split("T")[0],
      grading_system_name: snapshot?.grading_system_name || "Standard",
    });
    setEditSubjects(snapshot?.subjects || []);
    setEditDialogOpen(true);
  };

  const updateEditMarks = (idx: number, marks: number) => {
    setEditSubjects(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], marks_obtained: marks };
      return updated;
    });
  };

  const updateEditMaxMarks = (idx: number, marks: number) => {
    setEditSubjects(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], max_marks: marks };
      return updated;
    });
  };

  const removeEditSubject = (idx: number) => {
    setEditSubjects(prev => prev.filter((_, i) => i !== idx));
  };

  const addEditSubject = () => {
    setEditSubjects(prev => [...prev, {
      subject_area: "", isced_code: "", subject_name: "", max_marks: 100, marks_obtained: 0, grade_override: "",
    }]);
  };

  const updateEditSubjectField = (idx: number, field: keyof SubjectRow, value: string | number) => {
    setEditSubjects(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleUpdateResult = async () => {
    if (!selectedResult) return;

    const totalObtained = editSubjects.reduce((s, r) => s + r.marks_obtained, 0);
    const totalMax = editSubjects.reduce((s, r) => s + r.max_marks, 0);
    const pct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

    const snapshot = selectedResult.marksheet_data_snapshot as any;
    const studentData = snapshot?.student || {};

    const validationCode = snapshot?.validation_code || `NSCU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const html = generateMarksheetHtml({
      exam_level: editForm.examination,
      session_year: editForm.session,
      student_name: selectedResult.student_name,
      roll_number: selectedResult.enrollment_number,
      date_of_birth: studentData.date_of_birth || "",
      gender: studentData.gender || "",
      nationality: studentData.nationality || "",
      school_name: editForm.school_name || studentData.school_name || "",
      subjects: editSubjects as SubjectWithMarks[],
      issue_date: editForm.issue_date,
      validation_code: validationCode,
      photo_url: studentData.photo_url || undefined,
      father_name: studentData.father_name || undefined,
      mother_name: studentData.mother_name || undefined,
      grading_system_name: editForm.grading_system_name,
    });

    const updatedSnapshot = {
      ...snapshot,
      subjects: editSubjects,
      issue_date: editForm.issue_date,
      grading_system_name: editForm.grading_system_name,
      student: { ...studentData, school_name: editForm.school_name || studentData.school_name },
    };

    const { error } = await supabase
      .from("student_results")
      .update({
        examination: editForm.examination,
        session: editForm.session,
        certificate_id: editForm.certificate_id || null,
        total_marks: `${totalObtained}/${totalMax}`,
        percentage: `${pct}%`,
        school_name: editForm.school_name || null,
        result_html: html,
        marksheet_data_snapshot: updatedSnapshot,
      })
      .eq("id", selectedResult.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Update QR code URL too
      const newUrl = getResultUrl(selectedResult.id);
      await supabase.from("qr_codes").update({ qr_url: newUrl }).eq("student_result_id", selectedResult.id);
      await supabase.from("student_results").update({ result_url: newUrl }).eq("id", selectedResult.id);

      toast({ title: "Result updated & regenerated successfully!" });
      setEditDialogOpen(false);
      fetchResults();
    }
  };

  const handleUpdateResultUrl = async (resultId: string, newUrl: string) => {
    const { error } = await supabase
      .from("student_results")
      .update({ result_url: newUrl })
      .eq("id", resultId);
    
    if (!error) {
      // Also update QR code
      await supabase.from("qr_codes").update({ qr_url: newUrl }).eq("student_result_id", resultId);
      toast({ title: "URL updated! QR code regenerated." });
      fetchResults();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getResultUrl = (id: string) => `${baseUrl}/result/${id}`;
  const getMarksheetUrl = (id: string) => `${baseUrl}/marksheet/${id}`;

  const copyLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: `${label} link copied!` });
  };

  const downloadQR = (result: StudentResult) => {
    const svg = document.getElementById(`qr-${result.id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const dl = document.createElement("a");
      dl.download = `QR-${result.enrollment_number}.png`;
      dl.href = pngFile;
      dl.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const filteredResults = results.filter(
    (r) =>
      r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Results & QR Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Result</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate Student Result</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student Name *</Label>
                    <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Enrollment Number *</Label>
                    <Input value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} placeholder="ENR2025001" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="e.g. Level 2" />
                  </div>
                  <div className="space-y-2">
                    <Label>School/Institution</Label>
                    <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Institution name" />
                  </div>
                </div>

                {/* Exam Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Examination</Label>
                    <Input value={examination} onChange={(e) => setExamination(e.target.value)} placeholder="Examination name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Session / Year</Label>
                    <Input value={sessionYear} onChange={(e) => setSessionYear(e.target.value)} placeholder="2025-2026" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Issue</Label>
                    <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate Number</Label>
                    <Input value={certificateId} onChange={(e) => setCertificateId(e.target.value)} placeholder="Auto or manual" className="font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Grading System</Label>
                    <Input value={gradingSystemName} onChange={(e) => setGradingSystemName(e.target.value)} placeholder="e.g. ECTS, CGPA" />
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Subjects & Marks</Label>
                    <Button variant="outline" size="sm" onClick={addSubjectRow}><Plus className="h-3 w-3 mr-1" /> Add Subject</Button>
                  </div>
                  <div className="space-y-2">
                    {subjectRows.map((row, i) => (
                      <div key={i} className="grid grid-cols-6 gap-2 items-end">
                        <Input placeholder="Subject Name" value={row.subject_name} onChange={(e) => updateSubjectRow(i, "subject_name", e.target.value)} className="col-span-2" />
                        <Input placeholder="Area" value={row.subject_area} onChange={(e) => updateSubjectRow(i, "subject_area", e.target.value)} />
                        <Input type="number" placeholder="Max" value={row.max_marks} onChange={(e) => updateSubjectRow(i, "max_marks", parseInt(e.target.value) || 0)} />
                        <Input type="number" placeholder="Obtained" value={row.marks_obtained} onChange={(e) => updateSubjectRow(i, "marks_obtained", parseInt(e.target.value) || 0)} />
                        <Button variant="ghost" size="sm" onClick={() => removeSubjectRow(i)}><X className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleGenerateResult} disabled={generating}>
                    {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Generate Result
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or enrollment..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment #</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Examination</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filteredResults.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No results found</TableCell></TableRow>
              ) : (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-mono text-sm">{result.enrollment_number}</TableCell>
                    <TableCell className="font-medium">{result.student_name}</TableCell>
                    <TableCell>{result.examination}</TableCell>
                    <TableCell>{result.session}</TableCell>
                    <TableCell>{result.percentage || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(result)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedResult(result); setQrDialogOpen(true); }} title="QR & Links"><QrCode className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedResult(result); setPreviewDialogOpen(true); }} title="Preview"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(result.id)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* QR & Links Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR & Links — {selectedResult?.student_name}</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">QR Code (Result)</p>
                <QRCodeSVG
                  id={`qr-${selectedResult.id}`}
                  value={selectedResult.result_url || getResultUrl(selectedResult.id)}
                  size={200}
                  className="mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-2 break-all">{selectedResult.result_url || getResultUrl(selectedResult.id)}</p>
              </div>

              {/* Editable URL */}
              <div className="space-y-2">
                <Label>Result URL (editable)</Label>
                <div className="flex gap-2">
                  <Input
                    value={selectedResult.result_url || getResultUrl(selectedResult.id)}
                    onChange={(e) => setSelectedResult({ ...selectedResult, result_url: e.target.value })}
                    className="text-xs font-mono"
                  />
                  <Button size="sm" onClick={() => handleUpdateResultUrl(selectedResult.id, selectedResult.result_url || getResultUrl(selectedResult.id))}>
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Changing the URL will regenerate the QR code automatically.</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadQR(selectedResult)}>
                  <Download className="h-4 w-4 mr-1" /> Download QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyLink(selectedResult.result_url || getResultUrl(selectedResult.id), "Result")}>
                  <Link2 className="h-4 w-4 mr-1" /> Copy Link
                </Button>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Marksheet Link</p>
                <p className="text-xs text-muted-foreground break-all">{getMarksheetUrl(selectedResult.id)}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => copyLink(getMarksheetUrl(selectedResult.id), "Marksheet")}>
                  Copy Marksheet Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Marksheet Preview — {selectedResult?.student_name}</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div
              className="border rounded p-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedResult.result_html || "") }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Result Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Result — {selectedResult?.student_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Examination</Label>
                <Input value={editForm.examination} onChange={(e) => setEditForm(f => ({ ...f, examination: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Session / Year</Label>
                <Input value={editForm.session} onChange={(e) => setEditForm(f => ({ ...f, session: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date of Issue</Label>
                <Input type="date" value={editForm.issue_date} onChange={(e) => setEditForm(f => ({ ...f, issue_date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Certificate Number</Label>
                <Input value={editForm.certificate_id} onChange={(e) => setEditForm(f => ({ ...f, certificate_id: e.target.value }))} className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input value={editForm.school_name} onChange={(e) => setEditForm(f => ({ ...f, school_name: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Grading System Name</Label>
              <Input value={editForm.grading_system_name} onChange={(e) => setEditForm(f => ({ ...f, grading_system_name: e.target.value }))} placeholder="e.g. ECTS, CGPA, Custom..." />
            </div>

            {/* Subject Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subjects & Marks</Label>
                <Button variant="outline" size="sm" onClick={addEditSubject}><Plus className="h-3 w-3 mr-1" /> Add Subject</Button>
              </div>
              {editSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subject data available. Add subjects manually.</p>
              ) : (
                <div className="space-y-2">
                  {editSubjects.map((row, i) => (
                    <div key={i} className="grid grid-cols-7 gap-2 items-end">
                      <Input placeholder="Subject" value={row.subject_name} onChange={(e) => updateEditSubjectField(i, "subject_name", e.target.value)} className="col-span-2 text-sm" />
                      <Input placeholder="Area" value={row.subject_area} onChange={(e) => updateEditSubjectField(i, "subject_area", e.target.value)} className="text-sm" />
                      <Input type="number" placeholder="Max" value={row.max_marks} onChange={(e) => updateEditMaxMarks(i, parseInt(e.target.value) || 0)} className="text-sm" />
                      <Input type="number" placeholder="Obtained" value={row.marks_obtained} onChange={(e) => updateEditMarks(i, parseInt(e.target.value) || 0)} className="text-sm" />
                      <Input placeholder="Grade" value={row.grade_override || ""} onChange={(e) => updateEditSubjectField(i, "grade_override", e.target.value)} className="text-sm" />
                      <Button variant="ghost" size="sm" onClick={() => removeEditSubject(i)}><X className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <div className="text-sm text-muted-foreground mt-2">
                    Total: {editSubjects.reduce((s, r) => s + r.marks_obtained, 0)}/{editSubjects.reduce((s, r) => s + r.max_marks, 0)} — 
                    Percentage: {editSubjects.reduce((s, r) => s + r.max_marks, 0) > 0 ? ((editSubjects.reduce((s, r) => s + r.marks_obtained, 0) / editSubjects.reduce((s, r) => s + r.max_marks, 0)) * 100).toFixed(2) : "0.00"}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateResult}>Save & Regenerate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentResultManagement;
