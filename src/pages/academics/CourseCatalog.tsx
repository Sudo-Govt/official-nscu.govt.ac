
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CourseCatalog = () => {
  const departments = [
    { code: "ACCT", name: "Accounting", courses: 45 },
    { code: "BIOL", name: "Biology", courses: 68 },
    { code: "CHEM", name: "Chemistry", courses: 52 },
    { code: "COMP", name: "Computer Science", courses: 78 },
    { code: "ECON", name: "Economics", courses: 38 },
    { code: "ENGL", name: "English", courses: 85 },
    { code: "HIST", name: "History", courses: 64 },
    { code: "MATH", name: "Mathematics", courses: 72 },
    { code: "PHYS", name: "Physics", courses: 48 },
    { code: "PSYC", name: "Psychology", courses: 56 }
  ];

  const sampleCourses = [
    {
      code: "COMP 1010",
      title: "Introduction to Computer Science",
      credits: 3,
      description: "Fundamental concepts of computer science including programming, algorithms, and data structures.",
      prerequisites: "None",
      level: "Undergraduate"
    },
    {
      code: "BIOL 2540",
      title: "Genetics",
      credits: 4,
      description: "Principles of heredity, molecular genetics, and biotechnology applications.",
      prerequisites: "BIOL 1010, BIOL 1020",
      level: "Undergraduate"
    },
    {
      code: "HIST 3200",
      title: "Modern European History",
      credits: 3,
      description: "European political, social, and cultural developments from 1789 to present.",
      prerequisites: "6 hours of HIST or consent",
      level: "Undergraduate"
    },
    {
      code: "PSYC 6800",
      title: "Advanced Research Methods",
      credits: 3,
      description: "Advanced statistical techniques and research design in psychological research.",
      prerequisites: "PSYC 3800, Graduate standing",
      level: "Graduate"
    }
  ];

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
                <Input placeholder="Search courses..." className="flex-1" />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  All Levels
                </Button>
                <Button variant="outline" size="sm">Undergraduate</Button>
                <Button variant="outline" size="sm">Graduate</Button>
                <Button variant="outline" size="sm">Prerequisites Required</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Departments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{dept.code}</CardTitle>
                  <CardDescription className="text-sm">{dept.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-uw-purple">{dept.courses}</span>
                    <p className="text-xs text-gray-600">courses</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Course Listings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Courses</h2>
          <div className="space-y-6">
            {sampleCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{course.code}: {course.title}</CardTitle>
                      <CardDescription className="mt-2">{course.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={course.level === "Graduate" ? "default" : "secondary"}>
                        {course.level}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{course.credits} credits</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">Prerequisites: </span>
                      <span className="text-sm text-gray-600">{course.prerequisites}</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Catalog Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Catalog Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Total Courses</h3>
              <p className="text-2xl font-bold text-uw-purple">1,850+</p>
              <p className="text-sm text-gray-600">Across all disciplines</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Academic Year</h3>
              <p className="text-2xl font-bold text-uw-purple">2024-25</p>
              <p className="text-sm text-gray-600">Current catalog edition</p>
            </div>
            <div className="text-center">
              <Filter className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-2xl font-bold text-uw-purple">Dec 2024</p>
              <p className="text-sm text-gray-600">Course information updated</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseCatalog;
