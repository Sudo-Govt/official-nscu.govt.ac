import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const ReportsGeneratorModule = () => {
  const [reportType, setReportType] = useState('');
  const [reportYear, setReportYear] = useState('');

  const generateReport = () => {
    if (!reportType || !reportYear) {
      toast.error('Please select report type and year');
      return;
    }
    toast.success(`Generating ${reportType} report for ${reportYear}...`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Generator</CardTitle>
        <CardDescription>
          Auto-generate yearly public summary reports (PDF/CSV export)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Report</SelectItem>
                <SelectItem value="financial">Financial Summary</SelectItem>
                <SelectItem value="academic">Academic Performance</SelectItem>
                <SelectItem value="research">Research Output</SelectItem>
                <SelectItem value="governance">Governance Report</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <Select value={reportYear} onValueChange={setReportYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2023-24</SelectItem>
                <SelectItem value="2023">2022-23</SelectItem>
                <SelectItem value="2022">2021-22</SelectItem>
                <SelectItem value="2021">2020-21</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={generateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download as PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Recent Reports</h4>
          <div className="space-y-2">
            {[
              { title: 'Annual Report 2023-24', date: '2024-06-15', size: '2.3 MB' },
              { title: 'Financial Summary 2023-24', date: '2024-06-10', size: '1.1 MB' },
              { title: 'Research Output 2023-24', date: '2024-05-28', size: '850 KB' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-xs text-muted-foreground">Generated on {report.date} • {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsGeneratorModule;