import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, CheckCircle, XCircle, Users, BookOpen, Building, Phone, Mail, Calendar } from 'lucide-react';

const StudyCenters = () => {
  const studyCenters = [
    // Original Indian Centers
    {
      id: 1,
      name: "Eastline Study Center",
      location: "Bhopal, Madhya Pradesh",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Dr. Rahul Sharma",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 350,
      currentStudents: 285,
      programs: ["MBA Distance", "BBA", "Computer Applications", "English Literature"],
      facilities: ["Computer Lab", "Library", "Conference Room", "Exam Hall"],
      operatingHours: "9:00 AM - 7:00 PM",
      contactEmail: "eastline.bhopal@nscu.edu",
      contactPhone: "+91-755-2345678",
      weeklySchedule: {
        "Monday": "Counseling Sessions, Material Distribution",
        "Tuesday": "Computer Lab Sessions, Online Classes",
        "Wednesday": "Library Access, Study Groups",
        "Thursday": "Examination Conduct, Academic Support",
        "Friday": "Career Guidance, Project Mentoring",
        "Saturday": "Weekend Classes, Special Workshops"
      }
    },
    {
      id: 2,
      name: "Northern Hills Learning Hub",
      location: "Shimla, Himachal Pradesh",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Prof. Anjali Thakur",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: false
      },
      capacity: 200,
      currentStudents: 165,
      programs: ["Engineering Distance", "Management Studies", "Information Technology"],
      facilities: ["Smart Classroom", "Exam Center", "Student Lounge"],
      operatingHours: "10:00 AM - 6:00 PM",
      contactEmail: "northernhills.shimla@nscu.edu",
      contactPhone: "+91-177-2876543",
      weeklySchedule: {
        "Monday": "Academic Counseling, Course Registration",
        "Tuesday": "Practical Sessions, Lab Work",
        "Wednesday": "Student Support Services",
        "Thursday": "Examination Activities",
        "Friday": "Project Reviews, Industry Interaction",
        "Saturday": "Skills Development Programs"
      }
    },
    {
      id: 3,
      name: "Desert Oasis Education Center",
      location: "Bikaner, Rajasthan",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Kiran Gupta",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: false,
        libraryAccess: true
      },
      capacity: 280,
      currentStudents: 245,
      programs: ["Agriculture Studies", "Rural Development", "Commerce", "Arts"],
      facilities: ["Digital Library", "Exam Hall", "Agriculture Lab", "Conference Room"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "desertoasis.bikaner@nscu.edu",
      contactPhone: "+91-151-2567890",
      weeklySchedule: {
        "Monday": "Course Material Distribution",
        "Tuesday": "Agricultural Practical Sessions",
        "Wednesday": "Digital Library Access, Research Support",
        "Thursday": "Examination Conduct",
        "Friday": "Rural Development Projects",
        "Saturday": "Community Outreach Programs"
      }
    },
    {
      id: 4,
      name: "Coastal Knowledge Point",
      location: "Mangalore, Karnataka",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Deepa Nair",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: true
      },
      capacity: 320,
      currentStudents: 278,
      programs: ["Information Technology", "Business Studies", "Marine Biology", "Coastal Management"],
      facilities: ["IT Lab", "Marine Research Unit", "Study Halls", "Video Conferencing"],
      operatingHours: "9:00 AM - 8:00 PM",
      contactEmail: "coastal.mangalore@nscu.edu",
      contactPhone: "+91-824-2890123",
      weeklySchedule: {
        "Monday": "IT Practical Sessions",
        "Tuesday": "Marine Biology Field Work",
        "Wednesday": "Business Case Studies",
        "Thursday": "Research Methodology Sessions",
        "Friday": "Industry Connect Programs",
        "Saturday": "Special Marine Expeditions"
      }
    },
    {
      id: 5,
      name: "Valley View Learning Center",
      location: "Srinagar, Jammu & Kashmir",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Dr. Omar Abdullah",
      established: 2022,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 150,
      currentStudents: 125,
      programs: ["Fine Arts", "Journalism", "Cultural Studies", "Tourism Management"],
      facilities: ["Art Studio", "Media Lab", "Cultural Archive", "Exhibition Hall"],
      operatingHours: "10:00 AM - 5:00 PM",
      contactEmail: "valleyview.srinagar@nscu.edu",
      contactPhone: "+91-194-2234567",
      weeklySchedule: {
        "Monday": "Fine Arts Workshops",
        "Tuesday": "Journalism Practical Training",
        "Wednesday": "Cultural Documentation Projects",
        "Thursday": "Tourism Industry Sessions",
        "Friday": "Creative Writing Workshops",
        "Saturday": "Cultural Events and Exhibitions"
      }
    },
    {
      id: 6,
      name: "Plateau Learning Solutions",
      location: "Ranchi, Jharkhand",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Prof. Sunita Singh",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: false
      },
      capacity: 250,
      currentStudents: 210,
      programs: ["Engineering Support", "Technology Courses", "Mining Studies", "Environmental Science"],
      facilities: ["Technical Workshop", "Mining Simulator", "Environmental Lab", "Skill Development Center"],
      operatingHours: "9:00 AM - 6:00 PM",
      contactEmail: "plateau.ranchi@nscu.edu",
      contactPhone: "+91-651-2345678",
      weeklySchedule: {
        "Monday": "Engineering Practical Sessions",
        "Tuesday": "Mining Technology Training",
        "Wednesday": "Environmental Studies Field Work",
        "Thursday": "Technical Skill Development",
        "Friday": "Industry Collaboration Programs",
        "Saturday": "Regional Development Projects"
      }
    },

    // Micro Nations Study Centers
    {
      id: 7,
      name: "Vatican Educational Outreach",
      location: "Vatican City",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Dr. Francesco Romano",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: true
      },
      capacity: 25,
      currentStudents: 18,
      programs: ["Theology", "Philosophy", "Art History", "Languages"],
      facilities: ["Study Room", "Digital Archive", "Conference Hall"],
      operatingHours: "9:00 AM - 5:00 PM",
      contactEmail: "vatican@nscu.edu",
      contactPhone: "+39-06-69883145",
      weeklySchedule: {
        "Monday": "Theological Studies",
        "Tuesday": "Philosophy Sessions",
        "Wednesday": "Art History Research",
        "Thursday": "Language Classes",
        "Friday": "Academic Counseling",
        "Saturday": "Cultural Programs"
      }
    },
    {
      id: 8,
      name: "Monaco Elite Learning Center",
      location: "Monaco",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Prof. Marie Dubois",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 80,
      currentStudents: 65,
      programs: ["Business Administration", "Finance", "Hospitality", "International Relations"],
      facilities: ["Business Lab", "Conference Room", "Library", "Networking Lounge"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "monaco@nscu.edu",
      contactPhone: "+377-98765432",
      weeklySchedule: {
        "Monday": "Business Strategy Sessions",
        "Tuesday": "Finance Workshops",
        "Wednesday": "Hospitality Training",
        "Thursday": "International Relations Seminars",
        "Friday": "Executive Networking",
        "Saturday": "Industry Immersion"
      }
    },
    {
      id: 9,
      name: "San Marino Academic Center",
      location: "San Marino",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Dr. Marco Bellini",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: false,
        libraryAccess: true
      },
      capacity: 45,
      currentStudents: 32,
      programs: ["European Studies", "Cultural Heritage", "Tourism", "Languages"],
      facilities: ["Cultural Lab", "Heritage Archive", "Study Hall"],
      operatingHours: "9:00 AM - 6:00 PM",
      contactEmail: "sanmarino@nscu.edu",
      contactPhone: "+378-0549123456",
      weeklySchedule: {
        "Monday": "European Studies Research",
        "Tuesday": "Cultural Heritage Projects",
        "Wednesday": "Tourism Development",
        "Thursday": "Language Immersion",
        "Friday": "Academic Support",
        "Saturday": "Field Studies"
      }
    },
    {
      id: 10,
      name: "Liechtenstein Study Hub",
      location: "Vaduz, Liechtenstein",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Prof. Klaus Weber",
      established: 2022,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: true
      },
      capacity: 35,
      currentStudents: 28,
      programs: ["Banking & Finance", "Alpine Studies", "Sustainable Development", "Digital Innovation"],
      facilities: ["Finance Lab", "Research Center", "Digital Studio"],
      operatingHours: "8:30 AM - 5:30 PM",
      contactEmail: "liechtenstein@nscu.edu",
      contactPhone: "+423-2345678",
      weeklySchedule: {
        "Monday": "Banking & Finance Sessions",
        "Tuesday": "Alpine Research Projects",
        "Wednesday": "Sustainability Workshops",
        "Thursday": "Digital Innovation Labs",
        "Friday": "Academic Mentoring",
        "Saturday": "Mountain Field Studies"
      }
    },
    {
      id: 11,
      name: "Andorra Learning Point",
      location: "Andorra la Vella, Andorra",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Dr. Carmen Vidal",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: false
      },
      capacity: 40,
      currentStudents: 35,
      programs: ["Tourism Management", "Mountain Sports", "Languages", "Business Studies"],
      facilities: ["Sports Science Lab", "Language Center", "Business Incubator"],
      operatingHours: "9:00 AM - 6:00 PM",
      contactEmail: "andorra@nscu.edu",
      contactPhone: "+376-123456",
      weeklySchedule: {
        "Monday": "Tourism Industry Training",
        "Tuesday": "Mountain Sports Science",
        "Wednesday": "Multilingual Communication",
        "Thursday": "Business Development",
        "Friday": "Career Counseling",
        "Saturday": "Outdoor Education Programs"
      }
    },
    {
      id: 12,
      name: "Malta Mediterranean Center",
      location: "Valletta, Malta",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Prof. Joseph Mifsud",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 120,
      currentStudents: 95,
      programs: ["Maritime Studies", "European Law", "Tourism", "Digital Technology"],
      facilities: ["Maritime Simulator", "Law Library", "Tech Lab", "Conference Center"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "malta@nscu.edu",
      contactPhone: "+356-21234567",
      weeklySchedule: {
        "Monday": "Maritime Technology",
        "Tuesday": "European Law Studies",
        "Wednesday": "Tourism Development Projects",
        "Thursday": "Digital Innovation",
        "Friday": "Professional Development",
        "Saturday": "Mediterranean Cultural Studies"
      }
    },
    {
      id: 13,
      name: "Cyprus Knowledge Hub",
      location: "Nicosia, Cyprus",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Dr. Andreas Constantinou",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: false,
        libraryAccess: true
      },
      capacity: 180,
      currentStudents: 152,
      programs: ["International Business", "Archaeology", "Energy Studies", "Communication"],
      facilities: ["Business Center", "Archaeological Lab", "Energy Research Unit", "Media Studio"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "cyprus@nscu.edu",
      contactPhone: "+357-22345678",
      weeklySchedule: {
        "Monday": "International Business Seminars",
        "Tuesday": "Archaeological Field Work",
        "Wednesday": "Energy Research Projects",
        "Thursday": "Communication Skills Development",
        "Friday": "Academic Writing Support",
        "Saturday": "Cultural Heritage Tours"
      }
    },
    {
      id: 14,
      name: "Luxembourg Education Center",
      location: "Luxembourg City, Luxembourg",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Prof. Jean-Claude Meyer",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: true
      },
      capacity: 90,
      currentStudents: 78,
      programs: ["EU Affairs", "Banking", "Multilingual Studies", "Technology"],
      facilities: ["EU Simulation Room", "Banking Lab", "Language Center", "Tech Hub"],
      operatingHours: "9:00 AM - 6:00 PM",
      contactEmail: "luxembourg@nscu.edu",
      contactPhone: "+352-123456789",
      weeklySchedule: {
        "Monday": "European Union Studies",
        "Tuesday": "Banking & Finance",
        "Wednesday": "Multilingual Communication",
        "Thursday": "Technology Innovation",
        "Friday": "Career Services",
        "Saturday": "Professional Networking"
      }
    },
    {
      id: 15,
      name: "Iceland Academic Outpost",
      location: "Reykjavik, Iceland",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Dr. Bjorn Eriksson",
      established: 2022,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 70,
      currentStudents: 58,
      programs: ["Renewable Energy", "Arctic Studies", "Geothermal Science", "Environmental Policy"],
      facilities: ["Renewable Energy Lab", "Arctic Research Center", "Geothermal Simulator", "Policy Analysis Room"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "iceland@nscu.edu",
      contactPhone: "+354-5551234",
      weeklySchedule: {
        "Monday": "Renewable Energy Research",
        "Tuesday": "Arctic Environment Studies",
        "Wednesday": "Geothermal Technology",
        "Thursday": "Environmental Policy Analysis",
        "Friday": "Sustainability Projects",
        "Saturday": "Field Research Expeditions"
      }
    },
    {
      id: 16,
      name: "Nauru Pacific Learning Center",
      location: "Yaren District, Nauru",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Prof. Maria Detenamo",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: false,
        counseling: true,
        libraryAccess: false
      },
      capacity: 30,
      currentStudents: 22,
      programs: ["Marine Science", "Pacific Studies", "Environmental Restoration", "Community Development"],
      facilities: ["Marine Lab", "Community Center", "Environmental Station"],
      operatingHours: "8:00 AM - 5:00 PM",
      contactEmail: "nauru@nscu.edu",
      contactPhone: "+674-5551234",
      weeklySchedule: {
        "Monday": "Marine Biology Studies",
        "Tuesday": "Pacific Cultural Research",
        "Wednesday": "Environmental Restoration Projects",
        "Thursday": "Community Development Programs",
        "Friday": "Academic Support",
        "Saturday": "Ocean Conservation Activities"
      }
    },

    // International Study Centers (50 Countries)
    {
      id: 17,
      name: "Tokyo Learning Hub",
      location: "Tokyo, Japan",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Hiroshi Tanaka",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 300,
      currentStudents: 265,
      programs: ["Technology Innovation", "Japanese Studies", "Business Management", "Engineering"],
      facilities: ["Tech Lab", "Cultural Center", "Business Incubator", "Engineering Workshop"],
      operatingHours: "8:00 AM - 8:00 PM",
      contactEmail: "tokyo@nscu.edu",
      contactPhone: "+81-3-12345678",
      weeklySchedule: {
        "Monday": "Technology Innovation Sessions",
        "Tuesday": "Japanese Language & Culture",
        "Wednesday": "Business Strategy Workshops",
        "Thursday": "Engineering Projects",
        "Friday": "Industry Partnerships",
        "Saturday": "Cultural Exchange Programs"
      }
    },
    {
      id: 18,
      name: "Berlin Excellence Center",
      location: "Berlin, Germany",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Klaus Mueller",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 280,
      currentStudents: 245,
      programs: ["Engineering", "European Studies", "Renewable Energy", "Digital Arts"],
      facilities: ["Engineering Lab", "Design Studio", "Energy Research Center", "Digital Media Lab"],
      operatingHours: "8:30 AM - 7:30 PM",
      contactEmail: "berlin@nscu.edu",
      contactPhone: "+49-30-12345678",
      weeklySchedule: {
        "Monday": "Engineering Design Sessions",
        "Tuesday": "European Integration Studies",
        "Wednesday": "Renewable Energy Projects",
        "Thursday": "Digital Arts Workshops",
        "Friday": "Research Collaborations",
        "Saturday": "Industrial Visits"
      }
    },
    {
      id: 19,
      name: "Paris Academic Center",
      location: "Paris, France",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Marie Dubois",
      established: 2017,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 320,
      currentStudents: 298,
      programs: ["Fine Arts", "Fashion Design", "Culinary Arts", "International Relations"],
      facilities: ["Art Studio", "Fashion Lab", "Culinary Kitchen", "Diplomatic Simulation Room"],
      operatingHours: "9:00 AM - 8:00 PM",
      contactEmail: "paris@nscu.edu",
      contactPhone: "+33-1-42345678",
      weeklySchedule: {
        "Monday": "Fine Arts Masterclasses",
        "Tuesday": "Fashion Design Workshops",
        "Wednesday": "Culinary Techniques",
        "Thursday": "International Diplomacy Simulations",
        "Friday": "Cultural Immersion",
        "Saturday": "Museum and Gallery Tours"
      }
    },
    {
      id: 20,
      name: "London Knowledge Centre",
      location: "London, United Kingdom",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. James Wellington",
      established: 2016,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 400,
      currentStudents: 378,
      programs: ["Business Administration", "Literature", "Theatre Arts", "Finance"],
      facilities: ["Business Center", "Library", "Theatre", "Financial Trading Room"],
      operatingHours: "8:00 AM - 9:00 PM",
      contactEmail: "london@nscu.edu",
      contactPhone: "+44-20-12345678",
      weeklySchedule: {
        "Monday": "Business Strategy Sessions",
        "Tuesday": "Literature Analysis Workshops",
        "Wednesday": "Theatre Performance Training",
        "Thursday": "Financial Markets Simulation",
        "Friday": "Professional Development",
        "Saturday": "Cultural London Tours"
      }
    },
    {
      id: 21,
      name: "Sydney Learning Hub",
      location: "Sydney, Australia",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Michael O'Brien",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 350,
      currentStudents: 312,
      programs: ["Marine Biology", "Tourism Management", "Sports Science", "Environmental Studies"],
      facilities: ["Marine Research Lab", "Sports Science Center", "Environmental Station", "Tourism Training Center"],
      operatingHours: "7:00 AM - 7:00 PM",
      contactEmail: "sydney@nscu.edu",
      contactPhone: "+61-2-87654321",
      weeklySchedule: {
        "Monday": "Marine Biology Field Work",
        "Tuesday": "Tourism Industry Training",
        "Wednesday": "Sports Science Labs",
        "Thursday": "Environmental Research",
        "Friday": "Career Development",
        "Saturday": "Outdoor Adventure Programs"
      }
    },
    {
      id: 22,
      name: "Toronto Educational Center",
      location: "Toronto, Canada",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Sarah Mitchell",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 290,
      currentStudents: 265,
      programs: ["Information Technology", "Healthcare Management", "Multicultural Studies", "Arctic Research"],
      facilities: ["IT Lab", "Healthcare Simulation Center", "Cultural Center", "Arctic Research Station"],
      operatingHours: "8:00 AM - 8:00 PM",
      contactEmail: "toronto@nscu.edu",
      contactPhone: "+1-416-5551234",
      weeklySchedule: {
        "Monday": "IT Innovation Projects",
        "Tuesday": "Healthcare Management Training",
        "Wednesday": "Multicultural Integration Studies",
        "Thursday": "Arctic Research Programs",
        "Friday": "Professional Networking",
        "Saturday": "Community Engagement"
      }
    },
    {
      id: 23,
      name: "Singapore Study Center",
      location: "Singapore",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Li Wei",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 260,
      currentStudents: 238,
      programs: ["International Trade", "Fintech", "Urban Planning", "Asian Studies"],
      facilities: ["Trade Simulation Center", "Fintech Lab", "Urban Design Studio", "Asian Cultural Center"],
      operatingHours: "8:30 AM - 7:30 PM",
      contactEmail: "singapore@nscu.edu",
      contactPhone: "+65-6555-1234",
      weeklySchedule: {
        "Monday": "International Trade Simulations",
        "Tuesday": "Fintech Innovation Labs",
        "Wednesday": "Urban Planning Projects",
        "Thursday": "Asian Studies Research",
        "Friday": "Business Networking",
        "Saturday": "Cultural Exploration"
      }
    },
    {
      id: 24,
      name: "Seoul Learning Center",
      location: "Seoul, South Korea",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Park Min-jun",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 310,
      currentStudents: 285,
      programs: ["Technology Innovation", "K-Culture Studies", "Gaming Technology", "Electronics Engineering"],
      facilities: ["Innovation Lab", "Cultural Studio", "Gaming Development Center", "Electronics Workshop"],
      operatingHours: "8:00 AM - 9:00 PM",
      contactEmail: "seoul@nscu.edu",
      contactPhone: "+82-2-555-1234",
      weeklySchedule: {
        "Monday": "Technology Innovation Sessions",
        "Tuesday": "Korean Culture & Language",
        "Wednesday": "Gaming Development Projects",
        "Thursday": "Electronics Engineering Labs",
        "Friday": "Industry Collaborations",
        "Saturday": "Cultural Exchange Events"
      }
    },
    {
      id: 25,
      name: "Dubai Global Center",
      location: "Dubai, United Arab Emirates",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Dr. Ahmed Al-Rashid",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 380,
      currentStudents: 342,
      programs: ["International Business", "Hospitality Management", "Architecture", "Logistics"],
      facilities: ["Business Center", "Hospitality Training Kitchen", "Architecture Studio", "Logistics Simulation Center"],
      operatingHours: "8:00 AM - 8:00 PM",
      contactEmail: "dubai@nscu.edu",
      contactPhone: "+971-4-555-1234",
      weeklySchedule: {
        "Monday": "International Business Forums",
        "Tuesday": "Hospitality Excellence Training",
        "Wednesday": "Architectural Design Projects",
        "Thursday": "Logistics Management Systems",
        "Friday": "Professional Development",
        "Saturday": "Industry Exposure Programs"
      }
    },
    {
      id: 26,
      name: "Mumbai International Hub",
      location: "Mumbai, India",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Priya Sharma",
      established: 2017,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 450,
      currentStudents: 425,
      programs: ["Film Studies", "Information Technology", "Fashion Design", "Maritime Studies"],
      facilities: ["Film Studio", "IT Center", "Fashion Lab", "Maritime Simulator"],
      operatingHours: "7:00 AM - 9:00 PM",
      contactEmail: "mumbai@nscu.edu",
      contactPhone: "+91-22-5555-1234",
      weeklySchedule: {
        "Monday": "Film Production Workshops",
        "Tuesday": "IT Industry Projects",
        "Wednesday": "Fashion Design Sessions",
        "Thursday": "Maritime Technology Training",
        "Friday": "Industry Mentorship",
        "Saturday": "Creative Arts Showcase"
      }
    },
    {
      id: 27,
      name: "Bangkok Educational Hub",
      location: "Bangkok, Thailand",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Siriporn Thanakit",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 270,
      currentStudents: 245,
      programs: ["Hospitality Management", "Thai Studies", "Agriculture Technology", "Tourism"],
      facilities: ["Hospitality Training Center", "Cultural Research Lab", "AgriTech Center", "Tourism Simulation Room"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "bangkok@nscu.edu",
      contactPhone: "+66-2-555-1234",
      weeklySchedule: {
        "Monday": "Hospitality Excellence Programs",
        "Tuesday": "Thai Culture & Heritage Studies",
        "Wednesday": "Agricultural Innovation Projects",
        "Thursday": "Tourism Development Strategies",
        "Friday": "Professional Skills Development",
        "Saturday": "Cultural Immersion Programs"
      }
    },
    {
      id: 28,
      name: "Cairo Knowledge Center",
      location: "Cairo, Egypt",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Mahmoud Hassan",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 320,
      currentStudents: 295,
      programs: ["Archaeology", "Middle Eastern Studies", "Engineering", "Arabic Studies"],
      facilities: ["Archaeological Lab", "Research Center", "Engineering Workshop", "Language Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "cairo@nscu.edu",
      contactPhone: "+20-2-555-1234",
      weeklySchedule: {
        "Monday": "Archaeological Field Studies",
        "Tuesday": "Middle Eastern Politics & Culture",
        "Wednesday": "Engineering Design Projects",
        "Thursday": "Arabic Language & Literature",
        "Friday": "Research Methodology",
        "Saturday": "Historical Site Visits"
      }
    },
    {
      id: 29,
      name: "São Paulo Learning Center",
      location: "São Paulo, Brazil",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Carlos Mendoza",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 340,
      currentStudents: 318,
      programs: ["Business Administration", "Environmental Science", "Portuguese Studies", "Urban Development"],
      facilities: ["Business Center", "Environmental Lab", "Language Center", "Urban Planning Studio"],
      operatingHours: "7:30 AM - 7:30 PM",
      contactEmail: "saopaulo@nscu.edu",
      contactPhone: "+55-11-5555-1234",
      weeklySchedule: {
        "Monday": "Business Strategy Sessions",
        "Tuesday": "Environmental Conservation Projects",
        "Wednesday": "Portuguese Language & Literature",
        "Thursday": "Urban Development Planning",
        "Friday": "Professional Development",
        "Saturday": "Community Outreach Programs"
      }
    },
    {
      id: 30,
      name: "Cape Town Study Hub",
      location: "Cape Town, South Africa",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Nomsa Mandela",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 290,
      currentStudents: 267,
      programs: ["African Studies", "Mining Engineering", "Wine Studies", "Marine Conservation"],
      facilities: ["Cultural Research Center", "Mining Simulator", "Wine Lab", "Marine Biology Station"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "capetown@nscu.edu",
      contactPhone: "+27-21-555-1234",
      weeklySchedule: {
        "Monday": "African History & Culture",
        "Tuesday": "Mining Technology Training",
        "Wednesday": "Viticulture & Wine Production",
        "Thursday": "Marine Conservation Projects",
        "Friday": "Research Collaborations",
        "Saturday": "Wildlife Conservation Field Trips"
      }
    },
    {
      id: 31,
      name: "Mexico City Education Center",
      location: "Mexico City, Mexico",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Elena Rodriguez",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 310,
      currentStudents: 285,
      programs: ["Latin American Studies", "Architecture", "Culinary Arts", "International Relations"],
      facilities: ["Cultural Center", "Architecture Studio", "Culinary Lab", "Diplomatic Training Center"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "mexicocity@nscu.edu",
      contactPhone: "+52-55-5555-1234",
      weeklySchedule: {
        "Monday": "Latin American History & Politics",
        "Tuesday": "Architectural Design Workshops",
        "Wednesday": "Traditional Mexican Cuisine",
        "Thursday": "International Diplomacy Training",
        "Friday": "Cultural Exchange Programs",
        "Saturday": "Archaeological Site Visits"
      }
    },
    {
      id: 32,
      name: "Moscow Academic Center",
      location: "Moscow, Russia",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Alexei Volkov",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 280,
      currentStudents: 255,
      programs: ["Russian Studies", "Engineering", "Energy Studies", "International Business"],
      facilities: ["Language Center", "Engineering Lab", "Energy Research Center", "Business Hub"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "moscow@nscu.edu",
      contactPhone: "+7-495-555-1234",
      weeklySchedule: {
        "Monday": "Russian Language & Literature",
        "Tuesday": "Advanced Engineering Projects",
        "Wednesday": "Energy Technology Research",
        "Thursday": "International Business Strategies",
        "Friday": "Academic Research Methods",
        "Saturday": "Cultural Heritage Tours"
      }
    },
    {
      id: 33,
      name: "Beijing Learning Hub",
      location: "Beijing, China",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Wang Lei",
      established: 2017,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 380,
      currentStudents: 356,
      programs: ["Chinese Studies", "Technology Innovation", "Traditional Medicine", "Business Management"],
      facilities: ["Cultural Research Center", "Innovation Lab", "Traditional Medicine Center", "Business Incubator"],
      operatingHours: "8:00 AM - 8:00 PM",
      contactEmail: "beijing@nscu.edu",
      contactPhone: "+86-10-5555-1234",
      weeklySchedule: {
        "Monday": "Chinese History & Philosophy",
        "Tuesday": "Technology Innovation Projects",
        "Wednesday": "Traditional Chinese Medicine",
        "Thursday": "Modern Business Practices",
        "Friday": "Research Collaborations",
        "Saturday": "Cultural Immersion Programs"
      }
    },
    {
      id: 34,
      name: "Buenos Aires Study Center",
      location: "Buenos Aires, Argentina",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. María Fernandez",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 260,
      currentStudents: 235,
      programs: ["Latin American Studies", "Agriculture", "Tango Arts", "Economics"],
      facilities: ["Cultural Center", "Agricultural Research Station", "Dance Studio", "Economics Lab"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "buenosaires@nscu.edu",
      contactPhone: "+54-11-5555-1234",
      weeklySchedule: {
        "Monday": "Latin American Economics",
        "Tuesday": "Agricultural Innovation",
        "Wednesday": "Tango Culture & Performance",
        "Thursday": "Economic Policy Analysis",
        "Friday": "Cultural Research Projects",
        "Saturday": "Community Cultural Events"
      }
    },
    {
      id: 35,
      name: "Rome Heritage Center",
      location: "Rome, Italy",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Giuseppe Romano",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 300,
      currentStudents: 275,
      programs: ["Classical Studies", "Art History", "Italian Studies", "Archaeology"],
      facilities: ["Archaeological Lab", "Art Restoration Studio", "Language Center", "Heritage Archive"],
      operatingHours: "9:00 AM - 7:00 PM",
      contactEmail: "rome@nscu.edu",
      contactPhone: "+39-06-5555-1234",
      weeklySchedule: {
        "Monday": "Classical Literature & Philosophy",
        "Tuesday": "Renaissance Art Analysis",
        "Wednesday": "Italian Language & Culture",
        "Thursday": "Archaeological Field Work",
        "Friday": "Art Restoration Techniques",
        "Saturday": "Historical Site Explorations"
      }
    },
    {
      id: 36,
      name: "Stockholm Innovation Center",
      location: "Stockholm, Sweden",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Erik Lindström",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 220,
      currentStudents: 198,
      programs: ["Sustainability Studies", "Nordic Studies", "Technology Innovation", "Social Welfare"],
      facilities: ["Sustainability Lab", "Cultural Research Center", "Innovation Hub", "Social Policy Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "stockholm@nscu.edu",
      contactPhone: "+46-8-555-1234",
      weeklySchedule: {
        "Monday": "Sustainable Development Projects",
        "Tuesday": "Nordic Culture & Society",
        "Wednesday": "Technology Innovation Labs",
        "Thursday": "Social Welfare Policy Studies",
        "Friday": "Research Methodology",
        "Saturday": "Environmental Conservation Activities"
      }
    },
    {
      id: 37,
      name: "Zurich Excellence Hub",
      location: "Zurich, Switzerland",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Hans Mueller",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 180,
      currentStudents: 165,
      programs: ["Banking & Finance", "Alpine Studies", "Precision Engineering", "International Relations"],
      facilities: ["Finance Trading Room", "Alpine Research Station", "Precision Workshop", "Diplomatic Center"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "zurich@nscu.edu",
      contactPhone: "+41-44-555-1234",
      weeklySchedule: {
        "Monday": "International Banking Systems",
        "Tuesday": "Alpine Environment Research",
        "Wednesday": "Precision Manufacturing",
        "Thursday": "International Diplomacy",
        "Friday": "Financial Analysis Workshops",
        "Saturday": "Mountain Research Expeditions"
      }
    },
    {
      id: 38,
      name: "Amsterdam Learning Center",
      location: "Amsterdam, Netherlands",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Anke van der Berg",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 250,
      currentStudents: 225,
      programs: ["Dutch Studies", "Water Management", "Sustainable Agriculture", "Liberal Arts"],
      facilities: ["Cultural Center", "Water Engineering Lab", "Agricultural Research Station", "Liberal Arts Studio"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "amsterdam@nscu.edu",
      contactPhone: "+31-20-555-1234",
      weeklySchedule: {
        "Monday": "Dutch Language & Culture",
        "Tuesday": "Water Management Systems",
        "Wednesday": "Sustainable Farming Techniques",
        "Thursday": "Liberal Arts Workshops",
        "Friday": "Environmental Policy Studies",
        "Saturday": "Cultural Heritage Tours"
      }
    },
    {
      id: 39,
      name: "Vienna Cultural Hub",
      location: "Vienna, Austria",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Ingrid Habsburg",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 270,
      currentStudents: 248,
      programs: ["Music Studies", "European History", "Philosophy", "International Law"],
      facilities: ["Concert Hall", "Historical Archive", "Philosophy Seminar Room", "Law Library"],
      operatingHours: "9:00 AM - 7:00 PM",
      contactEmail: "vienna@nscu.edu",
      contactPhone: "+43-1-555-1234",
      weeklySchedule: {
        "Monday": "Classical Music Theory & Performance",
        "Tuesday": "European Historical Analysis",
        "Wednesday": "Philosophy Seminars",
        "Thursday": "International Law Studies",
        "Friday": "Cultural Research Projects",
        "Saturday": "Concert Performances & Cultural Events"
      }
    },
    {
      id: 40,
      name: "Oslo Nordic Center",
      location: "Oslo, Norway",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Astrid Hansen",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 200,
      currentStudents: 178,
      programs: ["Arctic Studies", "Renewable Energy", "Norwegian Studies", "Marine Biology"],
      facilities: ["Arctic Research Lab", "Renewable Energy Center", "Language Center", "Marine Station"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "oslo@nscu.edu",
      contactPhone: "+47-22-555-1234",
      weeklySchedule: {
        "Monday": "Arctic Climate Research",
        "Tuesday": "Renewable Energy Technology",
        "Wednesday": "Norwegian Language & Literature",
        "Thursday": "Marine Ecosystem Studies",
        "Friday": "Environmental Conservation",
        "Saturday": "Fjord Research Expeditions"
      }
    },
    {
      id: 41,
      name: "Helsinki Innovation Hub",
      location: "Helsinki, Finland",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Mika Virtanen",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 190,
      currentStudents: 168,
      programs: ["Technology Innovation", "Finnish Studies", "Education Sciences", "Design"],
      facilities: ["Innovation Lab", "Cultural Center", "Education Research Center", "Design Studio"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "helsinki@nscu.edu",
      contactPhone: "+358-9-555-1234",
      weeklySchedule: {
        "Monday": "Technology Innovation Projects",
        "Tuesday": "Finnish Culture & Society",
        "Wednesday": "Educational Methodology",
        "Thursday": "Scandinavian Design Principles",
        "Friday": "Research & Development",
        "Saturday": "Design Thinking Workshops"
      }
    },
    {
      id: 42,
      name: "Copenhagen Sustainability Center",
      location: "Copenhagen, Denmark",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Lars Andersen",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 210,
      currentStudents: 189,
      programs: ["Sustainability Studies", "Danish Studies", "Urban Planning", "Green Technology"],
      facilities: ["Sustainability Lab", "Language Center", "Urban Design Studio", "Green Tech Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "copenhagen@nscu.edu",
      contactPhone: "+45-33-555-1234",
      weeklySchedule: {
        "Monday": "Sustainable Development Goals",
        "Tuesday": "Danish Language & Culture",
        "Wednesday": "Smart City Planning",
        "Thursday": "Green Technology Innovation",
        "Friday": "Environmental Policy",
        "Saturday": "Cycling Culture & Urban Mobility"
      }
    },
    {
      id: 43,
      name: "Dublin Celtic Center",
      location: "Dublin, Ireland",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Seamus O'Brien",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 230,
      currentStudents: 208,
      programs: ["Irish Studies", "Literature", "European Studies", "Celtic History"],
      facilities: ["Celtic Research Center", "Literature Archive", "Cultural Hall", "Historical Library"],
      operatingHours: "9:00 AM - 7:00 PM",
      contactEmail: "dublin@nscu.edu",
      contactPhone: "+353-1-555-1234",
      weeklySchedule: {
        "Monday": "Irish Language & Culture",
        "Tuesday": "Celtic Literature Studies",
        "Wednesday": "European Integration",
        "Thursday": "Celtic History & Archaeology",
        "Friday": "Cultural Research",
        "Saturday": "Traditional Music & Dance"
      }
    },
    {
      id: 44,
      name: "Brussels EU Center",
      location: "Brussels, Belgium",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Marie Van Der Berg",
      established: 2017,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 240,
      currentStudents: 215,
      programs: ["European Union Studies", "International Relations", "Belgian Studies", "Public Policy"],
      facilities: ["EU Simulation Center", "Diplomatic Training Room", "Cultural Center", "Policy Analysis Lab"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "brussels@nscu.edu",
      contactPhone: "+32-2-555-1234",
      weeklySchedule: {
        "Monday": "EU Institutions & Law",
        "Tuesday": "International Diplomacy",
        "Wednesday": "Belgian History & Culture",
        "Thursday": "European Public Policy",
        "Friday": "EU Simulation Exercises",
        "Saturday": "European Heritage Tours"
      }
    },
    {
      id: 45,
      name: "Lisbon Atlantic Hub",
      location: "Lisbon, Portugal",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. João Silva",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 220,
      currentStudents: 195,
      programs: ["Portuguese Studies", "Maritime Studies", "Tourism Management", "Renewable Energy"],
      facilities: ["Language Center", "Maritime Simulator", "Tourism Training Center", "Energy Lab"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "lisbon@nscu.edu",
      contactPhone: "+351-21-555-1234",
      weeklySchedule: {
        "Monday": "Portuguese Language & Literature",
        "Tuesday": "Maritime Technology & History",
        "Wednesday": "Tourism Industry Development",
        "Thursday": "Ocean Energy Research",
        "Friday": "Cultural Heritage Studies",
        "Saturday": "Coastal Conservation Projects"
      }
    },
    {
      id: 46,
      name: "Madrid Iberian Center",
      location: "Madrid, Spain",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Carmen Rodriguez",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 290,
      currentStudents: 265,
      programs: ["Spanish Studies", "Flamenco Arts", "European History", "International Business"],
      facilities: ["Language Center", "Flamenco Studio", "Historical Archive", "Business Hub"],
      operatingHours: "8:30 AM - 7:30 PM",
      contactEmail: "madrid@nscu.edu",
      contactPhone: "+34-91-555-1234",
      weeklySchedule: {
        "Monday": "Spanish Language & Literature",
        "Tuesday": "Flamenco Dance & Music",
        "Wednesday": "Spanish History & Culture",
        "Thursday": "International Business in Spain",
        "Friday": "Cultural Research Projects",
        "Saturday": "Cultural Festivals & Events"
      }
    },
    {
      id: 47,
      name: "Athens Classical Center",
      location: "Athens, Greece",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Dimitris Papadopoulos",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 260,
      currentStudents: 238,
      programs: ["Classical Studies", "Greek Studies", "Philosophy", "Archaeology"],
      facilities: ["Archaeological Lab", "Philosophy Seminar Room", "Classical Library", "Museum"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "athens@nscu.edu",
      contactPhone: "+30-21-555-1234",
      weeklySchedule: {
        "Monday": "Ancient Greek Philosophy",
        "Tuesday": "Classical Archaeology",
        "Wednesday": "Modern Greek Studies",
        "Thursday": "Ancient History & Culture",
        "Friday": "Archaeological Field Work",
        "Saturday": "Ancient Site Expeditions"
      }
    },
    {
      id: 48,
      name: "Warsaw Historical Center",
      location: "Warsaw, Poland",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Anna Kowalski",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 200,
      currentStudents: 175,
      programs: ["Polish Studies", "Eastern European History", "Technology Innovation", "EU Relations"],
      facilities: ["Historical Archive", "Language Center", "Innovation Lab", "EU Studies Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "warsaw@nscu.edu",
      contactPhone: "+48-22-555-1234",
      weeklySchedule: {
        "Monday": "Polish Language & Literature",
        "Tuesday": "Eastern European History",
        "Wednesday": "Technology Innovation",
        "Thursday": "EU Integration Studies",
        "Friday": "Historical Research",
        "Saturday": "Cultural Heritage Tours"
      }
    },
    {
      id: 49,
      name: "Prague Central European Hub",
      location: "Prague, Czech Republic",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Pavel Novák",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 180,
      currentStudents: 162,
      programs: ["Czech Studies", "Central European History", "Architecture", "Music Studies"],
      facilities: ["Cultural Center", "Historical Archive", "Architecture Studio", "Music Hall"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "prague@nscu.edu",
      contactPhone: "+420-2-555-1234",
      weeklySchedule: {
        "Monday": "Czech Language & Culture",
        "Tuesday": "Central European Politics",
        "Wednesday": "Gothic & Baroque Architecture",
        "Thursday": "Classical Music Studies",
        "Friday": "Cultural Research",
        "Saturday": "Architectural Heritage Tours"
      }
    },
    {
      id: 50,
      name: "Budapest Danube Center",
      location: "Budapest, Hungary",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Katalin Nagy",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 210,
      currentStudents: 185,
      programs: ["Hungarian Studies", "Thermal Sciences", "Central European Studies", "Gastronomy"],
      facilities: ["Language Center", "Thermal Research Lab", "Cultural Center", "Culinary Studio"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "budapest@nscu.edu",
      contactPhone: "+36-1-555-1234",
      weeklySchedule: {
        "Monday": "Hungarian Language & Literature",
        "Tuesday": "Thermal Spa Sciences",
        "Wednesday": "Central European Politics",
        "Thursday": "Traditional Hungarian Cuisine",
        "Friday": "Cultural Heritage Studies",
        "Saturday": "Danube River Studies"
      }
    },
    {
      id: 51,
      name: "Bucharest Educational Center",
      location: "Bucharest, Romania",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Mircea Popescu",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 190,
      currentStudents: 168,
      programs: ["Romanian Studies", "Eastern European Studies", "Engineering", "EU Integration"],
      facilities: ["Cultural Center", "Engineering Lab", "Language Center", "EU Studies Room"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "bucharest@nscu.edu",
      contactPhone: "+40-21-555-1234",
      weeklySchedule: {
        "Monday": "Romanian Language & Culture",
        "Tuesday": "Eastern European History",
        "Wednesday": "Engineering Projects",
        "Thursday": "EU Integration Studies",
        "Friday": "Research Methods",
        "Saturday": "Cultural Heritage Exploration"
      }
    },
    {
      id: 52,
      name: "Sofia Balkan Center",
      location: "Sofia, Bulgaria",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Ivan Dimitrov",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 170,
      currentStudents: 148,
      programs: ["Bulgarian Studies", "Balkan History", "Technology", "Tourism"],
      facilities: ["Cultural Research Center", "Historical Archive", "Tech Lab", "Tourism Center"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "sofia@nscu.edu",
      contactPhone: "+359-2-555-1234",
      weeklySchedule: {
        "Monday": "Bulgarian Language & Literature",
        "Tuesday": "Balkan Peninsula History",
        "Wednesday": "Technology Innovation",
        "Thursday": "Mountain Tourism Development",
        "Friday": "Academic Research",
        "Saturday": "Cultural Immersion Programs"
      }
    },
    {
      id: 53,
      name: "Zagreb Adriatic Hub",
      location: "Zagreb, Croatia",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Ana Horvat",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 160,
      currentStudents: 142,
      programs: ["Croatian Studies", "Adriatic Studies", "Tourism", "European Integration"],
      facilities: ["Language Center", "Marine Research Lab", "Tourism Training Center", "EU Studies Room"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "zagreb@nscu.edu",
      contactPhone: "+385-1-555-1234",
      weeklySchedule: {
        "Monday": "Croatian Language & Culture",
        "Tuesday": "Adriatic Marine Studies",
        "Wednesday": "Coastal Tourism Management",
        "Thursday": "European Integration",
        "Friday": "Cultural Research",
        "Saturday": "Island Heritage Tours"
      }
    },
    {
      id: 54,
      name: "Ljubljana Alpine Center",
      location: "Ljubljana, Slovenia",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Marko Kralj",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 140,
      currentStudents: 125,
      programs: ["Slovenian Studies", "Alpine Studies", "Environmental Science", "Sustainable Tourism"],
      facilities: ["Language Center", "Alpine Research Station", "Environmental Lab", "Tourism Studio"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "ljubljana@nscu.edu",
      contactPhone: "+386-1-555-1234",
      weeklySchedule: {
        "Monday": "Slovenian Language & Culture",
        "Tuesday": "Alpine Ecology Research",
        "Wednesday": "Environmental Conservation",
        "Thursday": "Sustainable Tourism Planning",
        "Friday": "Mountain Research",
        "Saturday": "Alpine Adventure Programs"
      }
    },
    {
      id: 55,
      name: "Bratislava Central European Hub",
      location: "Bratislava, Slovakia",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Peter Novotný",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 150,
      currentStudents: 132,
      programs: ["Slovak Studies", "Central European History", "Engineering", "EU Studies"],
      facilities: ["Cultural Center", "Historical Library", "Engineering Workshop", "EU Research Center"],
      operatingHours: "8:30 AM - 6:30 PM",
      contactEmail: "bratislava@nscu.edu",
      contactPhone: "+421-2-555-1234",
      weeklySchedule: {
        "Monday": "Slovak Language & Literature",
        "Tuesday": "Central European Politics",
        "Wednesday": "Engineering Innovation",
        "Thursday": "EU Integration Studies",
        "Friday": "Regional Development",
        "Saturday": "Danube Cultural Heritage"
      }
    },
    {
      id: 56,
      name: "Vilnius Baltic Center",
      location: "Vilnius, Lithuania",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Rasa Petraite",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 130,
      currentStudents: 115,
      programs: ["Lithuanian Studies", "Baltic History", "Technology", "Nordic Cooperation"],
      facilities: ["Language Center", "Historical Archive", "Innovation Lab", "Nordic Studies Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "vilnius@nscu.edu",
      contactPhone: "+370-5-555-1234",
      weeklySchedule: {
        "Monday": "Lithuanian Language & Culture",
        "Tuesday": "Baltic States History",
        "Wednesday": "Technology Innovation",
        "Thursday": "Nordic-Baltic Cooperation",
        "Friday": "Regional Studies",
        "Saturday": "Baltic Heritage Tours"
      }
    },
    {
      id: 57,
      name: "Riga Baltic Learning Hub",
      location: "Riga, Latvia",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Aivar Berzins",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 140,
      currentStudents: 126,
      programs: ["Latvian Studies", "Baltic Sea Studies", "Digital Innovation", "EU Integration"],
      facilities: ["Cultural Center", "Marine Research Lab", "Digital Lab", "EU Studies Room"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "riga@nscu.edu",
      contactPhone: "+371-67-555-1234",
      weeklySchedule: {
        "Monday": "Latvian Language & Literature",
        "Tuesday": "Baltic Sea Environmental Studies",
        "Wednesday": "Digital Technology Innovation",
        "Thursday": "European Integration",
        "Friday": "Cultural Heritage Research",
        "Saturday": "Coastal Ecology Programs"
      }
    },
    {
      id: 58,
      name: "Tallinn Digital Center",
      location: "Tallinn, Estonia",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Kadri Tamm",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 160,
      currentStudents: 145,
      programs: ["Estonian Studies", "Digital Society", "Cybersecurity", "Baltic Innovation"],
      facilities: ["Language Center", "Cybersecurity Lab", "Innovation Hub", "Digital Society Research Center"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "tallinn@nscu.edu",
      contactPhone: "+372-6-555-1234",
      weeklySchedule: {
        "Monday": "Estonian Language & Culture",
        "Tuesday": "Digital Society Development",
        "Wednesday": "Cybersecurity Training",
        "Thursday": "Baltic Innovation Projects",
        "Friday": "E-governance Studies",
        "Saturday": "Medieval Heritage Tours"
      }
    },
    {
      id: 59,
      name: "Ankara Turkish Center",
      location: "Ankara, Turkey",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Mehmet Özkan",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 280,
      currentStudents: 252,
      programs: ["Turkish Studies", "Middle Eastern Studies", "Engineering", "International Relations"],
      facilities: ["Cultural Center", "Research Library", "Engineering Lab", "Diplomatic Training Center"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "ankara@nscu.edu",
      contactPhone: "+90-312-555-1234",
      weeklySchedule: {
        "Monday": "Turkish Language & Literature",
        "Tuesday": "Middle Eastern Politics",
        "Wednesday": "Engineering Innovation",
        "Thursday": "International Diplomacy",
        "Friday": "Cultural Research",
        "Saturday": "Anatolian Heritage Tours"
      }
    },
    {
      id: 60,
      name: "Tel Aviv Innovation Hub",
      location: "Tel Aviv, Israel",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Sarah Cohen",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 250,
      currentStudents: 228,
      programs: ["Technology Innovation", "Middle Eastern Studies", "Entrepreneurship", "Desert Studies"],
      facilities: ["Innovation Lab", "Startup Incubator", "Research Center", "Desert Research Station"],
      operatingHours: "8:00 AM - 8:00 PM",
      contactEmail: "telaviv@nscu.edu",
      contactPhone: "+972-3-555-1234",
      weeklySchedule: {
        "Monday": "Technology Startups",
        "Tuesday": "Middle Eastern Culture & Politics",
        "Wednesday": "Entrepreneurship Development",
        "Thursday": "Desert Technology Research",
        "Friday": "Innovation Showcase",
        "Saturday": "Archaeological Exploration"
      }
    },
    {
      id: 61,
      name: "Nairobi African Center",
      location: "Nairobi, Kenya",
      linkedCollege: "Winston Leonard Churchill College",
      coordinator: "Prof. Grace Wanjiku",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 320,
      currentStudents: 285,
      programs: ["African Studies", "Wildlife Conservation", "Sustainable Development", "Swahili Studies"],
      facilities: ["Cultural Research Center", "Wildlife Research Station", "Sustainability Lab", "Language Center"],
      operatingHours: "7:00 AM - 7:00 PM",
      contactEmail: "nairobi@nscu.edu",
      contactPhone: "+254-20-555-1234",
      weeklySchedule: {
        "Monday": "African History & Politics",
        "Tuesday": "Wildlife Conservation Projects",
        "Wednesday": "Sustainable Development Goals",
        "Thursday": "Swahili Language & Culture",
        "Friday": "Community Development",
        "Saturday": "Safari Research Expeditions"
      }
    },
    {
      id: 62,
      name: "Lagos West African Hub",
      location: "Lagos, Nigeria",
      linkedCollege: "Theodore Roosevelt University",
      coordinator: "Dr. Adebayo Ogundimu",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 380,
      currentStudents: 342,
      programs: ["West African Studies", "Oil & Gas Technology", "Business Development", "Nollywood Arts"],
      facilities: ["Cultural Center", "Energy Research Lab", "Business Incubator", "Film Studio"],
      operatingHours: "7:00 AM - 8:00 PM",
      contactEmail: "lagos@nscu.edu",
      contactPhone: "+234-1-555-1234",
      weeklySchedule: {
        "Monday": "West African History & Culture",
        "Tuesday": "Petroleum Technology",
        "Wednesday": "African Business Development",
        "Thursday": "Nollywood Film Production",
        "Friday": "Economic Development",
        "Saturday": "Cultural Festival Participation"
      }
    },
    {
      id: 63,
      name: "Casablanca Maghreb Center",
      location: "Casablanca, Morocco",
      linkedCollege: "Franklin Delano Roosevelt College",
      coordinator: "Prof. Fatima Benali",
      established: 2019,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 270,
      currentStudents: 245,
      programs: ["Arabic Studies", "North African Studies", "International Trade", "Islamic Architecture"],
      facilities: ["Language Center", "Cultural Research Lab", "Trade Simulation Center", "Architecture Studio"],
      operatingHours: "8:00 AM - 7:00 PM",
      contactEmail: "casablanca@nscu.edu",
      contactPhone: "+212-522-555-1234",
      weeklySchedule: {
        "Monday": "Arabic Language & Literature",
        "Tuesday": "Maghreb History & Politics",
        "Wednesday": "International Trade Routes",
        "Thursday": "Islamic Architectural Studies",
        "Friday": "Cultural Heritage Research",
        "Saturday": "Desert Studies Expeditions"
      }
    },
    {
      id: 64,
      name: "Tunis Mediterranean Hub",
      location: "Tunis, Tunisia",
      linkedCollege: "Abraham Lincoln Institute of Excellence",
      coordinator: "Dr. Amine Ben Salem",
      established: 2021,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 200,
      currentStudents: 178,
      programs: ["Tunisian Studies", "Mediterranean Studies", "Ancient History", "Olive Agriculture"],
      facilities: ["Archaeological Lab", "Mediterranean Research Center", "Historical Archive", "Agricultural Station"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "tunis@nscu.edu",
      contactPhone: "+216-71-555-1234",
      weeklySchedule: {
        "Monday": "Tunisian Arabic & French",
        "Tuesday": "Carthaginian Archaeology",
        "Wednesday": "Mediterranean Trade History",
        "Thursday": "Traditional Agriculture",
        "Friday": "Cultural Heritage Studies",
        "Saturday": "Archaeological Site Visits"
      }
    },
    {
      id: 65,
      name: "Algiers North African Center",
      location: "Algiers, Algeria",
      linkedCollege: "John Fitzgerald Kennedy University",
      coordinator: "Prof. Karim Cherif",
      established: 2020,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 230,
      currentStudents: 205,
      programs: ["Algerian Studies", "Saharan Studies", "Energy Resources", "Berber Culture"],
      facilities: ["Cultural Research Center", "Desert Research Station", "Energy Lab", "Language Center"],
      operatingHours: "8:00 AM - 6:00 PM",
      contactEmail: "algiers@nscu.edu",
      contactPhone: "+213-21-555-1234",
      weeklySchedule: {
        "Monday": "Algerian History & Politics",
        "Tuesday": "Sahara Desert Studies",
        "Wednesday": "Natural Gas & Oil Resources",
        "Thursday": "Berber Language & Culture",
        "Friday": "Independence Movement Studies",
        "Saturday": "Atlas Mountains Expeditions"
      }
    },
    {
      id: 66,
      name: "Accra Gold Coast Center",
      location: "Accra, Ghana",
      linkedCollege: "Alexander Hamilton Institute of Technology",
      coordinator: "Dr. Kwame Asante",
      established: 2018,
      status: "Active",
      functions: {
        materialDistribution: true,
        studentSupport: true,
        examConduction: true,
        counseling: true,
        libraryAccess: true
      },
      capacity: 300,
      currentStudents: 275,
      programs: ["Ghanaian Studies", "Gold Mining Technology", "Cocoa Agriculture", "Traditional Arts"],
      facilities: ["Mining Technology Lab", "Agricultural Research Station", "Arts & Crafts Studio", "Cultural Center"],
      operatingHours: "7:00 AM - 7:00 PM",
      contactEmail: "accra@nscu.edu",
      contactPhone: "+233-30-555-1234",
      weeklySchedule: {
        "Monday": "Ghanaian History & Languages",
        "Tuesday": "Mining Technology & Safety",
        "Wednesday": "Cocoa Cultivation & Processing",
        "Thursday": "Traditional Kente Weaving",
        "Friday": "West African Trade Networks",
        "Saturday": "Cultural Festival Participation"
      }
    }
  ];

  const getFunctionIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const totalCapacity = studyCenters.reduce((sum, center) => sum + center.capacity, 0);
  const totalStudents = studyCenters.reduce((sum, center) => sum + center.currentStudents, 0);
  const averageUtilization = Math.round((totalStudents / totalCapacity) * 100);
  const activeCenters = studyCenters.filter(c => c.status === "Active").length;

  return (
    <PageLayout 
      title="Study Centers" 
      description="Local support centers providing educational services and student assistance across various regions"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{activeCenters}</div>
              <div className="text-sm text-gray-600">Active Centers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Students Served</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{totalCapacity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Capacity</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">{averageUtilization}%</div>
              <div className="text-sm text-gray-600">Avg Utilization</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Center Overview</TabsTrigger>
            <TabsTrigger value="services">Services Matrix</TabsTrigger>
            <TabsTrigger value="schedule">Weekly Schedules</TabsTrigger>
            <TabsTrigger value="contact">Contact Directory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-uw-purple">{center.name}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {center.location} • Established {center.established}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={center.status === "Active" ? "default" : "destructive"}>
                          {center.status}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {Math.round((center.currentStudents / center.capacity) * 100)}% Utilized
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Coordinator:</span>
                          <div className="font-semibold">{center.coordinator}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Linked to:</span>
                          <div className="font-semibold text-uw-purple">{center.linkedCollege}</div>
                        </div>
                      </div>

                      {/* Capacity & Enrollment */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{center.currentStudents}</div>
                          <div className="text-sm text-gray-600">Current Students</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{center.capacity}</div>
                          <div className="text-sm text-gray-600">Total Capacity</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">{center.operatingHours}</div>
                          <div className="text-sm text-gray-600">Operating Hours</div>
                        </div>
                      </div>

                      {/* Programs & Facilities */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Programs Supported:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.programs.map((program, idx) => (
                              <Badge key={idx} variant="outline">{program}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Facilities Available:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.facilities.map((facility, idx) => (
                              <Badge key={idx} variant="secondary">{facility}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                          Contact Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{center.contactEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{center.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services & Capabilities Matrix</CardTitle>
                <CardDescription>Services offered at each study center</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Study Center</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Material Distribution</TableHead>
                      <TableHead className="text-center">Student Support</TableHead>
                      <TableHead className="text-center">Exam Conduct</TableHead>
                      <TableHead className="text-center">Counseling</TableHead>
                      <TableHead className="text-center">Library Access</TableHead>
                      <TableHead className="text-center">Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studyCenters.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{center.name}</div>
                            <div className="text-sm text-gray-600">{center.coordinator}</div>
                          </div>
                        </TableCell>
                        <TableCell>{center.location}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.materialDistribution)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.studentSupport)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.examConduction)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.counseling)}</TableCell>
                        <TableCell className="text-center">{getFunctionIcon(center.functions.libraryAccess)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={Math.round((center.currentStudents / center.capacity) * 100) > 80 ? "destructive" : "default"}>
                            {Math.round((center.currentStudents / center.capacity) * 100)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="grid gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-uw-purple" />
                      {center.name} - Weekly Schedule
                    </CardTitle>
                    <CardDescription>{center.location} • {center.operatingHours}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(center.weeklySchedule).map(([day, activities]) => (
                        <div key={day} className="border-l-4 border-uw-purple pl-4 py-2">
                          <div className="font-semibold text-uw-purple">{day}</div>
                          <div className="text-sm text-gray-600">{activities}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              {studyCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <CardDescription>{center.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Coordinator:</span>
                        <div className="font-semibold">{center.coordinator}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Linked College:</span>
                        <div className="font-semibold text-uw-purple">{center.linkedCollege}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.contactEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.contactPhone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm">{center.operatingHours}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Serving {center.currentStudents} students • {Math.round((center.currentStudents / center.capacity) * 100)}% capacity
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default StudyCenters;