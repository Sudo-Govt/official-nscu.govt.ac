import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, FileSpreadsheet, Download, CheckCircle2, XCircle, 
  AlertCircle, Loader2, Building2, GraduationCap, BookOpen 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
interface ImportResult {
  faculties: { success: number; failed: number; errors: string[] };
  departments: { success: number; failed: number; errors: string[] };
  courses: { success: number; failed: number; errors: string[] };
}

interface ParsedRow {
  faculty_name: string;
  faculty_code: string;
  department_name: string;
  department_code: string;
  course_name: string;
  course_code: string;
  duration_months?: string;
  total_credits?: string;
}

const MegaCourseUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);

  // Parse CSV line handling quoted values
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
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Parse file content (CSV or Excel)
  const parseFile = async (file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> => {
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExt === '.csv') {
      // Parse CSV
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('File must have a header row and at least one data row');
      }

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').toLowerCase().trim().replace(/\s+/g, '_'));
      const rows: ParsedRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.replace(/"/g, '').trim() || '';
        });
        rows.push(row as unknown as ParsedRow);
      }

      return { headers, rows };
    } else {
      // Parse Excel (.xls, .xlsx)
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('File must have a header row and at least one data row');
      }

      const headerRow = jsonData[0] as string[];
      const headers = headerRow.map(h => String(h || '').toLowerCase().trim().replace(/\s+/g, '_'));
      const rows: ParsedRow[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const dataRow = jsonData[i] as any[];
        if (!dataRow || dataRow.length === 0) continue;
        
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = String(dataRow[index] ?? '').trim();
        });
        rows.push(row as unknown as ParsedRow);
      }

      return { headers, rows };
    }
  };

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  // Create navigation item for entity
  const createNavigationItem = async (
    title: string, 
    href: string, 
    parentId: string | null,
    menuLocation: string = 'main'
  ): Promise<string | null> => {
    // Check if exists
    const { data: existing } = await supabase
      .from('site_navigation')
      .select('id')
      .eq('href', href)
      .single();

    if (existing) return existing.id;

    // Get max position
    const { data: maxPos } = await supabase
      .from('site_navigation')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from('site_navigation')
      .insert({
        title,
        href,
        parent_id: parentId,
        menu_location: menuLocation,
        is_active: true,
        position: (maxPos?.position || 0) + 1,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create navigation:', error);
      return null;
    }

    return data?.id || null;
  };

  // Create CMS page for entity
  const createCmsPage = async (title: string, slug: string, description: string): Promise<void> => {
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) return;

    await supabase.from('cms_pages').insert({
      title,
      slug,
      description,
      status: 'published',
      page_type: 'academic',
      meta_title: title,
      meta_description: description,
    });
  };

  // Main upload handler
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      // Validate required headers
      const requiredHeaders = ['faculty_name', 'faculty_code', 'department_name', 'department_code', 'course_name', 'course_code'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      setPreviewData(rows.slice(0, 5));

      const result: ImportResult = {
        faculties: { success: 0, failed: 0, errors: [] },
        departments: { success: 0, failed: 0, errors: [] },
        courses: { success: 0, failed: 0, errors: [] },
      };

      // Track created entities to avoid duplicates
      const facultyMap = new Map<string, string>(); // code -> id
      const departmentMap = new Map<string, string>(); // code -> id
      
      // Get "Academics" parent nav item or create one
      let academicsNavId: string | null = null;
      const { data: academicsNav } = await supabase
        .from('site_navigation')
        .select('id')
        .ilike('title', '%academic%')
        .limit(1)
        .single();
      
      if (academicsNav) {
        academicsNavId = academicsNav.id;
      }

      // Phase 1: Create Faculties (30%)
      setCurrentStep('Creating Faculties...');
      const uniqueFaculties = [...new Map(rows.map(r => [r.faculty_code, r])).values()];
      
      for (let i = 0; i < uniqueFaculties.length; i++) {
        setProgress(Math.round((i / uniqueFaculties.length) * 30));
        const row = uniqueFaculties[i];
        
        if (!row.faculty_name || !row.faculty_code) continue;

        try {
          // Check if faculty exists
          const { data: existing } = await supabase
            .from('academic_faculties')
            .select('id')
            .eq('code', row.faculty_code)
            .single();

          if (existing) {
            facultyMap.set(row.faculty_code, existing.id);
            continue;
          }

          const { data: faculty, error } = await supabase
            .from('academic_faculties')
            .insert({
              name: row.faculty_name,
              code: row.faculty_code,
              is_active: true,
            })
            .select('id')
            .single();

          if (error) throw error;

          facultyMap.set(row.faculty_code, faculty.id);
          result.faculties.success++;

          // Create navigation and page for faculty
          const facultySlug = `faculty-${generateSlug(row.faculty_name)}`;
          await createCmsPage(row.faculty_name, facultySlug, `Faculty of ${row.faculty_name}`);
          await createNavigationItem(row.faculty_name, `/page/${facultySlug}`, academicsNavId);

        } catch (err: any) {
          result.faculties.errors.push(`${row.faculty_code}: ${err.message}`);
          result.faculties.failed++;
        }
      }

      // Phase 2: Create Departments (60%)
      setCurrentStep('Creating Departments...');
      const uniqueDepts = [...new Map(rows.map(r => [r.department_code, r])).values()];
      
      for (let i = 0; i < uniqueDepts.length; i++) {
        setProgress(30 + Math.round((i / uniqueDepts.length) * 30));
        const row = uniqueDepts[i];
        
        if (!row.department_name || !row.department_code) continue;

        try {
          const facultyId = facultyMap.get(row.faculty_code);
          if (!facultyId) {
            throw new Error(`Faculty ${row.faculty_code} not found`);
          }

          // Check if department exists
          const { data: existing } = await supabase
            .from('academic_departments')
            .select('id')
            .eq('code', row.department_code)
            .single();

          if (existing) {
            departmentMap.set(row.department_code, existing.id);
            continue;
          }

          const { data: dept, error } = await supabase
            .from('academic_departments')
            .insert({
              name: row.department_name,
              code: row.department_code,
              faculty_id: facultyId,
              is_active: true,
            })
            .select('id')
            .single();

          if (error) throw error;

          departmentMap.set(row.department_code, dept.id);
          result.departments.success++;

          // Create navigation and page for department
          const deptSlug = `department-${generateSlug(row.department_name)}`;
          await createCmsPage(row.department_name, deptSlug, `Department of ${row.department_name}`);
          
          // Get faculty nav item as parent
          const facultySlug = `faculty-${generateSlug(row.faculty_name)}`;
          const { data: facultyNavItem } = await supabase
            .from('site_navigation')
            .select('id')
            .eq('href', `/page/${facultySlug}`)
            .single();
          
          await createNavigationItem(row.department_name, `/page/${deptSlug}`, facultyNavItem?.id || null);

        } catch (err: any) {
          result.departments.errors.push(`${row.department_code}: ${err.message}`);
          result.departments.failed++;
        }
      }

      // Phase 3: Create Courses (100%)
      setCurrentStep('Creating Courses...');
      
      for (let i = 0; i < rows.length; i++) {
        setProgress(60 + Math.round((i / rows.length) * 40));
        const row = rows[i];
        
        if (!row.course_name || !row.course_code) continue;

        try {
          const departmentId = departmentMap.get(row.department_code);
          if (!departmentId) {
            throw new Error(`Department ${row.department_code} not found`);
          }

          // Check if course exists
          const { data: existing } = await supabase
            .from('academic_courses')
            .select('id')
            .eq('course_code', row.course_code)
            .single();

          if (existing) continue;

          const courseSlug = generateSlug(`${row.course_name}-${row.course_code}`);
          
          const { error } = await supabase
            .from('academic_courses')
            .insert({
              name: row.course_name,
              course_code: row.course_code,
              slug: courseSlug,
              department_id: departmentId,
              duration_months: parseInt(row.duration_months || '48'),
              total_credits: parseInt(row.total_credits || '120'),
              enrollment_status: 'open',
              is_active: true,
              is_visible_on_website: true,
            });

          if (error) throw error;

          result.courses.success++;

          // Create navigation and page for course
          await createCmsPage(row.course_name, courseSlug, `${row.course_name} program`);
          
          // Get department nav item as parent
          const deptSlug = `department-${generateSlug(row.department_name)}`;
          const { data: deptNavItem } = await supabase
            .from('site_navigation')
            .select('id')
            .eq('href', `/page/${deptSlug}`)
            .single();
          
          await createNavigationItem(row.course_name, `/courses/${courseSlug}`, deptNavItem?.id || null);

        } catch (err: any) {
          result.courses.errors.push(`${row.course_code}: ${err.message}`);
          result.courses.failed++;
        }
      }

      setImportResult(result);
      setProgress(100);
      setCurrentStep('Complete!');
      
      toast({
        title: 'Import Complete',
        description: `Imported ${result.faculties.success} faculties, ${result.departments.success} departments, ${result.courses.success} courses`,
      });

    } catch (err: any) {
      toast({
        title: 'Import Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a CSV or Excel file (.csv, .xls, .xlsx)',
        variant: 'destructive',
      });
      return;
    }

    await handleUpload(file);
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const headers = ['faculty_name', 'faculty_code', 'department_name', 'department_code', 'course_name', 'course_code', 'duration_months', 'total_credits'];
    const sampleRows = [
      ['Faculty of Engineering', 'ENG', 'Computer Science', 'CS', 'Bachelor of Computer Science', 'BCS001', '48', '120'],
      ['Faculty of Engineering', 'ENG', 'Computer Science', 'CS', 'Master of Computer Science', 'MCS001', '24', '60'],
      ['Faculty of Engineering', 'ENG', 'Electrical Engineering', 'EE', 'Bachelor of Electrical Engineering', 'BEE001', '48', '120'],
      ['Faculty of Science', 'SCI', 'Physics', 'PHY', 'Bachelor of Science in Physics', 'BSPHY001', '36', '90'],
      ['Faculty of Science', 'SCI', 'Mathematics', 'MATH', 'Bachelor of Science in Mathematics', 'BSMATH001', '36', '90'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mega_course_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalErrors = importResult 
    ? importResult.faculties.errors.length + importResult.departments.errors.length + importResult.courses.errors.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Mega Course Uploader
        </CardTitle>
        <CardDescription>
          Upload a single CSV file containing Faculty, Department, and Course data. 
          The system will automatically create navigation links and pages for each entity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div>
            <p className="font-medium">Download Template</p>
            <p className="text-sm text-muted-foreground">
              CSV template with Faculty → Department → Course hierarchy
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="mega-upload"
          />
          <label htmlFor="mega-upload" className="cursor-pointer">
            {isUploading ? (
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            ) : (
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            )}
            <p className="text-lg font-medium">
              {isUploading ? currentStep : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              CSV, XLS, or XLSX files supported
            </p>
          </label>
        </div>

        {/* Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStep}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && !isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview (first 5 rows):</p>
            <ScrollArea className="h-40 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Course</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.faculty_name} ({row.faculty_code})</TableCell>
                      <TableCell>{row.department_name} ({row.department_code})</TableCell>
                      <TableCell>{row.course_name} ({row.course_code})</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Results */}
        {importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Faculties</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">{importResult.faculties.success} created</Badge>
                  {importResult.faculties.failed > 0 && (
                    <Badge variant="destructive">{importResult.faculties.failed} failed</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Departments</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">{importResult.departments.success} created</Badge>
                  {importResult.departments.failed > 0 && (
                    <Badge variant="destructive">{importResult.departments.failed} failed</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">Courses</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">{importResult.courses.success} created</Badge>
                  {importResult.courses.failed > 0 && (
                    <Badge variant="destructive">{importResult.courses.failed} failed</Badge>
                  )}
                </div>
              </div>
            </div>

            {totalErrors > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-32 mt-2">
                    <ul className="text-sm space-y-1">
                      {[...importResult.faculties.errors, ...importResult.departments.errors, ...importResult.courses.errors].map((err, idx) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            {totalErrors === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  All entities were imported successfully. Navigation links and pages have been created.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MegaCourseUploader;
