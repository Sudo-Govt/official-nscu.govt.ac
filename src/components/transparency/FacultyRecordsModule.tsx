import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const FacultyRecordsModule = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    // TODO: Uncomment when faculty_records table is created
    setLoading(false);
    toast.info('Faculty records module will be available after database migration');
    
    // try {
    //   const { data, error } = await supabase
    //     .from('faculty_records')
    //     .select('*')
    //     .order('joining_date', { ascending: false })
    //     .limit(50);
    //
    //   if (error) throw error;
    //   setRecords(data || []);
    // } catch (error) {
    //   console.error('Error fetching faculty records:', error);
    //   toast.error('Failed to load faculty records');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Faculty Records Management</CardTitle>
            <CardDescription>
              Faculty recruitment, qualifications, workload, and professional development
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Workload (hrs)</TableHead>
                <TableHead>Research Count</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No records found</TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.department}</TableCell>
                    <TableCell>{record.qualification}</TableCell>
                    <TableCell>{new Date(record.joining_date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.workload_hours}</TableCell>
                    <TableCell>{record.research_count}</TableCell>
                    <TableCell className="font-mono text-xs">{record.verified_hash?.substring(0, 12)}...</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyRecordsModule;