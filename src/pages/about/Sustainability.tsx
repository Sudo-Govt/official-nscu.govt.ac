
import PageLayout from '@/components/PageLayout';
import { Leaf, Recycle, Zap, Droplets, Car, Award } from 'lucide-react';

const sustainabilityMetrics = [
  {
    icon: Zap,
    title: "Renewable Energy",
    value: "85%",
    description: "Campus energy from renewable sources"
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    value: "40%",
    description: "Reduction in water usage since 2015"
  },
  {
    icon: Recycle,
    title: "Waste Diversion",
    value: "75%",
    description: "Campus waste diverted from landfills"
  },
  {
    icon: Car,
    title: "Carbon Footprint",
    value: "60%",
    description: "Reduction in emissions since 2010"
  }
];

const greenInitiatives = [
  {
    title: "LEED Certified Buildings",
    description: "Over 25 campus buildings have achieved LEED certification, with 5 receiving Platinum status",
    impact: "30% reduction in energy consumption",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Solar Energy Program",
    description: "Campus-wide solar installation providing clean energy to academic and residential buildings",
    impact: "12 MW solar capacity installed",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Campus Farm Initiative",
    description: "Student-operated organic farm providing fresh produce to dining services",
    impact: "5,000 lbs of organic produce annually",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Green Transportation",
    description: "Electric shuttle fleet and bike-sharing program reducing campus emissions",
    impact: "25% reduction in vehicle emissions",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const researchProjects = [
  {
    title: "Climate Change Adaptation",
    department: "Environmental Science",
    funding: "$2.5M NSF Grant",
    description: "Developing innovative solutions for coastal communities facing rising sea levels and extreme weather events."
  },
  {
    title: "Renewable Energy Storage",
    department: "Engineering",
    funding: "$1.8M DOE Grant",
    description: "Advanced battery technology research for efficient storage of renewable energy at scale."
  },
  {
    title: "Sustainable Agriculture",
    department: "Agriculture & Natural Resources",
    funding: "$1.2M USDA Grant",
    description: "Precision agriculture techniques to reduce water usage and chemical inputs while maintaining crop yields."
  },
  {
    title: "Green Building Materials",
    department: "Materials Science",
    funding: "$950K Industry Partnership",
    description: "Development of eco-friendly construction materials from recycled and bio-based sources."
  }
];

const Sustainability = () => {
  return (
    <PageLayout 
      title="Sustainability & Environmental Leadership" 
      description="Leading the way in environmental stewardship, sustainability research, and green campus operations"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Sustainability Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sustainabilityMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="bg-green-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-uw-purple mb-2">{metric.title}</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">{metric.value}</div>
                  <p className="text-gray-600 text-sm">{metric.description}</p>
                </div>
              );
            })}
          </div>

          {/* Climate Commitment */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-uw-purple mb-4">Climate Commitment</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                NSCU is committed to achieving carbon neutrality by 2030 through innovative research, 
                sustainable operations, and community engagement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">2030 Goals</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Carbon neutral operations</li>
                  <li>• 100% renewable energy</li>
                  <li>• Zero waste to landfill</li>
                  <li>• LEED Gold minimum for new buildings</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">Current Progress</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 85% renewable energy achieved</li>
                  <li>• 60% carbon footprint reduction</li>
                  <li>• 25+ LEED certified buildings</li>
                  <li>• 75% waste diversion rate</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-uw-purple mb-3">Recognition</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• STARS Gold Rating</li>
                  <li>• EPA Green Power Partner</li>
                  <li>• Tree Campus USA</li>
                  <li>• Climate Leadership Award</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Green Initiatives */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Green Campus Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {greenInitiatives.map((initiative, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={initiative.image} 
                    alt={initiative.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-uw-purple mb-3">{initiative.title}</h3>
                    <p className="text-gray-700 mb-3">{initiative.description}</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <Leaf className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Impact: {initiative.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Projects */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Sustainability Research</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchProjects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-uw-purple">{project.title}</h3>
                      <span className="bg-uw-gold text-uw-dark px-2 py-1 rounded text-xs font-semibold">
                        {project.funding}
                      </span>
                    </div>
                    <p className="text-uw-gold font-semibold mb-2">{project.department}</p>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Engagement */}
          <div className="bg-green-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Get Involved in Sustainability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Recycle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Green Living Program</h3>
                <p className="mb-4">Join residence hall sustainability competitions and earn green living certification</p>
              </div>
              <div className="text-center">
                <Leaf className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Environmental Club</h3>
                <p className="mb-4">Participate in campus clean-up events, tree planting, and environmental advocacy</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sustainability Minor</h3>
                <p className="mb-4">Pursue interdisciplinary studies in environmental science and sustainable development</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sustainability;
