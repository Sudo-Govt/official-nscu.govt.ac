
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Microscope, Download, FileText, Dna } from 'lucide-react';

const BachelorScienceBiology = () => {
  const programOverview = {
    name: "Bachelor of Science in Biology",
    duration: "4 Years, 8 Semesters",
    totalCredits: 128,
    structure: ["Core Biology Courses", "Laboratory Work", "Research Project", "Electives"],
    assessment: "60% External Exam, 25% Laboratory Assessment, 15% Continuous Evaluation"
  };

  const semesters = [
    {
      id: "sem1",
      title: "Semester I",
      totalCredits: 16,
      contactHours: 400,
      courses: [
        {
          name: "General Biology I",
          code: "BIO101",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Cell Structure", "Biomolecules", "Cell Division", "Genetics Basics", "Evolution"],
          referenceBooks: ["Campbell Biology by Neil A. Campbell", "Biology by Raven & Johnson"],
          learningOutcomes: ["Understand cellular structure", "Explain genetic principles", "Analyze evolutionary concepts"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Quizzes"
        },
        {
          name: "General Chemistry I",
          code: "CHEM101",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Atomic Structure", "Chemical Bonding", "Stoichiometry", "Thermodynamics", "Kinetics"],
          referenceBooks: ["General Chemistry by Petrucci", "Chemistry: The Central Science by Brown"],
          learningOutcomes: ["Apply chemical principles", "Perform laboratory techniques", "Solve chemical problems"],
          assessment: "65% Exams, 25% Lab Work, 10% Assignments"
        },
        {
          name: "College Mathematics",
          code: "MATH101",
          credits: 3,
          contactHours: 90,
          breakdown: ["90 Lectures"],
          topics: ["Calculus", "Statistics", "Probability", "Linear Algebra", "Mathematical Modeling"],
          referenceBooks: ["Calculus by James Stewart", "Statistics for Life Sciences by Samuels"],
          learningOutcomes: ["Apply mathematical concepts to biology", "Analyze biological data", "Use statistical methods"],
          assessment: "70% Exams, 20% Assignments, 10% Class Tests"
        }
      ]
    },
    {
      id: "sem2",
      title: "Semester II",
      totalCredits: 16,
      contactHours: 400,
      courses: [
        {
          name: "General Biology II",
          code: "BIO102",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Plant Biology", "Animal Physiology", "Ecology", "Biodiversity", "Conservation"],
          referenceBooks: ["Campbell Biology by Neil A. Campbell", "Principles of Biology by Hillis"],
          learningOutcomes: ["Understand organism diversity", "Explain physiological processes", "Analyze ecological relationships"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Field Work"
        }
      ]
    }
  ];

  const electives = [
    { name: "Marine Biology", code: "BIO301", credits: 3, semester: "V" },
    { name: "Biotechnology", code: "BIO302", credits: 3, semester: "VI" },
    { name: "Environmental Science", code: "BIO303", credits: 3, semester: "V" },
    { name: "Bioinformatics", code: "BIO304", credits: 3, semester: "VI" }
  ];

  const skillBasedCourses = [
    {
      name: "Laboratory Techniques in Biology",
      credits: 4,
      contactHours: 100,
      topics: ["Microscopy", "Cell Culture", "DNA Extraction", "PCR Techniques", "Data Analysis"],
      referenceBooks: ["Laboratory Manual for Biology by Morgan", "Molecular Biology Techniques by Walker"]
    }
  ];

  const capstoneProject = {
    title: "B.Sc Biology Research Project",
    credits: 6,
    contactHours: 150,
    description: "Independent research project in student's area of interest under faculty supervision",
    assessment: "Report 40%, Presentation 30%, Laboratory Work 30%"
  };

  return (
    <PageLayout 
      title="Bachelor of Science in Biology - Course Nomenclature" 
      description="Comprehensive curriculum and course details"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Program Overview Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Program Overview</span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Full Nomenclature (PDF)
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Program Details</h3>
                  <div className="space-y-2">
                    <div><strong>Program Name:</strong> {programOverview.name}</div>
                    <div><strong>Duration:</strong> {programOverview.duration}</div>
                    <div><strong>Total Credits:</strong> {programOverview.totalCredits}</div>
                    <div><strong>Assessment:</strong> {programOverview.assessment}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Program Structure</h3>
                  <ul className="space-y-1">
                    {programOverview.structure.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Dna className="w-4 h-4 text-uw-purple mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester Navigation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Semester-wise Curriculum</h2>
          <Tabs defaultValue="sem1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {semesters.map((semester, index) => (
                <TabsTrigger key={semester.id} value={semester.id}>
                  Sem {index + 1}
                </TabsTrigger>
              ))}
              <TabsTrigger value="sem3">Sem III</TabsTrigger>
              <TabsTrigger value="sem4">Sem IV</TabsTrigger>
              <TabsTrigger value="sem5">Sem V</TabsTrigger>
              <TabsTrigger value="sem6">Sem VI</TabsTrigger>
              <TabsTrigger value="sem7">Sem VII</TabsTrigger>
              <TabsTrigger value="sem8">Sem VIII</TabsTrigger>
            </TabsList>

            {semesters.map((semester) => (
              <TabsContent key={semester.id} value={semester.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Microscope className="h-5 w-5 mr-2" />
                      {semester.title}
                    </CardTitle>
                    <CardDescription>
                      Total Credits: {semester.totalCredits} | Contact Hours: {semester.contactHours}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {semester.courses.map((course, courseIndex) => (
                        <AccordionItem key={courseIndex} value={`course-${courseIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex justify-between items-center w-full pr-4">
                              <span>{course.name} ({course.code})</span>
                              <Badge variant="outline">{course.credits} Credits</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                              <div>
                                <h4 className="font-semibold mb-2">Course Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div><strong>Course Code:</strong> {course.code}</div>
                                  <div><strong>Credits:</strong> {course.credits}</div>
                                  <div><strong>Contact Hours:</strong> {course.contactHours}</div>
                                  <div><strong>Breakdown:</strong> {course.breakdown.join(", ")}</div>
                                  <div><strong>Assessment:</strong> {course.assessment}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Topics Covered</h4>
                                <ul className="text-sm space-y-1">
                                  {course.topics.map((topic, topicIndex) => (
                                    <li key={topicIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-uw-purple rounded-full mr-2 mt-2"></span>
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Reference Books</h4>
                                <ul className="text-sm space-y-1">
                                  {course.referenceBooks.map((book, bookIndex) => (
                                    <li key={bookIndex} className="flex items-start">
                                      <FileText className="w-3 h-3 mr-2 mt-1 text-uw-purple" />
                                      {book}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                                <ul className="text-sm space-y-1">
                                  {course.learningOutcomes.map((outcome, outcomeIndex) => (
                                    <li key={outcomeIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2"></span>
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            {/* Placeholder content for other semesters */}
            {["sem3", "sem4", "sem5", "sem6", "sem7", "sem8"].map((semId, index) => (
              <TabsContent key={semId} value={semId} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Semester {index + 3}</CardTitle>
                    <CardDescription>Curriculum details will be available soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Detailed course information for Semester {index + 3} is being updated. 
                      Please check back later or contact the academic office for more information.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Program Electives Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Program Electives</h2>
          <Card>
            <CardHeader>
              <CardTitle>Specialized Biology Electives</CardTitle>
              <CardDescription>Advanced courses in specialized areas of biology</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Elective Name</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Semester Offered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {electives.map((elective, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{elective.name}</TableCell>
                      <TableCell>{elective.code}</TableCell>
                      <TableCell>{elective.credits}</TableCell>
                      <TableCell>{elective.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Skill-Based Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skill-Based Courses</h2>
          {skillBasedCourses.map((course, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Microscope className="h-5 w-5 mr-2" />
                  {course.name}
                </CardTitle>
                <CardDescription>{course.credits} Credits | {course.contactHours} Contact Hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Laboratory Skills</h4>
                    <ul className="space-y-1">
                      {course.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-uw-purple rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reference Materials</h4>
                    <ul className="space-y-1">
                      {course.referenceBooks.map((book, bookIndex) => (
                        <li key={bookIndex} className="flex items-start">
                          <FileText className="w-4 h-4 mr-2 mt-0.5 text-uw-purple" />
                          {book}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capstone Project Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Capstone Project (Semester VIII)</h2>
          <Card>
            <CardHeader>
              <CardTitle>{capstoneProject.title}</CardTitle>
              <CardDescription>{capstoneProject.credits} Credits | {capstoneProject.contactHours} Contact Hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Project Description</h4>
                  <p className="text-gray-600">{capstoneProject.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Assessment Breakdown</h4>
                  <p className="text-sm">{capstoneProject.assessment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apply Now Section */}
        <div className="bg-uw-purple text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg mb-6 opacity-90">
            Begin your journey in biological sciences with our comprehensive program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-uw-purple hover:bg-gray-100">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-uw-purple">
              Download Brochure
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Application deadline: January 15, 2025
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default BachelorScienceBiology;
