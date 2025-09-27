import { useState, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, Phone, MapPin, Book, Award, Users, GraduationCap } from 'lucide-react';

const FacultyDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRank, setSelectedRank] = useState('all');

  const facultyMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Professor & Department Chair',
      department: 'Computer Science',
      college: 'College of Engineering',
      email: 'sarah.johnson@nscu.edu',
      phone: '(302) 555-0123',
      office: 'Engineering Building, Room 301',
      rank: 'Professor',
      education: ['Ph.D. Computer Science, MIT', 'M.S. Software Engineering, Stanford'],
      researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Data Mining', 'Computer Vision'],
      publications: 85,
      yearsAtNSCU: 12,
      courses: ['CS 101: Introduction to Programming', 'CS 450: Advanced AI', 'CS 520: Machine Learning'],
      awards: ['NSF CAREER Award 2020', 'IEEE Fellow 2019', 'Outstanding Teaching Award 2018']
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      title: 'Associate Professor',
      department: 'Biology',
      college: 'College of Arts & Sciences',
      email: 'michael.rodriguez@nscu.edu',
      phone: '(302) 555-0124',
      office: 'Science Hall, Room 245',
      rank: 'Associate Professor',
      education: ['Ph.D. Molecular Biology, Harvard', 'B.S. Biology, UC Berkeley'],
      researchInterests: ['Cancer Biology', 'Cell Signaling', 'Immunotherapy', 'Drug Discovery'],
      publications: 62,
      yearsAtNSCU: 8,
      courses: ['BIO 201: Cell Biology', 'BIO 401: Cancer Biology', 'BIO 550: Research Methods'],
      awards: ['NIH New Investigator Award 2021', 'Outstanding Research Award 2020']
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      title: 'Assistant Professor',
      department: 'Psychology',
      college: 'College of Arts & Sciences',
      email: 'emily.chen@nscu.edu',
      phone: '(302) 555-0125',
      office: 'Psychology Building, Room 120',
      rank: 'Assistant Professor',
      education: ['Ph.D. Cognitive Psychology, Yale', 'M.A. Psychology, Columbia'],
      researchInterests: ['Cognitive Neuroscience', 'Memory', 'Learning', 'Brain Imaging'],
      publications: 28,
      yearsAtNSCU: 4,
      courses: ['PSY 101: Introduction to Psychology', 'PSY 301: Cognitive Psychology', 'PSY 480: Senior Seminar'],
      awards: ['Early Career Researcher Award 2023', 'Excellence in Teaching Award 2022']
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      title: 'Professor',
      department: 'Business Administration',
      college: 'School of Business',
      email: 'james.wilson@nscu.edu',
      phone: '(302) 555-0126',
      office: 'Business Center, Room 401',
      rank: 'Professor',
      education: ['Ph.D. Finance, Wharton', 'MBA, Harvard Business School', 'B.A. Economics, Princeton'],
      researchInterests: ['Corporate Finance', 'Investment Banking', 'Risk Management', 'Financial Markets'],
      publications: 94,
      yearsAtNSCU: 15,
      courses: ['FIN 301: Corporate Finance', 'FIN 450: Investment Analysis', 'MBA 620: Advanced Finance'],
      awards: ['Outstanding Faculty Award 2021', 'Research Excellence Award 2019', 'Dean\'s Award 2017']
    },
    {
      id: 5,
      name: 'Dr. Maria Santos',
      title: 'Associate Professor',
      department: 'Engineering',
      college: 'College of Engineering',
      email: 'maria.santos@nscu.edu',
      phone: '(302) 555-0127',
      office: 'Engineering Building, Room 205',
      rank: 'Associate Professor',
      education: ['Ph.D. Electrical Engineering, Caltech', 'M.S. Computer Engineering, Georgia Tech'],
      researchInterests: ['Renewable Energy', 'Smart Grids', 'Power Electronics', 'Sustainable Technology'],
      publications: 47,
      yearsAtNSCU: 7,
      courses: ['ENG 201: Circuits', 'ENG 401: Power Systems', 'ENG 520: Renewable Energy'],
      awards: ['IEEE Young Engineer Award 2022', 'Innovation in Teaching Award 2021']
    },
    {
      id: 6,
      name: 'Dr. David Park',
      title: 'Professor',
      department: 'Chemistry',
      college: 'College of Arts & Sciences',
      email: 'david.park@nscu.edu',
      phone: '(302) 555-0128',
      office: 'Chemistry Building, Room 312',
      rank: 'Professor',
      education: ['Ph.D. Organic Chemistry, UC Berkeley', 'B.S. Chemistry, Seoul National University'],
      researchInterests: ['Organic Synthesis', 'Medicinal Chemistry', 'Drug Design', 'Chemical Biology'],
      publications: 118,
      yearsAtNSCU: 18,
      courses: ['CHEM 201: Organic Chemistry I', 'CHEM 401: Advanced Synthesis', 'CHEM 550: Medicinal Chemistry'],
      awards: ['Distinguished Professor Award 2020', 'Chemical Society Fellow 2018', 'Researcher of the Year 2016']
    },
    {
      id: 7,
      name: 'Dr. Lisa Thompson',
      title: 'Assistant Professor',
      department: 'English',
      college: 'College of Arts & Sciences',
      email: 'lisa.thompson@nscu.edu',
      phone: '(302) 555-0129',
      office: 'Humanities Building, Room 150',
      rank: 'Assistant Professor',
      education: ['Ph.D. English Literature, Oxford', 'M.A. Creative Writing, Iowa'],
      researchInterests: ['Victorian Literature', 'Women\'s Writing', 'Digital Humanities', 'Literary Theory'],
      publications: 22,
      yearsAtNSCU: 3,
      courses: ['ENG 101: Composition', 'ENG 301: Victorian Literature', 'ENG 450: Senior Seminar'],
      awards: ['New Faculty Excellence Award 2023', 'Best Paper Award 2022']
    },
    {
      id: 8,
      name: 'Dr. Robert Kim',
      title: 'Professor',
      department: 'Mathematics',
      college: 'College of Arts & Sciences',
      email: 'robert.kim@nscu.edu',
      phone: '(302) 555-0130',
      office: 'Math Building, Room 225',
      rank: 'Professor',
      education: ['Ph.D. Applied Mathematics, Princeton', 'M.S. Statistics, Stanford'],
      researchInterests: ['Applied Statistics', 'Mathematical Modeling', 'Computational Mathematics', 'Data Analysis'],
      publications: 76,
      yearsAtNSCU: 14,
      courses: ['MATH 201: Calculus II', 'MATH 401: Advanced Statistics', 'MATH 520: Mathematical Modeling'],
      awards: ['Mathematical Society Fellow 2019', 'Teaching Excellence Award 2018', 'Research Impact Award 2017']
    }
  ];

  const departments = [...new Set(facultyMembers.map(faculty => faculty.department))];
  const ranks = [...new Set(facultyMembers.map(faculty => faculty.rank))];

  const filteredFaculty = useMemo(() => {
    return facultyMembers.filter(faculty => {
      const matchesSearch = searchTerm === '' || 
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.researchInterests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesDepartment = selectedDepartment === 'all' || 
        faculty.department === selectedDepartment;
      
      const matchesRank = selectedRank === 'all' || 
        faculty.rank === selectedRank;
      
      return matchesSearch && matchesDepartment && matchesRank;
    });
  }, [searchTerm, selectedDepartment, selectedRank]);

  const totalStats = {
    totalFaculty: facultyMembers.length,
    professors: facultyMembers.filter(f => f.rank === 'Professor').length,
    associateProfessors: facultyMembers.filter(f => f.rank === 'Associate Professor').length,
    assistantProfessors: facultyMembers.filter(f => f.rank === 'Assistant Professor').length,
    totalPublications: facultyMembers.reduce((sum, f) => sum + f.publications, 0)
  };

  return (
    <PageLayout 
      title="Faculty Directory" 
      description="Meet our distinguished faculty members and their areas of expertise"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-uw-purple mb-4">Faculty Directory</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our world-class faculty are leaders in their fields, committed to excellence in teaching, research, and service.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-purple">{totalStats.totalFaculty}</div>
              <div className="text-xs text-gray-600">Total Faculty</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-purple">{totalStats.professors}</div>
              <div className="text-xs text-gray-600">Professors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-purple">{totalStats.associateProfessors}</div>
              <div className="text-xs text-gray-600">Associate Profs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-purple">{totalStats.assistantProfessors}</div>
              <div className="text-xs text-gray-600">Assistant Profs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-gold">{totalStats.totalPublications}</div>
              <div className="text-xs text-gray-600">Publications</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, department, or research area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ranks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFaculty.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-uw-purple mb-1">{faculty.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-2">{faculty.title}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-uw-purple text-uw-purple text-xs">
                        {faculty.department}
                      </Badge>
                      <Badge variant="outline" className="border-uw-gold text-uw-gold text-xs">
                        {faculty.rank}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div className="flex items-center">
                      <Book className="h-3 w-3 mr-1" />
                      {faculty.publications} pubs
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-uw-purple" />
                      <a href={`mailto:${faculty.email}`} className="text-uw-purple hover:underline">
                        {faculty.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                      <span>{faculty.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-uw-purple" />
                      <span>{faculty.office}</span>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      Education
                    </h4>
                    <ul className="text-sm space-y-1">
                      {faculty.education.map((degree, index) => (
                        <li key={index} className="text-gray-600">• {degree}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Research Interests */}
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">Research Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {faculty.researchInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Current Courses */}
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">Current Courses</h4>
                    <ul className="text-sm space-y-1">
                      {faculty.courses.slice(0, 2).map((course, index) => (
                        <li key={index} className="text-gray-600">• {course}</li>
                      ))}
                      {faculty.courses.length > 2 && (
                        <li className="text-gray-500 text-xs">+ {faculty.courses.length - 2} more courses</li>
                      )}
                    </ul>
                  </div>

                  {/* Awards (if any) */}
                  {faculty.awards && faculty.awards.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Recent Awards
                      </h4>
                      <ul className="text-sm space-y-1">
                        {faculty.awards.slice(0, 2).map((award, index) => (
                          <li key={index} className="text-gray-600">• {award}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Research
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No faculty found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FacultyDirectory;