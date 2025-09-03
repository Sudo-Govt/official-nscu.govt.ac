import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Users, Heart, Book, Computer, Phone, Mail } from 'lucide-react';

const DisabilityServices = () => {
  useSEO({
    title: "Disability Services - Accessibility Support | NSCU Delaware",
    description: "NSCU Delaware provides comprehensive disability services and accommodations to ensure equal access to education for all students with disabilities.",
    keywords: "disability services, accessibility, accommodations, ADA compliance, learning disabilities, NSCU Delaware support"
  });

  return (
    <PageLayout 
      title="Disability Services" 
      description="Ensuring equal access and opportunities for all students"
    >
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">800+ Students Served</h3>
              <p className="text-gray-600">Comprehensive support annually</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Heart className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Individualized Care</h3>
              <p className="text-gray-600">Personalized accommodation plans</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Book className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Academic Success</h3>
              <p className="text-gray-600">Supporting educational goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Services Offered</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Academic Accommodations</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Extended time for exams</li>
                    <li>• Alternative testing formats</li>
                    <li>• Note-taking assistance</li>
                    <li>• Priority registration</li>
                    <li>• Accessible classroom seating</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Assistive Technology</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Screen reading software</li>
                    <li>• Voice recognition programs</li>
                    <li>• Magnification tools</li>
                    <li>• Braille displays</li>
                    <li>• Alternative keyboards</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Support Services</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Academic coaching</li>
                    <li>• Study skills workshops</li>
                    <li>• Counseling referrals</li>
                    <li>• Transition planning</li>
                    <li>• Advocacy and guidance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Getting Started</h2>
              <div className="space-y-6">
                <div className="p-6 bg-uw-purple text-white rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Registration Process</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Schedule an intake appointment</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Provide documentation of disability</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Develop individualized accommodation plan</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span>Begin receiving accommodations</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-uw-gold" />
                      <span className="text-gray-600">(302) 857-6050</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-uw-gold" />
                      <span className="text-gray-600">disability@nscu.edu</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Computer className="h-5 w-5 text-uw-gold mt-1" />
                      <div className="text-gray-600">
                        <p>Student Services Building</p>
                        <p>Room 150</p>
                        <p>Hours: Monday-Friday, 8:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Documentation Requirements</h3>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p>• Must be from qualified professional</p>
                    <p>• Current (within 3 years for most conditions)</p>
                    <p>• Include specific diagnosis and recommendations</p>
                    <p>• Describe functional limitations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DisabilityServices;