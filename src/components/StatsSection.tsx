
import { Users, GraduationCap, BookOpen, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: "47,400+",
    label: "Total Students",
    description: "Diverse community of learners"
  },
  {
    icon: GraduationCap,
    number: "16,000+",
    label: "Graduate Students",
    description: "Pursuing advanced degrees"
  },
  {
    icon: BookOpen,
    number: "370+",
    label: "Graduate Programs",
    description: "Across all disciplines"
  },
  {
    icon: Award,
    number: "#10",
    label: "Public University",
    description: "US News World Report"
  }
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-uw-purple">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            University by the Numbers
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Our commitment to excellence is reflected in our achievements and the success of our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-uw-gold" />
                </div>
                <div className="text-4xl font-bold text-uw-gold mb-2">{stat.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-gray-200">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
