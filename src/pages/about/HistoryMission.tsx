
import PageLayout from '@/components/PageLayout';
import { Calendar, Award, Users, Globe } from 'lucide-react';

const milestones = [
  {
    year: "1891",
    title: "University Founded",
    description: "Established as Delaware Agricultural College with 12 students and 3 faculty members"
  },
  {
    year: "1921",
    title: "State University Status",
    description: "Became the University of Delaware, expanding beyond agricultural education"
  },
  {
    year: "1952",
    title: "Research University",
    description: "Gained Research I classification and established graduate programs"
  },
  {
    year: "1978",
    title: "NSCU System Formation",
    description: "Joined the New States Continental University system as flagship campus"
  },
  {
    year: "2010",
    title: "Global Campus Initiative",
    description: "Launched international partnerships and study abroad programs"
  },
  {
    year: "2020",
    title: "Innovation Hub",
    description: "Opened state-of-the-art research facilities and startup incubator"
  }
];

const HistoryMission = () => {
  return (
    <PageLayout 
      title="History & Mission" 
      description="Our rich heritage and commitment to excellence in education, research, and service"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Mission Statement */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Our Mission</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                To advance learning through teaching, research, and service, preparing students to be 
                engaged citizens and leaders in a global society while contributing to the economic, 
                cultural, and social vitality of Delaware and beyond.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Users className="h-12 w-12 text-uw-gold mx-auto mb-3" />
                  <h3 className="font-bold text-uw-purple mb-2">Teaching Excellence</h3>
                  <p className="text-gray-600">Providing transformative educational experiences</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-uw-gold mx-auto mb-3" />
                  <h3 className="font-bold text-uw-purple mb-2">Research Innovation</h3>
                  <p className="text-gray-600">Advancing knowledge through discovery</p>
                </div>
                <div className="text-center">
                  <Globe className="h-12 w-12 text-uw-gold mx-auto mb-3" />
                  <h3 className="font-bold text-uw-purple mb-2">Community Service</h3>
                  <p className="text-gray-600">Serving our state and global community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Our History</h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-uw-gold rounded-full p-3 mr-6 flex-shrink-0">
                    <Calendar className="h-6 w-6 text-uw-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-uw-purple mr-4">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-uw-purple">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision and Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Our Vision</h2>
              <p className="text-gray-700 mb-4">
                To be a world-class public research university that transforms lives through 
                excellent teaching, innovative research, and meaningful service.
              </p>
              <p className="text-gray-700">
                We aspire to be recognized globally for our contributions to knowledge, 
                our commitment to student success, and our positive impact on society.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Core Values</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-uw-purple">Excellence:</span>
                    <span className="text-gray-700"> Pursuing the highest standards in all we do</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-uw-purple">Integrity:</span>
                    <span className="text-gray-700"> Acting with honesty and ethical principles</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-uw-purple">Innovation:</span>
                    <span className="text-gray-700"> Embracing creativity and forward thinking</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-uw-purple">Diversity:</span>
                    <span className="text-gray-700"> Celebrating and including all perspectives</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-uw-purple">Collaboration:</span>
                    <span className="text-gray-700"> Working together toward common goals</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HistoryMission;
