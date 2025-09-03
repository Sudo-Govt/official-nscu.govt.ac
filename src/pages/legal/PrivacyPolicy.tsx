import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy - NSCU Delaware",
    description: "Read NSCU Delaware's privacy policy. Learn how we collect, use, and protect your personal information in accordance with FERPA and other privacy regulations.",
    keywords: "privacy policy, data protection, FERPA, personal information, student privacy, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Privacy Policy" 
      description="Your privacy and data protection are our top priorities"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">FERPA Compliant</h3>
                <p className="text-gray-600">Full compliance with federal privacy laws</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Lock className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">Secure Data</h3>
                <p className="text-gray-600">Advanced encryption and security measures</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Eye className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">Transparent</h3>
                <p className="text-gray-600">Clear communication about data usage</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose max-w-none">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Information We Collect</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-uw-purple">Personal Information</h3>
                      <p>We collect personal information including name, address, phone number, email address, and academic records as necessary for educational services.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Academic Information</h3>
                      <p>Educational records, grades, transcripts, and enrollment information are collected and maintained in accordance with FERPA regulations.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Technical Information</h3>
                      <p>Website usage data, IP addresses, and system logs may be collected for security and system maintenance purposes.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">How We Use Information</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-uw-purple">Educational Services</h3>
                      <p>Personal information is used to provide educational services, maintain academic records, and communicate with students and parents.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Administrative Purposes</h3>
                      <p>Information may be used for registration, billing, financial aid processing, and other administrative functions.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Legal Compliance</h3>
                      <p>Information may be disclosed as required by law or in response to valid legal requests.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Information Sharing</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>NSCU Delaware does not sell, rent, or trade personal information. We may share information in the following limited circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>With educational partners and service providers who need access to perform their functions</li>
                      <li>With accrediting organizations and government agencies as required</li>
                      <li>In emergency situations involving health and safety</li>
                      <li>As required by law or legal process</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Your Rights</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-uw-purple">Access and Review</h3>
                      <p>You have the right to access and review your educational records in accordance with FERPA.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Request Corrections</h3>
                      <p>You may request corrections to inaccurate or misleading information in your educational records.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-uw-purple">Directory Information</h3>
                      <p>You may request that directory information not be disclosed without your consent.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Data Security</h2>
                  <div className="text-gray-700">
                    <p>We implement appropriate technical and organizational measures to protect personal information against unauthorized access, alteration, disclosure, or destruction. Our security measures include:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Encryption of sensitive data</li>
                      <li>Secure network infrastructure</li>
                      <li>Regular security audits and updates</li>
                      <li>Staff training on privacy and security</li>
                      <li>Access controls and monitoring</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Contact Information</h2>
                  <div className="text-gray-700">
                    <p>For questions about this privacy policy or to exercise your rights regarding your personal information, please contact:</p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p><strong>Privacy Officer</strong></p>
                      <p>New States Continental University - Delaware</p>
                      <p>100 University Plaza</p>
                      <p>Dover, DE 19901</p>
                      <p>Email: privacy@nscu.edu</p>
                      <p>Phone: (302) 857-6060</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 border-t pt-6">
                  <p>This Privacy Policy was last updated on August 1, 2024. We reserve the right to modify this policy at any time. Changes will be posted on this page with an updated revision date.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;