import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Code, Cpu, Database, Globe, Users, Award } from 'lucide-react';

const ComputerScience = () => {
  useSEO({
    title: "Computer Science Department - NSCU Delaware",
    description: "Explore cutting-edge computer science programs at NSCU Delaware. Software engineering, AI, cybersecurity, and data science degrees with hands-on learning.",
    keywords: "computer science, software engineering, programming, AI, cybersecurity, data science, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Computer Science Department" 
      description="Pioneering the future of technology through innovative education and research"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Code className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">5 Degree Programs</h3>
              <p className="text-gray-600">Bachelor's to PhD levels</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">800+ Students</h3>
              <p className="text-gray-600">Diverse and talented community</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Award className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">95% Job Placement</h3>
              <p className="text-gray-600">Outstanding career outcomes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Degree Programs</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">Bachelor of Science in Computer Science</h3>
                  <p className="text-gray-600">Comprehensive foundation in programming, algorithms, and systems</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">BS in Software Engineering</h3>
                  <p className="text-gray-600">Focus on large-scale software development and project management</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">BS in Cybersecurity</h3>
                  <p className="text-gray-600">Protecting digital assets and information systems</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">MS in Data Science</h3>
                  <p className="text-gray-600">Advanced analytics and machine learning applications</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-uw-purple mb-2">PhD in Computer Science</h3>
                  <p className="text-gray-600">Research-focused doctoral program</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Research Areas</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Cpu className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Artificial Intelligence</h3>
                    <p className="text-gray-600">Machine learning, neural networks, and AI applications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Big Data & Analytics</h3>
                    <p className="text-gray-600">Processing and analyzing large-scale datasets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Web Technologies</h3>
                    <p className="text-gray-600">Modern web development and distributed systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Code className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Systems & Security</h3>
                    <p className="text-gray-600">Operating systems, networks, and cybersecurity</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-uw-purple text-white rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Industry Partnerships</h3>
                <p className="mb-4">We collaborate with leading technology companies to provide:</p>
                <ul className="space-y-2">
                  <li>• Internship opportunities</li>
                  <li>• Guest lectures from industry experts</li>
                  <li>• Real-world project experiences</li>
                  <li>• Career placement assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ComputerScience;