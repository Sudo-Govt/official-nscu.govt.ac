import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, FileSpreadsheet, Users, BookOpen, FileText, 
  Download, CheckCircle2, XCircle, AlertCircle, Loader2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const BulkUploadManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

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

  // Parse CSV/Excel file content
  const parseFile = async (file: File): Promise<{ headers: string[]; rows: Record<string, string>[] }> => {
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExt === '.csv') {
      // Parse CSV
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('File must have a header row and at least one data row');
      }

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').toLowerCase().trim());
      const rows: Record<string, string>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.replace(/"/g, '').trim() || '';
        });
        rows.push(row);
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
      const headers = headerRow.map(h => String(h || '').toLowerCase().trim());
      const rows: Record<string, string>[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const dataRow = jsonData[i] as any[];
        if (!dataRow || dataRow.length === 0) continue;
        
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = String(dataRow[index] ?? '').trim();
        });
        rows.push(row);
      }

      return { headers, rows };
    }
  };

  // Handle Users bulk upload
  const handleUsersUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      // Required: email, full_name, role
      const requiredHeaders = ['email', 'full_name', 'role'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < rows.length; i++) {
        setProgress(Math.round(((i + 1) / rows.length) * 100));
        const row = rows[i];

        try {
          // Create user via edge function
          const { data, error } = await supabase.functions.invoke('admin-create-user', {
            body: {
              email: row.email,
              password: row.password || 'TempPass123!',
              full_name: row.full_name,
              role: row.role,
              phone: row.phone || null,
            }
          });

          if (error) {
            errors.push(`Row ${i + 2}: ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (err: any) {
          errors.push(`Row ${i + 2}: ${err.message}`);
          failedCount++;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      toast({
        title: 'Import Complete',
        description: `${successCount} users imported, ${failedCount} failed`,
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

  // Handle Courses bulk upload
  const handleCoursesUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      // Required: name, course_code, faculty_id OR faculty_code
      const requiredHeaders = ['name', 'course_code'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      // Fetch faculties for lookup
      const { data: faculties } = await supabase.from('academic_faculties').select('id, code, name');
      const facultyMap = new Map(faculties?.map(f => [f.code.toLowerCase(), f.id]) || []);
      const facultyNameMap = new Map(faculties?.map(f => [f.name.toLowerCase(), f.id]) || []);

      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;
      const coursesToInsert: any[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // Resolve faculty_id
        let facultyId = row.faculty_id;
        if (!facultyId && row.faculty_code) {
          facultyId = facultyMap.get(row.faculty_code.toLowerCase());
        }
        if (!facultyId && row.faculty_name) {
          facultyId = facultyNameMap.get(row.faculty_name.toLowerCase());
        }

        if (!facultyId) {
          errors.push(`Row ${i + 2}: Could not resolve faculty`);
          failedCount++;
          continue;
        }

        coursesToInsert.push({
          name: row.name,
          course_code: row.course_code,
          faculty_id: facultyId,
          short_description: row.short_description || null,
          long_description: row.long_description || null,
          duration_months: parseInt(row.duration_months) || 12,
          total_credits: parseInt(row.total_credits) || 0,
          enrollment_status: row.enrollment_status || 'open',
          is_active: row.is_active?.toLowerCase() !== 'false',
          is_visible_on_website: row.is_visible_on_website?.toLowerCase() !== 'false',
        });
      }

      // Batch insert
      const batchSize = 20;
      for (let i = 0; i < coursesToInsert.length; i += batchSize) {
        setProgress(Math.round(((i + batchSize) / coursesToInsert.length) * 100));
        const batch = coursesToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('academic_courses').insert(batch);
        
        if (error) {
          errors.push(`Batch starting at row ${i + 2}: ${error.message}`);
          failedCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      toast({
        title: 'Import Complete',
        description: `${successCount} courses imported, ${failedCount} failed`,
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

  // Handle Study Materials bulk upload
  const handleMaterialsUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      // Required: title, isbn OR book_code
      const requiredHeaders = ['title'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;
      const booksToInsert: any[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        booksToInsert.push({
          title: row.title,
          author: row.author || null,
          isbn: row.isbn || null,
          publisher: row.publisher || null,
          edition: row.edition || null,
          publication_year: row.publication_year ? parseInt(row.publication_year) : null,
          description: row.description || null,
          cover_image_url: row.cover_image_url || null,
          pdf_url: row.pdf_url || null,
          is_active: row.is_active?.toLowerCase() !== 'false',
        });
      }

      // Batch insert
      const batchSize = 20;
      for (let i = 0; i < booksToInsert.length; i += batchSize) {
        setProgress(Math.round(((i + batchSize) / booksToInsert.length) * 100));
        const batch = booksToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('library_books').insert(batch);
        
        if (error) {
          errors.push(`Batch starting at row ${i + 2}: ${error.message}`);
          failedCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      toast({
        title: 'Import Complete',
        description: `${successCount} books imported, ${failedCount} failed`,
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

  // Handle Departments bulk upload
  const handleDepartmentsUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      const requiredHeaders = ['name'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;
      const deptToInsert: any[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        deptToInsert.push({
          name: row.name,
          code: row.code || undefined, // Let trigger generate if not provided
          description: row.description || null,
          is_active: row.is_active?.toLowerCase() !== 'false',
        });
      }

      const batchSize = 20;
      for (let i = 0; i < deptToInsert.length; i += batchSize) {
        setProgress(Math.round(((i + batchSize) / deptToInsert.length) * 100));
        const batch = deptToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('academic_departments').insert(batch);
        
        if (error) {
          errors.push(`Batch starting at row ${i + 2}: ${error.message}`);
          failedCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      toast({
        title: 'Import Complete',
        description: `${successCount} departments imported, ${failedCount} failed`,
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

  // Handle Faculties bulk upload
  const handleFacultiesUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows } = await parseFile(file);
      
      const requiredHeaders = ['name'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      // Faculties are now top-level (no parent needed)
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;
      const facultiesToInsert: any[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        facultiesToInsert.push({
          name: row.name,
          code: row.code || undefined,
          description: row.description || null,
          is_active: row.is_active?.toLowerCase() !== 'false',
        });
      }

      const batchSize = 20;
      for (let i = 0; i < facultiesToInsert.length; i += batchSize) {
        setProgress(Math.round(((i + batchSize) / facultiesToInsert.length) * 100));
        const batch = facultiesToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('academic_faculties').insert(batch);
        
        if (error) {
          errors.push(`Batch starting at row ${i + 2}: ${error.message}`);
          failedCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      toast({
        title: 'Import Complete',
        description: `${successCount} faculties imported, ${failedCount} failed`,
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

    switch (activeTab) {
      case 'users':
        await handleUsersUpload(file);
        break;
      case 'courses':
        await handleCoursesUpload(file);
        break;
      case 'materials':
        await handleMaterialsUpload(file);
        break;
      case 'departments':
        await handleDepartmentsUpload(file);
        break;
      case 'faculties':
        await handleFacultiesUpload(file);
        break;
    }

    // Reset file input
    event.target.value = '';
  };

  const downloadTemplate = (type: string) => {
    let headers: string[] = [];
    let sampleRow: string[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        headers = ['email', 'full_name', 'role', 'phone', 'password'];
        sampleRow = ['john@example.com', 'John Doe', 'student', '+1234567890', 'TempPass123!'];
        filename = 'users_template.csv';
        break;
      case 'courses':
        headers = ['name', 'course_code', 'faculty_code', 'short_description', 'duration_months', 'total_credits', 'enrollment_status', 'is_active'];
        sampleRow = ['Introduction to Computer Science', 'CS101', 'FAC001', 'Learn the basics of CS', '12', '30', 'open', 'true'];
        filename = 'courses_template.csv';
        break;
      case 'materials':
        headers = ['title', 'author', 'isbn', 'publisher', 'edition', 'publication_year', 'description', 'pdf_url'];
        sampleRow = ['Data Structures', 'John Smith', '978-0-123456-78-9', 'Tech Press', '3rd', '2023', 'Comprehensive guide', 'https://example.com/book.pdf'];
        filename = 'study_materials_template.csv';
        break;
      case 'faculties':
        headers = ['name', 'code', 'description', 'is_active'];
        sampleRow = ['Engineering', 'ENG', 'Faculty of Engineering', 'true'];
        filename = 'faculties_template.csv';
        break;
      case 'departments':
        headers = ['name', 'code', 'faculty_code', 'description', 'is_active'];
        sampleRow = ['Computer Science', 'CS', 'ENG', 'Department of Computer Science', 'true'];
        filename = 'departments_template.csv';
        break;
    }

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const UploadSection = ({ type, title, description, icon: Icon }: { type: string; title: string; description: string; icon: React.ElementType }) => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <Label htmlFor={`file-${type}`} className="cursor-pointer">
            <Button disabled={isUploading} asChild>
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </span>
            </Button>
          </Label>
          <Input
            id={`file-${type}`}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <Button variant="outline" onClick={() => downloadTemplate(type)}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {importResult && (
        <Alert variant={importResult.failed > 0 ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Import Results</AlertTitle>
          <AlertDescription>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {importResult.success} Success
              </Badge>
              {importResult.failed > 0 && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  {importResult.failed} Failed
                </Badge>
              )}
            </div>
            
            {importResult.errors.length > 0 && (
              <ScrollArea className="h-32 mt-3 rounded border p-2">
                <ul className="text-sm space-y-1">
                  {importResult.errors.map((error, idx) => (
                    <li key={idx} className="text-destructive">{error}</li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Upload Manager
        </CardTitle>
        <CardDescription>
          Import data in bulk using CSV or Excel files (.csv, .xls, .xlsx)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setImportResult(null); }}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Departments</span>
            </TabsTrigger>
            <TabsTrigger value="faculties" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Faculties</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Materials</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="users">
              <UploadSection
                type="users"
                title="Bulk Upload Users"
                description="Upload users with roles and credentials. Required: email, full_name, role"
                icon={Users}
              />
            </TabsContent>

            <TabsContent value="departments">
              <UploadSection
                type="departments"
                title="Bulk Upload Departments"
                description="Upload academic departments. Required: name"
                icon={BookOpen}
              />
            </TabsContent>

            <TabsContent value="faculties">
              <UploadSection
                type="faculties"
                title="Bulk Upload Faculties"
                description="Upload faculties with department associations. Required: name, department_code"
                icon={Users}
              />
            </TabsContent>

            <TabsContent value="courses">
              <UploadSection
                type="courses"
                title="Bulk Upload Courses"
                description="Upload courses with faculty associations. Required: name, course_code, faculty_code"
                icon={BookOpen}
              />
            </TabsContent>

            <TabsContent value="materials">
              <UploadSection
                type="materials"
                title="Bulk Upload Study Materials"
                description="Upload library books and study materials. Required: title"
                icon={FileText}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BulkUploadManager;
