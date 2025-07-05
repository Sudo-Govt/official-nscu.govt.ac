
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Award, Calendar } from 'lucide-react';

const FundingOpportunities = () => {
  return (
    <PageLayout 
      title="Funding Opportunities" 
      description="Discover funding sources to support your research endeavors"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Research Funding</h2>
            <p className="text-gray-600 mb-4">
              NSCU provides comprehensive support for securing research funding from federal 
              agencies, private foundations, and industry partners. Our experienced grants 
              office assists with proposal development, submission, and award management.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm">Funding Success Rate</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">$45M</div>
                <div className="text-sm">New Awards Annually</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <DollarSign className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Proposal Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Pre-award services including budget development and compliance review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Internal Funding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Seed grants and faculty development awards available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Funding Sources</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Federal Agencies</h3>
              <p className="text-2xl font-bold text-uw-purple">$78M</p>
              <p className="text-sm text-gray-600">NSF, NIH, DOD, DOE</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Private Foundations</h3>
              <p className="text-2xl font-bold text-uw-purple">$25M</p>
              <p className="text-sm text-gray-600">Gates, Ford, Kellogg</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Industry Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">$18M</p>
              <p className="text-sm text-gray-600">Corporate R&D contracts</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Internal Awards</h3>
              <p className="text-2xl font-bold text-uw-purple">$4M</p>
              <p className="text-sm text-gray-600">University seed funding</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FundingOpportunities;
