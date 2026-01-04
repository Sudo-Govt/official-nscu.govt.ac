import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileSpreadsheet, RefreshCw, CheckCircle2, AlertCircle, GraduationCap, Code, Trash2, ChevronDown, Plus, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CourseFormDialog, type CourseRecord } from '@/components/admin/courses/CourseFormDialog';

interface FeeStructure {
  [key: string]: number | undefined;
  delaware_campus?: number;
  belize_campus?: number;
  online?: number;
  hybrid?: number;
  offshore_campus?: number;
  distance?: number;
  fast_mode?: number;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  degree_type: string;
  college: string;
  department: string | null;
  duration_years: number;
  credit_hours: number | null;
  eligibility_criteria: string | null;
  seat_capacity: number | null;
  available_seats: number | null;
  is_active: boolean;
  created_at: string;
  description: string | null;
  slug: string | null;
  featured: boolean;
  brochure_url: string | null;
  application_deadline: string | null;
  career_outcomes: any[];
  reference_books: any[];
  fee_structure: FeeStructure | null;
  navigation_parent_id: string | null;
}

const CourseImportExport = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvUploading, setCsvUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [displayCount, setDisplayCount] = useState(10);

  // Manual add/edit dialog
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);

  // JSON Editor state
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [jsonEditingCourse, setJsonEditingCourse] = useState<Course | null>(null);
  const [jsonContent, setJsonContent] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCourseForm = (course?: Course) => {
    setEditingCourse((course || null) as unknown as CourseRecord | null);
    setCourseFormOpen(true);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses((data || []) as Course[]);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // JSON Editor functions
  const openJsonEditor = (course: Course) => {
    setJsonEditingCourse(course);
    setJsonContent(JSON.stringify(course, null, 2));
    setJsonError(null);
    setJsonEditorOpen(true);
  };

  const validateAndFormatJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      setJsonError(null);
      return parsed;
    } catch (e: any) {
      setJsonError(`Invalid JSON: ${e.message}`);
      return null;
    }
  };

  const handleJsonSave = async () => {
    const parsed = validateAndFormatJson(jsonContent);
    if (!parsed || !jsonEditingCourse) return;

    if (!parsed.id || parsed.id !== jsonEditingCourse.id) {
      setJsonError("Cannot modify the course ID");
      return;
    }

    try {
      const { id, created_at, ...updateData } = parsed;
      
      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', jsonEditingCourse.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course updated successfully"
      });

      setJsonEditorOpen(false);
      setJsonEditingCourse(null);
      fetchCourses();
    } catch (error: any) {
      console.error('Error saving course JSON:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully"
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, courses.length));
  };

  const generateSlug = (name: string, degree: string): string => {
    const combined = `${degree}-${name}`.toLowerCase();
    return combined
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Export all courses as CSV
  const exportCoursesCSV = () => {
    if (courses.length === 0) {
      toast({
        title: "No courses to export",
        description: "Add some courses first before exporting",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'course_code',
      'course_name',
      'degree_type',
      'college',
      'department',
      'duration_years',
      'credit_hours',
      'eligibility_criteria',
      'seat_capacity',
      'description',
      'featured',
      'is_active',
      'slug',
      'brochure_url',
      'application_deadline',
      'career_outcomes',
      'reference_books',
      'fee_delaware_campus',
      'fee_belize_campus',
      'fee_online',
      'fee_hybrid',
      'fee_offshore_campus',
      'fee_distance',
      'fee_fast_mode'
    ];

    const rows = courses.map(course => {
      const fees = course.fee_structure || {};
      return [
        course.course_code,
        course.course_name,
        course.degree_type,
        course.college,
        course.department || '',
        course.duration_years.toString(),
        course.credit_hours?.toString() || '',
        course.eligibility_criteria || '',
        course.seat_capacity?.toString() || '',
        course.description || '',
        course.featured ? 'true' : 'false',
        course.is_active ? 'true' : 'false',
        course.slug || '',
        course.brochure_url || '',
        course.application_deadline || '',
        Array.isArray(course.career_outcomes) ? course.career_outcomes.join('; ') : '',
        Array.isArray(course.reference_books) ? course.reference_books.join('; ') : '',
        fees.delaware_campus?.toString() || '',
        fees.belize_campus?.toString() || '',
        fees.online?.toString() || '',
        fees.hybrid?.toString() || '',
        fees.offshore_campus?.toString() || '',
        fees.distance?.toString() || '',
        fees.fast_mode?.toString() || ''
      ].map(cell => `"${String(cell).replace(/"/g, '""')}"`);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `courses_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export successful",
      description: `Exported ${courses.length} courses to CSV`
    });
  };

  // Download template CSV
  const downloadTemplateCSV = () => {
    const headers = [
      'course_code',
      'course_name',
      'degree_type',
      'college',
      'department',
      'duration_years',
      'credit_hours',
      'eligibility_criteria',
      'seat_capacity',
      'description',
      'featured',
      'fee_delaware_campus',
      'fee_belize_campus',
      'fee_online',
      'fee_hybrid',
      'fee_offshore_campus',
      'fee_distance',
      'fee_fast_mode'
    ];

    const exampleRows = [
      [
        'CS101',
        'Computer Science',
        'Bachelor',
        'College of Engineering',
        'Computer Science',
        '4',
        '120',
        'High school diploma with mathematics',
        '60',
        'Comprehensive program covering software development and algorithms',
        'true',
        '25000',
        '22000',
        '18000',
        '20000',
        '19000',
        '15000',
        '28000'
      ],
      [
        'MBA101',
        'Business Administration',
        'Master',
        'College of Business',
        'Business Administration',
        '2',
        '60',
        'Bachelor degree in any field',
        '40',
        'Advanced business management program',
        'true',
        '35000',
        '32000',
        '28000',
        '30000',
        '29000',
        '25000',
        '38000'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'courses_template.csv';
    link.click();
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  };

  // CSV Upload handler
  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvUploading(true);
    setUploadProgress(0);
    setImportResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        throw new Error('CSV file must have a header row and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());

      // Validate required headers
      const requiredHeaders = ['course_code', 'course_name', 'degree_type', 'college', 'duration_years'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const coursesToInsert = [];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        setUploadProgress(Math.round((i / (lines.length - 1)) * 50));
        
        const values = parseCSVLine(lines[i]);

        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: column count mismatch`);
          failedCount++;
          continue;
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index].replace(/"/g, '').trim();
        });

        // Build fee structure from CSV columns
        const csvFeeStructure: FeeStructure = {};
        if (row.fee_delaware_campus) csvFeeStructure.delaware_campus = parseFloat(row.fee_delaware_campus);
        if (row.fee_belize_campus) csvFeeStructure.belize_campus = parseFloat(row.fee_belize_campus);
        if (row.fee_online) csvFeeStructure.online = parseFloat(row.fee_online);
        if (row.fee_hybrid) csvFeeStructure.hybrid = parseFloat(row.fee_hybrid);
        if (row.fee_offshore_campus) csvFeeStructure.offshore_campus = parseFloat(row.fee_offshore_campus);
        if (row.fee_distance) csvFeeStructure.distance = parseFloat(row.fee_distance);
        if (row.fee_fast_mode) csvFeeStructure.fast_mode = parseFloat(row.fee_fast_mode);

        const courseData = {
          course_code: row.course_code,
          course_name: row.course_name,
          degree_type: row.degree_type,
          college: row.college,
          department: row.department || null,
          duration_years: parseInt(row.duration_years) || 4,
          credit_hours: row.credit_hours ? parseInt(row.credit_hours) : null,
          eligibility_criteria: row.eligibility_criteria || null,
          seat_capacity: row.seat_capacity ? parseInt(row.seat_capacity) : 50,
          available_seats: row.seat_capacity ? parseInt(row.seat_capacity) : 50,
          description: row.description || null,
          slug: generateSlug(row.course_name, row.degree_type),
          featured: row.featured?.toLowerCase() === 'true',
          fee_structure: Object.keys(csvFeeStructure).length > 0 ? csvFeeStructure : null
        };

        coursesToInsert.push(courseData);
      }

      // Insert courses in batches
      const batchSize = 10;
      for (let i = 0; i < coursesToInsert.length; i += batchSize) {
        setUploadProgress(50 + Math.round((i / coursesToInsert.length) * 50));
        
        const batch = coursesToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('courses').insert(batch);

        if (error) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          failedCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setUploadProgress(100);
      setImportResults({ success: successCount, failed: failedCount, errors });

      toast({
        title: "Import complete",
        description: `Successfully imported ${successCount} courses${failedCount > 0 ? `, ${failedCount} failed` : ''}`
      });

      fetchCourses();
    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCsvUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Default Location Info */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Default Course Location</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All courses are automatically placed under <strong>Academics → Course Catalog</strong>.
              This can be changed for individual courses in the Course Management section.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Add */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Add a Course Manually</h3>
                <p className="text-muted-foreground text-sm">Use this if CSV import fails or for one-off edits.</p>
              </div>
            </div>
            <Button onClick={() => openCourseForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export/Import Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Courses
            </CardTitle>
            <CardDescription>
              Download all existing courses as a CSV file for backup or editing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{courses.length} courses available</p>
                <p className="text-sm text-muted-foreground">Last refreshed just now</p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchCourses} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Button 
              onClick={exportCoursesCSV} 
              className="w-full" 
              disabled={courses.length === 0 || loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Courses to CSV
            </Button>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Courses
            </CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import courses into the catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={downloadTemplateCSV} className="w-full">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={csvUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {csvUploading ? 'Importing...' : 'Upload CSV File'}
            </Button>

            {csvUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  Processing... {uploadProgress}%
                </p>
              </div>
            )}

            {importResults && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex items-center gap-2">
                  {importResults.failed === 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">Import Results</span>
                </div>
                <p className="text-sm">
                  <span className="text-green-600">{importResults.success} successful</span>
                  {importResults.failed > 0 && (
                    <span className="text-red-600 ml-2">{importResults.failed} failed</span>
                  )}
                </p>
                {importResults.errors.length > 0 && (
                  <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
                    {importResults.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Courses Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Courses Overview</CardTitle>
          <CardDescription>
            Quick view of all courses in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No courses found. Import some using the CSV upload above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.slice(0, displayCount).map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-mono">{course.course_code}</TableCell>
                      <TableCell className="font-medium">{course.course_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.degree_type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{course.college}</TableCell>
                      <TableCell>{course.duration_years} years</TableCell>
                      <TableCell>
                        <Badge variant={course.is_active ? "default" : "secondary"}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCourseForm(course)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openJsonEditor(course)}
                            title="Edit JSON"
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Load More / Show All */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min(displayCount, courses.length)} of {courses.length} courses
                </p>
                {displayCount < courses.length && (
                  <Button variant="outline" onClick={loadMore}>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Load More ({courses.length - displayCount} remaining)
                  </Button>
                )}
                {displayCount < courses.length && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDisplayCount(courses.length)}
                  >
                    Show All
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Add/Edit Dialog */}
      <CourseFormDialog
        open={courseFormOpen}
        onOpenChange={(open) => {
          setCourseFormOpen(open);
          if (!open) setEditingCourse(null);
        }}
        course={editingCourse}
        onSaved={fetchCourses}
      />

      {/* JSON Editor Dialog */}
      <Dialog open={jsonEditorOpen} onOpenChange={setJsonEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Edit Course JSON
            </DialogTitle>
            <DialogDescription>
              Edit the raw JSON data for "{jsonEditingCourse?.course_name}". Be careful with field names and data types.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {jsonError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {jsonError}
              </div>
            )}
            
            <Textarea
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value);
                setJsonError(null);
              }}
              className="font-mono text-sm min-h-[400px] resize-none"
              placeholder="Course JSON data..."
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tip: Do not modify the "id" field. Changes are saved immediately.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(jsonContent), null, 2);
                    setJsonContent(formatted);
                    setJsonError(null);
                  } catch (e: any) {
                    setJsonError(`Invalid JSON: ${e.message}`);
                  }
                }}
              >
                Format JSON
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setJsonEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJsonSave} disabled={!!jsonError}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseImportExport;
