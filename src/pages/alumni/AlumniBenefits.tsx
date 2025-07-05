
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, BookOpen, Car, Briefcase } from 'lucide-react';

const AlumniBenefits = () => {
  return (
    <PageLayout 
      title="Alumni Benefits" 
      description="Exclusive benefits and services for NSCU alumni"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Lifetime Benefits</h2>
            <p className="text-gray-600 mb-4">
              Your NSCU degree opens doors to exclusive benefits and services designed to 
              support your personal and professional growth throughout your lifetime. From 
              career services to recreation facilities, we're here for you.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm">Exclusive Benefits</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">$500</div>
                <div className="text-sm">Average Annual Savings</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Library Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Lifetime access to university libraries and online resources
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Briefcase className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Career Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Lifetime career counseling and job placement assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Available Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Alumni Credit Card</h3>
              <p className="text-sm text-gray-600">No annual fee with rewards program</p>
            </div>
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Insurance Discounts</h3>
              <p className="text-sm text-gray-600">Auto, home, and life insurance savings</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Continuing Education</h3>
              <p className="text-sm text-gray-600">Discounted professional development courses</p>
            </div>
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Recreation Access</h3>
              <p className="text-sm text-gray-600">Campus fitness facilities and programs</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AlumniBenefits;
