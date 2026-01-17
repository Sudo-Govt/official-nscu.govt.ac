
import PageLayout from '@/components/PageLayout';
import { AlertTriangle, Shield, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmergencyAlerts = () => {
  return (
    <PageLayout 
      title="Emergency Information" 
      description="Safety alerts, emergency procedures, and important campus security information"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Current Alert Status */}
          <div className="bg-green-100 border border-green-400 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-bold text-green-800">Campus Status: Normal Operations</h3>
                <p className="text-green-700">No current emergency alerts. Campus is operating under normal conditions.</p>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Emergency</h3>
              <p className="text-red-700 mb-4">Life-threatening situations</p>
              <Button className="bg-red-600 hover:bg-red-700 w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call 911
              </Button>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center border border-blue-200">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-800 mb-2">Campus Security</h3>
              <p className="text-blue-700 mb-4">Non-emergency security issues</p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Phone className="h-4 w-4 mr-2" />
                (302) 857-6911
              </Button>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 text-center border border-yellow-200">
              <MapPin className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Safe Walk Service</h3>
              <p className="text-yellow-700 mb-4">24/7 campus escort service</p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 w-full">
                <Phone className="h-4 w-4 mr-2" />
                (302) 857-7233
              </Button>
            </div>
          </div>

          {/* Alert System Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6">NSCU Alert System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">How It Works</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    Emergency notifications sent via text, email, and campus speakers
                  </li>
                  <li className="flex items-start">
                    <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    Weather alerts and campus closure information
                  </li>
                  <li className="flex items-start">
                    <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    Security incidents affecting campus safety
                  </li>
                  <li className="flex items-start">
                    <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    Updates posted on university website and social media
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Stay Connected</h3>
                <p className="text-gray-700 mb-4">
                  Ensure you receive emergency alerts by keeping your contact information updated in the student portal.
                </p>
                <Button className="bg-uw-purple hover:bg-uw-purple/90 mb-4">
                  Update Contact Info
                </Button>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-uw-purple mb-2">Download NSCU Safety App</h4>
                  <p className="text-sm text-gray-600">
                    Get instant notifications, access emergency resources, and request safety escorts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6">Emergency Procedures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-uw-purple mb-2">Fire Emergency</h3>
                <p className="text-sm text-gray-600">
                  Evacuate immediately, use stairs, meet at designated assembly points
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-uw-purple mb-2">Active Threat</h3>
                <p className="text-sm text-gray-600">
                  Run, Hide, Fight - Follow campus security instructions immediately
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-uw-purple mb-2">Severe Weather</h3>
                <p className="text-sm text-gray-600">
                  Move to interior rooms on lowest floor, avoid windows and doors
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-uw-purple mb-2">Medical Emergency</h3>
                <p className="text-sm text-gray-600">
                  Call 911, provide first aid if trained, wait for emergency services
                </p>
              </div>
            </div>
          </div>

          {/* Resources and Links */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6">Emergency Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Important Links</h3>
                <ul className="space-y-2">
                  <li><a href="/resources/campus-safety" className="text-uw-gold hover:underline">Campus Safety Handbook</a></li>
                  <li><a href="/campus/facilities" className="text-uw-gold hover:underline">Emergency Evacuation Maps</a></li>
                  <li><a href="/resources/academic-policies" className="text-uw-gold hover:underline">Weather Closure Policies</a></li>
                  <li><a href="/student-life/health-wellness" className="text-uw-gold hover:underline">Mental Health Resources</a></li>
                  <li><a href="/resources/title-ix" className="text-uw-gold hover:underline">Title IX Information</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">24/7 Support Services</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <div className="font-semibold">Crisis Hotline</div>
                      <div className="text-sm text-gray-600">(302) 857-HELP (4357)</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <div className="font-semibold">Emergency Email</div>
                      <div className="text-sm text-gray-600">emergency@nscu.edu</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <div className="font-semibold">Campus Security Office</div>
                      <div className="text-sm text-gray-600">Student Union, Room 150</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EmergencyAlerts;
