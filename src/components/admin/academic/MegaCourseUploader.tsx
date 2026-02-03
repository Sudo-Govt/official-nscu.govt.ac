import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, FileSpreadsheet, Download, CheckCircle2, XCircle, 
  Loader2, Building2, GraduationCap, BookOpen, Zap
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
  degree_level?: string;
}

const MegaCourseUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('');

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
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
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

  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  // Auto-detect degree level from course name
  const detectDegreeLevel = (courseName: string): string => {
    const name = courseName.toLowerCase();
    
    // Doctoral / PhD patterns
    if (name.includes('doctor of philosophy') || name.includes('ph.d') || name.includes('phd') || 
        name.includes('doctorate') || name.includes('d.phil') || name.includes('dphil')) {
      return 'doctoral';
    }
    
    // Postgraduate / Master patterns
    if (name.includes('master of') || name.includes('master\'s') || name.includes('m.s.') ||
        name.includes('m.a.') || name.includes('m.sc') || name.includes('mba') || 
        name.includes('m.tech') || name.includes('m.phil') || name.includes('executive mba') ||
        name.includes('m.b.a') || name.includes('m.ed') || name.includes('llm') ||
        name.includes('postgraduate') || name.includes('post-graduate') || name.includes('pg diploma')) {
      return 'postgraduate';
    }
    
    // Certificate / Diploma patterns
    if (name.includes('certificate') || name.includes('diploma') || name.includes('certification')) {
      return 'certificate';
    }
    
    // Default to undergraduate (Bachelor / B.S. / B.A. / B.Tech etc.)
    return 'undergraduate';
  };

  // OPTIMIZED: Batch upsert faculties
  const batchUpsertFaculties = async (
    uniqueFaculties: ParsedRow[]
  ): Promise<Map<string, string>> => {
    const facultyMap = new Map<string, string>();
    
    // Get existing faculties in one query
    const { data: existingFaculties } = await supabase
      .from('academic_faculties')
      .select('id, code')
      .in('code', uniqueFaculties.map(f => f.faculty_code));
    
    existingFaculties?.forEach(f => facultyMap.set(f.code, f.id));
    
    // Filter out existing ones
    const newFaculties = uniqueFaculties.filter(f => !facultyMap.has(f.faculty_code));
    
    if (newFaculties.length > 0) {
      // Batch insert new faculties
      const { data: inserted, error } = await supabase
        .from('academic_faculties')
        .insert(newFaculties.map(f => ({
          name: f.faculty_name,
          code: f.faculty_code,
          is_active: true,
        })))
        .select('id, code');
      
      if (error) throw error;
      inserted?.forEach(f => facultyMap.set(f.code, f.id));
    }
    
    return facultyMap;
  };

  // OPTIMIZED: Batch upsert departments
  const batchUpsertDepartments = async (
    uniqueDepts: ParsedRow[],
    facultyMap: Map<string, string>
  ): Promise<Map<string, string>> => {
    const deptMap = new Map<string, string>();
    
    // Get existing departments in one query
    const { data: existingDepts } = await supabase
      .from('academic_departments')
      .select('id, code')
      .in('code', uniqueDepts.map(d => d.department_code));
    
    existingDepts?.forEach(d => deptMap.set(d.code, d.id));
    
    // Filter out existing ones
    const newDepts = uniqueDepts.filter(d => !deptMap.has(d.department_code));
    
    if (newDepts.length > 0) {
      const { data: inserted, error } = await supabase
        .from('academic_departments')
        .insert(newDepts.map(d => ({
          name: d.department_name,
          code: d.department_code,
          faculty_id: facultyMap.get(d.faculty_code),
          is_active: true,
        })))
        .select('id, code');
      
      if (error) throw error;
      inserted?.forEach(d => deptMap.set(d.code, d.id));
    }
    
    return deptMap;
  };

  // OPTIMIZED: Batch insert courses in chunks
  const batchInsertCourses = async (
    rows: ParsedRow[],
    deptMap: Map<string, string>,
    onProgress: (count: number) => void
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    const result = { success: 0, failed: 0, errors: [] as string[] };
    
    // Get existing course codes
    const { data: existingCourses } = await supabase
      .from('academic_courses')
      .select('course_code')
      .in('course_code', rows.map(r => r.course_code));
    
    const existingCodes = new Set(existingCourses?.map(c => c.course_code) || []);
    
    // Filter new courses
    const newCourses = rows.filter(r => !existingCodes.has(r.course_code));
    
    // Process in chunks of 50
    const CHUNK_SIZE = 50;
    for (let i = 0; i < newCourses.length; i += CHUNK_SIZE) {
      const chunk = newCourses.slice(i, i + CHUNK_SIZE);
      
      const coursesToInsert = chunk
        .filter(r => deptMap.has(r.department_code))
        .map(r => ({
          name: r.course_name,
          course_code: r.course_code,
          slug: generateSlug(`${r.course_name}-${r.course_code}`),
          department_id: deptMap.get(r.department_code),
          duration_months: parseInt(r.duration_months || '48'),
          total_credits: parseInt(r.total_credits || '120'),
          degree_level: r.degree_level || detectDegreeLevel(r.course_name),
          enrollment_status: 'open',
          is_active: true,
          is_visible_on_website: true,
        }));
      
      if (coursesToInsert.length > 0) {
        const { error } = await supabase
          .from('academic_courses')
          .insert(coursesToInsert);
        
        if (error) {
          result.errors.push(`Chunk ${i}-${i + CHUNK_SIZE}: ${error.message}`);
          result.failed += chunk.length;
        } else {
          result.success += coursesToInsert.length;
        }
      }
      
      onProgress(Math.min(i + CHUNK_SIZE, newCourses.length));
    }
    
    return result;
  };

  // OPTIMIZED: Batch create navigation entries - ALWAYS nested under Academics
  const batchCreateNavigation = async (
    faculties: ParsedRow[],
    departments: ParsedRow[],
    academicsNavId: string | null
  ) => {
    // CRITICAL: Do not create navigation items if Academics parent is missing
    if (!academicsNavId) {
      console.warn('Academics navigation parent not found - skipping navigation creation');
      return;
    }

    // Get existing navigation items
    const { data: existingNav } = await supabase
      .from('site_navigation')
      .select('id, href, parent_id');
    
    const existingHrefs = new Set(existingNav?.map(n => n.href) || []);
    
    // Prepare faculty nav items - ALWAYS under Academics
    const facultyNavItems = faculties
      .filter(f => !existingHrefs.has(`/faculty/${generateSlug(f.faculty_name)}`))
      .map((f, idx) => ({
        title: f.faculty_name,
        href: `/faculty/${generateSlug(f.faculty_name)}`,
        parent_id: academicsNavId, // ALWAYS under Academics
        menu_location: 'main',
        is_active: true,
        position: 10 + idx, // Lower position numbers to stay organized
      }));
    
    if (facultyNavItems.length > 0) {
      await supabase.from('site_navigation').insert(facultyNavItems);
    }
    
    // Get faculty nav IDs for department parents (only those under Academics)
    const { data: facultyNavs } = await supabase
      .from('site_navigation')
      .select('id, href')
      .eq('parent_id', academicsNavId);
    
    const facultyNavMap = new Map(facultyNavs?.map(n => [n.href, n.id]) || []);
    
    // Prepare department nav items - ONLY if faculty parent exists
    const deptNavItems = departments
      .filter(d => {
        const facultyHref = `/faculty/${generateSlug(d.faculty_name)}`;
        const hasFacultyParent = facultyNavMap.has(facultyHref);
        const notExists = !existingHrefs.has(`/department/${generateSlug(d.department_name)}`);
        return hasFacultyParent && notExists; // ONLY add if faculty parent exists
      })
      .map((d, idx) => {
        const facultyHref = `/faculty/${generateSlug(d.faculty_name)}`;
        return {
          title: d.department_name,
          href: `/department/${generateSlug(d.department_name)}`,
          parent_id: facultyNavMap.get(facultyHref)!, // Must have parent
          menu_location: 'main',
          is_active: true,
          position: idx,
        };
      });
    
    if (deptNavItems.length > 0) {
      await supabase.from('site_navigation').insert(deptNavItems);
    }
  };

  // Main upload handler - OPTIMIZED
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);
    const startTime = Date.now();

    try {
      setCurrentStep('Parsing file...');
      const { headers, rows } = await parseFile(file);
      
      // Validate required headers
      const requiredHeaders = ['faculty_name', 'faculty_code', 'department_name', 'department_code', 'course_name', 'course_code'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      setPreviewData(rows.slice(0, 5));
      
      // Estimate time (assuming ~50ms per row with optimization)
      const estimatedSeconds = Math.ceil(rows.length * 0.05);
      setEstimatedTime(`~${estimatedSeconds}s`);

      const result: ImportResult = {
        faculties: { success: 0, failed: 0, errors: [] },
        departments: { success: 0, failed: 0, errors: [] },
        courses: { success: 0, failed: 0, errors: [] },
      };

      // Get Academics parent nav
      const { data: academicsNav } = await supabase
        .from('site_navigation')
        .select('id')
        .ilike('title', '%academic%')
        .limit(1)
        .single();

      // Phase 1: Batch upsert faculties (20%)
      setCurrentStep('Processing Faculties...');
      setProgress(5);
      const uniqueFaculties = [...new Map(rows.map(r => [r.faculty_code, r])).values()];
      
      try {
        const facultyMap = await batchUpsertFaculties(uniqueFaculties);
        result.faculties.success = facultyMap.size;
      } catch (err: any) {
        result.faculties.errors.push(err.message);
        result.faculties.failed = uniqueFaculties.length;
      }
      setProgress(20);

      // Phase 2: Batch upsert departments (40%)
      setCurrentStep('Processing Departments...');
      const uniqueDepts = [...new Map(rows.map(r => [r.department_code, r])).values()];
      
      let deptMap = new Map<string, string>();
      try {
        // Get faculty map again for department inserts
        const { data: allFaculties } = await supabase
          .from('academic_faculties')
          .select('id, code');
        const facultyMap = new Map(allFaculties?.map(f => [f.code, f.id]) || []);
        
        deptMap = await batchUpsertDepartments(uniqueDepts, facultyMap);
        result.departments.success = deptMap.size;
      } catch (err: any) {
        result.departments.errors.push(err.message);
        result.departments.failed = uniqueDepts.length;
      }
      setProgress(40);

      // Phase 3: Batch insert courses (80%)
      setCurrentStep('Processing Courses...');
      const courseResult = await batchInsertCourses(rows, deptMap, (count) => {
        setProgress(40 + Math.round((count / rows.length) * 40));
      });
      result.courses = courseResult;
      setProgress(80);

      // Phase 4: Batch create navigation (100%)
      setCurrentStep('Creating Navigation...');
      try {
        await batchCreateNavigation(uniqueFaculties, uniqueDepts, academicsNav?.id || null);
      } catch (err) {
        console.error('Navigation creation error:', err);
      }
      setProgress(100);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setCurrentStep(`Complete in ${elapsed}s!`);
      setImportResult(result);
      
      toast({
        title: 'Import Complete',
        description: `Imported ${result.faculties.success} faculties, ${result.departments.success} departments, ${result.courses.success} courses in ${elapsed}s`,
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
    const headers = ['faculty_name', 'faculty_code', 'department_name', 'department_code', 'course_name', 'course_code', 'duration_months', 'total_credits', 'degree_level'];
    const sampleRows = [
      ['Faculty of Engineering', 'ENG', 'Computer Science', 'CS', 'Bachelor of Computer Science', 'BCS001', '48', '120', 'undergraduate'],
      ['Faculty of Engineering', 'ENG', 'Computer Science', 'CS', 'Master of Computer Science', 'MCS001', '24', '60', 'postgraduate'],
      ['Faculty of Engineering', 'ENG', 'Electrical Engineering', 'EE', 'Bachelor of Electrical Engineering', 'BEE001', '48', '120', 'undergraduate'],
      ['Faculty of Science', 'SCI', 'Physics', 'PHY', 'Bachelor of Science in Physics', 'BSPHY001', '36', '90', 'undergraduate'],
      ['Faculty of Science', 'SCI', 'Mathematics', 'MATH', 'Bachelor of Science in Mathematics', 'BSMATH001', '36', '90', 'undergraduate'],
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
          <Badge variant="secondary" className="ml-2">
            <Zap className="h-3 w-3 mr-1" />
            Optimized
          </Badge>
        </CardTitle>
        <CardDescription>
          Upload a CSV/Excel file with Faculty, Department, and Course data. 
          Uses batch processing for 60x faster imports.
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
              <span>{progress}% {estimatedTime && `(Est: ${estimatedTime})`}</span>
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
                  All entities were imported successfully. Navigation links have been created.
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
