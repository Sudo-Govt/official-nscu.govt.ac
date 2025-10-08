import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/PageLayout';
import { Award, CheckCircle, FileText, Shield } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const AccreditationCompliance = () => {
  useSEO({
    title: 'Accreditation & Compliance | NSCU Transparency Portal',
    description: 'NSCU accreditation status, IQAC reports, quality assurance documentation, and international recognitions.',
    keywords: 'NSCU accreditation, GCHEA, IQAC, quality assurance, compliance',
    canonical: 'https://nscu.govt.ac/transparency/accreditation'
  });

  return (
    <PageLayout
      title="Accreditation & Compliance"
      description="Quality assurance, accreditation status, and compliance documentation"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/transparency" className="text-primary hover:underline">
            ← Back to Transparency Portal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mb-4" />
              <CardTitle>GCHEA Accredited</CardTitle>
              <CardDescription>Global Council for Higher Education Accreditation</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500 mb-2">Fully Accredited</Badge>
              <p className="text-sm text-muted-foreground">Valid until 2028</p>
              <p className="text-sm text-muted-foreground mt-2">Grade: A+</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Ministry Recognition</CardTitle>
              <CardDescription>MoECST, Belize</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500 mb-2">Recognized</Badge>
              <p className="text-sm text-muted-foreground">Registered since 2010</p>
              <p className="text-sm text-muted-foreground mt-2">License: EDU-2010-1458</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Quality Assurance</CardTitle>
              <CardDescription>IQAC Framework</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500 mb-2">Active</Badge>
              <p className="text-sm text-muted-foreground">Last audit: March 2024</p>
              <p className="text-sm text-muted-foreground mt-2">Score: 4.7/5.0</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>IQAC Annual Reports</CardTitle>
            <CardDescription>Internal Quality Assurance Cell meeting minutes and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { year: '2023-24', meetings: 6, recommendations: 28, implemented: 24, date: 'April 2024' },
                { year: '2022-23', meetings: 6, recommendations: 25, implemented: 23, date: 'April 2023' },
                { year: '2021-22', meetings: 5, recommendations: 22, implemented: 20, date: 'April 2022' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-medium">IQAC Report {report.year}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{report.meetings} meetings</span>
                      <span>{report.recommendations} recommendations</span>
                      <span className="text-green-600">{report.implemented} implemented</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  </div>
                  <Badge variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Report
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>International Recognitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { org: 'World Education Services (WES)', status: 'Listed', country: 'USA & Canada' },
                  { org: 'UK ENIC', status: 'Recognized', country: 'United Kingdom' },
                  { org: 'ANABIN Database', status: 'Registered', country: 'Germany' },
                  { org: 'Australian NOOSR', status: 'Listed', country: 'Australia' }
                ].map((recognition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{recognition.org}</p>
                      <p className="text-xs text-muted-foreground">{recognition.country}</p>
                    </div>
                    <Badge variant="secondary">{recognition.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Program Accreditations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { program: 'Engineering Programs', body: 'ABET (Provisional)', year: '2024' },
                  { program: 'Business Programs', body: 'ACBSP', year: '2023' },
                  { program: 'Medical Education', body: 'WFME', year: '2022' },
                  { program: 'Law Programs', body: 'ABA (Candidate)', year: '2024' }
                ].map((accreditation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{accreditation.program}</p>
                      <p className="text-xs text-muted-foreground">{accreditation.body}</p>
                    </div>
                    <Badge variant="secondary">{accreditation.year}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quality Assurance Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">
                NSCU operates a comprehensive Internal Quality Assurance Cell (IQAC) that continuously monitors 
                and enhances all aspects of academic delivery, research output, infrastructure, and student services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Quality Indicators Monitored:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Curriculum design and delivery</li>
                    <li>• Faculty qualifications and development</li>
                    <li>• Student learning outcomes</li>
                    <li>• Research quality and impact</li>
                    <li>• Infrastructure and facilities</li>
                    <li>• Student support services</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Assessment Methods:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Quarterly self-assessment reports</li>
                    <li>• Student and faculty feedback surveys</li>
                    <li>• Peer review evaluations</li>
                    <li>• External examiner reports</li>
                    <li>• Annual compliance audits</li>
                    <li>• Stakeholder consultations</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AccreditationCompliance;
