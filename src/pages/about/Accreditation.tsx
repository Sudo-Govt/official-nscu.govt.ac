import PageLayout from '@/components/PageLayout';
import { Award, Mail, Phone, MapPin, Globe, CheckCircle, Building2, Users, GraduationCap, Shield } from 'lucide-react';

const Accreditation = () => {
  return (
    <PageLayout 
      title="Accreditation and Legal Status" 
      description="Official recognition and quality assurance framework"
    >
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-uw-gold/5">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Hero Section with Icon */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-uw-purple shadow-lg mb-6">
              <Award className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Accreditation & Legal Status
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized globally for academic excellence and institutional integrity
            </p>
          </div>

          {/* Legal Recognition - Highlighted Block */}
          <div className="bg-gradient-to-br from-primary via-uw-purple to-primary/90 border-2 border-uw-gold rounded-xl shadow-2xl p-8 md:p-10 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-uw-gold" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  Legal Recognition
                </h2>
                <div className="space-y-4">
                  <div className="bg-background/95 backdrop-blur rounded-lg p-6 border-2 border-uw-gold/50 shadow-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-lg leading-relaxed text-foreground">
                          <strong className="text-primary">New States Continental University (NSCU)</strong> is a legally constituted higher education institution recognized under the authority of the <strong className="text-primary">Ministry of Education, Culture, Science and Technology (MoECST), Government of Belize</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background/95 backdrop-blur rounded-lg p-6 border-2 border-uw-gold/50 shadow-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-uw-gold/10 rounded-lg p-4">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-uw-gold animate-pulse"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">License Number</p>
                          <p className="text-lg font-bold text-uw-gold">U135001</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-success/10 rounded-lg p-4">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-success animate-pulse"></div>
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
            <div className="bg-gradient-to-br from-card to-primary/5 rounded-xl shadow-lg p-8 border-2 border-primary/30 hover:shadow-2xl hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-uw-purple flex items-center justify-center shadow-md">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">International Oversight</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Managed by <strong className="text-primary">NSCU Higher Education LLP</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Corporate Office in <strong className="text-primary">Delaware, United States</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Global academic and operational standards
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-card to-uw-gold/10 rounded-xl shadow-lg p-8 border-2 border-uw-gold/40 hover:shadow-2xl hover:border-uw-gold/60 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-uw-gold to-info flex items-center justify-center shadow-md">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Institutional Accreditation</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-uw-gold/10 rounded-lg p-3 border-l-4 border-uw-gold">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Accredited by <strong className="text-uw-gold">Global Council for Higher Education Accreditation (GCHEA)</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-uw-gold/10 rounded-lg p-3 border-l-4 border-uw-gold">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Headquartered in <strong className="text-uw-gold">Switzerland</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-uw-gold/10 rounded-lg p-3 border-l-4 border-uw-gold">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">
                    Aligned with <strong className="text-uw-gold">INQAAHE</strong> and <strong className="text-uw-gold">UNESCO</strong> frameworks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Assurance Networks */}
          <div className="bg-gradient-to-br from-card via-primary/5 to-uw-gold/5 rounded-xl shadow-xl p-8 md:p-10 mb-8 border-2 border-primary/30">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-uw-purple flex items-center justify-center">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              Quality Assurance Networks
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              NSCU maintains academic alignment and recognition through multiple international frameworks:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-uw-gold/20 to-uw-gold/5 rounded-lg p-5 border-2 border-uw-gold/40 hover:border-uw-gold hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-uw-gold animate-pulse"></div>
                  <h4 className="font-bold text-foreground">GCHEA</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Global Council for Higher Education Accreditation
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-5 border-2 border-primary/40 hover:border-primary hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                  <h4 className="font-bold text-foreground">NSAAC</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Northern States Academic Accreditation Council
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-info/20 to-info/5 rounded-lg p-5 border-2 border-info/40 hover:border-info hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-info animate-pulse"></div>
                  <h4 className="font-bold text-foreground">AEEC</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Association of European Engineering Commission
                </p>
              </div>
            </div>
            <div className="mt-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border-l-4 border-success">
              <p className="text-base text-foreground font-semibold mb-3">
                These bodies collectively support:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Academic benchmarking and quality standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Curriculum evaluation and development</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Quality parity across degree programs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Global Recognition */}
          <div className="bg-gradient-to-br from-info/10 via-card to-primary/10 rounded-xl shadow-xl p-8 md:p-10 mb-8 border-2 border-info/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-info to-uw-gold flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Global Standards & Recognition
              </h2>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-uw-gold/10 rounded-lg p-6 mb-6 border-2 border-primary/30">
              <p className="text-lg text-foreground leading-relaxed">
                All academic programs are designed to comply with <strong className="text-primary">global outcome-based education standards</strong>, ensuring compatibility and equivalence with international higher education systems.
              </p>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-info" />
              Active Student & Partner Regions:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Europe', 'China', 'Australia', 'Middle East', 'India', 'Africa', 'South America', 'North America'].map((region, index) => (
                <div 
                  key={region} 
                  className={`bg-gradient-to-br ${
                    index % 4 === 0 ? 'from-primary/20 to-primary/5 border-primary/40 hover:border-primary' :
                    index % 4 === 1 ? 'from-uw-gold/20 to-uw-gold/5 border-uw-gold/40 hover:border-uw-gold' :
                    index % 4 === 2 ? 'from-info/20 to-info/5 border-info/40 hover:border-info' :
                    'from-success/20 to-success/5 border-success/40 hover:border-success'
                  } rounded-lg p-4 text-center border-2 hover:shadow-lg transition-all`}
                >
                  <Globe className={`h-6 w-6 mx-auto mb-2 ${
                    index % 4 === 0 ? 'text-primary' :
                    index % 4 === 1 ? 'text-uw-gold' :
                    index % 4 === 2 ? 'text-info' :
                    'text-success'
                  }`} />
                  <p className="font-semibold text-foreground">{region}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-primary via-uw-purple to-primary/90 text-primary-foreground rounded-xl shadow-2xl p-8 md:p-10 mb-8 border-2 border-uw-gold">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Shield className="h-8 w-8 text-uw-gold" />
                Verification & Authentication
              </h2>
              <p className="text-lg opacity-95">
                For institutional verification or document authentication
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/95 to-background/90 backdrop-blur rounded-xl p-8 max-w-2xl mx-auto border-2 border-uw-gold/50 shadow-xl">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold mb-1 text-foreground">Dr. Alexandre Moreau</p>
                <p className="text-lg text-muted-foreground bg-uw-gold/10 rounded-lg py-2 px-4 inline-block border border-uw-gold/30">
                  Director of International Admissions
                </p>
              </div>

              <div className="space-y-4">
                <a href="mailto:Dia@nscu.govt.ac" className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary/10 to-uw-gold/10 hover:from-primary/20 hover:to-uw-gold/20 rounded-lg p-4 transition-all group border-2 border-primary/30 hover:border-primary/50">
                  <Mail className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-medium text-foreground">Dia@nscu.govt.ac</span>
                </a>

                <a href="tel:+13028576060" className="flex items-center justify-center gap-3 bg-gradient-to-r from-uw-gold/10 to-info/10 hover:from-uw-gold/20 hover:to-info/20 rounded-lg p-4 transition-all group border-2 border-uw-gold/30 hover:border-uw-gold/50">
                  <Phone className="h-6 w-6 text-uw-gold group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-medium text-foreground">+1 (302) 857-6060 Ext. 104</span>
                </a>
              </div>
            </div>
          </div>

          {/* University Footer Information */}
          <div className="bg-gradient-to-br from-card via-uw-gold/5 to-primary/10 rounded-xl shadow-xl p-8 md:p-10 border-2 border-uw-gold/30">
            <div className="text-center space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-uw-gold flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                New States Continental University – BELIZE
              </h3>
              
              <div className="inline-block bg-gradient-to-r from-primary/20 to-uw-gold/20 rounded-lg px-6 py-3 border-2 border-primary/40">
                <p className="text-lg text-foreground font-semibold">
                  Managed by NSCU Higher Education LLP
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-4 pt-4">
                <div className="flex items-start justify-center gap-3 bg-gradient-to-br from-primary/10 to-info/10 rounded-lg p-5 border-2 border-primary/30">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground mb-1 font-semibold">Corporate Office</p>
                    <p className="text-base font-medium text-foreground">
                      7209 Lancaster Pike, Hockessin, DE 19707, United States of America
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-uw-gold/20 to-uw-gold/5 rounded-lg p-4 border-2 border-uw-gold/40">
                    <p className="text-sm text-muted-foreground mb-1 font-semibold">License Number</p>
                    <p className="text-xl font-bold text-uw-gold">U135001</p>
                  </div>
                  <div className="bg-gradient-to-br from-success/20 to-success/5 rounded-lg p-4 border-2 border-success/40">
                    <p className="text-sm text-muted-foreground mb-1 font-semibold">Recognized By</p>
                    <p className="text-xl font-bold text-foreground">MoECST – Belize</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href="https://www.nscu.govt.ac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary/20 to-uw-purple/20 hover:from-primary/30 hover:to-uw-purple/30 rounded-lg p-4 transition-all group border-2 border-primary/40 hover:border-primary/60 hover:shadow-lg"
                  >
                    <Globe className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-base font-medium text-foreground">www.nscu.govt.ac</span>
                  </a>
                  
                  <a 
                    href="tel:+13028576060" 
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-uw-gold/20 to-info/20 hover:from-uw-gold/30 hover:to-info/30 rounded-lg p-4 transition-all group border-2 border-uw-gold/40 hover:border-uw-gold/60 hover:shadow-lg"
                  >
                    <Phone className="h-6 w-6 text-uw-gold group-hover:scale-110 transition-transform" />
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
