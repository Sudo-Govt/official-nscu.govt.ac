import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, CheckCircle, XCircle, Users, BookOpen, Building, Phone, Mail, Calendar } from 'lucide-react';

const StudyCenters = () => {
  const studyCenters = [
    {
      id: 1,
      name: "Eastline Study Center",
      location: "Bhopal, Madhya Pradesh",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Dr. Rahul Sharma",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 350,
      currentStudents: 285,
      programs: ["MBA Distance", "BBA", "Computer Applications", "English Literature"],
      facilities: ["Computer Lab", "Library", "Conference Room", "Exam Hall"],
      operatingHours: "9:00 AM - 7:00 PM",
      contactEmail: "eastline.bhopal@nscu.edu",
      contactPhone: "+91-755-2345678",
      weeklySchedule: {
        "Monday": "Counseling Sessions, Material Distribution",
        "Tuesday": "Computer Lab Sessions, Online Classes",
        "Wednesday": "Library Access, Study Groups",
        "Thursday": "Examination Conduct, Academic Support",
        "Friday": "Career Guidance, Project Mentoring",
        "Saturday": "Weekend Classes, Special Workshops"
      }
    },
    {
      id: 2,
      name: "Northern Hills Learning Hub",
      location: "Shimla, Himachal Pradesh",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Prof. Anjali Thakur",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: false
      },
      capacity: 200,
      currentStudents: 165,
      programs: ["Engineering Distance", "Management Studies", "Information Technology"],
      facilities: ["Smart Classroom", "Exam Center", "Student Lounge"],
      operatingHours: "10:00 AM - 6:00 PM",
      contactEmail: "northernhills.shimla@nscu.edu",
      contactPhone: "+91-177-2876543",
      weeklySchedule: {
        "Monday": "Academic Counseling, Course Registration",
        "Tuesday": "Practical Sessions, Lab Work",
        "Wednesday": "Student Support Services",
        "Thursday": "Examination Activities",
        "Friday": "Project Reviews, Industry Interaction",
        "Saturday": "Skills Development Programs"
      }
    },
    {
      id: 3,
      name: "Desert Oasis Education Center",
      location: "Bikaner, Rajasthan",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Kiran Gupta",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: false,
        libraryAccess: true
      },
      capacity: 280,
      currentStudents: 245,
      programs: ["Agriculture Studies", "Rural Development", "Commerce", "Arts"],
      facilities: ["Digital Library", "Exam Hall", "Agriculture Lab", "Conference Room"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "desertoasis.bikaner@nscu.edu",
      contactPhone: "+91-151-2567890",
      weeklySchedule: {
        "Monday": "Course Material Distribution",
        "Tuesday": "Agricultural Practical Sessions",
        "Wednesday": "Digital Library Access, Research Support",
        "Thursday": "Examination Conduct",
        "Friday": "Rural Development Projects",
        "Saturday": "Community Outreach Programs"
      }
    },
    {
      id: 4,
      name: "Coastal Knowledge Point",
      location: "Mangalore, Karnataka",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Deepa Nair",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: true
      },
      capacity: 320,
      currentStudents: 278,
      programs: ["Information Technology", "Business Studies", "Marine Biology", "Coastal Management"],
      facilities: ["IT Lab", "Marine Research Unit", "Study Halls", "Video Conferencing"],
      operatingHours: "9:00 AM - 8:00 PM",
      contactEmail: "coastal.mangalore@nscu.edu",
      contactPhone: "+91-824-2890123",
      weeklySchedule: {
        "Monday": "IT Practical Sessions",
        "Tuesday": "Marine Biology Field Work",
        "Wednesday": "Business Case Studies",
        "Thursday": "Research Methodology Sessions",
        "Friday": "Industry Connect Programs",
        "Saturday": "Special Marine Expeditions"
      }
    },
    {
      id: 5,
      name: "Valley View Learning Center",
      location: "Srinagar, Jammu & Kashmir",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Dr. Omar Abdullah",
      established: 2022,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 150,
      currentStudents: 125,
      programs: ["Fine Arts", "Journalism", "Cultural Studies", "Tourism Management"],
      facilities: ["Art Studio", "Media Lab", "Cultural Archive", "Exhibition Hall"],
      operatingHours: "10:00 AM - 5:00 PM",
      contactEmail: "valleyview.srinagar@nscu.edu",
      contactPhone: "+91-194-2234567",
      weeklySchedule: {
        "Monday": "Fine Arts Workshops",
        "Tuesday": "Journalism Practical Training",
        "Wednesday": "Cultural Documentation Projects",
        "Thursday": "Tourism Industry Sessions",
        "Friday": "Creative Writing Workshops",
        "Saturday": "Cultural Events and Exhibitions"
      }
    },
    {
      id: 6,
      name: "Plateau Learning Solutions",
      location: "Ranchi, Jharkhand",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Prof. Sunita Singh",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: false
      },
      capacity: 250,
      currentStudents: 210,
      programs: ["Engineering Support", "Technology Courses", "Mining Studies", "Environmental Science"],
      facilities: ["Technical Workshop", "Mining Simulator", "Environmental Lab", "Skill Development Center"],
      operatingHours: "9:00 AM - 6:00 PM",
      contactEmail: "plateau.ranchi@nscu.edu",
      contactPhone: "+91-651-2345678",
      weeklySchedule: {
        "Monday": "Engineering Practical Sessions",
        "Tuesday": "Mining Technology Training",
        "Wednesday": "Environmental Studies Field Work",
        "Thursday": "Technical Skill Development",
        "Friday": "Industry Collaboration Programs",
        "Saturday": "Regional Development Projects"
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

  const totalCapacity = studyCenters.reduce((sum, center) => sum + center.capacity, 0);
  const totalStudents = studyCenters.reduce((sum, center) => sum + center.currentStudents, 0);
  const averageUtilization = Math.round((totalStudents / totalCapacity) * 100);
  const activeCenters = studyCenters.filter(c => c.status === "Active").length;

  return (
    <PageLayout 
      title="Study Centers" 
      description="Local support centers providing educational services and student assistance across various regions"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{activeCenters}</div>
              <div className="text-sm text-gray-600">Active Centers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Students Served</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalCapacity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Capacity</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{averageUtilization}%</div>
              <div className="text-sm text-gray-600">Avg Utilization</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Center Overview</TabsTrigger>
            <TabsTrigger value="services">Services Matrix</TabsTrigger>
            <TabsTrigger value="schedule">Weekly Schedules</TabsTrigger>
            <TabsTrigger value="contact">Contact Directory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-uw-purple">{center.name}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {center.location} • Established {center.established}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={center.status === "Active" ? "default" : "destructive"}>
                          {center.status}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {Math.round((center.currentStudents / center.capacity) * 100)}% Utilized
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Coordinator:</span>
                          <div className="font-semibold">{center.coordinator}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Linked to:</span>
                          <div className="font-semibold text-uw-purple">{center.linkedCollege}</div>
                        </div>
                      </div>

                      {/* Capacity & Enrollment */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{center.currentStudents}</div>
                          <div className="text-sm text-gray-600">Current Students</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{center.capacity}</div>
                          <div className="text-sm text-gray-600">Total Capacity</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{center.operatingHours}</div>
                          <div className="text-sm text-gray-600">Operating Hours</div>
                        </div>
                      </div>

                      {/* Programs & Facilities */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Programs Supported:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.programs.map((program, idx) => (
                              <Badge key={idx} variant="outline">{program}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Facilities Available:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.facilities.map((facility, idx) => (
                              <Badge key={idx} variant="secondary">{facility}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                          Contact Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{center.contactEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{center.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services & Capabilities Matrix</CardTitle>
                <CardDescription>Services offered at each study center</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Study Center</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Material Distribution</TableHead>
                      <TableHead className="text-center">Student Support</TableHead>
                      <TableHead className="text-center">Exam Conduct</TableHead>
                      <TableHead className="text-center">Counseling</TableHead>
                      <TableHead className="text-center">Library Access</TableHead>
                      <TableHead className="text-center">Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studyCenters.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{center.name}</div>
                            <div className="text-sm text-gray-600">{center.coordinator}</div>
                          </div>
                        </TableCell>
                        <TableCell>{center.location}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.materialDistribution)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.studentSupport)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.examConduction)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.counseling)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.libraryAccess)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={Math.round((center.currentStudents / center.capacity) * 100) > 80 ? "destructive" : "default"}>
                            {Math.round((center.currentStudents / center.capacity) * 100)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="grid gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-uw-purple" />
                      {center.name} - Weekly Schedule
                    </CardTitle>
                    <CardDescription>{center.location} • {center.operatingHours}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(center.weeklySchedule).map(([day, activities]) => (
                        <div key={day} className="border-l-4 border-uw-purple pl-4 py-2">
                          <div className="font-semibold text-uw-purple">{day}</div>
                          <div className="text-sm text-gray-600">{activities}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <CardDescription>{center.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Coordinator:</span>
                        <div className="font-semibold">{center.coordinator}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Linked College:</span>
                        <div className="font-semibold text-uw-purple">{center.linkedCollege}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.contactEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.contactPhone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.operatingHours}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Serving {center.currentStudents} students • {Math.round((center.currentStudents / center.capacity) * 100)}% capacity
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default StudyCenters;