import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, AlertTriangle, Users, Lock, Globe } from "lucide-react";

const TermsConditions = () => {
  return (
    <PageLayout
      title="Terms & Conditions"
      description="Terms and conditions for using NSCU website and services"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Legal Agreement</h3>
                  <p className="text-sm text-muted-foreground">Binding terms between NSCU and users</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">User Obligations</h3>
                  <p className="text-sm text-muted-foreground">Rights and responsibilities of all users</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Delaware Jurisdiction</h3>
                  <p className="text-sm text-muted-foreground">Governed by USA laws and regulations</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    Terms & Conditions
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold mb-2">Acceptance of Terms</p>
                    <p className="mb-0">
                      By accessing, browsing, or using the New States Continental University (NSCU) website, mobile applications, 
                      or applying for admission, you acknowledge that you have read, understood, and agree to be bound by these 
                      Terms and Conditions and all applicable university policies and academic regulations.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">1. Definitions</h3>
                  <div className="space-y-3 mb-6">
                    <p><strong>"University"</strong> or <strong>"NSCU"</strong> refers to New States Continental University, Delaware, USA, including all its campuses, online platforms, and representatives.</p>
                    <p><strong>"User"</strong> refers to any person accessing the website, including prospective students, current students, alumni, faculty, staff, or visitors.</p>
                    <p><strong>"Services"</strong> refers to all educational programs, online portals, resources, and facilities provided by NSCU.</p>
                    <p><strong>"Content"</strong> includes all text, graphics, logos, images, software, documents, and other materials available on the website.</p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property Rights</h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <h4 className="font-bold mb-3">Ownership</h4>
                    <p className="mb-4">
                      All content, forms, course materials, designs, logos, trademarks, and intellectual property on the NSCU website 
                      and platforms are the exclusive property of New States Continental University or its licensors. This includes but is not limited to:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li>• Course syllabi, lectures, and educational materials</li>
                      <li>• University branding, logos, and visual identity</li>
                      <li>• Research publications and academic papers</li>
                      <li>• Software, applications, and digital tools</li>
                      <li>• Website design, layout, and functionality</li>
                      <li>• Video lectures, recorded sessions, and multimedia content</li>
                    </ul>
                    <h4 className="font-bold mb-3">Usage Restrictions</h4>
                    <p className="mb-2">Users are <strong>prohibited</strong> from:</p>
                    <ul className="space-y-2">
                      <li>• Reproducing, distributing, or republishing content without written permission</li>
                      <li>• Using NSCU branding or logos for unauthorized purposes</li>
                      <li>• Selling, licensing, or sublicensing any university materials</li>
                      <li>• Creating derivative works from university content</li>
                      <li>• Removing copyright notices or watermarks</li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">3. User Obligations & Conduct</h3>
                  <div className="space-y-4 mb-8">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">3.1 Accurate Information</h4>
                      <p>
                        All applicants and users must submit accurate, complete, and authentic documents and information. 
                        You are responsible for the accuracy of all data provided including:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>• Personal identification details</li>
                        <li>• Educational transcripts and certificates</li>
                        <li>• Work experience and professional credentials</li>
                        <li>• Financial information for aid applications</li>
                        <li>• Emergency contact information</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">3.2 Document Authenticity</h4>
                      <p>
                        All documents submitted must be original and authentic. Submission of forged, altered, or fraudulent documents 
                        will result in immediate application rejection or admission cancellation, with potential legal consequences.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">3.3 Account Security</h4>
                      <p>
                        Users are responsible for maintaining the confidentiality of login credentials. Any activity under your account 
                        is your responsibility. Immediately notify the university of any unauthorized access.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold mb-2">3.4 Prohibited Activities</h4>
                      <p>Users shall not engage in:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Hacking, unauthorized access, or system manipulation</li>
                        <li>• Uploading viruses, malware, or harmful code</li>
                        <li>• Harassment, discrimination, or offensive behavior</li>
                        <li>• Academic dishonesty including plagiarism and cheating</li>
                        <li>• Impersonation or misrepresentation</li>
                        <li>• Sharing copyrighted materials without permission</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">4. Admission & Enrollment Terms</h3>
                  <div className="space-y-4 mb-6">
                    <p>
                      <strong>4.1 Application Process:</strong> Submission of an application does not guarantee admission. 
                      All applications are subject to review and approval by the admissions committee.
                    </p>
                    <p>
                      <strong>4.2 Admission Offer:</strong> Admission offers are conditional and may be revoked if:
                    </p>
                    <ul className="ml-6 space-y-1">
                      <li>• Academic credentials are found to be fraudulent</li>
                      <li>• Payment obligations are not met within deadlines</li>
                      <li>• Student fails to meet conditional admission requirements</li>
                      <li>• Student violates university code of conduct before enrollment</li>
                    </ul>
                    <p>
                      <strong>4.3 Enrollment Confirmation:</strong> Admission is confirmed only upon receipt of required documents, 
                      payment of fees, and completion of enrollment formalities.
                    </p>
                    <p>
                      <strong>4.4 Deferral Policy:</strong> Admission deferral requests must be submitted in writing and are 
                      subject to approval. Deferred admissions are typically valid for one academic year.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">5. Academic Policies & Student Conduct</h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <p className="mb-4">
                      All enrolled students are bound by the NSCU Student Handbook and Academic Policies, including but not limited to:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2 text-primary">Academic Integrity</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Zero tolerance for plagiarism</li>
                          <li>• Original work submission requirement</li>
                          <li>• Proper citation and attribution</li>
                          <li>• Consequences for dishonesty</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 text-primary">Attendance Requirements</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Minimum attendance percentage</li>
                          <li>• Punctuality expectations</li>
                          <li>• Leave application procedures</li>
                          <li>• Consequences for non-compliance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 text-primary">Grading & Assessment</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Assignment submission deadlines</li>
                          <li>• Examination regulations</li>
                          <li>• Grade appeal process</li>
                          <li>• Academic probation criteria</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 text-primary">Code of Conduct</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Respectful behavior expectations</li>
                          <li>• Anti-discrimination policies</li>
                          <li>• Substance abuse prohibitions</li>
                          <li>• Disciplinary procedures</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">6. Disclaimer & Limitations of Liability</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold mb-2">6.1 Information Accuracy</p>
                        <p>
                          While NSCU strives to maintain accurate and current information, the university does not guarantee the 
                          accuracy, completeness, or timeliness of content. Policies, programs, fees, and faculty are subject to 
                          change without prior notice.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold mb-2">6.2 Third-Party Content</p>
                        <p>
                          NSCU is not responsible for content, accuracy, or practices of third-party websites linked from our platforms. 
                          External links are provided for convenience only and do not constitute endorsement.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold mb-2">6.3 Technical Issues</p>
                        <p>
                          The university shall not be liable for any loss, damage, or inconvenience caused by:
                        </p>
                        <ul className="mt-2 space-y-1">
                          <li>• Technical downtime or server maintenance</li>
                          <li>• Data loss or corruption</li>
                          <li>• Internet connectivity issues</li>
                          <li>• Force majeure events beyond university control</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold mb-2">6.4 Career Outcomes</p>
                        <p>
                          NSCU provides career guidance and placement assistance but does not guarantee employment or specific 
                          salary outcomes. Job placement depends on multiple factors including individual performance, market conditions, 
                          and employer requirements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">7. Governing Law & Jurisdiction</h3>
                  <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary mb-6">
                    <p className="mb-3">
                      <strong>7.1 Applicable Law:</strong> These Terms and Conditions shall be governed by and construed in 
                      accordance with the laws of the State of Delaware, United States of America, without regard to its conflict of law provisions.
                    </p>
                    <p className="mb-3">
                      <strong>7.2 Dispute Resolution:</strong> Any disputes, controversies, or claims arising out of or relating to 
                      these terms shall first be attempted to be resolved through good faith negotiations and mediation.
                    </p>
                    <p className="mb-3">
                      <strong>7.3 Legal Jurisdiction:</strong> If mediation fails, the exclusive jurisdiction for any legal proceedings 
                      shall be the courts located in New Castle County, Delaware, USA.
                    </p>
                    <p className="mb-0">
                      <strong>7.4 Compliance:</strong> Users agree to comply with all applicable international, federal, state, and 
                      local laws and regulations pertaining to education, data protection, and online conduct.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">8. Modifications to Terms</h3>
                  <p className="mb-4">
                    NSCU reserves the right to modify, update, or change these Terms and Conditions at any time without prior notice. 
                    Continued use of the website or services after modifications constitutes acceptance of the updated terms.
                  </p>
                  <p className="mb-6">
                    <strong>Notification:</strong> Significant changes will be communicated via:
                  </p>
                  <ul className="space-y-1 mb-6">
                    <li>• Email notification to registered users</li>
                    <li>• Prominent notice on the website homepage</li>
                    <li>• Student portal announcements</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4">9. Termination of Access</h3>
                  <p className="mb-4">
                    The university reserves the right to terminate or suspend access to its website, portals, and services for any user who:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li>• Violates these Terms and Conditions</li>
                    <li>• Engages in fraudulent or illegal activities</li>
                    <li>• Abuses or misuses university systems</li>
                    <li>• Fails to pay required fees or fulfill financial obligations</li>
                    <li>• Violates academic integrity or conduct policies</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4">10. Contact Information</h3>
                  <div className="bg-muted/50 p-6 rounded-lg border">
                    <p className="mb-4">
                      For questions, concerns, or clarifications regarding these Terms and Conditions, please contact:
                    </p>
                    <div className="space-y-2">
                      <p><strong>Legal Department</strong></p>
                      <p>New States Continental University - Delaware</p>
                      <p>100 University Plaza, Dover, DE 19901, USA</p>
                      <p><strong>Email:</strong> legal@nscu.govt.ac</p>
                      <p><strong>Phone:</strong> +1 (302) 857-6060</p>
                      <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (EST)</p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Acknowledgment
                    </p>
                    <p className="text-sm">
                      By using this website or submitting an application, you acknowledge that you have read, understood, and agree 
                      to be bound by these Terms and Conditions in their entirety. If you do not agree to these terms, please refrain 
                      from using the website or applying to the university.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 3.0</p>
              <p>These terms are effective immediately and supersede all previous versions.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsConditions;
