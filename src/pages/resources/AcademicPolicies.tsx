import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { FileText, Scale, BookOpen, Users, Calendar, Award } from 'lucide-react';

const AcademicPolicies = () => {
  useSEO({
    title: "Academic Policies - NSCU Delaware",
    description: "Review NSCU Delaware's academic policies including grading, attendance, academic integrity, registration procedures, and degree requirements.",
    keywords: "academic policies, grading policy, attendance policy, academic integrity, registration, degree requirements, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Academic Policies" 
      description="Comprehensive guide to academic standards and procedures"
    >
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Scale className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Grading Standards</h3>
              <p className="text-gray-600">Fair and consistent evaluation criteria</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Academic Integrity</h3>
              <p className="text-gray-600">Upholding educational excellence</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Award className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Degree Requirements</h3>
              <p className="text-gray-600">Clear pathways to graduation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Key Policies</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Grading System</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• A: 90-100% (Excellent)</li>
                    <li>• B: 80-89% (Good)</li>
                    <li>• C: 70-79% (Satisfactory)</li>
                    <li>• D: 60-69% (Below Standard)</li>
                    <li>• F: Below 60% (Failing)</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Attendance Policy</h3>
                  <p className="text-gray-600 text-sm">Students are expected to attend all classes. More than 3 unexcused absences may result in grade reduction.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Academic Probation</h3>
                  <p className="text-gray-600 text-sm">Students with GPA below 2.0 will be placed on academic probation and must meet with an advisor.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Procedures</h2>
              <div className="space-y-6">
                <div className="p-6 bg-uw-purple text-white rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold">Registration Process</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>1. Meet with academic advisor</p>
                    <p>2. Clear any holds on account</p>
                    <p>3. Register during assigned time slot</p>
                    <p>4. Pay tuition and fees by deadline</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Grade Appeals</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Students may appeal grades through a formal process:</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Submit appeal within 30 days</p>
                    <p>• Meet with department chair</p>
                    <p>• Formal review by faculty committee</p>
                    <p>• Final decision by Academic Dean</p>
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

export default AcademicPolicies;