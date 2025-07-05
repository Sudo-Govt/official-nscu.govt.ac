
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Clock, BookOpen, Users } from 'lucide-react';

const CollegeEducation = () => {
  const courseStructure = {
    year1: {
      semester1: [
        { code: "EDU 101", title: "Foundations of Education", credits: 3, contact: "3-0-0", description: "Historical, philosophical, and sociological foundations of education" },
        { code: "PSY 101", title: "Educational Psychology", credits: 3, contact: "3-0-0", description: "Learning theories, cognitive development, motivation" },
        { code: "ENG 101", title: "English Composition", credits: 3, contact: "3-0-0", description: "Academic writing, research skills, communication" },
        { code: "MATH 101", title: "Mathematics for Teachers", credits: 3, contact: "3-0-0", description: "Mathematical concepts and problem-solving for educators" },
        { code: "SCI 101", title: "Science for Elementary Teachers", credits: 3, contact: "2-0-3", description: "Inquiry-based science instruction methods" },
        { code: "PE 101", title: "Health & Physical Education", credits: 2, contact: "1-0-3", description: "Physical fitness, health education, sports pedagogy" }
      ],
      semester2: [
        { code: "EDU 102", title: "Human Development", credits: 3, contact: "3-0-0", description: "Child and adolescent development theories and applications" },
        { code: "EDU 103", title: "Classroom Management", credits: 3, contact: "3-0-0", description: "Behavior management strategies, positive learning environments" },
        { code: "HIST 101", title: "World History", credits: 3, contact: "3-0-0", description: "Global historical perspectives for social studies education" },
        { code: "ART 101", title: "Arts Integration", credits: 3, contact: "1-0-6", description: "Visual arts, music, drama in educational contexts" },
        { code: "TECH 101", title: "Educational Technology", credits: 3, contact: "2-0-3", description: "Digital tools, online learning, technology integration" },
        { code: "EDU 104", title: "Field Experience I", credits: 1, contact: "0-0-3", description: "Classroom observation and assistance" }
      ]
    },
    year2: {
      semester3: [
        { code: "EDU 201", title: "Curriculum & Instruction", credits: 4, contact: "3-0-3", description: "Curriculum design, lesson planning, instructional strategies" },
        { code: "EDU 202", title: "Assessment & Evaluation", credits: 3, contact: "3-0-0", description: "Formative and summative assessment, data analysis" },
        { code: "SPED 201", title: "Special Education Foundations", credits: 3, contact: "3-0-0", description: "Inclusive education, learning disabilities, accommodations" },
        { code: "READ 201", title: "Reading & Literacy Methods", credits: 4, contact: "3-0-3", description: "Phonics, comprehension, literacy development" },
        { code: "MATH 201", title: "Mathematics Methods", credits: 3, contact: "2-0-3", description: "Teaching mathematics concepts and problem-solving" },
        { code: "EDU 203", title: "Field Experience II", credits: 2, contact: "0-0-6", description: "Teaching assistance and small group instruction" }
      ],
      semester4: [
        { code: "EDU 204", title: "Social Studies Methods", credits: 3, contact: "2-0-3", description: "Geography, civics, history instruction strategies" },
        { code: "SCI 201", title: "Science Methods", credits: 3, contact: "2-0-3", description: "Hands-on science teaching, STEM integration" },
        { code: "EDU 205", title: "Multicultural Education", credits: 3, contact: "3-0-0", description: "Cultural diversity, equity, inclusive practices" },
        { code: "EDU 206", title: "Parent & Community Relations", credits: 2, contact: "2-0-0", description: "Family engagement, community partnerships" },
        { code: "ELL 201", title: "English Language Learners", credits: 3, contact: "3-0-0", description: "Second language acquisition, ESL strategies" },
        { code: "EDU 207", title: "Field Experience III", credits: 3, contact: "0-0-9", description: "Lead teaching responsibilities" }
      ]
    },
    year3: {
      semester5: [
        { code: "EDU 301", title: "Advanced Instructional Methods", credits: 3, contact: "2-0-3", description: "Differentiated instruction, learning styles, adaptation" },
        { code: "EDU 302", title: "Educational Research", credits: 3, contact: "3-0-0", description: "Action research, data collection, evidence-based practice" },
        { code: "EDU 303", title: "School Law & Ethics", credits: 2, contact: "2-0-0", description: "Education law, professional ethics, policy" },
        { code: "EDU 304", title: "Leadership in Education", credits: 3, contact: "3-0-0", description: "Teacher leadership, mentoring, professional development" },
        { code: "ELEC 301", title: "Specialization Elective", credits: 3, contact: "3-0-0", description: "Choose focus area: Early Childhood, Elementary, Secondary" },
        { code: "EDU 305", title: "Pre-Student Teaching", credits: 4, contact: "0-0-12", description: "Extended classroom experience and planning" }
      ],
      semester6: [
        { code: "EDU 401", title: "Student Teaching Seminar", credits: 2, contact: "2-0-0", description: "Reflection, professional development, job preparation" },
        { code: "EDU 402", title: "Student Teaching", credits: 12, contact: "0-0-36", description: "Full-time teaching under supervision" },
        { code: "EDU 403", title: "Portfolio Development", credits: 2, contact: "1-0-3", description: "Teaching portfolio, certification preparation" },
        { code: "EDU 404", title: "Capstone Project", credits: 2, contact: "1-0-3", description: "Independent research or curriculum project" }
      ]
    }
  };

  const admissionRequirements = [
    "High School Diploma with minimum 3.0 GPA",
    "SAT score of 1100+ or ACT score of 24+",
    "Background check and clearances",
    "Personal statement about commitment to teaching",
    "Two letters of recommendation",
    "Interview with education faculty"
  ];

  const careerOpportunities = [
    "Elementary School Teacher", "Middle School Teacher", "High School Teacher",
    "Special Education Teacher", "Reading Specialist", "Curriculum Coordinator",
    "Instructional Coach", "Educational Administrator", "Corporate Trainer",
    "Educational Consultant", "After-School Program Director", "Private Tutor"
  ];

  return (
    <PageLayout 
      title="College of Education - Bachelor of Education" 
      description="Comprehensive teacher preparation program leading to initial teaching certification"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4 Years</div>
              <p className="text-xs text-muted-foreground">8 Semesters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">Credit Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B.Ed</div>
              <p className="text-xs text-muted-foreground">CAEP Accredited</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Bachelor of Education Curriculum</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    First Year - Semester 1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.semester1.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-P)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-uw-purple">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>First Year - Semester 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.semester2.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-P)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-uw-purple">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Years (2-4)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Years 2-4 include advanced methods courses, specialization tracks (Early Childhood, 
                    Elementary, or Secondary), extensive field experiences, and culminate in a full 
                    semester of student teaching with mentoring support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>B.Ed Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {admissionRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-uw-purple rounded-full mt-2"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Education Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerOpportunities.map((career, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {career}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>B.Ed Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Teaching Fee</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Field Experience Fee</span>
                    <span className="font-bold">$800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$18,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default CollegeEducation;
