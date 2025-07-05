
import PageLayout from '@/components/PageLayout';
import { Users, GraduationCap, BookOpen, Award, MapPin, Calendar } from 'lucide-react';

const facts = [
  {
    icon: Users,
    title: "Total Enrollment",
    value: "47,400+",
    description: "Students from all 50 states and 100+ countries"
  },
  {
    icon: GraduationCap,
    title: "Graduate Students",
    value: "16,000+",
    description: "Pursuing advanced degrees across all disciplines"
  },
  {
    icon: BookOpen,
    title: "Academic Programs",
    value: "370+",
    description: "Undergraduate and graduate programs"
  },
  {
    icon: Award,
    title: "National Ranking",
    value: "#10",
    description: "Among public universities (US News)"
  },
  {
    icon: MapPin,
    title: "Campus Size",
    value: "2,500",
    description: "Acres of beautiful campus in Dover"
  },
  {
    icon: Calendar,
    title: "Founded",
    value: "1891",
    description: "133+ years of academic excellence"
  }
];

const FastFacts = () => {
  return (
    <PageLayout 
      title="Fast Facts" 
      description="Key statistics and information about NSCU-Delaware"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {facts.map((fact, index) => {
              const IconComponent = fact.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="bg-uw-purple rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-uw-purple mb-2">{fact.title}</h3>
                  <div className="text-3xl font-bold text-uw-gold mb-2">{fact.value}</div>
                  <p className="text-gray-600">{fact.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">More About NSCU-Delaware</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Academic Excellence</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 22 colleges and schools</li>
                  <li>• 16:1 student-to-faculty ratio</li>
                  <li>• 95% of faculty hold terminal degrees</li>
                  <li>• $2.1 billion in research expenditures annually</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Campus Life</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 800+ student organizations</li>
                  <li>• 23 NCAA Division I sports teams</li>
                  <li>• 50+ fraternity and sorority chapters</li>
                  <li>• 15 residence hall communities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FastFacts;
