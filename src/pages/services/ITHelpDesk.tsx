import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Computer, Phone, Mail, Clock, Settings, Shield } from 'lucide-react';

const ITHelpDesk = () => {
  useSEO({
    title: "IT Help Desk - Technology Support | NSCU Delaware",
    description: "Get technical support at NSCU Delaware's IT Help Desk. Computer support, network access, software assistance, and technology resources for students and faculty.",
    keywords: "IT help desk, technology support, computer support, network access, software help, NSCU IT services"
  });

  return (
    <PageLayout 
      title="IT Help Desk" 
      description="24/7 technical support for all your technology needs"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Computer className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Hardware Support</h3>
              <p className="text-gray-600">Computer and device troubleshooting</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Settings className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Software Help</h3>
              <p className="text-gray-600">Application installation and support</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Shield className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Security</h3>
              <p className="text-gray-600">Password resets and account security</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Contact Support</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-gray-600">(302) 857-HELP (4357)</p>
                    <p className="text-sm text-gray-500">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-gray-600">helpdesk@nscu.edu</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Computer className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Walk-In Support</h3>
                    <p className="text-gray-600">Technology Center, Room 101</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 8 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Common Services</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple">Network Access</h3>
                  <p className="text-gray-600">WiFi setup and troubleshooting</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple">Email Setup</h3>
                  <p className="text-gray-600">Student and faculty email configuration</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple">Software Licensing</h3>
                  <p className="text-gray-600">Access to academic software packages</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple">Printing Services</h3>
                  <p className="text-gray-600">Campus printer setup and support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ITHelpDesk;