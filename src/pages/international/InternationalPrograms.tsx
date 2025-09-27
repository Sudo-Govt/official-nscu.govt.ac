import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Plane, Users, DollarSign, Calendar, MapPin, GraduationCap, Heart, Book, Award } from 'lucide-react';

const InternationalPrograms = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const studyAbroadPrograms = [
    {
      id: 1,
      name: 'Business Studies in London',
      location: 'London, United Kingdom',
      region: 'Europe',
      partner: 'University College London',
      duration: 'Full Semester (4 months)',
      cost: '$18,500',
      credits: 15,
      language: 'English',
      disciplines: ['Business', 'Finance', 'Marketing', 'International Trade'],
      highlights: [
        'Internship opportunities in London financial district',
        'Cultural immersion activities',
        'Access to UCL facilities and libraries',
        'Professional networking events'
      ],
      eligibility: {
        gpa: 3.0,
        year: 'Sophomore or above',
        prerequisites: ['ECON 201', 'BUS 101']
      },
      applicationDeadline: 'March 15, 2025',
      programDates: 'August - December 2025'
    },
    {
      id: 2,
      name: 'Engineering Innovation in Germany',
      location: 'Munich, Germany',
      region: 'Europe',
      partner: 'Technical University of Munich',
      duration: 'Summer Program (8 weeks)',
      cost: '$12,800',
      credits: 9,
      language: 'English (German classes available)',
      disciplines: ['Engineering', 'Technology', 'Innovation Management'],
      highlights: [
        'Hands-on projects with German companies',
        'Visit to BMW and Siemens facilities',
        'German language and culture courses',
        'Alpine excursions and cultural activities'
      ],
      eligibility: {
        gpa: 3.2,
        year: 'Junior or Senior',
        prerequisites: ['ENG 201', 'MATH 301']
      },
      applicationDeadline: 'February 1, 2025',
      programDates: 'June - August 2025'
    },
    {
      id: 3,
      name: 'Marine Biology Research in Australia',
      location: 'Cairns, Australia',
      region: 'Oceania',
      partner: 'James Cook University',
      duration: 'Summer Intensive (6 weeks)',
      cost: '$15,200',
      credits: 8,
      language: 'English',
      disciplines: ['Marine Biology', 'Environmental Science', 'Conservation'],
      highlights: [
        'Research at Great Barrier Reef',
        'Diving certification included',
        'Field research projects',
        'Indigenous culture workshops'
      ],
      eligibility: {
        gpa: 2.8,
        year: 'Any year',
        prerequisites: ['BIO 101', 'BIO 201']
      },
      applicationDeadline: 'January 30, 2025',
      programDates: 'May - July 2025'
    },
    {
      id: 4,
      name: 'Cultural Studies in Japan',
      location: 'Tokyo & Kyoto, Japan',
      region: 'Asia',
      partner: 'Waseda University',
      duration: 'Full Year (10 months)',
      cost: '$22,000',
      credits: 30,
      language: 'Japanese & English',
      disciplines: ['Japanese Studies', 'History', 'Art', 'Literature'],
      highlights: [
        'Homestay with Japanese families',
        'Intensive Japanese language training',
        'Traditional arts workshops',
        'Cultural sites and temple visits'
      ],
      eligibility: {
        gpa: 3.3,
        year: 'Sophomore or above',
        prerequisites: ['JPN 101 or equivalent']
      },
      applicationDeadline: 'November 15, 2024',
      programDates: 'September 2025 - June 2026'
    },
    {
      id: 5,
      name: 'Public Health Initiative in Ghana',
      location: 'Accra, Ghana',
      region: 'Africa',
      partner: 'University of Ghana',
      duration: 'Summer Service (10 weeks)',
      cost: '$8,900',
      credits: 12,
      language: 'English',
      disciplines: ['Public Health', 'Global Health', 'Community Development'],
      highlights: [
        'Community health projects',
        'Medical volunteer opportunities',
        'Tropical disease research',
        'Cultural exchange programs'
      ],
      eligibility: {
        gpa: 2.5,
        year: 'Any year',
        prerequisites: ['Health Sciences coursework preferred']
      },
      applicationDeadline: 'March 1, 2025',
      programDates: 'June - August 2025'
    },
    {
      id: 6,
      name: 'Sustainable Development in Costa Rica',
      location: 'San José, Costa Rica',
      region: 'Central America',
      partner: 'Universidad de Costa Rica',
      duration: 'Spring Semester (4 months)',
      cost: '$11,500',
      credits: 16,
      language: 'Spanish & English',
      disciplines: ['Environmental Studies', 'Sustainability', 'Ecology'],
      highlights: [
        'Rainforest conservation projects',
        'Sustainable agriculture practices',
        'Wildlife research opportunities',
        'Spanish language immersion'
      ],
      eligibility: {
        gpa: 2.8,
        year: 'Sophomore or above',
        prerequisites: ['SPAN 201 or equivalent']
      },
      applicationDeadline: 'October 15, 2024',
      programDates: 'January - May 2025'
    }
  ];

  const exchangePartners = [
    {
      name: 'University College London',
      country: 'United Kingdom',
      established: 2018,
      studentsExchanged: 45,
      programs: ['Business', 'Liberal Arts', 'Sciences']
    },
    {
      name: 'Sorbonne University',
      country: 'France',
      established: 2020,
      studentsExchanged: 32,
      programs: ['Languages', 'Art History', 'Philosophy']
    },
    {
      name: 'National University of Singapore',
      country: 'Singapore',
      established: 2019,
      studentsExchanged: 28,
      programs: ['Engineering', 'Computer Science', 'Business']
    },
    {
      name: 'University of São Paulo',
      country: 'Brazil',
      established: 2021,
      studentsExchanged: 19,
      programs: ['Medicine', 'Public Health', 'Environmental Science']
    }
  ];

  const scholarships = [
    {
      name: 'Global Hawks Scholarship',
      amount: '$5,000',
      description: 'Merit-based scholarship for academic excellence and leadership potential.',
      requirements: ['3.5+ GPA', 'Leadership experience', 'Essay application']
    },
    {
      name: 'Cultural Exchange Grant',
      amount: '$2,500',
      description: 'Supporting students from underrepresented backgrounds in study abroad.',
      requirements: ['Financial need demonstration', 'Cultural impact proposal']
    },
    {
      name: 'Research Abroad Fellowship',
      amount: '$7,500',
      description: 'For students conducting research projects during their international experience.',
      requirements: ['Research proposal', 'Faculty sponsor', 'Junior/Senior standing']
    }
  ];

  const regions = ['all', 'Europe', 'Asia', 'Africa', 'Oceania', 'Central America'];

  const filteredPrograms = selectedRegion === 'all' 
    ? studyAbroadPrograms 
    : studyAbroadPrograms.filter(program => program.region === selectedRegion);

  const totalStats = {
    programs: studyAbroadPrograms.length,
    countries: new Set(studyAbroadPrograms.map(p => p.location.split(',')[1].trim())).size,
    partners: exchangePartners.length,
    scholarships: scholarships.length
  };

  return (
    <PageLayout 
      title="International Programs" 
      description="Explore the world through NSCU's comprehensive study abroad and international exchange programs"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-uw-purple mb-4">International Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gain global perspectives and cross-cultural competencies through our diverse study abroad programs, 
            international exchanges, and global learning opportunities.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-3xl font-bold text-uw-purple">{totalStats.programs}</div>
              <div className="text-sm text-gray-600">Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-3xl font-bold text-uw-purple">{totalStats.countries}</div>
              <div className="text-sm text-gray-600">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-uw-gold mx-auto mb-2" />
              <div className="text-3xl font-bold text-uw-gold">{totalStats.partners}</div>
              <div className="text-sm text-gray-600">Partners</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-uw-gold mx-auto mb-2" />
              <div className="text-3xl font-bold text-uw-gold">{totalStats.scholarships}</div>
              <div className="text-sm text-gray-600">Scholarships</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Study Abroad</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-8">
            {/* Region Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region)}
                  className={selectedRegion === region ? "bg-uw-purple hover:bg-uw-dark" : "border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white"}
                >
                  {region === 'all' ? 'All Regions' : region}
                </Button>
              ))}
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-xl text-uw-purple mb-2">{program.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{program.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{program.partner}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-uw-purple text-uw-purple mb-2">
                          {program.region}
                        </Badge>
                        <div className="text-lg font-bold text-uw-gold">{program.cost}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{program.credits} Credits</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{program.language}</span>
                      </div>
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>GPA: {program.eligibility.gpa}+</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-uw-purple mb-2">Academic Focus:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.disciplines.map((discipline, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {discipline}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-uw-purple mb-2">Program Highlights:</h4>
                      <ul className="text-sm space-y-1">
                        {program.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="text-gray-600">• {highlight}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><strong>Application Deadline:</strong> {program.applicationDeadline}</div>
                        <div><strong>Program Dates:</strong> {program.programDates}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-uw-purple hover:bg-uw-dark">
                        Apply Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exchangePartners.map((partner, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-uw-purple">{partner.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.country}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-uw-gold font-semibold">{partner.studentsExchanged}</div>
                        <div className="text-gray-500">Students</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-uw-purple mb-2">Available Programs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.programs.map((program, programIndex) => (
                          <Badge key={programIndex} variant="outline" className="text-xs border-uw-purple text-uw-purple">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Partnership established: <span className="font-medium">{partner.established}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholarships" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scholarships.map((scholarship, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-uw-purple flex items-center">
                      <Award className="h-5 w-5 mr-2 text-uw-gold" />
                      {scholarship.name}
                    </CardTitle>
                    <div className="text-2xl font-bold text-uw-gold">{scholarship.amount}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{scholarship.description}</p>
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2">Requirements:</h4>
                      <ul className="text-sm space-y-1">
                        {scholarship.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-gray-600">• {req}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full mt-4" variant="outline">Apply for Scholarship</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Plane className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-uw-purple mb-2">Pre-Departure Support</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive orientation sessions, visa assistance, and cultural preparation workshops.
                  </p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-uw-purple mb-2">Health & Safety</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    24/7 emergency support, health insurance guidance, and safety protocols for all destinations.
                  </p>
                  <Button variant="outline" size="sm">Safety Info</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-uw-purple mb-2">Academic Integration</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Credit transfer assistance and academic advising to ensure seamless degree progress.
                  </p>
                  <Button variant="outline" size="sm">Academic Support</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-uw-purple to-uw-dark text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Go Global?</h3>
                  <p className="text-uw-gold mb-6 max-w-2xl mx-auto">
                    Join hundreds of NSCU students who have enriched their education through international experiences. 
                    Start your global journey today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" size="lg">
                      Schedule Advising
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-uw-purple">
                      Download Brochure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default InternationalPrograms;