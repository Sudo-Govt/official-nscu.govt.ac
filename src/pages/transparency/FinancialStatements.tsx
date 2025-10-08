import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/PageLayout';
import { DollarSign, TrendingUp, PieChart, FileText } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FinancialStatements = () => {
  useSEO({
    title: 'Financial Statements | NSCU Transparency Portal',
    description: 'Access NSCU financial transparency data including revenue, expenditure, scholarships, grants, and independent audit reports.',
    keywords: 'NSCU financials, university budget, financial transparency, audit reports',
    canonical: 'https://nscu.govt.ac/transparency/financial-statements'
  });

  const financialData = [
    { year: '2024', revenue: 185.5, expenditure: 172.3, scholarships: 12.5 },
    { year: '2023', revenue: 176.2, expenditure: 165.8, scholarships: 11.2 },
    { year: '2022', revenue: 168.4, expenditure: 158.9, scholarships: 9.8 },
    { year: '2021', revenue: 159.7, expenditure: 151.2, scholarships: 8.5 },
    { year: '2020', revenue: 152.3, expenditure: 145.6, scholarships: 7.8 }
  ];

  return (
    <PageLayout
      title="Financial Statements Summary"
      description="Transparent financial disclosures and audit reports"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/transparency" className="text-primary hover:underline">
            ← Back to Transparency Portal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue 2024</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$185.5M</div>
              <Badge variant="secondary" className="mt-2">+5.3% YoY</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenditure 2024</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$172.3M</div>
              <Badge variant="secondary" className="mt-2">+3.9% YoY</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scholarships 2024</CardTitle>
              <PieChart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.5M</div>
              <Badge variant="secondary" className="mt-2">3,450 students</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Surplus 2024</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$13.2M</div>
              <Badge variant="secondary" className="mt-2">7.1% margin</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Financial Trends (2020-2024)</CardTitle>
            <CardDescription>All amounts in millions USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($M)" />
                <Bar dataKey="expenditure" fill="hsl(var(--secondary))" name="Expenditure ($M)" />
                <Bar dataKey="scholarships" fill="hsl(var(--accent))" name="Scholarships ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'Tuition & Fees', amount: 98.2, percentage: 53 },
                  { source: 'Research Grants', amount: 45.6, percentage: 24 },
                  { source: 'Endowment Income', amount: 22.4, percentage: 12 },
                  { source: 'Auxiliary Services', amount: 12.8, percentage: 7 },
                  { source: 'Donations & Gifts', amount: 6.5, percentage: 4 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.source}</p>
                      <p className="text-sm text-muted-foreground">${item.amount}M</p>
                    </div>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenditure Categories 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Academic Operations', amount: 77.5, percentage: 45 },
                  { category: 'Research & Innovation', amount: 43.1, percentage: 25 },
                  { category: 'Infrastructure & Facilities', amount: 31.0, percentage: 18 },
                  { category: 'Student Services', amount: 20.7, percentage: 12 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">${item.amount}M</p>
                    </div>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Independent Audit Reports</CardTitle>
            <CardDescription>Certified by leading international audit firms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { year: '2023-24', firm: 'Deloitte LLP', opinion: 'Unqualified', date: 'September 2024' },
                { year: '2022-23', firm: 'KPMG International', opinion: 'Unqualified', date: 'September 2023' },
                { year: '2021-22', firm: 'PwC Delaware', opinion: 'Unqualified', date: 'September 2022' },
                { year: '2020-21', firm: 'Ernst & Young', opinion: 'Unqualified', date: 'September 2021' }
              ].map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Fiscal Year {audit.year}</p>
                    <p className="text-sm text-muted-foreground">Audited by {audit.firm}</p>
                    <p className="text-xs text-muted-foreground">{audit.date}</p>
                  </div>
                  <Badge className="bg-green-500">{audit.opinion} Opinion</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FinancialStatements;
