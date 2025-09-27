
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DynamicAdmissionsBanner from '@/components/DynamicAdmissionsBanner';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-uw-purple to-uw-dark overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)`
        }}
      />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Main Hero Content */}
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                NSCU Delaware USA - Your Global
                <span className="block text-uw-gold">University</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 animate-fade-in">
                Study at a GCHEA-accredited international university with globally recognized programs. 
                Earn prestigious degrees with flexible study options designed for working professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Button 
                  size="lg" 
                  className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark font-semibold"
                  onClick={() => navigate('/admissions/apply')}
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-uw-purple"
                  onClick={() => navigate('/home/virtual-tour')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Take a Virtual Tour
                </Button>
              </div>
            </div>
            
            {/* Dynamic Admissions Banner */}
            <div className="animate-fade-in">
              <DynamicAdmissionsBanner variant="compact" showCTA={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
