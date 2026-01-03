import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Filter, Calendar, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useSEO } from '@/hooks/useSEO';

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
  description: string | null;
  slug: string | null;
  is_active: boolean;
}

const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useSEO({
    title: "Course Catalog - NSCU Belize Academic Courses & Programs",
    description: "Browse NSCU Belize comprehensive course catalog. Find undergraduate and graduate courses across all departments with detailed descriptions, prerequisites, and schedules.",
    keywords: "NSCU course catalog, university course listings Belize, academic courses NSCU, course descriptions schedules, undergraduate graduate courses, NSCU curriculum guide",
    canonical: "https://newstatesuniversity.lovable.app/academics/course-catalog",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "NSCU Course Catalog",
      "description": "Complete catalog of academic courses offered at New States Continental University",
      "numberOfItems": courses.length.toString(),
    }
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .order('course_name');

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get unique departments/colleges for filtering
  const departments = [...new Set(courses.map(c => c.college))].map(college => ({
    code: college,
    name: college,
    courses: courses.filter(c => c.college === college).length
  }));

  // Filter courses based on search, level, and department
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery === '' || 
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const level = ['Bachelor', 'Diploma', 'Certificate'].includes(course.degree_type) 
      ? 'Undergraduate' 
      : 'Graduate';
    const matchesLevel = selectedLevel === 'All Levels' || level === selectedLevel;
    
    const matchesDepartment = !selectedDepartment || course.college === selectedDepartment;
    
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  return (
    <PageLayout 
      title="Course Catalog" 
      description="Explore our comprehensive academic offerings across all disciplines"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Course Search
              </CardTitle>
              <CardDescription>
                Search for courses by subject, title, or course number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input 
                  placeholder="Search courses..." 
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={() => setSearchQuery('')}>
                  <Search className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={selectedLevel === 'All Levels' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedLevel('All Levels')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All Levels
                </Button>
                <Button 
                  variant={selectedLevel === 'Undergraduate' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedLevel('Undergraduate')}
                >
                  Undergraduate
                </Button>
                <Button 
                  variant={selectedLevel === 'Graduate' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedLevel('Graduate')}
                >
                  Graduate
                </Button>
              </div>
              {(searchQuery || selectedLevel !== 'All Levels' || selectedDepartment) && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredCourses.length} of {courses.length} courses
                  {selectedDepartment && ` in ${selectedDepartment}`}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Academic Departments</h2>
            {selectedDepartment && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDepartment(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedDepartment === dept.code ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedDepartment(selectedDepartment === dept.code ? null : dept.code)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary">{dept.courses}</span>
                      <p className="text-xs text-muted-foreground">programs</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Course Listings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            {selectedDepartment || searchQuery || selectedLevel !== 'All Levels' ? 'Filtered Programs' : 'All Programs'}
          </h2>
          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No courses found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('All Levels');
                    setSelectedDepartment(null);
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          {course.degree_type} in {course.course_name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {course.description || `${course.degree_type} program offered by ${course.college}.`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={['Master', 'PhD'].includes(course.degree_type) ? "default" : "secondary"}>
                          {course.degree_type}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{course.duration_years} years</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{course.course_code}</span>
                        <span>{course.credit_hours ? `${course.credit_hours} credits` : ''}</span>
                        <span>{course.college}</span>
                      </div>
                      {course.slug ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/programs/${course.slug}`}>View Details</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Information */}
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Catalog Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Total Programs</h3>
              <p className="text-2xl font-bold text-primary">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Across all disciplines</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Academic Year</h3>
              <p className="text-2xl font-bold text-primary">2025-26</p>
              <p className="text-sm text-muted-foreground">Current catalog edition</p>
            </div>
            <div className="text-center">
              <Filter className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-2xl font-bold text-primary">Jan 2026</p>
              <p className="text-sm text-muted-foreground">Course information updated</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseCatalog;
