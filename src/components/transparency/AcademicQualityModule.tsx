import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const AcademicQualityModule = () => {
  const handleUpload = () => {
    toast.success('Evidence uploaded successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Quality & Accreditation</CardTitle>
        <CardDescription>
          IQAC meeting minutes, self-assessment reports, peer review reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Document Title</label>
            <Input placeholder="e.g., IQAC Meeting Minutes Q1 2024" className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Brief description of the document..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Upload Evidence</label>
            <div className="mt-1 flex items-center gap-4">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">PDF, DOCX, or Images (Max 10MB)</span>
            </div>
          </div>

          <Button onClick={handleUpload}>
            <FileText className="h-4 w-4 mr-2" />
            Upload & Verify Hash
          </Button>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Recent Quality Documents</h4>
          <div className="space-y-2">
            {[
              { title: 'IQAC Meeting Minutes - March 2024', date: '2024-03-15', hash: 'a3f5d8c9...' },
              { title: 'Self-Assessment Report 2023-24', date: '2024-02-28', hash: 'b7e2f1a4...' },
              { title: 'Peer Review Report - Engineering Dept', date: '2024-01-20', hash: 'c9d4e6b2...' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.date} • Hash: <span className="font-mono">{doc.hash}</span>
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicQualityModule;