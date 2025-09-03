import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { BookOpen, Download, Search, Users, Calendar, Shield } from 'lucide-react';

const StudentHandbook = () => {
  useSEO({
    title: "Student Handbook - Policies & Guidelines | NSCU Delaware",
    description: "Access the official NSCU Delaware Student Handbook containing academic policies, student rights, campus regulations, and essential university information.",
    keywords: "student handbook, academic policies, student rights, campus rules, university guidelines, NSCU policies"
  });

  return (
    <PageLayout 
      title="Student Handbook" 
      description="Your comprehensive guide to university policies and student life"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Academic Policies</h3>
              <p className="text-gray-600">Grading, attendance, and academic standards</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Student Rights</h3>
              <p className="text-gray-600">Your rights and responsibilities as a student</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Shield className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Campus Safety</h3>
              <p className="text-gray-600">Safety guidelines and emergency procedures</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Handbook Sections</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Academic Information</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Registration procedures</li>
                    <li>• Grading system</li>
                    <li>• Academic probation</li>
                    <li>• Transfer credit policies</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Student Conduct</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Code of conduct</li>
                    <li>• Disciplinary procedures</li>
                    <li>• Academic integrity</li>
                    <li>• Appeals process</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Campus Life</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Housing policies</li>
                    <li>• Dining services</li>
                    <li>• Student organizations</li>
                    <li>• Campus facilities</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Access Resources</h2>
              <div className="space-y-6">
                <div className="p-6 bg-uw-purple text-white rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Download className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold">Download Handbook</h3>
                  </div>
                  <p className="mb-4">Get the complete 2024-2025 Student Handbook</p>
                  <button className="bg-uw-gold text-uw-dark px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
                    Download PDF
                  </button>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Search className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Quick Search</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Find specific policies and procedures</p>
                  <div className="flex space-x-2">
                    <input 
                      type="search" 
                      placeholder="Search handbook..." 
                      className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-uw-gold"
                    />
                    <button className="px-4 py-2 bg-uw-purple text-white rounded hover:bg-uw-dark transition-colors">
                      Search
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Updates</h3>
                  </div>
                  <p className="text-gray-600">Last updated: August 2024</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Policy updates are published annually and mid-year when necessary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentHandbook;