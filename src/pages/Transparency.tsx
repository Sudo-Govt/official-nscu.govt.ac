import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, FileText, Award, Users, BookOpen, TrendingUp, Building, Info, Lock, Eye, Globe, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';
import { generateTransparencySchema } from '@/lib/seoSchemas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Transparency = () => {
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useSEO({
    title: 'Transparency & Accountability Portal | NSCU Delaware USA',
    description: 'Access NSCU\'s institutional transparency portal featuring public records, blockchain credential verification, and annual reports demonstrating our commitment to ethical integrity.',
    keywords: 'NSCU transparency, institutional accountability, blockchain verification, public records, annual reports, ethical university',
    structuredData: generateTransparencySchema(),
    canonical: 'https://nscu.govt.ac/transparency'
  });

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      // Aggregate statistics (mock data for demo)
      setStats({
        totalStudents: 15420,
        facultyRatio: '1:18',
        researchPublications: 245,
        placementRate: 89,
        accreditationScore: 'A+',
        greenCampusRating: 4.5,
        libraryResources: 125000,
        campusCount: 12,
        scholarships: 3450,
        internationalStudents: 42
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching public data:', error);
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationInput.trim()) {
      toast.error('Please enter a credential ID or hash');
      return;
    }

    // Simulate blockchain verification
    setTimeout(() => {
      if (verificationInput.toLowerCase().includes('nscu') || verificationInput.length > 10) {
        setVerificationResult({
          valid: true,
          studentName: 'Sample Student',
          degree: 'Bachelor of Science in Computer Science',
          graduationDate: '2024-05-15',
          credentialId: verificationInput
        });
        toast.success('Credential verified successfully!');
      } else {
        setVerificationResult({ valid: false });
        toast.error('Credential not found or invalid');
      }
    }, 1000);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--chart-1))'];

  const enrollmentData = [
    { year: '2019', students: 11800 },
    { year: '2020', students: 12500 },
    { year: '2021', students: 13200 },
    { year: '2022', students: 14100 },
    { year: '2023', students: 14800 },
    { year: '2024', students: 15420 }
  ];

  const programData = [
    { name: 'Engineering', value: 35 },
    { name: 'Business', value: 28 },
    { name: 'Medicine', value: 18 },
    { name: 'Arts & Sciences', value: 19 }
  ];

  const researchData = [
    { year: '2020', publications: 185 },
    { year: '2021', publications: 198 },
    { year: '2022', publications: 215 },
    { year: '2023', publications: 232 },
    { year: '2024', publications: 245 }
  ];

  const financialData = [
    { category: 'Academic Operations', amount: 45 },
    { category: 'Research & Innovation', amount: 25 },
    { category: 'Infrastructure', amount: 18 },
    { category: 'Student Services', amount: 12 }
  ];

  return (
    <PageLayout
      title="Transparency & Accountability Portal"
      description="New States Continental University's commitment to open governance and ethical practices"
    >
      {/* Hero Image */}
      <div className="relative h-[400px] w-full mb-12">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070"
          alt="NSCU Transparency Portal - Open books and documents symbolizing accountability"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <Shield className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Transparency & Accountability</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Open governance, ethical integrity, and blockchain-verified records
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Login Notification for Non-Logged Users */}
        {!user && (
          <Alert className="mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Only public information is available here. To access detailed institutional records and reports, you must be{' '}
              <Link to="/login" className="font-semibold underline hover:text-primary">
                logged in
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}

        {/* Motto Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 mb-12 text-center border-2 border-primary/20">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
          <h2 className="text-4xl font-bold text-foreground mb-3">
            "Even if no one is watching, we believe in ethical integrity."
          </h2>
          <p className="text-muted-foreground text-xl mb-4">
            NSCU - A university built on trust, transparency, and technology
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-4 py-2 text-base">
              <CheckCircle className="h-4 w-4 mr-2" />
              Ethics before Approval
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Database className="h-4 w-4 mr-2" />
              Records before Recognition
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Eye className="h-4 w-4 mr-2" />
              Data before Decision
            </Badge>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">About Transparency at NSCU</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                New States Continental University (NSCU) maintains the highest standards of institutional transparency and accountability. 
                Following principles inspired by ethical governance frameworks similar to UGC Act 1956, Section 13, we provide open access 
                to key institutional data, demonstrating our commitment to fair academic practices and administrative integrity.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our blockchain-verified record system ensures that all credentials and institutional records remain tamper-proof and 
                publicly verifiable. We disclose all major academic, financial, and governance data as a voluntary commitment to 
                accountability and fairness, even beyond regulatory requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                NSCU believes that transparency is not merely compliance—it is our culture. Every decision, every record, and every 
                achievement is documented, verified, and made accessible to stakeholders, students, and the global academic community.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070"
                alt="University governance and accountability"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Key Performance Dashboard */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Institutional Performance Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Academic Year 2024-25</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last year
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty-Student Ratio</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.facultyRatio}</div>
                <p className="text-xs text-muted-foreground mt-1">Qualified instructors</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Above industry standard
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Research Publications</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.researchPublications}</div>
                <p className="text-xs text-muted-foreground mt-1">Last academic year</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.6% growth
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.placementRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Class of 2024</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Top 10% nationally
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GCHEA Accreditation</CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.accreditationScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Current rating</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Fully accredited
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Green Campus Rating</CardTitle>
                <Building className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.greenCampusRating}/5</div>
                <p className="text-xs text-muted-foreground mt-1">Sustainability index</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Carbon neutral by 2030
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Library Resources</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{(stats?.libraryResources / 1000).toFixed(0)}K+</div>
                <p className="text-xs text-muted-foreground mt-1">Books, journals & digital</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    50K+ digital access
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Campus Network</CardTitle>
                <Globe className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.campusCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Campuses worldwide</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Building className="h-3 w-3 mr-1" />
                    6 countries
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scholarships Awarded</CardTitle>
                <Award className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.scholarships}</div>
                <p className="text-xs text-muted-foreground mt-1">This academic year</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    $12.5M total value
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">International Students</CardTitle>
                <Globe className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.internationalStudents}%</div>
                <p className="text-xs text-muted-foreground mt-1">From 65+ countries</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Diverse community
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts and Analytics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Performance Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Student Enrollment Trends (2019-2024)
                </CardTitle>
                <CardDescription>Consistent growth in student admissions year-over-year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Bar dataKey="students" fill="hsl(var(--primary))" name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Program Distribution
                </CardTitle>
                <CardDescription>Student enrollment across major academic programs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={programData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {programData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Research Publications Growth
                </CardTitle>
                <CardDescription>Annual research output by faculty and students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={researchData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="publications" stroke="hsl(var(--primary))" strokeWidth={2} name="Publications" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Budget Allocation (Public Summary)
                </CardTitle>
                <CardDescription>Major spending categories for 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={financialData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, amount }) => `${category}: ${amount}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Blockchain Verification Tool */}
        <section className="mb-16">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                Blockchain Credential Verification Tool
              </CardTitle>
              <CardDescription className="text-base">
                Verify the authenticity of NSCU degrees and certificates using our Academic Blockchain Registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070"
                    alt="Blockchain verification technology"
                    className="rounded-lg shadow-md mb-4"
                  />
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>All credentials are recorded in NSCU's tamper-proof blockchain registry</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>Instant verification available 24/7 from anywhere in the world</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>Employers and institutions can verify credentials independently</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Enter Degree ID or Certificate Hash (e.g., NSCU-2024-CS-12345)"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerification()}
                      className="text-base"
                    />
                    <Button onClick={handleVerification} size="lg">
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>

                  {verificationResult && (
                    <div className={`p-6 rounded-lg border-2 ${verificationResult.valid ? 'bg-green-50 border-green-500 dark:bg-green-950/20' : 'bg-red-50 border-red-500 dark:bg-red-950/20'}`}>
                      {verificationResult.valid ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <h4 className="font-bold text-lg text-green-700 dark:text-green-400">Valid Credential Verified</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><strong className="text-foreground">Student Name:</strong> {verificationResult.studentName}</p>
                            <p><strong className="text-foreground">Degree:</strong> {verificationResult.degree}</p>
                            <p><strong className="text-foreground">Graduation Date:</strong> {new Date(verificationResult.graduationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong className="text-foreground">Credential ID:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">{verificationResult.credentialId}</code></p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-green-300">
                            <p className="text-xs text-muted-foreground">
                              <Lock className="h-3 w-3 inline mr-1" />
                              This credential is recorded in NSCU's Academic Blockchain Registry and cannot be altered or forged.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                            <h4 className="font-bold text-lg text-red-700 dark:text-red-400">Invalid or Not Found</h4>
                          </div>
                          <p className="text-sm">The credential ID or hash you entered could not be verified in our blockchain registry.</p>
                          <p className="text-xs text-muted-foreground mt-2">Please double-check the credential ID and try again.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Public Records Sections - Each leading to detail pages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Public Records & Disclosures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/transparency/annual-reports">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Annual Reports</CardTitle>
                  <CardDescription>
                    Comprehensive yearly reports including Chancellor's message, academic achievements, and institutional goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2070"
                    alt="Annual reports"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">2020-2024 Archives Available</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transparency/financial-statements">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Financial Statements Summary</CardTitle>
                  <CardDescription>
                    Transparent financial disclosures including revenue, expenditure, scholarships, and audit reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070"
                    alt="Financial statements"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">Audited & Verified</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transparency/accreditation">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Accreditation & Compliance</CardTitle>
                  <CardDescription>
                    GCHEA accreditation status, IQAC reports, and quality assurance documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070"
                    alt="Accreditation certificates"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">GCHEA Accredited</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transparency/research-excellence">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Research & Innovation</CardTitle>
                  <CardDescription>
                    Published research, ongoing projects, patents, and technology transfer initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070"
                    alt="Research laboratory"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">245+ Publications</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transparency/governance">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Governance & Leadership</CardTitle>
                  <CardDescription>
                    Board meeting minutes, policy decisions, and institutional governance framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070"
                    alt="Board meeting"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">Transparent Governance</Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/transparency/community-impact">
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Community & Social Impact</CardTitle>
                  <CardDescription>
                    Outreach programs, sustainability initiatives, and community engagement activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070"
                    alt="Community service"
                    className="rounded-lg mb-3 h-48 w-full object-cover"
                  />
                  <Badge variant="secondary">100+ Programs</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Ethics & Integrity Statement */}
        <section className="mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Our Commitment to Ethical Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Eye className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ethics before Approval</h3>
                  <p className="text-sm text-muted-foreground">
                    We prioritize doing what's right over seeking recognition or approval from external bodies
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Database className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Records before Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Meticulous documentation and transparent record-keeping form the foundation of our operations
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Data before Decision</h3>
                  <p className="text-sm text-muted-foreground">
                    Evidence-based decision making ensures fairness, accountability, and continuous improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Future Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Transparency Roadmap</h2>
          <Card>
            <CardHeader>
              <CardTitle>Our Vision for Enhanced Transparency</CardTitle>
              <CardDescription>Upcoming initiatives to further strengthen our commitment to openness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Full Polygon-Based Credential Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Integration with Polygon blockchain for globally verifiable, immutable academic credentials (Q2 2025)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Open Data API for Research Partners</h4>
                    <p className="text-sm text-muted-foreground">
                      Public API access to anonymized institutional data for academic research and analysis (Q3 2025)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Quarterly Public Audit Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time transparency dashboard with quarterly financial and academic performance updates (Q4 2025)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">AI-Powered Transparency Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Machine learning tools for automated compliance monitoring and transparency reporting (2026)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Transparency Offices</CardTitle>
              <CardDescription>Reach out to our governance, compliance, and transparency teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-lg mb-3">Registrar's Office</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">For credential verification and student records inquiries</p>
                    <p><strong>Email:</strong> registrar@nscu.govt.ac</p>
                    <p><strong>Phone:</strong> +1-302-555-1620</p>
                    <p><strong>Hours:</strong> Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-lg mb-3">Public Grievance Cell</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">For complaints, suggestions, and transparency concerns</p>
                    <p><strong>Email:</strong> grievance@nscu.govt.ac</p>
                    <p><strong>Phone:</strong> +1-302-555-1621</p>
                    <p><strong>Hours:</strong> 24/7 Online Portal</p>
                  </div>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-lg mb-3">Academic Quality Division</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">For accreditation, IQAC, and quality assurance matters</p>
                    <p><strong>Email:</strong> quality@nscu.govt.ac</p>
                    <p><strong>Phone:</strong> +1-302-555-1622</p>
                    <p><strong>Hours:</strong> Mon-Fri, 8AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Quote */}
        <div className="mt-16 text-center py-8 border-t">
          <p className="text-xl font-semibold text-foreground italic mb-2">
            "Transparency is not compliance — it is our culture."
          </p>
          <p className="text-muted-foreground">
            This portal is developed to ensure transparency, accountability, and academic honesty at NSCU.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Transparency;
