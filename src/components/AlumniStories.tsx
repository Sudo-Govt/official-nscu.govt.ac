
import { Quote, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const alumniStories = [
  {
    name: "Dr. Sarah Chen",
    class: "Class of 2015",
    title: "Chief Technology Officer",
    company: "MedTech Innovations",
    quote: "NSCU gave me the foundation to revolutionize healthcare technology. The research opportunities and mentorship I received were invaluable.",
    achievement: "Led development of AI-powered diagnostic tools now used in 500+ hospitals worldwide",
    image: "photo-1494790108755-2616b612b5bc"
  },
  {
    name: "Marcus Rodriguez",
    class: "Class of 2018",
    title: "Environmental Policy Director",
    company: "United Nations",
    quote: "The interdisciplinary approach at NSCU taught me to think globally. I'm now shaping international climate policy.",
    achievement: "Authored the UN's Global Climate Action Framework adopted by 195 countries",
    image: "photo-1472099645785-5658abf4ff4e"
  },
  {
    name: "Dr. Aisha Patel",
    class: "Class of 2012",
    title: "Quantum Researcher",
    company: "Quantum Dynamics Lab",
    quote: "NSCU's cutting-edge research facilities and brilliant faculty prepared me for breakthroughs in quantum computing.",
    achievement: "Co-inventor of quantum error correction method featured in Nature",
    image: "photo-1580489944761-15a19d654956"
  }
];

const AlumniStories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Alumni Making an Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our graduates are leaders, innovators, and changemakers across every field. 
            See how NSCU prepared them to make their mark on the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {alumniStories.map((story, index) => (
            <Card key={index} className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/${story.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80)`
                }}
              />
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-uw-purple">{story.name}</h3>
                  <p className="text-uw-gold font-semibold">{story.class}</p>
                  <p className="text-gray-600">{story.title}, {story.company}</p>
                </div>
                
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-uw-purple mb-2" />
                  <p className="text-gray-700 italic leading-relaxed">"{story.quote}"</p>
                </div>
                
                <div className="bg-uw-purple/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Notable Achievement:</p>
                  <p className="text-sm text-uw-purple">{story.achievement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white">
            View More Alumni Stories
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AlumniStories;
