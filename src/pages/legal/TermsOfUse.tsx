import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { FileText, Shield, Users, AlertTriangle } from 'lucide-react';

const TermsOfUse = () => {
  useSEO({
    title: "Terms of Use - NSCU Delaware",
    description: "Read the terms of use for NSCU Delaware's website and digital services. Learn about user responsibilities, acceptable use policies, and legal guidelines.",
    keywords: "terms of use, website terms, user agreement, acceptable use policy, legal terms, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Terms of Use" 
      description="Legal terms and conditions for using NSCU Delaware digital services"
    >
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <FileText className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">Legal Agreement</h3>
                <p className="text-gray-600">Binding terms for all users</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">User Protection</h3>
                <p className="text-gray-600">Rights and responsibilities</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">Community Standards</h3>
                <p className="text-gray-600">Acceptable use guidelines</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose max-w-none">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Acceptance of Terms</h2>
                  <div className="text-gray-700">
                    <p>By accessing and using the New States Continental University - Delaware ("NSCU Delaware") website and digital services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>
                    <p className="mt-4">These terms may be updated periodically, and continued use of our services constitutes acceptance of any changes.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Acceptable Use</h2>
                  <div className="text-gray-700">
                    <h3 className="font-semibold text-uw-purple mb-2">Permitted Uses</h3>
                    <p>You may use our website and services for:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Educational and academic purposes</li>
                      <li>Accessing university information and resources</li>
                      <li>Communicating with faculty, staff, and other students</li>
                      <li>Conducting official university business</li>
                    </ul>

                    <h3 className="font-semibold text-uw-purple mb-2 mt-6">Prohibited Activities</h3>
                    <p>You may not:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Use services for any illegal or unauthorized purpose</li>
                      <li>Attempt to gain unauthorized access to systems</li>
                      <li>Transmit viruses, malware, or harmful code</li>
                      <li>Engage in harassment, intimidation, or hate speech</li>
                      <li>Share copyrighted material without permission</li>
                      <li>Impersonate others or create false identities</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">User Accounts</h2>
                  <div className="text-gray-700">
                    <h3 className="font-semibold text-uw-purple mb-2">Account Security</h3>
                    <p>Users are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Maintaining the confidentiality of login credentials</li>
                      <li>All activities that occur under their account</li>
                      <li>Reporting unauthorized use immediately</li>
                      <li>Using strong passwords and security practices</li>
                    </ul>

                    <h3 className="font-semibold text-uw-purple mb-2 mt-4">Account Termination</h3>
                    <p>NSCU Delaware reserves the right to suspend or terminate accounts for violations of these terms or for any conduct deemed harmful to the university community.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Intellectual Property</h2>
                  <div className="text-gray-700">
                    <h3 className="font-semibold text-uw-purple mb-2">University Content</h3>
                    <p>All content on NSCU Delaware websites, including text, images, logos, and multimedia, is protected by copyright and other intellectual property laws. Users may not reproduce, distribute, or create derivative works without permission.</p>

                    <h3 className="font-semibold text-uw-purple mb-2 mt-4">User-Generated Content</h3>
                    <p>By submitting content to university systems, users grant NSCU Delaware a license to use, modify, and display such content for educational and administrative purposes.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Privacy and Data</h2>
                  <div className="text-gray-700">
                    <p>Our collection and use of personal information is governed by our Privacy Policy. By using our services, you consent to the practices described in that policy.</p>
                    <p className="mt-4">NSCU Delaware complies with FERPA and other applicable privacy laws in handling student educational records.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Disclaimers and Limitations</h2>
                  <div className="text-gray-700">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-yellow-800">Important Notice</h3>
                          <p className="text-yellow-700 text-sm mt-1">Services are provided "as is" without warranties of any kind.</p>
                        </div>
                      </div>
                    </div>
                    <p>NSCU Delaware makes no warranties regarding the accuracy, reliability, or availability of its digital services. The university shall not be liable for any damages arising from use of these services.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Governing Law</h2>
                  <div className="text-gray-700">
                    <p>These Terms of Use are governed by the laws of the State of Delaware. Any disputes shall be resolved in the courts of Delaware.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-uw-purple mb-4">Contact Information</h2>
                  <div className="text-gray-700">
                    <p>For questions about these Terms of Use, please contact:</p>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p><strong>Legal Affairs Office</strong></p>
                      <p>New States Continental University - Delaware</p>
                      <p>100 University Plaza</p>
                      <p>Dover, DE 19901</p>
                      <p>Email: legal@nscu.edu</p>
                      <p>Phone: (302) 857-6060</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 border-t pt-6">
                  <p>These Terms of Use were last updated on August 1, 2024. NSCU Delaware reserves the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsOfUse;