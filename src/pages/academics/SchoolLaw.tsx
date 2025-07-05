
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Clock, BookOpen, GraduationCap } from 'lucide-react';

const SchoolLaw = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "LAW 101", title: "Constitutional Law I", credits: 4, contact: "4-0-0", description: "Foundations of constitutional interpretation, judicial review, federalism" },
        { code: "LAW 102", title: "Contracts", credits: 4, contact: "4-0-0", description: "Formation, performance, breach, and remedies in contract law" },
        { code: "LAW 103", title: "Torts", credits: 4, contact: "4-0-0", description: "Intentional torts, negligence, strict liability, damages" },
        { code: "LAW 104", title: "Legal Research & Writing I", credits: 2, contact: "1-0-3", description: "Legal citation, case analysis, memorandum writing" },
        { code: "LAW 105", title: "Criminal Law", credits: 3, contact: "3-0-0", description: "Elements of crimes, defenses, constitutional limitations" }
      ],
      spring: [
        { code: "LAW 106", title: "Constitutional Law II", credits: 4, contact: "4-0-0", description: "Individual rights, equal protection, due process" },
        { code: "LAW 107", title: "Property Law", credits: 4, contact: "4-0-0", description: "Real and personal property, estates, future interests" },
        { code: "LAW 108", title: "Civil Procedure", credits: 4, contact: "4-0-0", description: "Federal Rules of Civil Procedure, jurisdiction, pleadings" },
        { code: "LAW 109", title: "Legal Research & Writing II", credits: 2, contact: "1-0-3", description: "Advanced legal writing, appellate brief writing" },
        { code: "LAW 110", title: "Professional Responsibility", credits: 3, contact: "3-0-0", description: "Ethics, attorney-client relationships, conflicts of interest" }
      ]
    },
    year2: {
      fall: [
        { code: "LAW 201", title: "Evidence", credits: 4, contact: "4-0-0", description: "Rules of evidence, hearsay, privileges, expert testimony" },
        { code: "LAW 202", title: "Administrative Law", credits: 3, contact: "3-0-0", description: "Administrative agencies, rulemaking, judicial review" },
        { code: "LAW 203", title: "Corporate Law", credits: 3, contact: "3-0-0", description: "Corporate formation, governance, fiduciary duties" },
        { code: "LAW 204", title: "Federal Income Tax", credits: 3, contact: "3-0-0", description: "Individual and business taxation principles" },
        { code: "LAW 205", title: "Elective I", credits: 3, contact: "3-0-0", description: "Choose from specialization tracks" }
      ],
      spring: [
        { code: "LAW 206", title: "Employment Law", credits: 3, contact: "3-0-0", description: "Workplace rights, discrimination, labor relations" },
        { code: "LAW 207", title: "International Law", credits: 3, contact: "3-0-0", description: "Public international law, treaties, jurisdiction" },
        { code: "LAW 208", title: "Environmental Law", credits: 3, contact: "3-0-0", description: "Environmental statutes, regulatory frameworks" },
        { code: "LAW 209", title: "Intellectual Property", credits: 3, contact: "3-0-0", description: "Patents, trademarks, copyrights, trade secrets" },
        { code: "LAW 210", title: "Elective II", credits: 3, contact: "3-0-0", description: "Advanced specialization courses" }
      ]
    },
    year3: {
      fall: [
        { code: "LAW 301", title: "Trial Advocacy", credits: 3, contact: "1-0-6", description: "Courtroom skills, witness examination, jury selection" },
        { code: "LAW 302", title: "Clinic/Externship", credits: 4, contact: "0-0-12", description: "Supervised legal practice experience" },
        { code: "LAW 303", title: "Advanced Constitutional Law", credits: 3, contact: "3-0-0", description: "First Amendment, privacy rights, substantive due process" },
        { code: "LAW 304", title: "Elective III", credits: 3, contact: "3-0-0", description: "Specialization elective" },
        { code: "LAW 305", title: "Bar Exam Preparation", credits: 2, contact: "2-0-0", description: "MBE and state-specific exam preparation" }
      ],
      spring: [
        { code: "LAW 306", title: "Advanced Legal Writing", credits: 2, contact: "1-0-3", description: "Scholarly writing, law review articles" },
        { code: "LAW 307", title: "Alternative Dispute Resolution", credits: 3, contact: "2-0-3", description: "Mediation, arbitration, negotiation techniques" },
        { code: "LAW 308", title: "Capstone Project", credits: 3, contact: "1-0-6", description: "Independent research project or thesis" },
        { code: "LAW 309", title: "Elective IV", credits: 3, contact: "3-0-0", description: "Final specialization elective" },
        { code: "LAW 310", title: "Judicial Externship", credits: 3, contact: "0-0-9", description: "Work with federal or state judges" }
      ]
    }
  };

  const admissionRequirements = [
    "Bachelor's degree from accredited institution (minimum 3.5 GPA)",
    "LSAT score of 160+ (top 20th percentile)",
    "Personal statement demonstrating commitment to law",
    "Three letters of recommendation",
    "Resume highlighting leadership and service",
    "Character and fitness evaluation"
  ];

  const careerOpportunities = [
    "Private Practice Attorney", "Corporate Counsel", "Public Defender",
    "Prosecutor", "Judge", "Legal Consultant", "Policy Analyst",
    "Legal Academic", "Government Attorney", "Non-profit Legal Advocate"
  ];

  return (
    <PageLayout 
      title="School of Law - Juris Doctor (JD)" 
      description="Rigorous 3-year program preparing future legal professionals for bar admission and legal practice"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Years</div>
              <p className="text-xs text-muted-foreground">6 Semesters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">90</div>
              <p className="text-xs text-muted-foreground">Credit Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">J.D.</div>
              <p className="text-xs text-muted-foreground">ABA Accredited</p>
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
              <h3 className="text-2xl font-bold">JD Curriculum Structure</h3>
              
              {/* Year 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    First Year (1L) - Fall Semester
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.fall.map((course, index) => (
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
                  <CardTitle>First Year (1L) - Spring Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.spring.map((course, index) => (
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
                  <CardTitle>Advanced Years (2L & 3L)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Years 2 and 3 include advanced coursework, clinical experiences, externships, 
                    and specialized electives in areas such as Business Law, Criminal Law, 
                    Environmental Law, International Law, and Public Interest Law.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>JD Admission Requirements</CardTitle>
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
                <CardTitle>Legal Career Opportunities</CardTitle>
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
                <CardTitle>JD Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$28,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical/Externship Fee</span>
                    <span className="font-bold">$3,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bar Exam Preparation</span>
                    <span className="font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$1,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$62,000</span>
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

export default SchoolLaw;
