
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Users, Award } from 'lucide-react';

const TechnologyTransfer = () => {
  return (
    <PageLayout 
      title="Technology Transfer" 
      description="Transforming research discoveries into real-world solutions"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Innovation & Impact</h2>
            <p className="text-gray-600 mb-4">
              The Office of Technology Transfer helps researchers translate their discoveries 
              into practical applications that benefit society. We support patent protection, 
              licensing, and startup formation to maximize the impact of university research.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">185</div>
                <div className="text-sm">Active Patents</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm">Startup Companies</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Lightbulb className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Innovation Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Supporting entrepreneurs and inventors from idea to market
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Licensing Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  $8.5M in annual licensing revenue returned to inventors
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Innovation Metrics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Invention Disclosures</h3>
              <p className="text-2xl font-bold text-uw-purple">65</p>
              <p className="text-sm text-gray-600">submitted annually</p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patent Applications</h3>
              <p className="text-2xl font-bold text-uw-purple">42</p>
              <p className="text-sm text-gray-600">filed per year</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Industry Partnerships</h3>
              <p className="text-2xl font-bold text-uw-purple">95</p>
              <p className="text-sm text-gray-600">active collaborations</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Jobs Created</h3>
              <p className="text-2xl font-bold text-uw-purple">1,250</p>
              <p className="text-sm text-gray-600">by university startups</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TechnologyTransfer;
