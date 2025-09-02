
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, DollarSign, Users } from 'lucide-react';

const UndergraduateAdmissions = () => {
  return (
    <PageLayout 
      title="NSCU Belize Bachelor Degree Programs - GCHEA Accredited" 
      description="Apply to NSCU's affordable bachelor degree programs. GCHEA accredited programs designed for working professionals."
    >
      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Global Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85+</div>
              <p className="text-xs text-muted-foreground">Countries Represented</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <FileText className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">GCHEA Accredited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">All Programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Affordable Tuition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,800</div>
              <p className="text-xs text-muted-foreground">Per semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Flexible Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">Rolling</div>
              <p className="text-xs text-muted-foreground">Admissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Process */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">How to Apply to NSCU</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-uw-purple text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">1</div>
                <div>
                  <h3 className="font-semibold">Complete Application</h3>
                  <p className="text-gray-600">Apply from anywhere - no campus visit required</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-uw-purple text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">2</div>
                <div>
                  <h3 className="font-semibold">Submit Academic Documents</h3>
                  <p className="text-gray-600">High school or equivalent transcripts (international accepted)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-uw-purple text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">3</div>
                <div>
                  <h3 className="font-semibold">English Proficiency</h3>
                  <p className="text-gray-600">TOEFL/IELTS for international students (if applicable)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-uw-purple text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">4</div>
                <div>
                  <h3 className="font-semibold">Start Classes</h3>
                  <p className="text-gray-600">Begin your GCHEA accredited degree program</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Important Dates</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">Early Action Deadline</div>
                <div className="text-uw-purple">November 1, 2024</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">Regular Decision Deadline</div>
                <div className="text-uw-purple">January 15, 2025</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">FAFSA Priority Deadline</div>
                <div className="text-uw-purple">March 1, 2025</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">Decision Notification</div>
                <div className="text-uw-purple">March 15, 2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Programs Overview */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Choose Your Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Liberal Arts & Sciences</h3>
              <p className="mb-3">Explore diverse fields from biology to philosophy</p>
              <Badge variant="secondary">25+ Majors</Badge>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Engineering & Technology</h3>
              <p className="mb-3">Innovative programs in cutting-edge fields</p>
              <Badge variant="secondary">6 Departments</Badge>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Business & Professional</h3>
              <p className="mb-3">Prepare for leadership in the global economy</p>
              <Badge variant="secondary">AACSB Accredited</Badge>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UndergraduateAdmissions;
