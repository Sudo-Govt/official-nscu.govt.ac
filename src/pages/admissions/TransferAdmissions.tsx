
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Award, Calendar } from 'lucide-react';

import { useSEO } from '@/hooks/useSEO';

const TransferAdmissions = () => {
  useSEO({
    title: "Transfer Admissions - Credit Transfer Program | NSCU Belize",
    description: "Transfer to NSCU with credit recognition. GCHEA-accredited programs accepting transfer credits from accredited institutions worldwide. Flexible transfer options for working professionals.",
    keywords: "university transfer admissions Belize, credit transfer program NSCU, transfer student requirements international, accelerated degree completion transfer credits, flexible transfer options working professionals, GCHEA accredited transfer programs",
    canonical: "https://newstatesuniversity.lovable.app/admissions/transfer",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      "name": "Transfer Student Program - NSCU Belize",
      "description": "Credit transfer program for students seeking to complete their degree at NSCU",
      "provider": {
        "@type": "University",
        "name": "New States Continental University"
      },
      "programType": "Transfer Program",
      "timeToComplete": "P2Y",
      "applicationDeadline": "Rolling admissions"
    }
  });

  return (
    <PageLayout 
      title="Transfer Admissions" 
      description="Continue your academic journey at NSCU with seamless credit transfer"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Transfer Success</h2>
            <p className="text-gray-600 mb-4">
              NSCU welcomes transfer students from community colleges and four-year institutions. 
              Our dedicated transfer counselors work with you to maximize credit transfer and 
              ensure a smooth transition to university life.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">2,850</div>
                <div className="text-sm">Transfer Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm">Graduation Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Credit Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Up to 90 credits from community colleges, 75 from universities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Transfer Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Merit-based scholarships available for qualified transfer students
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Transfer Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Minimum Credits</h3>
              <p className="text-2xl font-bold text-uw-purple">24</p>
              <p className="text-sm text-gray-600">transferable credit hours</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">GPA Requirement</h3>
              <p className="text-2xl font-bold text-uw-purple">2.5</p>
              <p className="text-sm text-gray-600">minimum cumulative GPA</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Application Deadline</h3>
              <p className="text-2xl font-bold text-uw-purple">Rolling</p>
              <p className="text-sm text-gray-600">admission basis</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TransferAdmissions;
