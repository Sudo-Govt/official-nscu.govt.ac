
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, BookOpen, GraduationCap } from 'lucide-react';

const MasterSocialWork = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "SW 601", title: "Human Behavior & Social Environment I", credits: 3, contact: "3-0-0", description: "Theories of human development, systems theory, ecological perspective" },
        { code: "SW 602", title: "Social Welfare Policy & Services", credits: 3, contact: "3-0-0", description: "History and analysis of social welfare policies and programs" },
        { code: "SW 603", title: "Research Methods in Social Work", credits: 3, contact: "3-0-0", description: "Quantitative and qualitative research methods, evidence-based practice" },
        { code: "SW 604", title: "Practice with Individuals", credits: 3, contact: "3-0-0", description: "Assessment, intervention, and evaluation with individual clients" },
        { code: "SW 605", title: "Field Practicum I", credits: 4, contact: "0-0-16", description: "Supervised field experience in social service agency" }
      ],
      spring: [
        { code: "SW 606", title: "Human Behavior & Social Environment II", credits: 3, contact: "3-0-0", description: "Group dynamics, family systems, community development" },
        { code: "SW 607", title: "Practice with Families & Groups", credits: 3, contact: "3-0-0", description: "Group work theory, family therapy techniques, intervention strategies" },
        { code: "SW 608", title: "Social Work Ethics", credits: 2, contact: "2-0-0", description: "Professional ethics, values, and ethical decision-making" },
        { code: "SW 609", title: "Cultural Diversity & Social Justice", credits: 3, contact: "3-0-0", description: "Oppression, privilege, cultural competence, advocacy" },
        { code: "SW 610", title: "Field Practicum II", credits: 4, contact: "0-0-16", description: "Advanced field experience with increased responsibility" }
      ]
    },
    year2: {
      fall: [
        { code: "SW 701", title: "Advanced Clinical Practice", credits: 3, contact: "3-0-0", description: "Advanced therapeutic interventions, trauma-informed care" },
        { code: "SW 702", title: "Program Evaluation", credits: 3, contact: "3-0-0", description: "Evaluation methods for social service programs" },
        { code: "SW 703", title: "Mental Health & Substance Abuse", credits: 3, contact: "3-0-0", description: "Assessment and treatment of mental health and addiction issues" },
        { code: "SW 704", title: "Specialization Elective I", credits: 3, contact: "3-0-0", description: "Choose from clinical, macro, or specialized practice areas" },
        { code: "SW 705", title: "Advanced Field Practicum I", credits: 4, contact: "0-0-16", description: "Specialized field placement in area of concentration" }
      ],
      spring: [
        { code: "SW 706", title: "Community Organization & Development", credits: 3, contact: "3-0-0", description: "Community assessment, organizing strategies, advocacy" },
        { code: "SW 707", title: "Administrative Practice", credits: 3, contact: "3-0-0", description: "Management, supervision, and leadership in social services" },
        { code: "SW 708", title: "Specialization Elective II", credits: 3, contact: "3-0-0", description: "Advanced specialized practice coursework" },
        { code: "SW 709", title: "Capstone Seminar", credits: 2, contact: "2-0-0", description: "Integration of learning, professional development planning" },
        { code: "SW 710", title: "Advanced Field Practicum II", credits: 4, contact: "0-0-16", description: "Culminating field experience with leadership responsibilities" }
      ]
    }
  };

  const admissionRequirements = [
    "Bachelor's degree from accredited institution (minimum 3.0 GPA)",
    "Coursework in human biology, statistics, and abnormal psychology",
    "GRE scores (waived for applicants with 3.5+ GPA)",
    "Personal statement demonstrating commitment to social work",
    "Three professional references",
    "Resume highlighting relevant experience",
    "Criminal background check and drug screening"
  ];

  const careerOpportunities = [
    "Clinical Social Worker", "School Social Worker", "Medical Social Worker",
    "Mental Health Counselor", "Substance Abuse Counselor", "Program Manager",
    "Policy Analyst", "Community Organizer", "Private Practice Therapist"
  ];

  return (
    <PageLayout 
      title="Master of Social Work (MSW)" 
      description="CSWE-accredited 2-year program preparing social work professionals for clinical and macro practice"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 Years</div>
              <p className="text-xs text-muted-foreground">4 Semesters + Field Work</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60</div>
              <p className="text-xs text-muted-foreground">Credit Hours + 900 Field Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MSW</div>
              <p className="text-xs text-muted-foreground">CSWE & GCHEA Accredited</p>
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
              <h3 className="text-2xl font-bold">MSW Curriculum Structure</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Year 1 - Foundation Year - Fall Semester
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
                  <CardTitle>Year 1 - Foundation Year - Spring Semester</CardTitle>
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
                  <CardTitle>Year 2 - Concentration Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced coursework in specialized practice areas including clinical practice, 
                    macro practice, and field education with increased autonomy and responsibility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>MSW Admission Requirements</CardTitle>
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
                <CardTitle>Social Work Career Opportunities</CardTitle>
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
                <CardTitle>MSW Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$18,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Field Placement Fee</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$38,000</span>
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

export default MasterSocialWork;
