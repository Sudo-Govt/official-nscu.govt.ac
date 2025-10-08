import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/PageLayout';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const AnnualReports = () => {
  useSEO({
    title: 'Annual Reports Archive | NSCU Transparency Portal',
    description: 'Access NSCU annual reports including Chancellor\'s message, academic achievements, student data, financial summaries, and institutional goals.',
    keywords: 'NSCU annual reports, university reports, institutional transparency, academic achievements',
    canonical: 'https://nscu.govt.ac/transparency/annual-reports'
  });

  const reports = [
    {
      year: '2023-24',
      title: 'Annual Report 2023-2024',
      date: 'August 2024',
      highlights: ['15,420 students enrolled', '245 research publications', '89% placement rate', '$12.5M in scholarships'],
      hash: 'a3f5d8c9b2e1f7a4...',
      pages: 156,
      size: '12.4 MB'
    },
    {
      year: '2022-23',
      title: 'Annual Report 2022-2023',
      date: 'August 2023',
      highlights: ['14,800 students enrolled', '232 research publications', '86% placement rate', '$11.2M in scholarships'],
      hash: 'b7e2f1a4c9d3e6b8...',
      pages: 148,
      size: '11.8 MB'
    },
    {
      year: '2021-22',
      title: 'Annual Report 2021-2022',
      date: 'August 2022',
      highlights: ['14,100 students enrolled', '215 research publications', '84% placement rate', '$9.8M in scholarships'],
      hash: 'c9d4e6b2a1f5c7d3...',
      pages: 142,
      size: '10.9 MB'
    },
    {
      year: '2020-21',
      title: 'Annual Report 2020-2021',
      date: 'August 2021',
      highlights: ['13,200 students enrolled', '198 research publications', '82% placement rate', '$8.5M in scholarships'],
      hash: 'd1f7c3e9b4a6d8f2...',
      pages: 138,
      size: '10.2 MB'
    },
    {
      year: '2019-20',
      title: 'Annual Report 2019-2020',
      date: 'August 2020',
      highlights: ['12,500 students enrolled', '185 research publications', '79% placement rate', '$7.8M in scholarships'],
      hash: 'e5a8d2f6c1b9e7a3...',
      pages: 134,
      size: '9.8 MB'
    }
  ];

  return (
    <PageLayout
      title="Annual Reports Archive"
      description="Comprehensive yearly reports documenting NSCU's academic, financial, and institutional progress"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/transparency" className="text-primary hover:underline">
            ← Back to Transparency Portal
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What's Included in Our Annual Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, title: "Chancellor's Message", desc: "Leadership vision and reflections" },
              { icon: Calendar, title: "Academic Achievements", desc: "Student & faculty accomplishments" },
              { icon: Eye, title: "Financial Summary", desc: "Revenue, expenditure & scholarships" },
              { icon: Download, title: "Future Goals", desc: "Strategic plans & objectives" }
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="text-xs">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {reports.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      {report.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{report.date}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Online
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Highlights</h4>
                    <ul className="space-y-2">
                      {report.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Badge variant="secondary" className="mt-0.5">✓</Badge>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Document Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Pages:</strong> {report.pages}</p>
                      <p><strong>File Size:</strong> {report.size}</p>
                      <p><strong>Format:</strong> PDF</p>
                      <p><strong>Blockchain Hash:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">{report.hash}</code></p>
                      <Badge className="mt-2">Verified & Authentic</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-muted/50">
          <CardHeader>
            <CardTitle>About Our Annual Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              NSCU's annual reports are comprehensive documents that provide a detailed overview of the university's 
              activities, achievements, and financial performance throughout the academic year. Each report includes 
              a message from the Chancellor, detailed enrollment and graduation statistics, faculty research highlights, 
              financial summaries, community engagement activities, and strategic goals for the coming year. All reports 
              are independently audited and blockchain-verified for authenticity.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AnnualReports;
