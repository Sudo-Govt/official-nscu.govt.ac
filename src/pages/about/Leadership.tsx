
import PageLayout from '@/components/PageLayout';
import { Mail, Phone, Award, GraduationCap } from 'lucide-react';

const leaders = [
  {
    name: "Dr. Sarah Mitchell",
    title: "President",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Dr. Mitchell brings over 20 years of experience in higher education administration. She holds a Ph.D. in Educational Leadership from Harvard University and has been instrumental in advancing NSCU's research initiatives and global partnerships.",
    achievements: ["Led $500M capital campaign", "Established 15 international partnerships", "Increased research funding by 40%"],
    email: "president@nscu.govt.ac",
    phone: "(302) 857-1000"
  },
  {
    name: "Dr. Michael Chen",
    title: "Provost & Vice President for Academic Affairs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Dr. Chen oversees all academic programs and faculty affairs. With a background in engineering and education, he has championed interdisciplinary studies and innovative teaching methods.",
    achievements: ["Launched online learning platform", "Increased graduation rates by 15%", "Implemented faculty excellence program"],
    email: "Provost@nscu.govt.ac",
    phone: "(302) 857-1100"
  },
  {
    name: "Dr. Jennifer Rodriguez",
    title: "Vice President for Research",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Dr. Rodriguez leads NSCU's research enterprise, overseeing $2.1 billion in annual research expenditures. She is a renowned scientist with expertise in biotechnology and materials science.",
    achievements: ["Secured $100M NSF grant", "Established 5 research centers", "Published 150+ peer-reviewed papers"],
    email: "vp-research@nscu.govt.ac",
    phone: "(302) 857-1200"
  },
  {
    name: "Robert Thompson",
    title: "Vice President for Student Affairs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Robert Thompson oversees all aspects of student life, from housing and dining to student organizations and wellness programs. He is passionate about creating an inclusive campus environment.",
    achievements: ["Launched mental health initiative", "Increased student satisfaction by 25%", "Established diversity programs"],
    email: "vp-students@nscu.govt.ac",
    phone: "(302) 857-1300"
  }
];

import { useSEO } from '@/hooks/useSEO';

const Leadership = () => {
  useSEO({
    title: "University Leadership - NSCU Belize Administration & Faculty Leaders",
    description: "Meet NSCU Belize leadership team. Experienced university administration and academic leaders committed to excellence in higher education and student success.",
    keywords: "NSCU Belize university leadership, university administration team, academic leaders Belize, university president provost, NSCU leadership experience, higher education administration",
    canonical: "https://newstatesuniversity.lovable.app/about/leadership",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      "name": "New States Continental University - Leadership",
      "description": "University leadership and administration at NSCU Belize",
      "parentOrganization": {
        "@type": "University",
        "name": "New States Continental University"
      },
      "employee": [
        {
          "@type": "Person",
          "name": "Dr. Sarah Mitchell",
          "jobTitle": "President",
          "worksFor": {
            "@type": "University",
            "name": "New States Continental University"
          }
        }
      ]
    }
  });

  return (
    <PageLayout 
      title="University Leadership" 
      description="Meet the dedicated leaders guiding NSCU toward excellence and innovation"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* President's Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <img 
                src={leaders[0].image} 
                alt={`${leaders[0].name} - ${leaders[0].title} at NSCU Belize Leadership Team`}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-3xl font-bold text-uw-purple mb-2">{leaders[0].name}</h2>
              <p className="text-xl text-uw-gold mb-4">{leaders[0].title}</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                "As we look toward the future, NSCU remains committed to our founding principles of 
                excellence, innovation, and service. Our university has always been a place where 
                ambitious minds come together to tackle the world's greatest challenges. Today, we 
                continue that tradition by fostering an environment where students, faculty, and 
                staff can achieve their highest potential while making meaningful contributions to 
                our global community."
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                "I am proud to lead an institution that values diversity, promotes inclusion, and 
                champions the pursuit of knowledge. Together, we are building a brighter future 
                for Central America and beyond."
              </p>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Executive Leadership Team</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {leaders.map((leader, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <img 
                        src={leader.image} 
                        alt={`${leader.name} - NSCU ${leader.title} University Leadership`}
                        className="w-20 h-20 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-uw-purple mb-1">{leader.name}</h3>
                        <p className="text-uw-gold font-semibold mb-2">{leader.title}</p>
                        <div className="flex flex-col space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            <a href={`mailto:${leader.email}`} className="hover:text-uw-purple">
                              {leader.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{leader.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{leader.bio}</p>
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {leader.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-2 flex-shrink-0"></div>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Board of Trustees */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Board of Trustees</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-bold text-uw-purple mb-2">Patricia Williams</h3>
                <p className="text-uw-gold font-semibold mb-1">Board Chair</p>
                <p className="text-sm text-gray-600">Former CEO, Delaware Business Council</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-uw-purple mb-2">Dr. James Foster</h3>
                <p className="text-uw-gold font-semibold mb-1">Vice Chair</p>
                <p className="text-sm text-gray-600">Retired President, Foster Medical Group</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-uw-purple mb-2">Maria Gonzalez</h3>
                <p className="text-uw-gold font-semibold mb-1">Secretary</p>
                <p className="text-sm text-gray-600">Partner, Gonzalez & Associates Law Firm</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">
                The Board of Trustees provides governance and strategic oversight for the university,
                ensuring accountability and advancing our mission of excellence.
              </p>
              <a href="#" className="text-uw-purple hover:text-uw-gold font-semibold">
                View Complete Board Membership →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Leadership;
