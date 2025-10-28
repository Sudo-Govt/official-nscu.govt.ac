import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Info, ExternalLink, FileWarning, Globe } from "lucide-react";

const Disclaimer = () => {
  return (
    <PageLayout
      title="Disclaimer"
      description="Disclaimer and limitations of liability for NSCU website"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Warning Banner */}
            <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg">
              <div className="flex gap-4 items-start">
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-100">Important Legal Notice</h3>
                  <p className="text-amber-800 dark:text-amber-200">
                    Please read this disclaimer carefully before using the NSCU website or services. By accessing 
                    or using this website, you acknowledge and agree to the terms outlined in this disclaimer.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FileWarning className="h-8 w-8 text-primary" />
                    Legal Disclaimer
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold mb-2">General Disclaimer</p>
                    <p className="mb-0">
                      While New States Continental University (NSCU) strives to maintain accurate, complete, and current 
                      information on this website, we make no representations or warranties of any kind, express or implied, 
                      about the completeness, accuracy, reliability, suitability, or availability with respect to the website 
                      or the information contained herein.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Info className="h-6 w-6 text-primary" />
                    1. Information Accuracy & Currency
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="border-l-4 border-amber-500 pl-4 bg-amber-50/50 dark:bg-amber-950/10 p-4">
                      <h4 className="font-bold mb-2">1.1 No Guarantee of Accuracy</h4>
                      <p>
                        The information, content, programs, policies, fees, faculty listings, course offerings, and other 
                        materials published on this website are subject to change without prior notice. NSCU does not guarantee:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>• Accuracy of program descriptions or curriculum details</li>
                        <li>• Current availability of listed courses or programs</li>
                        <li>• Correctness of faculty information or credentials</li>
                        <li>• Precision of fee structures or financial information</li>
                        <li>• Timeliness of news, events, or announcements</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 bg-amber-50/50 dark:bg-amber-950/10 p-4">
                      <h4 className="font-bold mb-2">1.2 Dynamic Nature of Academic Programs</h4>
                      <p>
                        Academic programs, course offerings, admission requirements, and policies are continually reviewed 
                        and revised to maintain educational excellence and relevance. Changes may occur:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>• Between website updates and actual implementation</li>
                        <li>• During academic year planning cycles</li>
                        <li>• In response to accreditation requirements</li>
                        <li>• Based on faculty availability or institutional decisions</li>
                      </ul>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <strong>Students should verify:</strong> Always confirm program details, requirements, and policies 
                        with the Admissions Office or Academic Advising before making enrollment decisions.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 bg-amber-50/50 dark:bg-amber-950/10 p-4">
                      <h4 className="font-bold mb-2">1.3 Typographical & Clerical Errors</h4>
                      <p>
                        Despite best efforts to ensure accuracy, the website may contain typographical errors, technical 
                        inaccuracies, or outdated information. NSCU reserves the right to:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>• Correct errors when discovered</li>
                        <li>• Update content without notification</li>
                        <li>• Remove or modify information at any time</li>
                      </ul>
                      <p className="mt-3 font-semibold">
                        Clerical errors do not constitute binding commitments by the university.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    2. Limitations of Liability
                  </h3>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-8">
                    <p className="font-bold mb-4 text-lg">The University Shall Not Be Liable For:</p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Reliance on Information:</strong> Any decisions made or actions taken based on 
                          information found on this website. Users are responsible for verifying critical information 
                          through official channels.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Financial Losses:</strong> Any financial loss, opportunity cost, or damages resulting 
                          from use of outdated fee information, scholarship details, or payment processing errors.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Admission Decisions:</strong> Application rejections, waitlisting, or admission 
                          decisions based on information presented on the website. Final admissions are at university discretion.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Career Outcomes:</strong> Employment prospects, salary expectations, or career advancement 
                          implied or suggested by program descriptions. Job placement depends on individual merit, market conditions, 
                          and employer requirements.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Credential Recognition:</strong> Recognition, acceptance, or equivalency of NSCU degrees 
                          by employers, other institutions, or licensing bodies. Students should verify credential acceptance 
                          for their intended career paths.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="font-bold text-red-600 dark:text-red-400 mt-1">•</div>
                        <div>
                          <strong>Student Performance:</strong> Academic success, learning outcomes, or skill acquisition. 
                          Educational outcomes depend significantly on individual effort, engagement, and aptitude.
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <ExternalLink className="h-6 w-6 text-primary" />
                    3. Third-Party Content & External Links
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3">3.1 External Website Links</h4>
                      <p className="mb-3">
                        This website may contain links to third-party websites, resources, or services for informational 
                        purposes or user convenience. NSCU:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <span className="text-red-500">✗</span>
                          <span>Does NOT control or endorse third-party websites</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">✗</span>
                          <span>Is NOT responsible for content on external sites</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">✗</span>
                          <span>Does NOT guarantee accuracy of linked information</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">✗</span>
                          <span>Is NOT liable for damages from third-party site usage</span>
                        </li>
                      </ul>
                      <p className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded text-sm">
                        <strong>User Caution:</strong> Visiting external websites is at your own risk. Review their terms, 
                        privacy policies, and security measures before providing personal information.
                      </p>
                    </div>

                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3">3.2 Third-Party Services & Integrations</h4>
                      <p className="mb-3">
                        NSCU may use third-party service providers for:
                      </p>
                      <ul className="space-y-1 mb-3">
                        <li>• Payment processing gateways</li>
                        <li>• Learning management systems</li>
                        <li>• Video conferencing platforms</li>
                        <li>• Email and communication services</li>
                        <li>• Analytics and tracking tools</li>
                      </ul>
                      <p>
                        These services operate under their own terms and privacy policies. NSCU is not responsible for 
                        service interruptions, data breaches, or issues arising from third-party providers.
                      </p>
                    </div>

                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3">3.3 Social Media Content</h4>
                      <p>
                        Content posted on NSCU's social media pages (Facebook, Twitter, LinkedIn, Instagram, YouTube) 
                        represents unofficial communications. For official university policies and announcements, 
                        refer to this website or official university publications.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    4. Technical & Service Availability
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="bg-muted/50 p-5 rounded-lg">
                      <h4 className="font-bold mb-3">4.1 Website Downtime & Maintenance</h4>
                      <p className="mb-3">
                        NSCU strives to maintain website availability 24/7 but does not guarantee uninterrupted access. 
                        The website may be temporarily unavailable due to:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-1">
                          <li>• Scheduled maintenance</li>
                          <li>• System upgrades and updates</li>
                          <li>• Server failures or hardware issues</li>
                          <li>• Security incidents or attacks</li>
                        </ul>
                        <ul className="space-y-1">
                          <li>• Network connectivity problems</li>
                          <li>• Power outages or natural disasters</li>
                          <li>• Emergency system repairs</li>
                          <li>• Unforeseen technical issues</li>
                        </ul>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        <strong>Impact on Applications:</strong> Application deadlines will not be extended due to 
                        website downtime. Submit applications well in advance to avoid last-minute technical issues.
                      </p>
                    </div>

                    <div className="bg-muted/50 p-5 rounded-lg">
                      <h4 className="font-bold mb-3">4.2 Data Loss & System Errors</h4>
                      <p>
                        While NSCU implements regular backups and data protection measures, the university is not liable for:
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li>• Loss of user-submitted data or documents</li>
                        <li>• Corruption of application materials</li>
                        <li>• Failed file uploads or incomplete submissions</li>
                        <li>• Payment transaction errors or delays</li>
                      </ul>
                      <p className="mt-4 font-semibold">
                        User Responsibility: Always keep backup copies of important documents and payment confirmations.
                      </p>
                    </div>

                    <div className="bg-muted/50 p-5 rounded-lg">
                      <h4 className="font-bold mb-3">4.3 Browser & Device Compatibility</h4>
                      <p>
                        This website is optimized for modern web browsers (Chrome, Firefox, Safari, Edge - latest versions). 
                        Functionality may be limited or unavailable on:
                      </p>
                      <ul className="space-y-1 mt-2">
                        <li>• Outdated or unsupported browsers</li>
                        <li>• Mobile devices with limited capabilities</li>
                        <li>• Systems with disabled JavaScript or cookies</li>
                        <li>• Devices with incompatible screen resolutions</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">5. No Professional Advice</h3>
                  <div className="border-2 border-amber-400 dark:border-amber-600 p-6 rounded-lg mb-6">
                    <p className="font-bold mb-3">This Website Does NOT Provide:</p>
                    <ul className="space-y-3">
                      <li>
                        <strong>Legal Advice:</strong> Information on this website is not a substitute for professional 
                        legal counsel. Consult an attorney for legal matters.
                      </li>
                      <li>
                        <strong>Financial Advice:</strong> Financial information is for general guidance only. Consult 
                        financial advisors for personal financial decisions.
                      </li>
                      <li>
                        <strong>Immigration Advice:</strong> International students should consult immigration attorneys 
                        or official government sources for visa and immigration matters.
                      </li>
                      <li>
                        <strong>Career Counseling:</strong> Career information is general in nature. Seek professional 
                        career counselors for personalized guidance.
                      </li>
                      <li>
                        <strong>Medical Advice:</strong> Health and wellness information is educational only. Consult 
                        healthcare professionals for medical concerns.
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">6. Program Changes & Cancellations</h3>
                  <div className="space-y-3 mb-6">
                    <p>
                      NSCU reserves the right to:
                    </p>
                    <ul className="space-y-2">
                      <li>• Modify program curriculum, structure, or duration</li>
                      <li>• Change course schedules, formats, or delivery methods</li>
                      <li>• Substitute faculty members as needed</li>
                      <li>• Cancel programs with insufficient enrollment</li>
                      <li>• Merge or discontinue academic programs</li>
                      <li>• Revise admission requirements or eligibility criteria</li>
                    </ul>
                    <p className="mt-4">
                      <strong>Student Protection:</strong> Enrolled students will be given reasonable notice of significant 
                      program changes and options for program transfer or completion.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">7. Intellectual Property Notice</h3>
                  <p className="mb-4">
                    Unauthorized use, reproduction, or distribution of website content may violate copyright, trademark, 
                    and other intellectual property laws. Legal action may be taken against violations.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4">8. Acceptance of Disclaimer</h3>
                  <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
                    <p className="font-bold mb-3">By Using This Website, You Acknowledge:</p>
                    <ol className="space-y-2">
                      <li>1. You have read and understood this disclaimer in its entirety</li>
                      <li>2. You accept the risks associated with website usage</li>
                      <li>3. You agree not to hold NSCU liable for the issues outlined above</li>
                      <li>4. You will verify critical information through official university channels</li>
                      <li>5. You understand that this disclaimer may be updated without notice</li>
                    </ol>
                  </div>

                  <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold text-lg mb-3">Questions or Concerns?</h4>
                    <p className="mb-3">
                      If you have questions about this disclaimer or need clarification on any website content:
                    </p>
                    <p className="mb-1"><strong>Legal Department:</strong> legal@nscu.govt.ac</p>
                    <p className="mb-1"><strong>General Inquiries:</strong> info@nscu.govt.ac</p>
                    <p className="mb-0"><strong>Phone:</strong> +1 (302) 857-6060</p>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Final Notice
                    </p>
                    <p className="text-sm mb-0">
                      Use of this website constitutes acceptance of this disclaimer. If you do not agree with any part 
                      of this disclaimer, please discontinue use of the website immediately. This disclaimer is subject 
                      to change without prior notification. Continued use after changes indicates acceptance of the 
                      modified disclaimer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 2.2</p>
              <p>For the most current disclaimer, always refer to this webpage.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Disclaimer;
