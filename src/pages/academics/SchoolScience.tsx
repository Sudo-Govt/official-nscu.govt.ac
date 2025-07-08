
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Users, Award, Microscope, Calculator, Atom, FlaskConical, Dna, TreePine, Brain, Clock, Target, Star, Beaker } from 'lucide-react';

const SchoolScience = () => {
  const departments = [
    { 
      name: "Biology", 
      students: 850, 
      majors: 8, 
      research: "$4.2M", 
      faculty: 45,
      programs: ["Molecular Biology", "Ecology", "Marine Biology", "Biotechnology", "Pre-Medicine", "Bioinformatics", "Conservation Biology", "Physiology"],
      topCourses: ["Cell Biology", "Genetics", "Organic Chemistry", "Evolution", "Ecology"],
      careerPaths: ["Research Scientist", "Medical Doctor", "Biotechnologist", "Environmental Consultant", "Academic Professor"],
      avgSalary: "$65,000"
    },
    { 
      name: "Chemistry", 
      students: 420, 
      majors: 5, 
      research: "$3.8M", 
      faculty: 32,
      programs: ["Analytical Chemistry", "Organic Chemistry", "Physical Chemistry", "Biochemistry", "Materials Chemistry"],
      topCourses: ["General Chemistry", "Organic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Quantum Chemistry"],
      careerPaths: ["Chemical Engineer", "Pharmaceutical Scientist", "Quality Control Analyst", "Research Chemist", "Patent Attorney"],
      avgSalary: "$70,000"
    },
    { 
      name: "Physics", 
      students: 280, 
      majors: 4, 
      research: "$5.1M", 
      faculty: 28,
      programs: ["Theoretical Physics", "Applied Physics", "Astrophysics", "Quantum Physics"],
      topCourses: ["Classical Mechanics", "Electromagnetism", "Quantum Mechanics", "Thermodynamics", "Mathematical Physics"],
      careerPaths: ["Research Physicist", "Data Scientist", "Engineering Physicist", "Science Teacher", "Patent Examiner"],
      avgSalary: "$85,000"
    },
    { 
      name: "Mathematics", 
      students: 380, 
      majors: 6, 
      research: "$2.1M", 
      faculty: 35,
      programs: ["Pure Mathematics", "Applied Mathematics", "Statistics", "Actuarial Science", "Mathematics Education", "Financial Mathematics"],
      topCourses: ["Calculus", "Linear Algebra", "Differential Equations", "Real Analysis", "Probability Theory"],
      careerPaths: ["Data Analyst", "Actuary", "Software Developer", "Math Teacher", "Quantitative Analyst"],
      avgSalary: "$75,000"
    },
    { 
      name: "Computer Science", 
      students: 640, 
      majors: 5, 
      research: "$6.2M", 
      faculty: 35,
      programs: ["Software Engineering", "Artificial Intelligence", "Cybersecurity", "Data Science", "Human-Computer Interaction"],
      topCourses: ["Programming Fundamentals", "Data Structures", "Algorithms", "Software Engineering", "Machine Learning"],
      careerPaths: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst", "Product Manager", "Research Scientist"],
      avgSalary: "$95,000"
    },
    { 
      name: "Environmental Science", 
      students: 320, 
      majors: 3, 
      research: "$2.9M", 
      faculty: 22,
      programs: ["Environmental Chemistry", "Climate Science", "Conservation Biology"],
      topCourses: ["Environmental Chemistry", "Ecology", "Climate Science", "Environmental Policy", "GIS Applications"],
      careerPaths: ["Environmental Consultant", "Climate Researcher", "Conservation Scientist", "Environmental Policy Analyst", "Sustainability Coordinator"],
      avgSalary: "$60,000"
    },
    { 
      name: "Psychology", 
      students: 920, 
      majors: 4, 
      research: "$2.8M", 
      faculty: 38,
      programs: ["Clinical Psychology", "Cognitive Psychology", "Developmental Psychology", "Social Psychology"],
      topCourses: ["General Psychology", "Research Methods", "Statistics", "Cognitive Psychology", "Abnormal Psychology"],
      careerPaths: ["Clinical Psychologist", "Counselor", "Research Psychologist", "Human Resources Specialist", "Market Research Analyst"],
      avgSalary: "$58,000"
    },
    { 
      name: "Statistics", 
      students: 195, 
      majors: 3, 
      research: "$1.4M", 
      faculty: 18,
      programs: ["Applied Statistics", "Biostatistics", "Mathematical Statistics"],
      topCourses: ["Statistical Methods", "Probability Theory", "Regression Analysis", "Experimental Design", "Data Mining"],
      careerPaths: ["Statistician", "Data Analyst", "Biostatistician", "Market Research Analyst", "Operations Research Analyst"],
      avgSalary: "$80,000"
    },
    { 
      name: "Geology", 
      students: 165, 
      majors: 2, 
      research: "$1.8M", 
      faculty: 16,
      programs: ["Geological Sciences", "Environmental Geology"],
      topCourses: ["Physical Geology", "Mineralogy", "Petrology", "Structural Geology", "Hydrogeology"],
      careerPaths: ["Geologist", "Environmental Consultant", "Mining Engineer", "Petroleum Geologist", "Science Teacher"],
      avgSalary: "$72,000"
    },
    { 
      name: "Astronomy", 
      students: 125, 
      majors: 2, 
      research: "$2.2M", 
      faculty: 12,
      programs: ["Astrophysics", "Planetary Science"],
      topCourses: ["Introduction to Astronomy", "Astrophysics", "Planetary Science", "Stellar Astronomy", "Cosmology"],
      careerPaths: ["Astronomer", "Data Scientist", "Planetarium Director", "Science Educator", "Aerospace Engineer"],
      avgSalary: "$90,000"
    },
    { 
      name: "Biochemistry", 
      students: 240, 
      majors: 3, 
      research: "$2.6M", 
      faculty: 20,
      programs: ["Molecular Biochemistry", "Medical Biochemistry", "Structural Biology"],
      topCourses: ["General Biochemistry", "Molecular Biology", "Enzymology", "Protein Chemistry", "Metabolic Pathways"],
      careerPaths: ["Biochemist", "Medical Scientist", "Pharmaceutical Researcher", "Biotechnologist", "Clinical Laboratory Scientist"],
      avgSalary: "$78,000"
    },
    { 
      name: "Neuroscience", 
      students: 185, 
      majors: 2, 
      research: "$3.1M", 
      faculty: 16,
      programs: ["Cellular Neuroscience", "Cognitive Neuroscience"],
      topCourses: ["Introduction to Neuroscience", "Neuroanatomy", "Neurophysiology", "Cognitive Neuroscience", "Behavioral Neuroscience"],
      careerPaths: ["Neuroscientist", "Medical Researcher", "Neuropsychologist", "Pharmaceutical Researcher", "Academic Professor"],
      avgSalary: "$82,000"
    }
  ];

  const sampleCourseDetails = {
    course: "Advanced Organic Chemistry (CHEM 485)",
    credits: 4,
    prerequisites: "CHEM 231, CHEM 232, CHEM 241",
    description: "Advanced study of organic reaction mechanisms, stereochemistry, and synthetic methodology with emphasis on modern organic synthesis.",
    learningOutcomes: [
      "Apply advanced mechanistic principles to predict reaction outcomes",
      "Design multi-step synthetic routes to complex organic molecules",
      "Analyze stereochemical relationships in organic transformations",
      "Evaluate literature synthetic methods and propose improvements"
    ],
    topics: [
      "Advanced Reaction Mechanisms and Kinetics",
      "Stereochemistry and Conformational Analysis",
      "Organometallic Chemistry and Catalysis",
      "Modern Synthetic Methods and Strategy",
      "Natural Product Synthesis",
      "Protecting Group Chemistry",
      "Asymmetric Synthesis",
      "Spectroscopic Analysis and Structure Determination"
    ],
    assessment: "35% Midterm Exams, 25% Final Exam, 25% Research Project, 15% Problem Sets",
    textbooks: [
      "Clayden et al. - Organic Chemistry (2nd Edition)",
      "March - Advanced Organic Chemistry (7th Edition)",
      "Warren & Wyatt - Organic Synthesis: The Disconnection Approach"
    ],
    labComponent: {
      credits: 1,
      hours: "3 hours/week",
      experiments: ["Multi-step Synthesis", "Catalytic Reactions", "Spectroscopic Analysis", "Literature Synthesis"]
    }
  };

  const facultyHighlights = [
    { name: "Dr. Elena Petrov", specialty: "Quantum Computing", credentials: "MIT PhD, Google Research Alumni", research: "Quantum Algorithm Development", awards: "NSF CAREER Award 2023", publications: 85 },
    { name: "Dr. Marcus Johnson", specialty: "Cancer Biology", credentials: "Stanford MD/PhD", research: "Tumor Immunotherapy", awards: "NIH New Innovator Award", publications: 120 },
    { name: "Dr. Sarah Chen", specialty: "Climate Modeling", credentials: "Caltech PhD, NOAA Fellow", research: "Arctic Climate Change", awards: "AGU Early Career Award", publications: 75 },
    { name: "Dr. David Rodriguez", specialty: "Machine Learning", credentials: "Carnegie Mellon PhD, Apple Research", research: "Computer Vision", awards: "IEEE Outstanding Paper", publications: 95 },
    { name: "Dr. Lisa Wang", specialty: "Neuroscience", credentials: "Harvard PhD, Broad Institute", research: "Brain-Computer Interfaces", awards: "Sloan Research Fellowship", publications: 110 },
    { name: "Dr. Ahmed Hassan", specialty: "Materials Chemistry", credentials: "UC Berkeley PhD, LBNL Postdoc", research: "Solar Cell Technology", awards: "DOE Early Career Award", publications: 90 }
  ];

  const researchCenters = [
    { name: "Center for Molecular Biology", focus: "Genomics & Proteomics", funding: "$8.5M" },
    { name: "Materials Science Institute", focus: "Nanotechnology Research", funding: "$12.2M" },
    { name: "Behavioral Research Center", focus: "Cognitive Psychology", funding: "$4.6M" },
    { name: "Environmental Research Station", focus: "Climate Change Studies", funding: "$6.1M" },
    { name: "Observatory & Planetarium", focus: "Astrophysics Research", funding: "$3.4M" },
    { name: "Computational Science Lab", focus: "High-Performance Computing", funding: "$5.8M" },
    { name: "Quantum Research Institute", focus: "Quantum Computing & Physics", funding: "$7.2M" },
    { name: "Biomedical Engineering Center", focus: "Medical Device Innovation", funding: "$4.9M" }
  ];

  const programs = [
    { name: "Pre-Medical Track", type: "Undergraduate", students: 380, acceptance: "85%" },
    { name: "Pre-Dental Track", type: "Undergraduate", students: 120, acceptance: "82%" },
    { name: "Research Scholars", type: "Undergraduate", students: 180, funded: "100%" },
    { name: "Computational Science", type: "Graduate", students: 95, placement: "98%" },
    { name: "Data Science Certificate", type: "All Levels", students: 240, industry: "94%" },
    { name: "Environmental Field Studies", type: "Undergraduate", students: 85, hands_on: "100%" }
  ];

  return (
    <PageLayout 
      title="School of Science" 
      description="Advancing scientific discovery through rigorous research and innovative education"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">4,720</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">12</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">45+</div>
              <div className="text-sm text-gray-600">Degree Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">$42M</div>
              <div className="text-sm text-gray-600">Research Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Scientific Discovery</h2>
            <p className="text-gray-600 mb-6">
              The School of Science is at the forefront of scientific research and education, 
              offering comprehensive programs across the natural sciences, mathematics, and 
              computational sciences. Our faculty and students engage in cutting-edge research 
              that addresses society's most pressing challenges.
            </p>
            <p className="text-gray-600 mb-6">
              From fundamental research in physics and chemistry to applied work in environmental 
              science and computer science, our programs prepare students for careers in research, 
              industry, healthcare, and education while fostering the analytical thinking and 
              problem-solving skills essential for scientific innovation.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm">Graduate School Acceptance</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">12:1</div>
                <div className="text-sm">Student-Faculty Ratio</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <FlaskConical className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">State-of-the-Art Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Modern research facilities with cutting-edge equipment and instrumentation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calculator className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Computational Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  High-performance computing clusters and advanced data analysis capabilities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TreePine className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Field Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Field stations and outdoor laboratories for environmental and geological studies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Departments</h2>
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Department Overview</TabsTrigger>
              <TabsTrigger value="programs">Degree Programs</TabsTrigger>
              <TabsTrigger value="curriculum">Sample Curriculum</TabsTrigger>
              <TabsTrigger value="faculty">Faculty Excellence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-uw-purple">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Students:</span>
                            <div className="font-semibold">{dept.students}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Programs:</span>
                            <div className="font-semibold">{dept.majors}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Research:</span>
                            <div className="font-semibold">{dept.research}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Faculty:</span>
                            <div className="font-semibold">{dept.faculty}</div>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Avg Starting Salary:</span>
                          <div className="font-semibold text-green-600">{dept.avgSalary}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Top Career Paths:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dept.careerPaths.slice(0, 3).map((career, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{career}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="programs">
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{dept.name} Department</CardTitle>
                      <CardDescription>{dept.students} students • {dept.majors} degree programs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Degree Programs</h4>
                          <div className="space-y-2">
                            {dept.programs.map((program, i) => (
                              <div key={i} className="flex items-center">
                                <Target className="h-3 w-3 mr-2 text-uw-purple" />
                                <span className="text-sm">{program}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Core Courses</h4>
                          <div className="space-y-2">
                            {dept.topCourses.map((course, i) => (
                              <div key={i} className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-2 text-uw-purple" />
                                <span className="text-sm">{course}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Course: Advanced Organic Chemistry</CardTitle>
                  <CardDescription>Example of rigorous science curriculum standards across all departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Course Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Course:</span> {sampleCourseDetails.course}</div>
                          <div><span className="font-medium">Credits:</span> {sampleCourseDetails.credits}</div>
                          <div><span className="font-medium">Prerequisites:</span> {sampleCourseDetails.prerequisites}</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{sampleCourseDetails.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                        <ul className="text-sm space-y-1">
                          {sampleCourseDetails.learningOutcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-uw-purple mr-2">•</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Course Topics</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {sampleCourseDetails.topics.map((topic, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <Beaker className="h-3 w-3 mr-2 text-uw-purple" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Assessment Methods</h4>
                        <p className="text-sm text-gray-600">{sampleCourseDetails.assessment}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Required Textbooks</h4>
                        <ul className="text-sm space-y-1">
                          {sampleCourseDetails.textbooks.map((book, i) => (
                            <li key={i} className="text-gray-600">• {book}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Laboratory Component</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Credits:</span> {sampleCourseDetails.labComponent.credits}
                          </div>
                          <div>
                            <span className="font-medium">Hours:</span> {sampleCourseDetails.labComponent.hours}
                          </div>
                          <div>
                            <span className="font-medium">Experiments:</span> {sampleCourseDetails.labComponent.experiments.length}
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-medium text-sm">Lab Experiments:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sampleCourseDetails.labComponent.experiments.map((exp, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{exp}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faculty">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyHighlights.map((faculty, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{faculty.name}</CardTitle>
                      <CardDescription>{faculty.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                          <span className="text-sm">{faculty.credentials}</span>
                        </div>
                        <div className="flex items-start">
                          <Microscope className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                          <span className="text-sm">{faculty.research}</span>
                        </div>
                        <div className="flex items-start">
                          <Award className="h-4 w-4 mr-2 text-uw-gold mt-0.5" />
                          <span className="text-sm font-medium">{faculty.awards}</span>
                        </div>
                        <div className="flex items-start">
                          <Star className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                          <span className="text-sm">{faculty.publications} Publications</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Research Centers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Research Centers & Institutes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchCenters.map((center, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{center.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">{center.focus}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Funding:</span>
                    <Badge variant="outline" className="text-xs">{center.funding}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Special Programs & Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Participants:</span>
                      <span className="font-semibold">{program.students}</span>
                    </div>
                    {program.acceptance && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate:</span>
                        <span className="font-semibold text-green-600">{program.acceptance}</span>
                      </div>
                    )}
                    {program.funded && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Funded:</span>
                        <span className="font-semibold text-green-600">{program.funded}</span>
                      </div>
                    )}
                    {program.placement && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Placement:</span>
                        <span className="font-semibold text-green-600">{program.placement}</span>
                      </div>
                    )}
                    {program.industry && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Industry Rate:</span>
                        <span className="font-semibold text-green-600">{program.industry}</span>
                      </div>
                    )}
                    {program.hands_on && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Field Work:</span>
                        <span className="font-semibold text-green-600">{program.hands_on}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Success */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Scientific Achievement</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <Dna className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Papers</h3>
              <p className="text-2xl font-bold text-uw-purple">850+</p>
              <p className="text-sm text-gray-600">Published annually</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patents</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">In past 3 years</p>
            </div>
            <div className="text-center">
              <Atom className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Lab Courses</h3>
              <p className="text-2xl font-bold text-uw-purple">120+</p>
              <p className="text-sm text-gray-600">Hands-on experiences</p>
            </div>
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Projects</h3>
              <p className="text-2xl font-bold text-uw-purple">580+</p>
              <p className="text-sm text-gray-600">Undergraduate research</p>
            </div>
            <div className="text-center">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Industry Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">85+</p>
              <p className="text-sm text-gray-600">Active collaborations</p>
            </div>
          </div>
        </div>

        {/* Alumni Impact */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">18,500+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">Leading scientific innovation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-lg">Nobel Laureates</div>
              <p className="text-sm opacity-90 mt-2">Among faculty and alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$135K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolScience;
