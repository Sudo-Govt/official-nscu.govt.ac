import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Microscope, Cpu, Leaf, Heart, Brain, Globe, Users, DollarSign, FileText, Award } from 'lucide-react';

const ResearchCenters = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const researchCenters = [
    {
      name: 'Center for Biomedical Innovation',
      director: 'Dr. Elena Rodriguez',
      category: 'Health Sciences',
      icon: Heart,
      established: 2018,
      funding: '$15.2M',
      faculty: 25,
      students: 85,
      description: 'Leading research in cancer biology, immunotherapy, and precision medicine with state-of-the-art molecular biology laboratories.',
      focusAreas: ['Cancer Research', 'Immunotherapy', 'Drug Discovery', 'Precision Medicine'],
      facilities: ['BSL-2 Labs', 'Cell Culture Facility', 'Flow Cytometry Core', 'Microscopy Suite'],
      recentAchievements: [
        'Published 45 peer-reviewed papers in 2024',
        'Received $5M NIH grant for cancer research',
        'Licensed 3 drug compounds to pharmaceutical companies'
      ]
    },
    {
      name: 'Advanced Computing Research Institute',
      director: 'Dr. Michael Chang',
      category: 'Technology',
      icon: Cpu,
      established: 2020,
      funding: '$12.8M',
      faculty: 20,
      students: 65,
      description: 'Pioneering research in artificial intelligence, quantum computing, and cybersecurity with high-performance computing clusters.',
      focusAreas: ['Artificial Intelligence', 'Quantum Computing', 'Cybersecurity', 'Data Science'],
      facilities: ['Quantum Lab', 'HPC Cluster', 'AI Research Lab', 'Cybersecurity Operations Center'],
      recentAchievements: [
        'Developed breakthrough quantum algorithm',
        'Partnership with Google Research established',
        'Trained 200+ professionals in AI ethics'
      ]
    },
    {
      name: 'Sustainable Energy Research Center',
      director: 'Dr. Sarah Kim',
      category: 'Environment',
      icon: Leaf,
      established: 2019,
      funding: '$18.5M',
      faculty: 30,
      students: 95,
      description: 'Research focused on renewable energy technologies, battery storage, and sustainable materials for a cleaner future.',
      focusAreas: ['Solar Energy', 'Wind Power', 'Energy Storage', 'Smart Grid Technology'],
      facilities: ['Solar Test Lab', 'Battery Research Lab', 'Materials Characterization Lab', 'Grid Simulation Center'],
      recentAchievements: [
        'Developed 30% more efficient solar cells',
        'Patent for novel battery technology approved',
        'Reduced campus energy consumption by 25%'
      ]
    },
    {
      name: 'Neuroscience Research Institute',
      director: 'Dr. James Wilson',
      category: 'Health Sciences',
      icon: Brain,
      established: 2017,
      funding: '$22.1M',
      faculty: 35,
      students: 120,
      description: 'Investigating brain function, neurological diseases, and cognitive processes using advanced neuroimaging and computational modeling.',
      focusAreas: ['Alzheimer\'s Disease', 'Brain Imaging', 'Cognitive Science', 'Neuroplasticity'],
      facilities: ['fMRI Center', 'EEG Labs', 'Behavioral Testing Suite', 'Computational Neuroscience Lab'],
      recentAchievements: [
        'Breakthrough in Alzheimer\'s early detection',
        'Collaboration with Mayo Clinic established',
        'FDA approval for neurological device'
      ]
    },
    {
      name: 'Global Health Research Center',
      director: 'Dr. Maria Santos',
      category: 'Health Sciences',
      icon: Globe,
      established: 2021,
      funding: '$8.9M',
      faculty: 18,
      students: 55,
      description: 'Addressing global health challenges through interdisciplinary research in infectious diseases, health policy, and healthcare delivery.',
      focusAreas: ['Infectious Diseases', 'Health Policy', 'Healthcare Delivery', 'Global Health Equity'],
      facilities: ['Epidemiology Lab', 'Field Research Station', 'Telemedicine Center', 'Policy Analysis Center'],
      recentAchievements: [
        'WHO collaboration on pandemic preparedness',
        'Vaccine efficacy study published in Lancet',
        'Health policy adopted by 3 countries'
      ]
    },
    {
      name: 'Materials Science Research Lab',
      director: 'Dr. David Park',
      category: 'Technology',
      icon: Microscope,
      established: 2016,
      funding: '$14.7M',
      faculty: 22,
      students: 75,
      description: 'Developing advanced materials for aerospace, electronics, and medical applications using cutting-edge synthesis and characterization techniques.',
      focusAreas: ['Nanomaterials', 'Biomaterials', 'Composite Materials', 'Electronic Materials'],
      facilities: ['Clean Room', 'Electron Microscopy Center', 'X-ray Diffraction Lab', 'Mechanical Testing Lab'],
      recentAchievements: [
        'New aerospace material reduces weight by 40%',
        'Biocompatible implant material developed',
        'Spin-off company launched with $2M funding'
      ]
    }
  ];

  const categories = ['all', 'Health Sciences', 'Technology', 'Environment'];

  const filteredCenters = selectedCategory === 'all' 
    ? researchCenters 
    : researchCenters.filter(center => center.category === selectedCategory);

  const totalStats = {
    centers: researchCenters.length,
    faculty: researchCenters.reduce((sum, center) => sum + center.faculty, 0),
    students: researchCenters.reduce((sum, center) => sum + center.students, 0),
    funding: researchCenters.reduce((sum, center) => sum + parseFloat(center.funding.replace('$', '').replace('M', '')), 0)
  };

  return (
    <PageLayout 
      title="Research Centers" 
      description="World-class research facilities driving innovation and discovery at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-uw-purple mb-4">NSCU Research Centers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our research centers are at the forefront of scientific discovery, addressing critical challenges in health, technology, and sustainability.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-uw-purple">{totalStats.centers}</div>
              <div className="text-sm text-gray-600">Research Centers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-uw-purple">{totalStats.faculty}</div>
              <div className="text-sm text-gray-600">Faculty Researchers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-uw-purple">{totalStats.students}</div>
              <div className="text-sm text-gray-600">Graduate Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-uw-gold">${totalStats.funding.toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Annual Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-uw-purple hover:bg-uw-dark" : "border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white"}
            >
              {category === 'all' ? 'All Centers' : category}
            </Button>
          ))}
        </div>

        {/* Research Centers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCenters.map((center, index) => {
            const IconComponent = center.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-uw-purple/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-uw-purple" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-uw-purple">{center.name}</CardTitle>
                        <p className="text-sm text-gray-600">Director: {center.director}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-uw-gold text-uw-gold">
                      {center.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">{center.description}</p>
                  
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="facilities">Facilities</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-uw-purple" />
                            <span>{center.faculty} Faculty</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-uw-gold" />
                            <span>{center.students} Students</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-uw-purple" />
                            <span>{center.funding} Funding</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-uw-gold" />
                            <span>Est. {center.established}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-uw-purple mb-2">Focus Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.focusAreas.map((area, areaIndex) => (
                              <Badge key={areaIndex} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="facilities">
                      <div>
                        <h4 className="font-semibold text-uw-purple mb-3">Research Facilities:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {center.facilities.map((facility, facilityIndex) => (
                            <div key={facilityIndex} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                              <Microscope className="h-4 w-4 mr-2 text-uw-purple" />
                              {facility}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="achievements">
                      <div>
                        <h4 className="font-semibold text-uw-purple mb-3">Recent Achievements:</h4>
                        <div className="space-y-2">
                          {center.recentAchievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex items-start text-sm">
                              <Award className="h-4 w-4 mr-2 mt-0.5 text-uw-gold flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-uw-purple to-uw-dark text-white">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Join Our Research Community</h3>
              <p className="text-uw-gold mb-6">
                Discover opportunities for collaboration, funding, and cutting-edge research at NSCU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Research Opportunities
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-uw-purple">
                  Contact Research Office
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResearchCenters;