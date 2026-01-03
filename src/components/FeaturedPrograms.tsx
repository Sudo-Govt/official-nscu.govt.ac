import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Microscope, Code, Briefcase, Heart, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  course_name: string;
  course_code: string;
  college: string;
  degree_type: string;
  duration_years: number;
  available_seats?: number;
  seat_capacity?: number;
  eligibility_criteria?: string;
  slug?: string;
  featured?: boolean;
}

const getIconForCollege = (college: string) => {
  const collegeLower = college.toLowerCase();
  if (collegeLower.includes('business')) return Briefcase;
  if (collegeLower.includes('engineering')) return Code;
  if (collegeLower.includes('health') || collegeLower.includes('medicine')) return Heart;
  if (collegeLower.includes('science')) return Microscope;
  if (collegeLower.includes('arts') || collegeLower.includes('education')) return BookOpen;
  return GraduationCap;
};

const FeaturedPrograms = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        // First try to get featured courses, then fall back to any active courses
        let { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .eq('featured', true)
          .limit(6)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // If no featured courses, get any active courses
        if (!data || data.length === 0) {
          const result = await supabase
            .from('courses')
            .select('*')
            .eq('is_active', true)
            .limit(6)
            .order('created_at', { ascending: false });
          
          if (result.error) throw result.error;
          data = result.data;
        }

        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show section if no courses
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Accredited Degree Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            NSCU's flexible degree programs with GCHEA-accredited courses designed for working professionals seeking career advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => {
            const IconComponent = getIconForCollege(course.college);
            const availableSeats = course.available_seats || course.seat_capacity || 0;
            
            return (
              <Card key={course.id} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary">{course.degree_type} in {course.course_name}</CardTitle>
                      <div className="flex space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{course.course_code}</span>
                        <span>{course.duration_years} years</span>
                      </div>
                      <div className="text-xs text-accent-foreground mt-1">
                        {availableSeats > 0 ? `${availableSeats} seats available` : 'Limited seats'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {course.eligibility_criteria || `${course.degree_type} program offered by ${course.college}.`}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                      {course.college}
                    </span>
                    {course.slug ? (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/programs/${course.slug}`}>
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/academics/course-catalog">
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/academics/course-catalog')}
          >
            Explore All Programs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
