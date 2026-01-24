import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, GraduationCap, Eye, BookOpen, Sparkles } from 'lucide-react';
import { useAcademicCourses, useFaculties, useDepartments } from '@/hooks/useAcademicData';
import { CurriculumEditor } from './CurriculumEditor';
import type { AcademicCourse, Department } from '@/types/academic';

// New hierarchy: Faculty -> Department -> Course
export function AcademicCourseManagement() {
  const { data: courses, loading, fetchWithHierarchy, create, update, remove } = useAcademicCourses();
  const { data: faculties, fetch: fetchFaculties } = useFaculties();
  const { data: departments, fetchWithFaculty } = useDepartments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AcademicCourse | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [editingCourse, setEditingCourse] = useState<AcademicCourse | null>(null);
  const [formData, setFormData] = useState({
    department_id: '',
    name: '',
    duration_months: 12,
    total_credits: 0,
    start_date: '',
    short_description: '',
    long_description: '',
    is_active: true,
    is_visible_on_website: true,
    enrollment_status: 'open' as 'open' | 'closed' | 'coming_soon',
  });

  useEffect(() => {
    fetchWithHierarchy();
    fetchFaculties();
    fetchWithFaculty();
  }, []);

  // Filter departments by selected faculty
  const filteredDepartments = selectedFacultyId
    ? departments.filter((d) => d.faculty_id === selectedFacultyId)
    : departments;

  const handleOpenDialog = (course?: AcademicCourse) => {
    if (course) {
      setEditingCourse(course);
      const department = departments.find(d => d.id === course.department_id) as Department & { faculty?: { id: string } };
      setSelectedFacultyId(department?.faculty_id || '');
      setFormData({
        department_id: course.department_id,
        name: course.name,
        duration_months: course.duration_months,
        total_credits: course.total_credits,
        start_date: course.start_date || '',
        short_description: course.short_description || '',
        long_description: course.long_description || '',
        is_active: course.is_active,
        is_visible_on_website: course.is_visible_on_website,
        enrollment_status: course.enrollment_status,
      });
    } else {
      setEditingCourse(null);
      setSelectedFacultyId('');
      setFormData({
        department_id: '',
        name: '',
        duration_months: 12,
        total_credits: 0,
        start_date: '',
        short_description: '',
        long_description: '',
        is_active: true,
        is_visible_on_website: true,
        enrollment_status: 'open',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.department_id) return;

    // Calculate end_date from start_date + duration
    let endDate = '';
    if (formData.start_date) {
      const start = new Date(formData.start_date);
      start.setMonth(start.getMonth() + formData.duration_months);
      endDate = start.toISOString().split('T')[0];
    }

    const payload = {
      ...formData,
      end_date: endDate || null,
    };

    if (editingCourse) {
      await update(editingCourse.id, payload);
    } else {
      await create(payload);
    }
    setDialogOpen(false);
    setEditingCourse(null);
    fetchWithHierarchy();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will delete all subjects, topics, and lessons under this course.')) {
      await remove(id);
    }
  };

  const handleOpenCurriculum = (course: AcademicCourse) => {
    setSelectedCourse(course);
    setCurriculumOpen(true);
  };

  const getEnrollmentBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'coming_soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Course Management
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Add Course'}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Faculty *</Label>
                      <Select
                        value={selectedFacultyId}
                        onValueChange={(value) => {
                          setSelectedFacultyId(value);
                          setFormData({ ...formData, department_id: '' });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.filter(f => f.is_active).map((faculty) => (
                            <SelectItem key={faculty.id} value={faculty.id}>
                              {faculty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Department *</Label>
                      <Select
                        value={formData.department_id}
                        onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                        disabled={!selectedFacultyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDepartments.filter(d => d.is_active).map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Course Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Diploma in Electrical Engineering"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (months)</Label>
                      <Input
                        type="number"
                        value={formData.duration_months}
                        onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 12 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Credits</Label>
                      <Input
                        type="number"
                        value={formData.total_credits}
                        onChange={(e) => setFormData({ ...formData, total_credits: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Short Description (for listings)</Label>
                    <Textarea
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief description for course cards"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Long Description (for detail page)</Label>
                    <Textarea
                      value={formData.long_description}
                      onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                      placeholder="Detailed course description"
                      rows={6}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Enrollment Status</Label>
                    <Select
                      value={formData.enrollment_status}
                      onValueChange={(value: 'open' | 'closed' | 'coming_soon') => 
                        setFormData({ ...formData, enrollment_status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show on Public Website</Label>
                    <Switch
                      checked={formData.is_visible_on_website}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_visible_on_website: checked })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={handleSubmit} className="w-full mt-4">
                {editingCourse ? 'Update' : 'Create'} Course
              </Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground">No courses found. Add one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>AI Content</TableHead>
                  <TableHead>Page Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono text-sm">{course.course_code}</TableCell>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {(course as any).department?.name || '-'}
                    </TableCell>
                    <TableCell>{course.duration_months} months</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{getEnrollmentBadge(course.enrollment_status)}</TableCell>
                    <TableCell>
                      {(course as any).ai_generated_content ? (
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          Generated
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.slug && (
                        <a 
                          href={`/courses/${course.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          /courses/{course.slug}
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCurriculum(course)}
                        title="Edit Curriculum"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/academic-courses/${course.slug}`, '_blank')}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(course)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Curriculum Editor Dialog */}
      <Dialog open={curriculumOpen} onOpenChange={setCurriculumOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Curriculum: {selectedCourse?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <CurriculumEditor courseId={selectedCourse.id} courseName={selectedCourse.name} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
