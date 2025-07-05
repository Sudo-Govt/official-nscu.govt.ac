
import { Microscope, Atom, Cpu, HeartHandshake, Globe, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const researchAreas = [
  {
    icon: Atom,
    title: "Quantum Sciences",
    description: "Pioneering research in quantum computing, cryptography, and materials science.",
    funding: "$45M Annual Funding",
    highlight: "Home to the Quantum Computing Lab"
  },
  {
    icon: Cpu,
    title: "Artificial Intelligence",
    description: "Advancing machine learning, robotics, and human-computer interaction.",
    funding: "$38M Annual Funding",
    highlight: "AI Ethics Research Center"
  },
  {
    icon: HeartHandshake,
    title: "Global Health",
    description: "Addressing worldwide health challenges through innovative research and partnerships.",
    funding: "$52M Annual Funding",
    highlight: "WHO Collaborating Center"
  },
  {
    icon: Globe,
    title: "Climate Solutions",
    description: "Developing sustainable technologies for environmental conservation and energy.",
    funding: "$41M Annual Funding",
    highlight: "Carbon Neutrality by 2030"
  },
  {
    icon: Microscope,
    title: "Biomedical Innovation",
    description: "Revolutionary discoveries in genetics, cancer research, and precision medicine.",
    funding: "$67M Annual Funding",
    highlight: "Gene Therapy Breakthrough"
  },
  {
    icon: Lightbulb,
    title: "Social Innovation",
    description: "Tackling societal challenges through interdisciplinary research and policy.",
    funding: "$29M Annual Funding",
    highlight: "Policy Impact Institute"
  }
];

const ResearchExcellence = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-uw-purple to-uw-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Research Excellence
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Our world-renowned faculty and researchers are pushing the boundaries of knowledge 
            across disciplines, creating solutions for tomorrow's challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {researchAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-uw-gold/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-uw-gold" />
                  </div>
                  <CardTitle className="text-xl text-white">{area.title}</CardTitle>
                  <div className="text-sm font-semibold text-uw-gold">{area.funding}</div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-200 leading-relaxed mb-3">{area.description}</p>
                  <div className="text-sm text-uw-gold font-medium">{area.highlight}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark font-semibold">
            Explore Research Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResearchExcellence;
