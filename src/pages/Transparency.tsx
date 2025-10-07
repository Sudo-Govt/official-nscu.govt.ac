import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Shield, FileText, Award, Users, BookOpen, TrendingUp, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';
import { generateTransparencySchema } from '@/lib/seoSchemas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Transparency = () => {
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Fetch public transparency records
      const { data: records } = await supabase
        .from('transparency_records')
        .select('*')
        .eq('visibility', 'public');

      // Fetch public financial records
      const { data: financial } = await supabase
        .from('financial_records')
        .select('*')
        .eq('visibility', 'public')
        .order('report_year', { ascending: true });

      // Fetch published research
      const { data: research } = await supabase
        .from('research_projects')
        .select('*')
        .eq('published_flag', true);

      // Aggregate statistics (mock data for demo)
      setStats({
        totalStudents: 15420,
        facultyRatio: '1:18',
        researchPublications: research?.length || 245,
        placementRate: 89,
        accreditationScore: 'A+',
        greenCampusRating: 4.5,
        libraryResources: 125000,
        campusCount: 12
      });

      setFinancialData(financial || []);
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

    try {
      const { data, error } = await supabase
        .from('blockchain_verifications')
        .select('*')
        .or(`credential_id.eq.${verificationInput},verification_hash.eq.${verificationInput}`)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setVerificationResult({
          valid: data.is_valid,
          studentName: data.student_name,
          degree: data.degree_title,
          graduationDate: data.graduation_date,
          credentialId: data.credential_id
        });
        toast.success('Credential verified successfully!');
      } else {
        setVerificationResult({ valid: false });
        toast.error('Credential not found or invalid');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Error during verification');
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const enrollmentData = [
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

  return (
    <PageLayout
      title="Transparency & Accountability Portal"
      description="New States Continental University's commitment to open governance and ethical practices"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Motto Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 mb-12 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-foreground mb-2">
            "Even if no one is watching, we believe in ethical integrity."
          </h2>
          <p className="text-muted-foreground text-lg">
            NSCU - A university built on trust, transparency, and technology
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Commitment to Transparency</h2>
          <p className="text-muted-foreground leading-relaxed">
            New States Continental University (NSCU) maintains the highest standards of institutional transparency and accountability. 
            Following principles inspired by ethical governance frameworks, we provide open access to key institutional data, 
            demonstrating our commitment to fair academic practices and administrative integrity. Our blockchain-verified record 
            system ensures that all credentials and institutional records remain tamper-proof and publicly verifiable.
          </p>
        </section>

        {/* Statistics Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Institutional Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Academic Year 2024-25</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty-Student Ratio</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.facultyRatio}</div>
                <p className="text-xs text-muted-foreground">Qualified instructors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Research Publications</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.researchPublications}</div>
                <p className="text-xs text-muted-foreground">Last academic year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.placementRate}%</div>
                <p className="text-xs text-muted-foreground">Class of 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accreditation</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.accreditationScore}</div>
                <p className="text-xs text-muted-foreground">GCHEA Rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Green Campus</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.greenCampusRating}/5</div>
                <p className="text-xs text-muted-foreground">Sustainability rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Library Resources</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.libraryResources / 1000).toFixed(0)}K+</div>
                <p className="text-xs text-muted-foreground">Books & journals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campus Network</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.campusCount}</div>
                <p className="text-xs text-muted-foreground">Global locations</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Enrollment Trends</CardTitle>
                <CardDescription>Year-wise growth in student admissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Distribution</CardTitle>
                <CardDescription>Student enrollment by major programs</CardDescription>
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {programData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Blockchain Verification */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blockchain Credential Verification
              </CardTitle>
              <CardDescription>
                Verify the authenticity of NSCU degrees and certificates using our blockchain registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Enter Degree ID or Certificate Hash"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerification()}
                />
                <Button onClick={handleVerification}>
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>

              {verificationResult && (
                <div className={`p-4 rounded-lg border ${verificationResult.valid ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : 'bg-red-50 border-red-200 dark:bg-red-950/20'}`}>
                  {verificationResult.valid ? (
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✓ Valid Credential</h4>
                      <p className="text-sm"><strong>Student:</strong> {verificationResult.studentName}</p>
                      <p className="text-sm"><strong>Degree:</strong> {verificationResult.degree}</p>
                      <p className="text-sm"><strong>Graduation:</strong> {new Date(verificationResult.graduationDate).toLocaleDateString()}</p>
                      <p className="text-sm"><strong>ID:</strong> {verificationResult.credentialId}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        This credential is recorded in NSCU's Academic Blockchain Registry
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400">✗ Invalid or Not Found</h4>
                      <p className="text-sm">The credential ID or hash you entered could not be verified.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Annual Reports */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Annual Reports & Disclosures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Annual Report 2023-24', icon: FileText, file: 'annual-report-2024.pdf' },
              { title: 'Financial Statements Summary', icon: FileText, file: 'financial-summary-2024.pdf' },
              { title: 'IQAC Report 2024', icon: FileText, file: 'iqac-report-2024.pdf' },
              { title: 'Research Highlights', icon: FileText, file: 'research-highlights-2024.pdf' },
              { title: 'Institutional Development Plan', icon: FileText, file: 'development-plan-2024.pdf' },
              { title: 'Ethics & Compliance Code', icon: FileText, file: 'ethics-code.pdf' }
            ].map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <report.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <CardDescription className="text-xs">PDF Document</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Contact & Inquiries</CardTitle>
              <CardDescription>Reach out to our transparency and governance offices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Registrar's Office</h4>
                  <p className="text-sm text-muted-foreground">registrar@nscu.govt.ac</p>
                  <p className="text-sm text-muted-foreground">+1-302-555-1620</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Public Grievance Cell</h4>
                  <p className="text-sm text-muted-foreground">grievance@nscu.govt.ac</p>
                  <p className="text-sm text-muted-foreground">+1-302-555-1621</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Academic Quality Division</h4>
                  <p className="text-sm text-muted-foreground">quality@nscu.govt.ac</p>
                  <p className="text-sm text-muted-foreground">+1-302-555-1622</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>This portal is developed to ensure transparency, accountability, and academic honesty at NSCU.</p>
          <p className="mt-2">All credentials are blockchain-verified and tamper-proof.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Transparency;