import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Users, BookOpen, Award, Target, Briefcase, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

const Collaborations = () => {
  // SEO optimization with comprehensive meta tags
  useSEO({
    title: 'Global Academic Collaborations | Partner with NSCU Delaware',
    description: 'Explore partnership opportunities with NSCU. Joint research, student exchange, dual degree programs, and international academic collaborations with Indian institutions.',
    keywords: 'NSCU partnerships, academic collaboration, international university partnerships, dual degree programs, student exchange, faculty exchange, research collaboration, study abroad India, higher education partnerships, joint research programs, academic excellence, global education network',
    canonical: 'https://www.nscu.govt.ac/international/collaborations',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "New States Continental University",
      "alternateName": "NSCU Delaware",
      "url": "https://www.nscu.govt.ac",
      "description": "NSCU offers global academic collaborations and partnerships with premier institutions worldwide, focusing on joint research, student exchange, and dual degree programs.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "Delaware"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "International Partnerships",
        "email": "partnerships@nscu.govt.ac",
        "telephone": "+1-302-XXX-XXXX"
      },
      "offers": {
        "@type": "Offer",
        "category": "Academic Partnerships",
        "description": "Joint research, faculty & student exchange, dual degree programs, skill development training, and cultural exchange programs"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    }
  });

  return (
    <PageLayout
      title="Global Academic Collaborations"
      description="Partnering with New States Continental University (NSCU) to transform higher education worldwide"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Introduction Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Globe className="w-16 h-16 mx-auto mb-6 text-primary" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              At New States Continental University (NSCU), our vision is rooted in the belief that knowledge transcends borders. 
              We are dedicated to fostering a dynamic global learning ecosystem where ideas converge, innovation thrives, and 
              cultures interconnect. Our strategic focus on building robust academic partnerships with premier institutions in 
              India is a cornerstone of our mission to enrich higher education and create unparalleled opportunities for students, 
              faculty, and communities worldwide.
            </p>
          </div>
        </section>

        {/* Mission & Objectives */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Our Collaborative Mission & Objectives
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our partnerships are built on a foundation of mutual benefit, academic excellence, and a shared commitment to 
              addressing global challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="w-10 h-10 mb-3 text-primary" />
                <CardTitle className="text-xl">Joint Research & Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We actively promote interdisciplinary research projects in fields such as Artificial Intelligence, 
                  Sustainable Engineering, Public Health, Business Analytics, and the Humanities. By pooling intellectual 
                  resources and infrastructure, we aim to secure international grants and publish groundbreaking findings 
                  that have a tangible global impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 mb-3 text-primary" />
                <CardTitle className="text-xl">Faculty & Student Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We create vibrant pathways for students and academics to gain international exposure. This includes 
                  semester abroad programs, visiting faculty residencies, and joint supervision of graduate research, 
                  fostering a diverse and intellectually stimulating campus environment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-10 h-10 mb-3 text-primary" />
                <CardTitle className="text-xl">Dual Degree & Credit Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We design integrated academic frameworks that allow students to earn qualifications from both NSCU and 
                  our partner institutions. These flexible, globally-recognized pathways enhance student mobility and 
                  career prospects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="w-10 h-10 mb-3 text-primary" />
                <CardTitle className="text-xl">Skill Development & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In alignment with global industry needs, we collaborate to offer specialized certification programs, 
                  executive education workshops, and vocational training. These initiatives are tailored to bridge the 
                  skills gap and empower a future-ready workforce.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-10 h-10 mb-3 text-primary" />
                <CardTitle className="text-xl">Cultural & Academic Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beyond the classroom, we cultivate deep, meaningful understanding through international symposiums, 
                  cultural festivals, and art exhibitions. These exchanges enrich the university experience and build 
                  lifelong global citizens.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Strategic Areas */}
        <section className="mb-16 bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Strategic Areas of Partnership</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Higher Education Institutions</h3>
              <p className="text-muted-foreground">
                Including central and state universities, private autonomous colleges, and Institutes of National Importance (INIs).
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Research Foundations and Innovation Hubs</h3>
              <p className="text-muted-foreground">
                Partnering with leading R&D centers, technology parks, and incubation labs to drive innovation from lab to market.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Skill Development Councils & Professional Bodies</h3>
              <p className="text-muted-foreground">
                Aligning our curricula with national and international standards set by industry bodies to ensure graduate readiness.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Public-Private Academic Initiatives</h3>
              <p className="text-muted-foreground">
                Engaging in tripartite projects that involve government, industry, and academia to solve real-world problems.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose NSCU */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NSCU as Your Academic Partner?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Globally Accredited Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our degrees and certifications hold international recognition, ensuring your students receive a world-class 
                  education valued by employers and institutions worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Unwavering Commitment to Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maintain the highest standards in pedagogy, research, and student support, ensuring a consistent and 
                  exceptional educational experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Regulatory Alignment & Flexibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our collaborative frameworks are meticulously designed to be compliant with Indian regulatory bodies 
                  (UGC, AICTE) and the visionary guidelines of the National Education Policy (NEP) 2020, facilitating seamless integration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Proven Track Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  With extensive experience in managing offshore academic centers and international partnerships, we guarantee 
                  operational integrity, academic rigor, and full regulatory compliance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Future Vision */}
        <section className="mb-16 bg-primary/5 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Envisioning the Future Together</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
              NSCU is actively expanding its network with universities, research organizations, and skill development 
              institutes across India. Our collective vision for the future includes:
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="flex-1">
                Co-creating specialized joint and dual degree programs in emerging fields.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="flex-1">
                Establishing international research consortiums to tackle global challenges like climate change, digital equity, 
                and public health.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="flex-1">
                Co-hosting prestigious international conferences, faculty development programs, and academic seminars.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p className="flex-1">
                Pioneering digital and blended learning initiatives to make quality education accessible to a wider audience.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Begin a Conversation with Us</CardTitle>
              <CardDescription className="text-lg">
                We believe that the most transformative ideas are born from collaboration. If your institution shares our 
                passion for global education and innovation, we would be delighted to explore the possibilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-center font-medium mb-6">
                  Please contact our Office of International Partnerships to initiate a dialogue:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">Email</span>
                    <a href="mailto:partnerships@nscu.govt.ac" className="text-primary hover:underline">
                      partnerships@nscu.govt.ac
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">Phone</span>
                    <a href="tel:+1302XXX" className="text-primary hover:underline">
                      +1-302-XXX-XXXX
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                    <Globe className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">Website</span>
                    <a href="https://www.nscu.govt.ac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      www.nscu.govt.ac
                    </a>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" className="gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Partnership Office
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Closing Statement */}
        <section className="text-center py-8">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Let's build bridges to the future, together!
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us in creating a transformative educational experience that empowers students and strengthens communities worldwide.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default Collaborations;
