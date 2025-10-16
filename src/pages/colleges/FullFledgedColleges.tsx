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
      name: "Barcelona Global University",
      shortName: "BGU",
      established: 1998,
      locations: [
        { city: "Barcelona", type: "Main Campus", students: 7800 },
        { city: "Madrid", type: "Branch Campus", students: 3400 },
        { city: "Valencia", type: "Branch Campus", students: 2100 }
      ],
      status: "Active",
      chancellor: "Dr. Carlos Fernández",
      vicechancellor: "Prof. Isabel Martínez",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 13300,
      facultyCount: 940,
      departments: 24,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Business", "Architecture", "Tourism", "Engineering", "Arts"],
      ranking: {
        national: 18,
        category: "European Universities"
      }
    },
    {
      id: 2,
      name: "Berlin International Institute",
      shortName: "BII",
      established: 1991,
      locations: [
        { city: "Berlin", type: "Main Campus", students: 9200 },
        { city: "Munich", type: "Branch Campus", students: 4100 },
        { city: "Frankfurt", type: "Branch Campus", students: 2900 }
      ],
      status: "Active",
      chancellor: "Dr. Hans Mueller",
      vicechancellor: "Prof. Eva Schmidt",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 16200,
      facultyCount: 1220,
      departments: 29,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Engineering", "Technology", "Sciences", "Business Administration", "Medicine"],
      ranking: {
        national: 12,
        category: "Technical Universities"
      }
    },
    {
      id: 3,
      name: "Buenos Aires Metropolitan College",
      shortName: "BAMC",
      established: 1989,
      locations: [
        { city: "Buenos Aires", type: "Main Campus", students: 8600 },
        { city: "Córdoba", type: "Branch Campus", students: 3800 },
        { city: "Rosario", type: "Branch Campus", students: 2700 }
      ],
      status: "Active",
      chancellor: "Dr. María González",
      vicechancellor: "Prof. Diego Ramírez",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 15100,
      facultyCount: 1080,
      departments: 26,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Social Sciences", "Law", "Economics", "Agriculture", "Liberal Arts"],
      ranking: {
        national: 21,
        category: "Multi-Disciplinary Universities"
      }
    },
    {
      id: 4,
      name: "Cape Town University of Excellence",
      shortName: "CTUE",
      established: 1994,
      locations: [
        { city: "Cape Town", type: "Main Campus", students: 7400 },
        { city: "Johannesburg", type: "Branch Campus", students: 3200 },
        { city: "Durban", type: "Branch Campus", students: 2400 }
      ],
      status: "Active",
      chancellor: "Dr. Thandiwe Mbeki",
      vicechancellor: "Prof. John van der Merwe",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 13000,
      facultyCount: 920,
      departments: 23,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Health Sciences", "Natural Sciences", "Engineering", "Business", "Humanities"],
      ranking: {
        national: 25,
        category: "Research Universities"
      }
    },
    {
      id: 5,
      name: "Guadalajara Technical Institute",
      shortName: "GTI",
      established: 1997,
      locations: [
        { city: "Guadalajara", type: "Main Campus", students: 6900 },
        { city: "Monterrey", type: "Branch Campus", students: 3100 },
        { city: "Puebla", type: "Branch Campus", students: 2300 }
      ],
      status: "Active",
      chancellor: "Dr. Roberto Hernández",
      vicechancellor: "Prof. Ana López",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 12300,
      facultyCount: 860,
      departments: 21,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Engineering", "Technology", "Architecture", "Business", "Design"],
      ranking: {
        national: 29,
        category: "Technical Universities"
      }
    },
    {
      id: 6,
      name: "Jakarta International University",
      shortName: "JIU",
      established: 1993,
      locations: [
        { city: "Jakarta", type: "Main Campus", students: 8800 },
        { city: "Surabaya", type: "Branch Campus", students: 3700 },
        { city: "Bandung", type: "Branch Campus", students: 2900 }
      ],
      status: "Active",
      chancellor: "Dr. Siti Rahman",
      vicechancellor: "Prof. Ahmad Wijaya",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 15400,
      facultyCount: 1100,
      departments: 27,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Business", "Information Technology", "Islamic Studies", "Engineering", "Social Sciences"],
      ranking: {
        national: 17,
        category: "Multi-Disciplinary Universities"
      }
    },
    {
      id: 7,
      name: "Kuala Lumpur Institute of Technology",
      shortName: "KLIT",
      established: 2000,
      locations: [
        { city: "Kuala Lumpur", type: "Main Campus", students: 6500 },
        { city: "Penang", type: "Branch Campus", students: 2800 },
        { city: "Johor Bahru", type: "Branch Campus", students: 2200 }
      ],
      status: "Active",
      chancellor: "Dr. Azman Abdullah",
      vicechancellor: "Prof. Mei Ling Tan",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 11500,
      facultyCount: 810,
      departments: 19,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Engineering", "Computer Science", "Business", "Biotechnology", "Design"],
      ranking: {
        national: 33,
        category: "Technical Universities"
      }
    },
    {
      id: 8,
      name: "Lagos Metropolitan University",
      shortName: "LMU",
      established: 1996,
      locations: [
        { city: "Lagos", type: "Main Campus", students: 7900 },
        { city: "Abuja", type: "Branch Campus", students: 3300 },
        { city: "Port Harcourt", type: "Branch Campus", students: 2500 }
      ],
      status: "Active",
      chancellor: "Dr. Adebayo Okonkwo",
      vicechancellor: "Prof. Grace Nwosu",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 13700,
      facultyCount: 970,
      departments: 25,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Business", "Law", "Medicine", "Engineering", "Arts"],
      ranking: {
        national: 20,
        category: "Multi-Disciplinary Universities"
      }
    },
    {
      id: 9,
      name: "Manila College of Advanced Studies",
      shortName: "MCAS",
      established: 1990,
      locations: [
        { city: "Manila", type: "Main Campus", students: 8300 },
        { city: "Cebu", type: "Branch Campus", students: 3500 },
        { city: "Davao", type: "Branch Campus", students: 2600 }
      ],
      status: "Active",
      chancellor: "Dr. Rosa Santos",
      vicechancellor: "Prof. Ramon Cruz",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 14400,
      facultyCount: 1020,
      departments: 26,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Diploma"],
      specializations: ["Nursing", "Pharmacy", "Business", "Engineering", "Education"],
      ranking: {
        national: 19,
        category: "Health Sciences Universities"
      }
    },
    {
      id: 10,
      name: "Paris International College",
      shortName: "PIC",
      established: 1987,
      locations: [
        { city: "Paris", type: "Main Campus", students: 9500 },
        { city: "Lyon", type: "Branch Campus", students: 4200 },
        { city: "Marseille", type: "Branch Campus", students: 3100 }
      ],
      status: "Active",
      chancellor: "Dr. Jean-Pierre Dubois",
      vicechancellor: "Prof. Sophie Laurent",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 16800,
      facultyCount: 1280,
      departments: 30,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Arts", "Literature", "Business", "Sciences", "Humanities"],
      ranking: {
        national: 14,
        category: "Liberal Arts Universities"
      }
    },
    {
      id: 11,
      name: "Rio de Janeiro University of Science",
      shortName: "RJUS",
      established: 1992,
      locations: [
        { city: "Rio de Janeiro", type: "Main Campus", students: 8100 },
        { city: "São Paulo", type: "Branch Campus", students: 3600 },
        { city: "Brasília", type: "Branch Campus", students: 2800 }
      ],
      status: "Active",
      chancellor: "Dr. Paulo Silva",
      vicechancellor: "Prof. Juliana Costa",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 14500,
      facultyCount: 1040,
      departments: 25,
      programs: ["Undergraduate", "Postgraduate", "Doctoral"],
      specializations: ["Environmental Sciences", "Engineering", "Medicine", "Technology", "Social Work"],
      ranking: {
        national: 23,
        category: "Research Universities"
      }
    },
    {
      id: 12,
      name: "Santiago Institute of Excellence",
      shortName: "SIE",
      established: 1999,
      locations: [
        { city: "Santiago", type: "Main Campus", students: 7100 },
        { city: "Valparaíso", type: "Branch Campus", students: 2900 },
        { city: "Concepción", type: "Branch Campus", students: 2300 }
      ],
      status: "Active",
      chancellor: "Dr. Carmen Rodríguez",
      vicechancellor: "Prof. Andrés Vargas",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 12300,
      facultyCount: 870,
      departments: 22,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Mining Engineering", "Business", "Agriculture", "Sciences", "Arts"],
      ranking: {
        national: 27,
        category: "Technical Universities"
      }
    },
    {
      id: 13,
      name: "Singapore Global Academy",
      shortName: "SGA",
      established: 1995,
      locations: [
        { city: "Singapore", type: "Main Campus", students: 9800 },
        { city: "Singapore East", type: "Branch Campus", students: 4500 },
        { city: "Singapore West", type: "Branch Campus", students: 3400 }
      ],
      status: "Active",
      chancellor: "Dr. Lee Wei Chen",
      vicechancellor: "Prof. Sarah Krishnan",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 17700,
      facultyCount: 1340,
      departments: 31,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Finance", "Technology", "Medicine", "Engineering", "Business Analytics"],
      ranking: {
        national: 8,
        category: "Research Universities"
      }
    },
    {
      id: 14,
      name: "Stockholm University of Innovation",
      shortName: "SUI",
      established: 1986,
      locations: [
        { city: "Stockholm", type: "Main Campus", students: 8700 },
        { city: "Gothenburg", type: "Branch Campus", students: 3900 },
        { city: "Malmö", type: "Branch Campus", students: 2800 }
      ],
      status: "Active",
      chancellor: "Dr. Lars Andersson",
      vicechancellor: "Prof. Ingrid Johansson",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: true
      },
      accreditation: "GCHEA Accredited",
      totalStudents: 15400,
      facultyCount: 1120,
      departments: 28,
      programs: ["Undergraduate", "Postgraduate", "Doctoral", "Professional"],
      specializations: ["Sustainable Technology", "Engineering", "Business", "Design", "Medicine"],
      ranking: {
        national: 16,
        category: "Innovation Universities"
      }
    },
    {
      id: 15,
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