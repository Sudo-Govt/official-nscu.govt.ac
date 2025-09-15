
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, DollarSign, Users, GraduationCap, Download, ChevronDown, FileText, Award, Cog } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const BachelorEngineering = () => {
  useSEO({
    title: "Bachelor of Engineering Program - GCHEA Accredited | NSCU Belize",
    description: "Earn your Bachelor of Engineering degree from NSCU Belize. GCHEA-accredited 4-year program with specializations in Mechanical, Electrical, Computer, Civil, Chemical Engineering. Apply by January 5th, 2026.",
    keywords: "Bachelor Engineering NSCU Belize, accredited engineering degree Belize, mechanical electrical computer engineering program, engineering admissions 2026, GCHEA engineering degree",
    canonical: "https://newstatesuniversity.lovable.app/programs/bachelor-engineering",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Bachelor of Engineering",
      "description": "Comprehensive 4-year engineering program with multiple specializations",
      "provider": {
        "@type": "University",
        "name": "New States Continental University",
        "url": "https://newstatesuniversity.lovable.app"
      },
      "educationalCredentialAwarded": "Bachelor of Engineering",
      "teaches": ["Engineering Mathematics", "Thermodynamics", "Circuit Analysis", "Materials Science", "Engineering Design"],
      "totalTime": "P4Y",
      "courseMode": "on-campus",
      "applicationDeadline": "2026-01-05",
      "startDate": "2026-01-15"
    }
  });
  const programOverview = {
    name: "Bachelor of Engineering",
    duration: "4 Years, 8 Semesters", 
    totalCredits: 120,
    structure: ["Foundation Mathematics & Sciences", "Core Engineering Courses", "Specialization Tracks", "Capstone Project"],
    assessment: "65% External Exam, 25% Laboratory Assessment, 10% Continuous Evaluation"
  };

  const semesters = [
    {
      id: "sem1",
      title: "Semester I",
      totalCredits: 15,
      contactHours: 375,
      courses: [
        {
          name: "Engineering Mathematics I",
          code: "MATH101",
          credits: 4,
          contactHours: 120,
          breakdown: ["90 Lectures", "30 Tutorials"],
          topics: ["Calculus", "Differential Equations", "Linear Algebra", "Complex Numbers", "Vector Analysis"],
          referenceBooks: ["Advanced Engineering Mathematics by Kreyszig", "Calculus by James Stewart", "Linear Algebra by Gilbert Strang"],
          learningOutcomes: ["Apply calculus to engineering problems", "Solve differential equations", "Use linear algebra in engineering contexts"],
          assessment: "70% Final Exam, 20% Mid-term, 10% Assignments"
        },
        {
          name: "Engineering Physics I",
          code: "PHYS101",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Mechanics", "Thermodynamics", "Wave Motion", "Optics", "Modern Physics"],
          referenceBooks: ["University Physics by Young & Freedman", "Physics for Scientists and Engineers by Serway"],
          learningOutcomes: ["Understand fundamental physics principles", "Apply physics to engineering systems", "Conduct laboratory experiments"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Quizzes"
        },
        {
          name: "Chemistry for Engineers",
          code: "CHEM101",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Laboratory"],
          topics: ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Kinetics", "Materials Chemistry"],
          referenceBooks: ["General Chemistry by Petrucci", "Chemistry: The Central Science by Brown"],
          learningOutcomes: ["Apply chemistry principles to materials", "Understand chemical processes", "Analyze material properties"],
          assessment: "65% Exams, 25% Lab Work, 10% Assignments"
        },
        {
          name: "Engineering Graphics & CAD",
          code: "ENG101",
          credits: 3,
          contactHours: 90,
          breakdown: ["30 Lectures", "60 CAD Lab"],
          topics: ["Technical Drawing", "Orthographic Projection", "AutoCAD", "SolidWorks", "3D Modeling"],
          referenceBooks: ["Engineering Graphics by Giesecke", "AutoCAD Manual", "SolidWorks Tutorial"],
          learningOutcomes: ["Create technical drawings", "Use CAD software proficiently", "Design 3D models"],
          assessment: "40% Project Work, 35% Lab Assignments, 25% Final Exam"
        },
        {
          name: "Introduction to Engineering",
          code: "ENG102", 
          credits: 1,
          contactHours: 30,
          breakdown: ["30 Seminars"],
          topics: ["Engineering Disciplines", "Problem Solving", "Ethics", "Communication", "Teamwork"],
          referenceBooks: ["Introduction to Engineering by Wickert", "Engineering Ethics by Martin"],
          learningOutcomes: ["Understand engineering profession", "Apply problem-solving methods", "Work effectively in teams"],
          assessment: "50% Project, 30% Presentations, 20% Participation"
        }
      ]
    },
    {
      id: "sem2", 
      title: "Semester II",
      totalCredits: 15,
      contactHours: 375,
      courses: [
        {
          name: "Engineering Mathematics II",
          code: "MATH102",
          credits: 4,
          contactHours: 120,
          breakdown: ["90 Lectures", "30 Tutorials"],
          topics: ["Multivariable Calculus", "Vector Calculus", "Fourier Series", "Laplace Transforms", "Numerical Methods"],
          referenceBooks: ["Advanced Engineering Mathematics by Kreyszig", "Numerical Methods by Chapra"],
          learningOutcomes: ["Solve multivariable problems", "Apply transforms to engineering", "Use numerical methods"],
          assessment: "70% Final Exam, 20% Mid-term, 10% Assignments"
        },
        {
          name: "Engineering Physics II", 
          code: "PHYS102",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Electricity & Magnetism", "Electromagnetic Waves", "AC/DC Circuits", "Electronic Devices", "Quantum Physics"],
          referenceBooks: ["University Physics by Young & Freedman", "Introduction to Electrodynamics by Griffiths"],
          learningOutcomes: ["Understand electromagnetic principles", "Analyze electrical circuits", "Apply quantum concepts"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Quizzes"
        },
        {
          name: "Engineering Mechanics - Statics",
          code: "ENG201",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Problem Sessions"],
          topics: ["Force Systems", "Equilibrium", "Trusses", "Friction", "Centroids", "Moments of Inertia"],
          referenceBooks: ["Engineering Mechanics: Statics by Hibbeler", "Statics by Meriam & Kraige"],
          learningOutcomes: ["Analyze static structures", "Apply equilibrium principles", "Solve truss problems"],
          assessment: "65% Exams, 25% Assignments, 10% Quizzes"
        },
        {
          name: "Materials Science",
          code: "MATL201",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Laboratory"],
          topics: ["Crystal Structure", "Phase Diagrams", "Mechanical Properties", "Metals", "Ceramics", "Polymers"],
          referenceBooks: ["Materials Science and Engineering by Callister", "Introduction to Materials Science by Shackelford"],
          learningOutcomes: ["Understand material properties", "Select appropriate materials", "Analyze material behavior"],
          assessment: "60% Final Exam, 30% Lab Reports, 10% Assignments"
        },
        {
          name: "Programming for Engineers",
          code: "CS101",
          credits: 1,
          contactHours: 45,
          breakdown: ["15 Lectures", "30 Programming Lab"],
          topics: ["C Programming", "MATLAB", "Data Structures", "Algorithms", "Engineering Applications"],
          referenceBooks: ["C Programming by Kernighan & Ritchie", "MATLAB Guide by Higham"],
          learningOutcomes: ["Program in C and MATLAB", "Solve engineering problems computationally", "Apply algorithms"],
          assessment: "50% Programming Projects, 30% Lab Work, 20% Final Exam"
        }
      ]
    }
  ];

  const specializationTracks = [
    {
      name: "Mechanical Engineering",
      courses: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Manufacturing Processes"]
    },
    {
      name: "Electrical Engineering", 
      courses: ["Circuit Analysis", "Electronics", "Power Systems", "Control Systems", "Telecommunications"]
    },
    {
      name: "Computer Engineering",
      courses: ["Digital Logic", "Computer Architecture", "Software Engineering", "Embedded Systems", "Networks"]
    },
    {
      name: "Civil Engineering",
      courses: ["Structural Analysis", "Geotechnical Engineering", "Transportation", "Water Resources", "Construction Management"]
    },
    {
      name: "Chemical Engineering",
      courses: ["Process Design", "Mass Transfer", "Chemical Reactors", "Process Control", "Environmental Engineering"]
    }
  ];

  const courseStructure = {
    semester1: [
      { code: "MATH 101", title: "Calculus I", credits: 4, contact: "4-0-0", description: "Limits, derivatives, applications of derivatives, basic integration" },
      { code: "PHYS 101", title: "Physics I (Mechanics)", credits: 4, contact: "3-0-3", description: "Kinematics, dynamics, work-energy theorem, rotational mechanics" },
      { code: "CHEM 101", title: "General Chemistry", credits: 3, contact: "3-0-0", description: "Atomic structure, chemical bonding, thermodynamics, kinetics" },
      { code: "ENG 101", title: "Engineering Graphics", credits: 3, contact: "1-0-6", description: "Technical drawing, CAD fundamentals, orthographic projections" },
      { code: "ENGL 101", title: "Technical Communication", credits: 3, contact: "3-0-0", description: "Technical writing, presentation skills, documentation" },
      { code: "CS 101", title: "Programming Fundamentals", credits: 3, contact: "2-0-3", description: "C programming, algorithms, data structures basics" }
    ],
    semester2: [
      { code: "MATH 102", title: "Calculus II", credits: 4, contact: "4-0-0", description: "Integration techniques, series, multivariable calculus introduction" },
      { code: "PHYS 102", title: "Physics II (Electricity & Magnetism)", credits: 4, contact: "3-0-3", description: "Electric fields, magnetic fields, electromagnetic induction" },
      { code: "MATH 201", title: "Differential Equations", credits: 3, contact: "3-0-0", description: "First-order ODEs, second-order linear ODEs, Laplace transforms" },
      { code: "ENG 102", title: "Engineering Mechanics - Statics", credits: 3, contact: "3-0-0", description: "Force systems, equilibrium, trusses, friction, centroids" },
      { code: "CHEM 102", title: "Chemistry Lab", credits: 1, contact: "0-0-3", description: "Laboratory experiments in general chemistry" },
      { code: "HIST 101", title: "World History", credits: 3, contact: "3-0-0", description: "Global historical perspectives and civilizations" }
    ],
    semester3: [
      { code: "MATH 301", title: "Linear Algebra", credits: 3, contact: "3-0-0", description: "Matrices, vector spaces, eigenvalues, linear transformations" },
      { code: "ENG 201", title: "Engineering Mechanics - Dynamics", credits: 3, contact: "3-0-0", description: "Kinematics and kinetics of particles and rigid bodies" },
      { code: "EE 201", title: "Circuit Analysis", credits: 4, contact: "3-0-3", description: "DC and AC circuits, network theorems, operational amplifiers" },
      { code: "MATL 201", title: "Materials Science", credits: 3, contact: "3-0-0", description: "Structure-property relationships, metals, ceramics, polymers" },
      { code: "STAT 201", title: "Engineering Statistics", credits: 3, contact: "3-0-0", description: "Probability, distributions, hypothesis testing, regression" },
      { code: "ECON 101", title: "Engineering Economics", credits: 3, contact: "3-0-0", description: "Time value of money, economic analysis of engineering projects" }
    ],
    semester4: [
      { code: "ME 201", title: "Thermodynamics", credits: 3, contact: "3-0-0", description: "Laws of thermodynamics, entropy, cycles, phase equilibrium" },
      { code: "ME 202", title: "Fluid Mechanics", credits: 3, contact: "3-0-0", description: "Fluid statics, conservation laws, viscous flow, turbulence" },
      { code: "EE 202", title: "Electronics", credits: 4, contact: "3-0-3", description: "Diodes, transistors, amplifiers, digital logic circuits" },
      { code: "CS 201", title: "Data Structures", credits: 3, contact: "2-0-3", description: "Arrays, linked lists, stacks, queues, trees, graphs" },
      { code: "ENG 301", title: "Engineering Design", credits: 3, contact: "1-0-6", description: "Design process, CAD/CAM, prototyping, project management" },
      { code: "PHIL 101", title: "Engineering Ethics", credits: 2, contact: "2-0-0", description: "Professional ethics, social responsibility, case studies" }
    ]
  };

  const admissionRequirements = [
    "High School Diploma with minimum 85% aggregate",
    "Strong background in Mathematics and Physics",
    "SAT score of 1200+ or equivalent standardized test",
    "English proficiency (TOEFL 80+ for international students)",
    "Personal statement and recommendation letters"
  ];

  const careerOpportunities = [
    "Design Engineer", "Project Manager", "Research & Development",
    "Quality Assurance Engineer", "Manufacturing Engineer", "Consulting Engineer",
    "Systems Analyst", "Technical Sales Engineer", "Patent Engineer"
  ];

  return (
    <PageLayout 
      title="Bachelor of Engineering" 
      description="Comprehensive 4-year engineering program preparing students for diverse engineering careers"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Program Overview */}
        <div className="mb-8">
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
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">Credit Hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Degree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">B.Eng</div>
                <p className="text-xs text-muted-foreground">ABET Accredited</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Structure */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Course Structure</h3>
              
              {/* Semester 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Semester 1 (First Year)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.semester1.map((course, index) => (
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

              {/* Semester 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Semester 2 (First Year)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.semester2.map((course, index) => (
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

              {/* Continue with remaining semesters... */}
              <Card>
                <CardHeader>
                  <CardTitle>Remaining Semesters (3-8)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Semesters 3-8 include specialized courses in your chosen engineering discipline 
                    (Mechanical, Electrical, Computer, Civil, Chemical, or Aerospace), advanced mathematics, 
                    design projects, internships, and a capstone senior project.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
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
                <CardTitle>Career Opportunities</CardTitle>
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
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee (per semester)</span>
                    <span className="font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$34,500</span>
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

export default BachelorEngineering;
