import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, UserCheck, Clock, Shield, FileText, HeadphonesIcon, Mail, Phone } from "lucide-react";

const Grievance = () => {
  return (
    <PageLayout
      title="Student Grievance & Support"
      description="Student grievance redressal and support system at NSCU"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Open Communication</h3>
                  <p className="text-sm text-muted-foreground">Multiple channels to raise concerns</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">7-10 working days resolution</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Confidentiality</h3>
                  <p className="text-sm text-muted-foreground">Protected information handling</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Fair Treatment</h3>
                  <p className="text-sm text-muted-foreground">Impartial grievance resolution</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <HeadphonesIcon className="h-8 w-8 text-primary" />
                    Student Grievance & Support System
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold mb-2">Our Commitment to Student Welfare</p>
                    <p className="mb-0">
                      New States Continental University (NSCU) is committed to maintaining the highest standards of 
                      academic excellence, student welfare, and transparent operations. We believe that every student 
                      has the right to voice concerns, seek redressal for grievances, and receive prompt, fair, and 
                      unbiased resolution.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">1. What is a Grievance?</h3>
                  <p className="mb-4">
                    A grievance is any concern, complaint, or dissatisfaction expressed by a student regarding:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Academic Issues</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Unfair grading or evaluation</li>
                        <li>• Faculty conduct or teaching quality</li>
                        <li>• Course content or delivery issues</li>
                        <li>• Examination irregularities</li>
                        <li>• Academic advising problems</li>
                        <li>• Plagiarism or academic integrity concerns</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Administrative Matters</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Admission process irregularities</li>
                        <li>• Fee payment or refund issues</li>
                        <li>• Document processing delays</li>
                        <li>• Registration or enrollment problems</li>
                        <li>• Scholarship or financial aid disputes</li>
                        <li>• Service quality concerns</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Campus Life & Facilities</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Library or IT services</li>
                        <li>• Campus infrastructure issues</li>
                        <li>• Hostel or accommodation problems</li>
                        <li>• Cafeteria or dining services</li>
                        <li>• Sports facilities access</li>
                        <li>• Campus safety concerns</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Discrimination & Harassment</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Discrimination based on race, gender, religion</li>
                        <li>• Sexual harassment or misconduct</li>
                        <li>• Bullying or ragging</li>
                        <li>• Verbal or physical abuse</li>
                        <li>• Unfair treatment by staff or peers</li>
                        <li>• Violation of student rights</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    2. How to Raise a Grievance
                  </h3>
                  <div className="space-y-6 mb-8">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-bold text-lg mb-4">Step-by-Step Process:</h4>
                      
                      <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            1
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Initial Informal Resolution (Optional)</h5>
                            <p className="text-sm">
                              Try to resolve the issue informally by discussing with the concerned person (faculty, 
                              department head, or administrative staff). Many issues can be resolved through direct communication.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            2
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Formal Grievance Submission</h5>
                            <p className="text-sm mb-2">
                              If informal resolution fails or issue is serious, submit a formal written grievance through:
                            </p>
                            <ul className="text-sm space-y-1">
                              <li><strong>Email:</strong> grievance@nscu.govt.ac or support@nscu.govt.ac</li>
                              <li><strong>Student Portal:</strong> Dashboard → Support Center → Submit Grievance</li>
                              <li><strong>Physical Submission:</strong> Grievance Box at Student Affairs Office</li>
                              <li><strong>Online Form:</strong> Available on university website grievance section</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            3
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Grievance Registration & Acknowledgment</h5>
                            <p className="text-sm">
                              Upon receipt, your grievance will be assigned a unique tracking number. You'll receive 
                              email confirmation within 24 hours with your grievance ID and expected resolution timeline.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            4
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Investigation & Review</h5>
                            <p className="text-sm">
                              The Grievance Redressal Committee will review your complaint, conduct necessary investigations, 
                              collect evidence, and interview relevant parties. You may be contacted for additional information.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            5
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Resolution & Communication</h5>
                            <p className="text-sm">
                              A decision will be made within the specified timeline. You'll be notified of the outcome, 
                              actions taken, and any remedial measures implemented.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                            6
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Escalation (if needed)</h5>
                            <p className="text-sm">
                              If you're unsatisfied with the resolution, you can escalate to the Office of Academic Affairs 
                              or submit an appeal within 15 days of receiving the decision.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-primary/30 p-6 rounded-lg">
                      <h4 className="font-bold text-lg mb-4">Required Information for Grievance Submission:</h4>
                      <ol className="space-y-2">
                        <li><strong>1. Personal Details:</strong> Full name, Student ID, program, contact information</li>
                        <li><strong>2. Nature of Grievance:</strong> Clear category selection (academic, administrative, etc.)</li>
                        <li><strong>3. Detailed Description:</strong> Specific incident details, dates, locations, people involved</li>
                        <li><strong>4. Supporting Evidence:</strong> Documents, emails, screenshots, witness information (if applicable)</li>
                        <li><strong>5. Previous Actions:</strong> Steps already taken to resolve the issue informally</li>
                        <li><strong>6. Expected Resolution:</strong> What outcome or action you're seeking</li>
                      </ol>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    3. Response Time & Resolution Timeline
                  </h3>
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border-collapse border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border p-3 text-left">Grievance Type</th>
                          <th className="border p-3 text-left">Acknowledgment</th>
                          <th className="border p-3 text-left">Resolution Timeline</th>
                          <th className="border p-3 text-left">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-3">Critical/Emergency</td>
                          <td className="border p-3">Within 2 hours</td>
                          <td className="border p-3">24-48 hours</td>
                          <td className="border p-3"><span className="text-red-600 font-bold">Urgent</span></td>
                        </tr>
                        <tr>
                          <td className="border p-3">Harassment/Discrimination</td>
                          <td className="border p-3">Within 4 hours</td>
                          <td className="border p-3">3-5 days</td>
                          <td className="border p-3"><span className="text-red-600 font-bold">High</span></td>
                        </tr>
                        <tr>
                          <td className="border p-3">Academic Issues</td>
                          <td className="border p-3">Within 24 hours</td>
                          <td className="border p-3">7-10 days</td>
                          <td className="border p-3"><span className="text-amber-600 font-bold">Medium</span></td>
                        </tr>
                        <tr>
                          <td className="border p-3">Administrative Matters</td>
                          <td className="border p-3">Within 24 hours</td>
                          <td className="border p-3">10-15 days</td>
                          <td className="border p-3"><span className="text-green-600 font-bold">Standard</span></td>
                        </tr>
                        <tr>
                          <td className="border p-3">Facility/Infrastructure</td>
                          <td className="border p-3">Within 48 hours</td>
                          <td className="border p-3">15-20 days</td>
                          <td className="border p-3"><span className="text-green-600 font-bold">Standard</span></td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-sm mt-2 text-muted-foreground">
                      *Timelines may vary based on complexity and investigation requirements. You'll be kept informed of any delays.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">4. Grievance Redressal Committee</h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <p className="mb-4">
                      The Grievance Redressal Committee is composed of:
                    </p>
                    <ul className="space-y-2">
                      <li><strong>Chairperson:</strong> Dean of Student Affairs</li>
                      <li><strong>Members:</strong> Faculty representatives from each college</li>
                      <li><strong>Student Representatives:</strong> Elected student council members</li>
                      <li><strong>Administrative Representative:</strong> Senior administrative officer</li>
                      <li><strong>External Advisor:</strong> Independent educational consultant (for serious cases)</li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      The committee meets weekly to review grievances and makes decisions through majority voting. 
                      All proceedings are documented and records maintained securely.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    5. Student Rights & Protections
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>Right to Fair Hearing:</strong> Every student has the right to present their case 
                        and be heard impartially.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>Confidentiality:</strong> Your identity and grievance details will be kept confidential 
                        and shared only with authorized personnel involved in resolution.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>No Retaliation:</strong> University policy strictly prohibits any form of retaliation, 
                        discrimination, or victimization against students who file grievances.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>Right to Appeal:</strong> If dissatisfied with the resolution, students can file an appeal 
                        to higher authorities within 15 days.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>Regular Updates:</strong> You'll receive status updates on your grievance at every stage 
                        of the process.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">✓</div>
                      <div>
                        <strong>Support Services:</strong> Access to counseling, legal guidance, and support services 
                        during the grievance process.
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">6. Escalation Path for Unresolved Issues</h3>
                  <div className="space-y-4 mb-8">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">Level 1: Department/Faculty Level</h4>
                      <p className="text-sm">Initial resolution attempt through department head or program coordinator.</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">Level 2: Grievance Redressal Committee</h4>
                      <p className="text-sm">Formal review by the university grievance committee.</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">Level 3: Office of Academic Affairs</h4>
                      <p className="text-sm">Appeal to the Dean of Academic Affairs for serious or unresolved matters.</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">Level 4: Vice Chancellor/President</h4>
                      <p className="text-sm">Final internal escalation to the university's highest authority.</p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-bold mb-2">Level 5: External Agencies</h4>
                      <p className="text-sm">
                        For matters involving legal violations, students may approach external regulatory bodies, 
                        education departments, or legal authorities.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">7. Anonymous Grievance Submission</h3>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg mb-6">
                    <p className="mb-3">
                      For sensitive issues or if you fear retaliation, you can submit grievances anonymously through:
                    </p>
                    <ul className="space-y-2">
                      <li>• Sealed grievance boxes located at strategic campus locations</li>
                      <li>• Anonymous online submission form (accessible via incognito mode)</li>
                      <li>• Third-party grievance hotline managed by external counselors</li>
                    </ul>
                    <p className="text-sm mt-4 text-muted-foreground">
                      <strong>Note:</strong> Anonymous grievances may take longer to resolve due to limited ability to 
                      gather additional information. For faster resolution, identified submissions are recommended.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">8. Support Services Available</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Student Counseling Services</h4>
                      <p className="text-sm mb-2">Free confidential counseling for emotional support during difficult situations.</p>
                      <p className="text-sm"><strong>Email:</strong> counseling@nscu.govt.ac</p>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Legal Assistance</h4>
                      <p className="text-sm mb-2">Guidance on legal rights and options for serious violations.</p>
                      <p className="text-sm"><strong>Email:</strong> legal@nscu.govt.ac</p>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Student Advocacy Office</h4>
                      <p className="text-sm mb-2">Support in navigating university processes and representing student interests.</p>
                      <p className="text-sm"><strong>Email:</strong> advocacy@nscu.govt.ac</p>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Ombudsperson</h4>
                      <p className="text-sm mb-2">Independent mediator for conflict resolution and impartial guidance.</p>
                      <p className="text-sm"><strong>Email:</strong> ombudsperson@nscu.govt.ac</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-primary" />
                    9. Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="border-2 border-primary/30">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-primary" />
                          Email Support
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>General Grievances:</strong><br/>support@nscu.govt.ac</p>
                          <p><strong>Academic Issues:</strong><br/>academic.grievance@nscu.govt.ac</p>
                          <p><strong>Harassment/Discrimination:</strong><br/>safecampus@nscu.govt.ac</p>
                          <p><strong>Financial Matters:</strong><br/>finance@nscu.govt.ac</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/30">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Phone className="h-5 w-5 text-primary" />
                          Phone Support
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Main Helpline:</strong><br/>+1 (302) 857-6060</p>
                          <p><strong>WhatsApp Support:</strong><br/>+91-XXXXXXXXXX</p>
                          <p><strong>24/7 Emergency:</strong><br/>+1 (302) 857-9999</p>
                          <p><strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM (EST)<br/>
                          Saturday: 10 AM - 2 PM</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary mb-6">
                    <h4 className="font-bold text-lg mb-3">Physical Office Location</h4>
                    <p className="mb-2"><strong>Student Affairs Office</strong></p>
                    <p className="mb-1">New States Continental University - Delaware</p>
                    <p className="mb-1">Building A, 2nd Floor, Room 205</p>
                    <p className="mb-1">100 University Plaza, Dover, DE 19901, USA</p>
                    <p className="mb-4"><strong>Walk-in Hours:</strong> Monday - Friday, 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-muted-foreground">
                      Appointments recommended for complex issues. Book via student portal or call ahead.
                    </p>
                  </div>

                  <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-bold mb-2">Our Promise to You</p>
                    <p className="text-sm">
                      NSCU is dedicated to fostering a safe, inclusive, and supportive learning environment. Your voice 
                      matters, and we are committed to addressing your concerns with professionalism, empathy, and fairness. 
                      We encourage open communication and continuous improvement based on student feedback.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 2.0</p>
              <p>For urgent safety concerns, contact campus security immediately at +1 (302) 857-9999</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Grievance;
