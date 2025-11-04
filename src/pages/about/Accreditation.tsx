import PageLayout from '@/components/PageLayout';
import { Award, Mail, Phone, MapPin, Globe, CheckCircle, Building2, Users, GraduationCap, Shield } from 'lucide-react';

const Accreditation = () => {
  return (
    <PageLayout 
      title="Accreditation and Legal Status" 
      description="Official recognition and quality assurance framework"
    >
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Hero Section with Icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Accreditation & Legal Status
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized globally for academic excellence and institutional integrity
            </p>
          </div>

          {/* Legal Recognition - Highlighted Block */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-xl shadow-xl p-8 md:p-10 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Legal Recognition
                </h2>
                <div className="space-y-4">
                  <div className="bg-card/80 backdrop-blur rounded-lg p-6 border border-border">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-lg leading-relaxed text-foreground">
                          <strong className="text-primary">New States Continental University (NSCU)</strong> is a legally constituted higher education institution recognized under the authority of the <strong className="text-primary">Ministry of Education, Culture, Science and Technology (MoECST), Government of Belize</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card/80 backdrop-blur rounded-lg p-6 border border-border">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">License Number</p>
                          <p className="text-lg font-bold text-primary">U135001</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Regulatory Authority</p>
                          <p className="text-lg font-bold text-foreground">MoECST - Belize</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* International Oversight */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">International Oversight</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Managed by <strong className="text-primary">NSCU Higher Education LLP</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Corporate Office in <strong className="text-primary">Delaware, United States</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Global academic and operational standards
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg p-8 border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Institutional Accreditation</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Accredited by <strong className="text-primary">Global Council for Higher Education Accreditation (GCHEA)</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Headquartered in <strong className="text-primary">Switzerland</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Aligned with <strong className="text-primary">INQAAHE</strong> and <strong className="text-primary">UNESCO</strong> frameworks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Assurance Networks */}
          <div className="bg-card rounded-xl shadow-lg p-8 md:p-10 mb-8 border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              Quality Assurance Networks
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              NSCU maintains academic alignment and recognition through multiple international frameworks:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <h4 className="font-bold text-foreground">GCHEA</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Global Council for Higher Education Accreditation
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <h4 className="font-bold text-foreground">NSAAC</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Northern States Academic Accreditation Council
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <h4 className="font-bold text-foreground">AEEC</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Association of European Engineering Commission
                </p>
              </div>
            </div>
            <div className="mt-6 bg-muted/50 rounded-lg p-5">
              <p className="text-base text-foreground">
                <strong>These bodies collectively support:</strong>
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Academic benchmarking and quality standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Curriculum evaluation and development</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Quality parity across degree programs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Global Recognition */}
          <div className="bg-gradient-to-br from-card to-muted/20 rounded-xl shadow-lg p-8 md:p-10 mb-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Global Standards & Recognition
              </h2>
            </div>
            <div className="bg-card rounded-lg p-6 mb-6 border border-border">
              <p className="text-lg text-foreground leading-relaxed mb-4">
                All academic programs are designed to comply with <strong className="text-primary">global outcome-based education standards</strong>, ensuring compatibility and equivalence with international higher education systems.
              </p>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-4">Active Student & Partner Regions:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Europe', 'China', 'Australia', 'Middle East', 'India', 'Africa', 'South America', 'North America'].map((region) => (
                <div key={region} className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20 hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{region}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl shadow-2xl p-8 md:p-10 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Verification & Authentication
              </h2>
              <p className="text-lg opacity-90">
                For institutional verification or document authentication
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold mb-1">Dr. Alexandre Moreau</p>
                <p className="text-lg opacity-90">Director of International Admissions</p>
              </div>

              <div className="space-y-4">
                <a href="mailto:Dia@nscu.govt.ac" className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group">
                  <Mail className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-medium">Dia@nscu.govt.ac</span>
                </a>

                <a href="tel:+13028576060" className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group">
                  <Phone className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-medium">+1 (302) 857-6060 Ext. 104</span>
                </a>
              </div>
            </div>
          </div>

          {/* University Footer Information */}
          <div className="bg-card rounded-xl shadow-lg p-8 md:p-10 border border-border">
            <div className="text-center space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                New States Continental University – BELIZE
              </h3>
              
              <div className="inline-block bg-primary/10 rounded-lg px-6 py-3 border border-primary/20">
                <p className="text-lg text-foreground font-semibold">
                  Managed by NSCU Higher Education LLP
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-4 pt-4">
                <div className="flex items-start justify-center gap-3 bg-muted/50 rounded-lg p-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground mb-1">Corporate Office</p>
                    <p className="text-base font-medium text-foreground">
                      7209 Lancaster Pike, Hockessin, DE 19707, United States of America
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">License Number</p>
                    <p className="text-lg font-bold text-primary">U135001</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Recognized By</p>
                    <p className="text-lg font-bold text-foreground">MoECST – Belize</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href="https://www.nscu.govt.ac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 rounded-lg p-4 transition-colors group border border-primary/20"
                  >
                    <Globe className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-base font-medium text-foreground">www.nscu.govt.ac</span>
                  </a>
                  
                  <a 
                    href="tel:+13028576060" 
                    className="flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 rounded-lg p-4 transition-colors group border border-primary/20"
                  >
                    <Phone className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-base font-medium text-foreground">+1 (302) 857-6060</span>
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
