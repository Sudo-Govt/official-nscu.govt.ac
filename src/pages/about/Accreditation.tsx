import PageLayout from '@/components/PageLayout';
import { Award, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Accreditation = () => {
  return (
    <PageLayout 
      title="Accreditation and Legal Status" 
      description="Official recognition and quality assurance framework"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Main Content */}
          <div className="bg-card rounded-lg shadow-lg p-8 md:p-12 mb-8 space-y-8">
            
            {/* Header Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-6 rounded-full">
                <Award className="h-16 w-16 text-primary" />
              </div>
            </div>

            {/* Legal Status */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                <strong>New States Continental University (NSCU)</strong> is a legally constituted higher education institution recognized under the authority of the <strong>Ministry of Education, Culture, Science and Technology (MoECST), Government of Belize</strong>, under <strong>License No. U135001</strong>.
              </p>
              
              <p className="text-lg leading-relaxed text-foreground">
                The university maintains international academic and operational oversight through <strong>NSCU Higher Education LLP, Delaware, United States</strong>.
              </p>
            </div>

            {/* GCHEA Accreditation */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                NSCU is institutionally accredited by the <strong>Global Council for Higher Education Accreditation (GCHEA)</strong>, headquartered in <strong>Switzerland</strong>. GCHEA functions in accordance with internationally accepted principles of quality assurance in higher education, consistent with the frameworks of <strong>INQAAHE</strong> and <strong>UNESCO</strong>.
              </p>
            </div>

            {/* Additional Recognition */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                In addition to GCHEA, NSCU maintains academic alignment and recognition through several international frameworks and quality networks, including the <strong>Northern States Academic Accreditation Council (NSAAC)</strong> and the <strong>Association of European Engineering Commission (AEEC)</strong>. These bodies collectively support benchmarking, curriculum evaluation, and quality parity across our degree programs.
              </p>
            </div>

            {/* Global Standards */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">
                All academic programs offered by NSCU are designed to comply with global outcome-based education standards, ensuring compatibility and equivalence with international higher education systems. NSCU currently serves students and academic partners across multiple regions — including <strong>Europe</strong>, <strong>China</strong>, <strong>Australia</strong>, the <strong>Middle East</strong>, <strong>India</strong>, <strong>Africa</strong>, and <strong>South America</strong> — under formal recognition agreements and institutional quality review protocols.
              </p>
            </div>

            {/* Verification Note */}
            <div className="pt-6 border-t border-border">
              <p className="text-lg leading-relaxed text-foreground mb-6">
                For institutional verification or document authentication, please contact our Registrar's Office:
              </p>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-card rounded-lg shadow-lg p-8 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Contact Information</h2>
            
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-xl font-bold text-foreground">Dr. Alexandre Moreau</p>
                <p className="text-lg text-muted-foreground">Director of International Admissions</p>
              </div>

              <div className="flex items-center justify-center gap-3 text-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:Dia@nscu.govt.ac" className="text-lg hover:text-primary transition-colors">
                  Dia@nscu.govt.ac
                </a>
              </div>

              <div className="flex items-center justify-center gap-3 text-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+13028576060" className="text-lg hover:text-primary transition-colors">
                  +1 (302) 857-6060 Ext. 104
                </a>
              </div>
            </div>
          </div>

          {/* University Footer Information */}
          <div className="bg-primary/5 rounded-lg p-8 md:p-10 border border-primary/10">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                New States Continental University – BELIZE
              </h3>
              
              <p className="text-lg text-foreground font-semibold">
                Managed by NSCU Higher Education LLP
              </p>
              
              <div className="space-y-3 text-foreground pt-4">
                <div className="flex items-start justify-center gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-base">
                    Corporate Office: 7209 Lancaster Pike, Hockessin, DE 19707, United States of America
                  </p>
                </div>
                
                <p className="text-base">
                  <strong>License No.:</strong> U135001 | <strong>Recognized by:</strong> MoECST – Belize
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                  <a 
                    href="https://www.nscu.govt.ac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base hover:text-primary transition-colors"
                  >
                    www.nscu.govt.ac
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+13028576060" className="text-base hover:text-primary transition-colors">
                    +1 (302) 857-6060
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Accreditation;
