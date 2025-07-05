
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Shield, Phone } from 'lucide-react';

const HealthWellness = () => {
  return (
    <PageLayout 
      title="Health & Wellness" 
      description="Comprehensive health and wellness services to support your well-being"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Your Health Matters</h2>
            <p className="text-gray-600 mb-4">
              The Health & Wellness Center provides comprehensive medical care, mental health 
              services, and wellness programs to support your physical and emotional well-being 
              throughout your academic journey.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Crisis Support</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Student Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Heart className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Medical Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Primary care, urgent care, and specialty services on campus
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Shield className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Mental Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Counseling services, therapy, and mental health resources
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Health Services</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Primary Care</h3>
              <p className="text-sm text-gray-600">Routine medical care and checkups</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Counseling</h3>
              <p className="text-sm text-gray-600">Individual and group therapy</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Wellness Programs</h3>
              <p className="text-sm text-gray-600">Prevention and health promotion</p>
            </div>
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Crisis Support</h3>
              <p className="text-sm text-gray-600">24/7 emergency assistance</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HealthWellness;
