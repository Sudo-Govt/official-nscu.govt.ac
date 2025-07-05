import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Download, Clock, BookOpen, Users, Award } from 'lucide-react';

const MasterArtsHistory = () => {
  return (
    <PageLayout 
      title="Master of Arts in History" 
      description="A comprehensive 2-year program designed to develop advanced research and analytical skills in historical studies with specializations in various periods and regions."
    >
      <div className="container mx-auto px-4 py-8">
        {/* Program Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Program Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Program Name</h4>
                <p>Master of Arts in History</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Duration</h4>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  2 Years, 4 Semesters
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Total Credits</h4>
                <p>60 Credits</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Program Structure</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Core Historical Methods</li>
                  <li>Specialized Period/Regional Studies</li>
                  <li>Research Methods & Historiography</li>
                  <li>Master's Thesis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Assessment</h4>
                <p>60% Thesis, 30% Coursework, 10% Comprehensive Exams</p>
              </div>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Complete Curriculum (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admission Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Admission Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Application Dates</h4>
              <ul className="space-y-1">
                <li>Application Opens: October 1</li>
                <li>Application Deadline: January 15</li>
                <li>Interviews: February 15-28</li>
                <li>Results: March 31</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Program Fees</h4>
              <ul className="space-y-1">
                <li>Tuition: $15,000/year</li>
                <li>Application Fee: $50</li>
                <li>Research Fee: $300/year</li>
                <li>Total: $30,600 (2 years)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Requirements</h4>
              <ul className="space-y-1">
                <li>Bachelor's in History or related field</li>
                <li>GPA: 3.5 minimum</li>
                <li>Writing sample (15-20 pages)</li>
                <li>3 Letters of recommendation</li>
                <li>GRE scores required</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Semester Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
            <CardDescription>Detailed semester-wise breakdown of courses and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="semester1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="semester1">Semester I</TabsTrigger>
                <TabsTrigger value="semester2">Semester II</TabsTrigger>
                <TabsTrigger value="semester3">Semester III</TabsTrigger>
                <TabsTrigger value="semester4">Semester IV</TabsTrigger>
              </TabsList>

              {/* Semester I */}
              <TabsContent value="semester1" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester I</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Foundation Courses</span></div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course1">
                    <AccordionTrigger>Historical Methods and Historiography (HIST501) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Seminars, 30 Independent Research)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Historical research methodologies</li>
                          <li>Primary and secondary source analysis</li>
                          <li>Digital humanities and archival research</li>
                          <li>Major schools of historical thought</li>
                          <li>Historiographical debates and trends</li>
                          <li>Academic writing and citation methods</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>John Lewis Gaddis' "The Landscape of History"</li>
                          <li>Georg Iggers' "Historiography in the Twentieth Century"</li>
                          <li>E.H. Carr's "What is History?"</li>
                          <li>Martha Howell's "From Reliable Sources"</li>
                          <li>Selected historiographical essays</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Master historical research methodologies</li>
                          <li>Critically analyze historical arguments</li>
                          <li>Develop advanced writing skills</li>
                          <li>Understand major historiographical debates</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Research Paper 50%, Historiographical Review 30%, Class Participation 20%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course2">
                    <AccordionTrigger>Ancient and Medieval History (HIST502) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Lectures, 30 Seminars)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Ancient civilizations: Greece, Rome, Egypt</li>
                          <li>Medieval Europe: politics, society, culture</li>
                          <li>Byzantine and Islamic civilizations</li>
                          <li>Feudalism and medieval institutions</li>
                          <li>Religious movements and crusades</li>
                          <li>Medieval trade and urban development</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Christopher Wickham's "Medieval Europe"</li>
                          <li>Peter Heather's "The Fall of the Roman Empire"</li>
                          <li>R.I. Moore's "The First European Revolution"</li>
                          <li>Primary sources: Tacitus, Gregory of Tours</li>
                          <li>Selected medieval chronicles</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Analyze ancient and medieval societies</li>
                          <li>Understand historical continuity and change</li>
                          <li>Interpret primary historical sources</li>
                          <li>Develop comparative historical analysis</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Essays 60%, Source Analysis 25%, Final Exam 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course3">
                    <AccordionTrigger>Research Seminar I (HIST503) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Seminars, 15 Individual Consultation)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Developing research questions</li>
                          <li>Literature review methodology</li>
                          <li>Archival research techniques</li>
                          <li>Database and digital resource navigation</li>
                          <li>Bibliography construction</li>
                          <li>Thesis proposal development</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Wayne Booth's "The Craft of Research"</li>
                          <li>Kate Turabian's "A Manual for Writers"</li>
                          <li>Research guides and databases</li>
                          <li>Style manuals for historical writing</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Design independent research projects</li>
                          <li>Conduct systematic literature reviews</li>
                          <li>Access and evaluate historical sources</li>
                          <li>Prepare preliminary thesis proposals</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Research Proposal 60%, Literature Review 30%, Presentation 10%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Other semesters would follow similar pattern */}
              <TabsContent value="semester2" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester II</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Specialized Studies</span></div>
                  </div>
                </div>
                <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
                  Detailed course information for Semester II is being updated. Please check back later or contact the academic office for more information.
                </p>
              </TabsContent>

              <TabsContent value="semester3" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester III</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Thesis Research</span></div>
                  </div>
                </div>
                <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
                  Detailed course information for Semester III is being updated. Please check back later or contact the academic office for more information.
                </p>
              </TabsContent>

              <TabsContent value="semester4" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester IV</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Thesis Completion</span></div>
                  </div>
                </div>
                <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
                  Detailed course information for Semester IV is being updated. Please check back later or contact the academic office for more information.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Apply Now Section */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-uw-purple hover:bg-uw-purple/90">
            <Award className="h-5 w-5 mr-2" />
            Apply Now for MA History Program
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MasterArtsHistory;
