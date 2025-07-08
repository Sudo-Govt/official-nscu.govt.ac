import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, CheckCircle, XCircle, Users, Globe, Building, Handshake, Flag, Calendar } from 'lucide-react';

const OffshoreColleges = () => {
  const offshoreColleges = [
    {
      id: 1,
      name: "Global Horizon Institute",
      location: "Dubai, UAE",
      country: "United Arab Emirates",
      type: "International Branch Campus",
      parentCollege: "Winston Leonard Churchill College",
      established: 2018,
      status: "Active",
      director: "Dr. Ahmed Al-Rashid",
      academicDirector: "Prof. Sarah Mitchell",
      functions: {
        admissions: false,
        study: true,
        exams: true,
        paperChecking: false,
        results: false
      },
      managedBy: "Main University",
      studentCapacity: 2500,
      currentStudents: 1850,
      programs: ["MBA", "Engineering", "Computer Science", "Business Administration"],
      accreditation: "UAE Ministry of Education, KHDA",
      partnershipType: "Wholly Owned Subsidiary",
      languages: ["English", "Arabic"],
      tuitionUSD: 25000,
      localStaff: 45,
      expatStaff: 28
    },
    {
      id: 2,
      name: "Pacific Excellence University",
      location: "Singapore",
      country: "Singapore",
      type: "Partnered Offshore College",
      parentCollege: "Theodore Roosevelt University",
      established: 2020,
      status: "Active",
      director: "Dr. Lee Wei Ming",
      academicDirector: "Prof. Rajesh Kumar",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: true,
        results: false
      },
      managedBy: "Joint Management",
      studentCapacity: 3200,
      currentStudents: 2750,
      programs: ["Medicine", "Pharmacy", "Biotechnology", "Health Sciences"],
      accreditation: "Singapore Education Trust, EduTrust",
      partnershipType: "Joint Venture (60-40)",
      languages: ["English", "Mandarin", "Malay"],
      tuitionUSD: 35000,
      localStaff: 65,
      expatStaff: 42
    },
    {
      id: 3,
      name: "Atlantic Bridge College",
      location: "London, UK",
      country: "United Kingdom",
      type: "Remote Offshore Institution",
      parentCollege: "Abraham Lincoln Institute of Excellence",
      established: 2019,
      status: "Active",
      director: "Dr. James Robertson",
      academicDirector: "Prof. Priya Sharma",
      functions: {
        admissions: true,
        study: true,
        exams: false,
        paperChecking: false,
        results: false
      },
      managedBy: "Local Partner",
      studentCapacity: 1800,
      currentStudents: 1420,
      programs: ["Design", "Digital Marketing", "Finance", "International Business"],
      accreditation: "UK Visa and Immigration, Quality Assurance Agency",
      partnershipType: "Licensing Agreement",
      languages: ["English"],
      tuitionUSD: 28000,
      localStaff: 35,
      expatStaff: 18
    },
    {
      id: 4,
      name: "Maple Leaf International Campus",
      location: "Toronto, Canada",
      country: "Canada",
      type: "International Branch Campus",
      parentCollege: "John Fitzgerald Kennedy University",
      established: 2017,
      status: "Active",
      director: "Dr. Michael Thompson",
      academicDirector: "Prof. Amitabh Ghosh",
      functions: {
        admissions: false,
        study: true,
        exams: true,
        paperChecking: true,
        results: false
      },
      managedBy: "Main University",
      studentCapacity: 2200,
      currentStudents: 1950,
      programs: ["Liberal Arts", "Journalism", "Fine Arts", "Media Studies"],
      accreditation: "Ontario Universities Council, PTIB",
      partnershipType: "Direct Investment",
      languages: ["English", "French"],
      tuitionUSD: 22000,
      localStaff: 52,
      expatStaff: 31
    },
    {
      id: 5,
      name: "Sahara Excellence Institute",
      location: "Doha, Qatar",
      country: "Qatar",
      type: "Partnered Offshore College",
      parentCollege: "Franklin Delano Roosevelt College",
      established: 2021,
      status: "Active",
      director: "Dr. Fatima Al-Zahra",
      academicDirector: "Prof. Krishna Murthy",
      functions: {
        admissions: true,
        study: true,
        exams: true,
        paperChecking: false,
        results: false
      },
      managedBy: "Joint Management",
      studentCapacity: 1500,
      currentStudents: 1180,
      programs: ["Information Technology", "Cybersecurity", "Data Science", "AI & Machine Learning"],
      accreditation: "Qatar Ministry of Education, QAA",
      partnershipType: "Strategic Partnership",
      languages: ["English", "Arabic"],
      tuitionUSD: 30000,
      localStaff: 28,
      expatStaff: 22
    },
    {
      id: 6,
      name: "Southern Cross University College",
      location: "Melbourne, Australia",
      country: "Australia",
      type: "Remote Offshore Institution",
      parentCollege: "Alexander Hamilton Institute of Technology",
      established: 2022,
      status: "Active",
      director: "Dr. Emma Williams",
      academicDirector: "Prof. Rohit Gupta",
      functions: {
        admissions: true,
        study: true,
        exams: false,
        paperChecking: false,
        results: false
      },
      managedBy: "Local Partner",
      studentCapacity: 2800,
      currentStudents: 2150,
      programs: ["Engineering", "Architecture", "Construction Management", "Urban Planning"],
      accreditation: "TEQSA, Engineers Australia",
      partnershipType: "Franchise Model",
      languages: ["English"],
      tuitionUSD: 32000,
      localStaff: 68,
      expatStaff: 25
    }
  ];

  const getFunctionIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "International Branch Campus":
        return "bg-blue-100 text-blue-800";
      case "Partnered Offshore College":
        return "bg-green-100 text-green-800";
      case "Remote Offshore Institution":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalStudents = offshoreColleges.reduce((sum, college) => sum + college.currentStudents, 0);
  const totalCapacity = offshoreColleges.reduce((sum, college) => sum + college.studentCapacity, 0);
  const countries = [...new Set(offshoreColleges.map(c => c.country))].length;

  return (
    <PageLayout 
      title="Offshore Colleges" 
      description="International campuses and partner institutions expanding global education reach"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{offshoreColleges.length}</div>
              <div className="text-sm text-gray-600">Offshore Institutions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Flag className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{countries}</div>
              <div className="text-sm text-gray-600">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Current Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{Math.round((totalStudents/totalCapacity)*100)}%</div>
              <div className="text-sm text-gray-600">Capacity Utilization</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Institution Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Functional Matrix</TabsTrigger>
            <TabsTrigger value="partnerships">Partnership Models</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6">
              {offshoreColleges.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-uw-purple">{college.name}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {college.location} • Established {college.established}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={college.status === "Active" ? "default" : "destructive"}>
                          {college.status}
                        </Badge>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(college.type)}`}>
                          {college.type}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Leadership & Management */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Director:</span>
                          <div className="font-semibold">{college.director}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Academic Director:</span>
                          <div className="font-semibold">{college.academicDirector}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Managed By:</span>
                          <div className="font-semibold">{college.managedBy}</div>
                        </div>
                      </div>

                      {/* Partnership Details */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Handshake className="h-4 w-4 mr-2 text-uw-purple" />
                          Partnership Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Parent Institution:</span>
                            <div className="font-medium">{college.parentCollege}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Partnership Type:</span>
                            <div className="font-medium">{college.partnershipType}</div>
                          </div>
                        </div>
                      </div>

                      {/* Enrollment & Programs */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{college.currentStudents.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Current Students</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{college.studentCapacity.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Capacity</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{college.localStaff + college.expatStaff}</div>
                          <div className="text-sm text-gray-600">Total Staff</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-700">${college.tuitionUSD.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Annual Tuition</div>
                        </div>
                      </div>

                      {/* Programs & Languages */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Academic Programs:</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.programs.map((program, idx) => (
                              <Badge key={idx} variant="outline">{program}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Languages of Instruction:</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.languages.map((lang, idx) => (
                              <Badge key={idx} variant="secondary">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Accreditation */}
                      <div>
                        <h4 className="font-semibold mb-2">Local Accreditation:</h4>
                        <p className="text-sm text-gray-600">{college.accreditation}</p>
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
                <CardDescription>Academic and administrative functions enabled at each offshore location</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Admissions</TableHead>
                      <TableHead className="text-center">Study/Teaching</TableHead>
                      <TableHead className="text-center">Examinations</TableHead>
                      <TableHead className="text-center">Paper Checking</TableHead>
                      <TableHead className="text-center">Results</TableHead>
                      <TableHead className="text-center">Management</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offshoreColleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{college.name}</div>
                            <div className="text-sm text-gray-600">{college.type}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Flag className="h-3 w-3 mr-1" />
                            {college.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.admissions)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.study)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.exams)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.paperChecking)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(college.functions.results)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {college.managedBy}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partnerships">
            <div className="grid md:grid-cols-3 gap-6">
              {["International Branch Campus", "Partnered Offshore College", "Remote Offshore Institution"].map((type) => {
                const collegesOfType = offshoreColleges.filter(c => c.type === type);
                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="text-lg">{type}</CardTitle>
                      <CardDescription>{collegesOfType.length} institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {collegesOfType.map((college) => (
                          <div key={college.id} className="border-l-4 border-uw-purple pl-4">
                            <div className="font-semibold">{college.name}</div>
                            <div className="text-sm text-gray-600">{college.location}</div>
                            <div className="text-sm text-uw-purple">{college.partnershipType}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {college.currentStudents.toLocaleString()} students • ${college.tuitionUSD.toLocaleString()} tuition
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...new Set(offshoreColleges.map(c => c.country))].map((country) => {
                      const countryColleges = offshoreColleges.filter(c => c.country === country);
                      const countryStudents = countryColleges.reduce((sum, c) => sum + c.currentStudents, 0);
                      return (
                        <div key={country} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold flex items-center">
                              <Flag className="h-4 w-4 mr-2" />
                              {country}
                            </div>
                            <div className="text-sm text-gray-600">{countryColleges.length} institution(s)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-uw-purple">{countryStudents.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Students</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offshoreColleges
                      .sort((a, b) => b.tuitionUSD - a.tuitionUSD)
                      .map((college) => (
                        <div key={college.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{college.name}</div>
                            <div className="text-sm text-gray-600">{college.location}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">${college.tuitionUSD.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Annual Tuition</div>
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

export default OffshoreColleges;