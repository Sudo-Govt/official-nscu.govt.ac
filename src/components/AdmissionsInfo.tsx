
import { Calendar, FileText, DollarSign, GraduationCap, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const admissionSteps = [
  {
    step: "1",
    title: "Submit Application",
    description: "Complete your application through our online portal",
    deadline: "January 15, 2025"
  },
  {
    step: "2",
    title: "Transcripts & Test Scores",
    description: "Submit official transcripts and standardized test scores",
    deadline: "February 1, 2025"
  },
  {
    step: "3",
    title: "Essays & Recommendations",
    description: "Personal statement and letters of recommendation",
    deadline: "February 1, 2025"
  },
  {
    step: "4",
    title: "Decision Notification",
    description: "Admission decisions released",
    deadline: "March 15, 2025"
  }
];

const quickFacts = [
  {
    icon: GraduationCap,
    label: "Global Recognition",
    value: "GCHEA",
    description: "Internationally accredited degrees"
  },
  {
    icon: FileText,
    label: "Flexible Study",
    value: "100%",
    description: "Flexible programs for working adults"
  },
  {
    icon: DollarSign,
    label: "Affordable Tuition",
    value: "$2,500",
    description: "Per semester for international students"
  },
  {
    icon: Clock,
    label: "Fast Track",
    value: "12-18 months",
    description: "Complete your degree while working"
  }
];

const AdmissionsInfo = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-uw-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Apply to NSCU Belize - GCHEA Accredited Global University
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of working professionals earning accredited degrees. 
            Flexible programs designed for international students seeking career advancement.
          </p>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {quickFacts.map((fact, index) => {
            const IconComponent = fact.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="bg-uw-purple/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-uw-purple" />
                  </div>
                  <div className="text-2xl font-bold text-uw-purple mb-1">{fact.value}</div>
                  <div className="font-semibold text-gray-700 mb-1">{fact.label}</div>
                  <div className="text-sm text-gray-600">{fact.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Application Process */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-uw-purple text-center mb-8">Application Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((step, index) => (
              <Card key={index} className="relative border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="bg-uw-purple text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg text-uw-purple">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="text-sm font-semibold text-uw-gold">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {step.deadline}
                  </div>
                </CardContent>
                {index < admissionSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-uw-purple">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-uw-purple rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Earn Your Global Degree?</h3>
          <p className="text-lg mb-6 text-gray-200">
            Join NSCU Belize - the trusted GCHEA accredited university for working professionals worldwide. 
            Study with our globally recognized programs designed for international students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark">
              Start Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-uw-purple">
              Schedule Campus Visit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-uw-purple">
              Request Information
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsInfo;
