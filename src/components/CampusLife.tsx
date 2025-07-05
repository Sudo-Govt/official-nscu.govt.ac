
import { Users, Coffee, Dumbbell, Music, Palette, TreePine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const campusFeatures = [
  {
    icon: Users,
    title: "Student Organizations",
    description: "Over 800 student organizations covering every interest from academics to recreation.",
    stats: "800+ Organizations"
  },
  {
    icon: Coffee,
    title: "Dining & Cafes",
    description: "Award-winning dining halls and cozy cafes serving diverse, sustainable cuisine.",
    stats: "25+ Dining Locations"
  },
  {
    icon: Dumbbell,
    title: "Fitness & Recreation",
    description: "State-of-the-art fitness centers, pools, and outdoor recreation programs.",
    stats: "5 Fitness Centers"
  },
  {
    icon: Music,
    title: "Arts & Culture",
    description: "World-class performances, galleries, and creative spaces for artistic expression.",
    stats: "12 Performance Venues"
  },
  {
    icon: Palette,
    title: "Student Life Centers",
    description: "Modern spaces for studying, socializing, and community building.",
    stats: "8 Life Centers"
  },
  {
    icon: TreePine,
    title: "Green Spaces",
    description: "Beautiful courtyards, gardens, and outdoor study areas throughout campus.",
    stats: "150+ Acres"
  }
];

const CampusLife = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Vibrant Campus Life
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience a dynamic community where learning extends far beyond the classroom. 
            Our campus offers endless opportunities for growth, connection, and discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campusFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-uw-purple/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-uw-purple/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-uw-purple" />
                  </div>
                  <CardTitle className="text-xl text-uw-purple">{feature.title}</CardTitle>
                  <div className="text-sm font-semibold text-uw-gold">{feature.stats}</div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampusLife;
