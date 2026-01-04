import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, BookOpen, Eye, Star, Upload, Download, FileSpreadsheet, Code } from 'lucide-react';

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
  curriculum_data: any[];
  reference_books: any[];
  career_outcomes: any[];
  fee_structure: FeeStructure | null;
  navigation_parent_id: string | null;
}

interface NavLocation {
  id: string;
  title: string;
  href: string | null;
}

const COURSE_MODES = [
  { key: 'delaware_campus', label: 'Delaware Campus' },
  { key: 'belize_campus', label: 'Belize Campus' },
  { key: 'online', label: 'Online' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'offshore_campus', label: 'Offshore Campus' },
  { key: 'distance', label: 'Distance' },
  { key: 'fast_mode', label: 'Fast Mode' },
];

const CourseManagement = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [navLocations, setNavLocations] = useState<NavLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [navigationParentId, setNavigationParentId] = useState<string>('');
  
  // JSON Editor state
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [jsonEditingCourse, setJsonEditingCourse] = useState<Course | null>(null);
  const [jsonContent, setJsonContent] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Form state - Basic
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [degreeType, setDegreeType] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [durationYears, setDurationYears] = useState('4');
  const [creditHours, setCreditHours] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('50');
  
  // Form state - Additional
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [careerOutcomes, setCareerOutcomes] = useState('');
  const [referenceBooks, setReferenceBooks] = useState('');

  // Form state - Fees
  const [feeStructure, setFeeStructure] = useState<FeeStructure>({});

  const degreeTypes = [
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Master', label: 'Master' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Certificate', label: 'Certificate' }
  ];

  const colleges = [
    { value: 'College of Arts and Sciences', label: 'College of Arts and Sciences' },
    { value: 'College of Engineering', label: 'College of Engineering' },
    { value: 'College of Business', label: 'College of Business' },
    { value: 'College of Health Sciences', label: 'College of Health Sciences' },
    { value: 'College of Education', label: 'College of Education' },
    { value: 'School of Law', label: 'School of Law' },
    { value: 'School of Medicine', label: 'School of Medicine' }
  ];

  // Generate URL-friendly slug from course name and degree type
  const generateSlug = (name: string, degree: string): string => {
    const combined = `${degree}-${name}`.toLowerCase();
    return combined
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    fetchCourses();
    fetchNavLocations();
  }, []);

  const fetchNavLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('site_navigation')
        .select('id, title, href')
        .order('title');

      if (error) throw error;
      setNavLocations((data || []) as NavLocation[]);
    } catch (error) {
      console.error('Error fetching nav locations:', error);
    }
  };

  const getDefaultNavLocationId = () => {
    const courseCatalog = navLocations.find(n => n.href === '/academics/course-catalog');
    return courseCatalog?.id || '';
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

  const resetForm = () => {
    setCourseCode('');
    setCourseName('');
    setDegreeType('');
    setCollege('');
    setDepartment('');
    setDurationYears('4');
    setCreditHours('');
    setEligibility('');
    setSeatCapacity('50');
    setDescription('');
    setFeatured(false);
    setBrochureUrl('');
    setApplicationDeadline('');
    setCareerOutcomes('');
    setReferenceBooks('');
    setFeeStructure({});
    setNavigationParentId(getDefaultNavLocationId());
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseCode(course.course_code);
      setCourseName(course.course_name);
      setDegreeType(course.degree_type);
      setCollege(course.college);
      setDepartment(course.department || '');
      setDurationYears(course.duration_years.toString());
      setCreditHours(course.credit_hours?.toString() || '');
      setEligibility(course.eligibility_criteria || '');
      setSeatCapacity(course.seat_capacity?.toString() || '50');
      setDescription(course.description || '');
      setFeatured(course.featured || false);
      setBrochureUrl(course.brochure_url || '');
      setApplicationDeadline(course.application_deadline || '');
      setCareerOutcomes(Array.isArray(course.career_outcomes) ? course.career_outcomes.join('\n') : '');
      setReferenceBooks(Array.isArray(course.reference_books) ? course.reference_books.join('\n') : '');
      setFeeStructure(course.fee_structure || {});
      setNavigationParentId(course.navigation_parent_id || getDefaultNavLocationId());
    } else {
      setEditingCourse(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleFeeChange = (mode: string, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFeeStructure(prev => ({
      ...prev,
      [mode]: numValue
    }));
  };

  const handleSaveCourse = async () => {
    if (!courseCode || !courseName || !degreeType || !college || !durationYears) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = generateSlug(courseName, degreeType);
      
      // Clean fee structure - remove undefined values
      const cleanedFees: FeeStructure = {};
      Object.entries(feeStructure).forEach(([key, value]) => {
        if (value !== undefined && value !== null && !isNaN(value)) {
          cleanedFees[key as keyof FeeStructure] = value;
        }
      });
      
      const courseData = {
        course_code: courseCode,
        course_name: courseName,
        degree_type: degreeType,
        college: college,
        department: department || null,
        duration_years: parseInt(durationYears),
        credit_hours: creditHours ? parseInt(creditHours) : null,
        eligibility_criteria: eligibility || null,
        seat_capacity: seatCapacity ? parseInt(seatCapacity) : 50,
        available_seats: seatCapacity ? parseInt(seatCapacity) : 50,
        description: description || null,
        slug: slug,
        featured: featured,
        brochure_url: brochureUrl || null,
        application_deadline: applicationDeadline || null,
        career_outcomes: careerOutcomes ? careerOutcomes.split('\n').filter(c => c.trim()) : [],
        reference_books: referenceBooks ? referenceBooks.split('\n').filter(b => b.trim()) : [],
        fee_structure: Object.keys(cleanedFees).length > 0 ? cleanedFees : null,
        navigation_parent_id: navigationParentId || null
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(courseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully. It will now appear on the website."
        });
      }

      setDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "A course with this name already exists" 
          : `Failed to ${editingCourse ? 'update' : 'create'} course`,
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

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (courseId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ featured: !currentFeatured })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${!currentFeatured ? 'added to' : 'removed from'} featured programs`
      });

      fetchCourses();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const previewCourse = (course: Course) => {
    if (course.slug) {
      window.open(`/programs/${course.slug}`, '_blank');
    } else {
      toast({
        title: "Preview unavailable",
        description: "This course doesn't have a URL slug yet. Please edit and save the course.",
        variant: "destructive"
      });
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

    // Ensure critical fields are preserved
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
        description: "Course updated via JSON editor"
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

  // CSV Demo file download
  const downloadDemoCSV = () => {
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

  // CSV Upload handler
  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvUploading(true);
    
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
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          console.warn(`Skipping row ${i + 1}: column count mismatch`);
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
          fee_structure: Object.keys(csvFeeStructure).length > 0 ? csvFeeStructure : null,
          is_active: true
        };
        
        coursesToInsert.push(courseData);
      }
      
      if (coursesToInsert.length === 0) {
        throw new Error('No valid courses found in CSV');
      }
      
      // Insert courses
      const { error } = await supabase
        .from('courses')
        .insert(coursesToInsert);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${coursesToInsert.length} courses imported successfully`
      });
      
      fetchCourses();
      
    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import courses from CSV",
        variant: "destructive"
      });
    } finally {
      setCsvUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Helper to parse CSV line handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
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

  return (
    <div className="space-y-6">
      {/* Quick Add Section */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Add a New Course</h3>
                <p className="text-muted-foreground text-sm">
                  Manually add courses or import via CSV. Courses appear on the website automatically.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course Manually
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Courses ({courses.length})
              </CardTitle>
              <CardDescription>
                View and manage all courses in the database. Click any row action to edit.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" onClick={downloadDemoCSV}>
                <Download className="h-4 w-4 mr-2" />
                Demo CSV
              </Button>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={csvUploading}
                >
                  {csvUploading ? (
                    <>
                      <FileSpreadsheet className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </>
                  )}
                </Button>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCourse ? 'Update course information' : 'Create a new course. It will automatically appear on the website.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="fees">Fees</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Course Code *</Label>
                          <Input
                            placeholder="e.g., CS101"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Degree Type *</Label>
                          <Select value={degreeType} onValueChange={setDegreeType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree type" />
                            </SelectTrigger>
                            <SelectContent>
                              {degreeTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Course Name *</Label>
                        <Input
                          placeholder="e.g., Computer Science"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                        {courseName && degreeType && (
                          <p className="text-xs text-muted-foreground mt-1">
                            URL: /programs/{generateSlug(courseName, degreeType)}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>College *</Label>
                          <Select value={college} onValueChange={setCollege}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select college" />
                            </SelectTrigger>
                            <SelectContent>
                              {colleges.map((col) => (
                                <SelectItem key={col.value} value={col.value}>
                                  {col.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Input
                            placeholder="e.g., Computer Science"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Duration (Years) *</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={durationYears}
                            onChange={(e) => setDurationYears(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Credit Hours</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 120"
                            value={creditHours}
                            onChange={(e) => setCreditHours(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Seat Capacity</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 50"
                            value={seatCapacity}
                            onChange={(e) => setSeatCapacity(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Navigation Location</Label>
                        <Select value={navigationParentId} onValueChange={setNavigationParentId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select navigation location" />
                          </SelectTrigger>
                          <SelectContent>
                            {navLocations.map((nav) => (
                              <SelectItem key={nav.id} value={nav.id}>
                                {nav.title} {nav.href && `(${nav.href})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Default: Academics → Course Catalog
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label>Featured Program</Label>
                          <p className="text-sm text-muted-foreground">Show on homepage and in navigation</p>
                        </div>
                        <Switch
                          checked={featured}
                          onCheckedChange={setFeatured}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="fees" className="space-y-4 mt-4">
                      <div className="p-4 bg-muted rounded-lg mb-4">
                        <h4 className="font-medium mb-2">Course Fees by Delivery Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Enter the fee for each delivery mode. Leave blank if mode is not available.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {COURSE_MODES.map((mode) => (
                          <div key={mode.key}>
                            <Label>{mode.label} Fee (USD)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="100"
                              placeholder="e.g., 25000"
                              value={feeStructure[mode.key as keyof FeeStructure] || ''}
                              onChange={(e) => handleFeeChange(mode.key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div>
                        <Label>Program Description</Label>
                        <Textarea
                          placeholder="Enter a detailed description of the program..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Eligibility Criteria</Label>
                        <Textarea
                          placeholder="Enter eligibility requirements..."
                          value={eligibility}
                          onChange={(e) => setEligibility(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Application Deadline</Label>
                          <Input
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => setApplicationDeadline(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Brochure URL</Label>
                          <Input
                            placeholder="https://..."
                            value={brochureUrl}
                            onChange={(e) => setBrochureUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="content" className="space-y-4 mt-4">
                      <div>
                        <Label>Career Outcomes (one per line)</Label>
                        <Textarea
                          placeholder="Software Engineer&#10;Data Scientist&#10;System Architect"
                          value={careerOutcomes}
                          onChange={(e) => setCareerOutcomes(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Reference Books (one per line)</Label>
                        <Textarea
                          placeholder="Introduction to Algorithms by Cormen&#10;Clean Code by Robert Martin"
                          value={referenceBooks}
                          onChange={(e) => setReferenceBooks(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCourse}>
                      {editingCourse ? 'Update' : 'Create'} Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No courses found. Add your first course to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const fees = course.fee_structure;
                  const feeCount = fees ? Object.keys(fees).filter(k => fees[k as keyof FeeStructure]).length : 0;
                  
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.course_code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {course.course_name}
                          {course.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{course.degree_type}</TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">{course.college}</TableCell>
                      <TableCell>{course.duration_years} years</TableCell>
                      <TableCell>
                        {feeCount > 0 ? (
                          <Badge variant="outline">{feeCount} modes</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No fees</span>
                        )}
                      </TableCell>
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
                            onClick={() => previewCourse(course)}
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured(course.id, course.featured)}
                            title={course.featured ? "Remove from featured" : "Add to featured"}
                          >
                            <Star className={`h-4 w-4 ${course.featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(course)}
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
                            onClick={() => toggleCourseStatus(course.id, course.is_active)}
                          >
                            {course.is_active ? 'Deactivate' : 'Activate'}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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

export default CourseManagement;
