import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, CheckCircle, XCircle, Users, GraduationCap, Calendar, ClipboardCheck, Trophy, Building } from 'lucide-react';

const FullFledgedColleges = () => {
  const colleges = [
    {
      id: 1,
      name: "Winston Leonard Churchill College",
      shortName: "WLCC",
      established: 1985,
      locations: [
        { city: "New Delhi", type: "Main Campus", students: 8500 },
        { city: "Mumbai", type: "Branch Campus", students: 4200 },
        { city: "Bangalore", type: "Branch Campus", students: 3800 }
      ],
      status: "Active",
      chancellor: "Dr. Margaret Thompson",
      vicechancellor: "Prof. Rajesh Kumar",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 16500,
      facultyCount: 1250,
      departments: 28,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Engineering", "Management", "Medical Sciences", "Arts & Sciences", "Law"],
      ranking: {
        national: 15,
        category: "Multi-Disciplinary Universities"
      }
    },
    {
      id: 2,
      name: "Abraham Lincoln Institute of Excellence",
      shortName: "ALIOE",
      established: 1992,
      locations: [
        { city: "Chennai", type: "Main Campus", students: 7200 },
        { city: "Coimbatore", type: "Branch Campus", students: 2800 },
        { city: "Madurai", type: "Branch Campus", students: 2100 }
      ],
      status: "Active",
      chancellor: "Dr. Priya Sharma",
      vicechancellor: "Prof. S. Ramakrishnan",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 12100,
      facultyCount: 890,
      departments: 22,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Technology", "Business", "Health Sciences", "Design"],
      ranking: {
        national: 28,
        category: "Technical Universities"
      }
    },
    {
      id: 3,
      name: "Theodore Roosevelt University",
      shortName: "TRU",
      established: 1978,
      locations: [
        { city: "Pune", type: "Main Campus", students: 9800 },
        { city: "Nashik", type: "Branch Campus", students: 3500 },
        { city: "Aurangabad", type: "Branch Campus", students: 2200 }
      ],
      status: "Active",
      chancellor: "Dr. Vikram Singh",
      vicechancellor: "Prof. Anjali Desai",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 15500,
      facultyCount: 1180,
      departments: 25,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Engineering", "Medicine", "Pharmacy", "Agriculture", "Social Sciences"],
      ranking: {
        national: 22,
        category: "State Universities"
      }
    },
    {
      id: 4,
      name: "Franklin Delano Roosevelt College",
      shortName: "FDRC",
      established: 1995,
      locations: [
        { city: "Hyderabad", type: "Main Campus", students: 6800 },
        { city: "Warangal", type: "Branch Campus", students: 2400 },
        { city: "Karimnagar", type: "Branch Campus", students: 1800 }
      ],
      status: "Active",
      chancellor: "Dr. Sunita Reddy",
      vicechancellor: "Prof. Krishna Murthy",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 11000,
      facultyCount: 780,
      departments: 20,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Information Technology", "Biotechnology", "Management", "Liberal Arts"],
      ranking: {
        national: 35,
        category: "Private Universities"
      }
    },
    {
      id: 5,
      name: "John Fitzgerald Kennedy University",
      shortName: "JFKU",
      established: 1988,
      locations: [
        { city: "Kolkata", type: "Main Campus", students: 8900 },
        { city: "Bhubaneswar", type: "Branch Campus", students: 3200 },
        { city: "Siliguri", type: "Branch Campus", students: 2600 }
      ],
      status: "Active",
      chancellor: "Dr. Amitabh Ghosh",
      vicechancellor: "Prof. Meera Banerjee",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 14700,
      facultyCount: 1050,
      departments: 26,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Commerce", "Sciences", "Humanities", "Fine Arts", "Journalism"],
      ranking: {
        national: 19,
        category: "Liberal Arts Universities"
      }
    },
    {
      id: 6,
      name: "Alexander Hamilton Institute of Technology",
      shortName: "AHIT",
      established: 2001,
      locations: [
        { city: "Jaipur", type: "Main Campus", students: 5200 },
        { city: "Udaipur", type: "Branch Campus", students: 2200 },
        { city: "Jodhpur", type: "Branch Campus", students: 1800 }
      ],
      status: "Active",
      chancellor: "Dr. Rohit Gupta",
      vicechancellor: "Prof. Kavita Sharma",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 9200,
      facultyCount: 650,
      departments: 18,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Engineering", "Architecture", "Design", "Computer Science"],
      ranking: {
        national: 42,
        category: "Technical Universities"
      }
    }
  ];

  const getFunctionIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const totalStudentsAcrossAll = colleges.reduce((sum, college) => sum + college.totalStudents, 0);
  const totalFacultyAcrossAll = colleges.reduce((sum, college) => sum + college.facultyCount, 0);
  const activeColleges = colleges.filter(c => c.status === "Active").length;

  return (
    <PageLayout 
      title="Full-Fledged Colleges" 
      description="Autonomous degree-granting institutions with comprehensive academic and administrative capabilities"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{activeColleges}</div>
              <div className="text-sm text-gray-600">Active Colleges</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalStudentsAcrossAll.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalFacultyAcrossAll.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Faculty Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{colleges.reduce((sum, c) => sum + c.locations.length, 0)}</div>
              <div className="text-sm text-gray-600">Campus Locations</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">College Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities Matrix</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6">
              {colleges.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-uw-purple">{college.name}</CardTitle>
                        <CardDescription className="mt-2">
                          Established {college.established} • {college.shortName} • {college.accreditation}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={college.status === "Active" ? "default" : "destructive"}>
                          {college.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Rank #{college.ranking.national} ({college.ranking.category})
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Leadership */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Chancellor:</span>
                          <div className="font-semibold">{college.chancellor}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Vice-Chancellor:</span>
                          <div className="font-semibold">{college.vicechancellor}</div>
                        </div>
                      </div>

                      {/* Locations */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-uw-purple" />
                          Campus Locations
                        </h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          {college.locations.map((location, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <div className="font-medium">{location.city}</div>
                              <div className="text-sm text-gray-600">{location.type}</div>
                              <div className="text-sm text-uw-purple font-semibold">{location.students.toLocaleString()} students</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Academic Overview */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{college.totalStudents.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Students</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{college.facultyCount}</div>
                          <div className="text-sm text-gray-600">Faculty</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{college.departments}</div>
                          <div className="text-sm text-gray-600">Departments</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-700">{college.programs.length}</div>
                          <div className="text-sm text-gray-600">Program Types</div>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div>
                        <h4 className="font-semibold mb-2">Specializations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.specializations.map((spec, idx) => (
                            <Badge key={idx} variant="outline">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="capabilities">
            <Card>
              <CardHeader>
                <CardTitle>Functional Capabilities Matrix</CardTitle>
                <CardDescription>Enabled functions across all full-fledged colleges</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College</TableHead>
                      <TableHead className="text-center">Admissions</TableHead>
                      <TableHead className="text-center">Study/Teaching</TableHead>
                      <TableHead className="text-center">Examinations</TableHead>
                      <TableHead className="text-center">Paper Checking</TableHead>
                      <TableHead className="text-center">Declaring Results</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{college.shortName}</div>
                            <div className="text-sm text-gray-600">{college.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.admissions)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.study)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.exams)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.paperChecking)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.results)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={college.status === "Active" ? "default" : "destructive"}>
                            {college.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-uw-gold" />
                    Performance Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {colleges
                      .sort((a, b) => a.ranking.national - b.ranking.national)
                      .map((college, idx) => (
                        <div key={college.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{college.shortName}</div>
                            <div className="text-sm text-gray-600">{college.ranking.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-uw-purple">#{college.ranking.national}</div>
                            <div className="text-sm text-gray-600">National Rank</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-uw-purple" />
                    Student Enrollment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {colleges
                      .sort((a, b) => b.totalStudents - a.totalStudents)
                      .map((college, idx) => (
                        <div key={college.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{college.shortName}</div>
                            <div className="text-sm text-gray-600">{college.locations.length} campuses</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{college.totalStudents.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Students</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default FullFledgedColleges;