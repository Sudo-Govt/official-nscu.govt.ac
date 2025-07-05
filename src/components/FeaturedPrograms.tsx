
import { GraduationCap, Microscope, Code, Briefcase, Heart, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const programs = [
  {
    icon: Code,
    title: "Computer Science & Engineering",
    description: "Leading-edge research in AI, machine learning, and software systems.",
    students: "2,400+",
    ranking: "#6 Nationally"
  },
  {
    icon: Heart,
    title: "School of Medicine",
    description: "Training the next generation of healthcare leaders and researchers.",
    students: "950+",
    ranking: "#1 in Primary Care"
  },
  {
    icon: Briefcase,
    title: "Business School",
    description: "Innovative business education with global perspective.",
    students: "1,800+",
    ranking: "#22 Nationally"
  },
  {
    icon: Microscope,
    title: "College of Engineering",
    description: "Solving complex challenges through engineering excellence.",
    students: "4,200+",
    ranking: "#26 Nationally"
  },
  {
    icon: BookOpen,
    title: "College of Arts & Sciences",
    description: "Comprehensive liberal arts education fostering critical thinking.",
    students: "12,000+",
    ranking: "Top 10 Public"
  },
  {
    icon: GraduationCap,
    title: "Graduate School",
    description: "Advanced research and professional development opportunities.",
    students: "16,000+",
    ranking: "#15 Nationally"
  }
];

const FeaturedPrograms = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            World-Class Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from over 180 undergraduate and 370 graduate degree programs 
            across 18 schools and colleges, all designed to prepare you for success.
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
