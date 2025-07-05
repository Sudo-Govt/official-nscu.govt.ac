
import PageLayout from '@/components/PageLayout';
import { Users, Heart, Globe, Award, BookOpen, Handshake } from 'lucide-react';

const diversityStats = [
  {
    icon: Users,
    title: "Student Diversity",
    value: "45%",
    description: "Students from underrepresented groups"
  },
  {
    icon: Globe,
    title: "International Students",
    value: "18%",
    description: "Students from 100+ countries"
  },
  {
    icon: BookOpen,
    title: "First-Generation",
    value: "28%",
    description: "First-generation college students"
  },
  {
    icon: Award,
    title: "Diversity Faculty",
    value: "38%",
    description: "Faculty from diverse backgrounds"
  }
];

const inclusionPrograms = [
  {
    title: "Multicultural Center",
    description: "A welcoming space for students from all backgrounds to connect, learn, and celebrate diversity",
    services: ["Cultural programming", "Identity-based organizations", "Peer mentoring", "Safe space discussions"],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "First-Generation Success Program",
    description: "Comprehensive support system for students who are the first in their families to attend college",
    services: ["Academic coaching", "Financial literacy", "Career guidance", "Family engagement"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "International Student Services",
    description: "Supporting our global community with immigration, cultural adjustment, and academic success",
    services: ["Visa support", "Cultural orientation", "English language support", "Global networking"],
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "LGBTQ+ Resource Center",
    description: "Creating an inclusive environment for students of all sexual orientations and gender identities",
    services: ["Support groups", "Educational workshops", "Advocacy training", "Safe zone program"],
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const culturalOrganizations = [
  {
    name: "Black Student Union",
    focus: "African American student advocacy and cultural celebration",
    activities: ["Heritage Month events", "Academic support", "Community service", "Leadership development"]
  },
  {
    name: "Latino Student Association",
    focus: "Hispanic and Latino cultural programming and support",
    activities: ["Cultural festivals", "Scholarship programs", "Mentorship", "Professional networking"]
  },
  {
    name: "Asian Pacific American Student Association",
    focus: "Asian and Pacific Islander student community building",
    activities: ["Cultural showcases", "Leadership retreats", "Academic excellence", "Community outreach"]
  },
  {
    name: "Native American Student Alliance",
    focus: "Indigenous student support and cultural preservation",
    activities: ["Traditional ceremonies", "Educational workshops", "Environmental advocacy", "Cultural exchange"]
  },
  {
    name: "International Student Organization",
    focus: "Global student community and cross-cultural understanding",
    activities: ["International fair", "Cultural exchanges", "Language partnerships", "Global awareness"]
  },
  {
    name: "Interfaith Council",
    focus: "Religious diversity and spiritual growth",
    activities: ["Interfaith dialogue", "Service projects", "Religious celebrations", "Spiritual support"]
  }
];

const DiversityInclusion = () => {
  return (
    <PageLayout 
      title="Diversity, Equity & Inclusion" 
      description="Building an inclusive community where all students, faculty, and staff can thrive and succeed"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Diversity Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {diversityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="bg-uw-purple rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-uw-purple mb-2">{stat.title}</h3>
                  <div className="text-3xl font-bold text-uw-gold mb-2">{stat.value}</div>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Mission Statement */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-uw-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-uw-purple mb-4">Our Commitment to Inclusion</h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                At NSCU, we believe that diversity strengthens our community and enhances the educational 
                experience for all. We are committed to creating an inclusive environment where every 
                individual feels valued, respected, and empowered to reach their full potential.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">Diversity</h3>
                <p className="text-gray-700">
                  We celebrate the rich tapestry of backgrounds, experiences, and perspectives that 
                  make our community vibrant and dynamic.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">Equity</h3>
                <p className="text-gray-700">
                  We work to ensure fair treatment, access, and opportunity for all members of our 
                  community, regardless of their background or identity.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">Inclusion</h3>
                <p className="text-gray-700">
                  We foster an environment where all individuals feel welcomed, valued, and able to 
                  contribute their unique talents and perspectives.
                </p>
              </div>
            </div>
          </div>

          {/* Inclusion Programs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Support Programs & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inclusionPrograms.map((program, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-uw-purple mb-3">{program.title}</h3>
                    <p className="text-gray-700 mb-4">{program.description}</p>
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2">Services Offered:</h4>
                      <ul className="space-y-1">
                        {program.services.map((service, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <div className="bg-uw-gold rounded-full w-1.5 h-1.5 mt-2 mr-2 flex-shrink-0"></div>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Organizations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Cultural & Identity Organizations</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalOrganizations.map((org, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-uw-purple mb-2">{org.name}</h3>
                    <p className="text-gray-700 mb-3 text-sm">{org.focus}</p>
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2 text-sm">Activities:</h4>
                      <ul className="space-y-1">
                        {org.activities.map((activity, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start">
                            <div className="bg-uw-gold rounded-full w-1 h-1 mt-1.5 mr-2 flex-shrink-0"></div>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Initiatives & Achievements */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Recent Initiatives & Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-uw-purple mb-4">Academic Excellence</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Launched $5M scholarship fund for underrepresented students</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Increased diverse faculty hiring by 35% over three years</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Established mentorship program with 95% retention rate</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Created inclusive curriculum guidelines across all departments</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-uw-purple mb-4">Campus Climate</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Handshake className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Implemented bias incident reporting and response system</span>
                  </li>
                  <li className="flex items-start">
                    <Handshake className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Trained 500+ faculty and staff in cultural competency</span>
                  </li>
                  <li className="flex items-start">
                    <Handshake className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Renovated spaces to be fully accessible and inclusive</span>
                  </li>
                  <li className="flex items-start">
                    <Handshake className="h-5 w-5 text-uw-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Established interfaith prayer and meditation spaces</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Get Involved */}
          <div className="bg-uw-purple rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Inclusive Community</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Whether you're a prospective student, current community member, or alumni, there are many 
              ways to get involved in building a more diverse and inclusive NSCU.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Student Organizations</h3>
                <p className="text-sm">Join one of our 50+ cultural and identity-based organizations</p>
              </div>
              <div>
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Educational Programs</h3>
                <p className="text-sm">Participate in workshops, seminars, and cultural celebrations</p>
              </div>
              <div>
                <Heart className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Volunteer Opportunities</h3>
                <p className="text-sm">Get involved in community service and advocacy initiatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DiversityInclusion;
