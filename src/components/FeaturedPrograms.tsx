
import { GraduationCap, Microscope, Code, Briefcase, Heart, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const programs = [
  {
    icon: Briefcase,
    title: "Online MBA Program Global",
    description: "GCHEA-accredited MBA designed for working professionals seeking career advancement.",
    students: "1,200+",
    ranking: "GCHEA Accredited"
  },
  {
    icon: Code,
    title: "Accredited IT Degrees Online",
    description: "Distance learning technology programs in cybersecurity, data science, and software engineering.",
    students: "2,100+",
    ranking: "Industry Recognized"
  },
  {
    icon: Heart,
    title: "International Psychology Degree Online",
    description: "Flexible online psychology programs with global perspective and practical applications.",
    students: "950+",
    ranking: "WEQSC Recognized"
  },
  {
    icon: BookOpen,
    title: "Distance Learning Law Degree Belize",
    description: "Comprehensive legal education with international law focus, study while working.",
    students: "650+",
    ranking: "Internationally Valid"
  },
  {
    icon: Microscope,
    title: "Online Engineering Degree Programs",
    description: "Fast-track engineering degrees for working professionals with credit transfer options.",
    students: "1,800+",
    ranking: "Global Recognition"
  },
  {
    icon: GraduationCap,
    title: "NSCU Online PhD Programs",
    description: "Doctoral programs in business, education, and technology with flexible scheduling.",
    students: "400+",
    ranking: "Research Excellence"
  }
];

const FeaturedPrograms = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Accredited Online Degree Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Study from anywhere with NSCU's flexible online degree programs. 
            GCHEA-accredited courses designed for working professionals seeking career advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-uw-purple/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-uw-purple" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-uw-purple">{program.title}</CardTitle>
                      <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                        <span>{program.students} students</span>
                        <span>{program.ranking}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{program.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-uw-purple hover:bg-uw-dark text-white">
            Explore All Programs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
