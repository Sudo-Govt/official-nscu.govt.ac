import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const StudentRecordsModule = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    // TODO: Uncomment when student_records table is created
    setLoading(false);
    toast.info('Student records module will be available after database migration');
    
    // try {
    //   const { data, error } = await supabase
    //     .from('student_records')
    //     .select('*')
    //     .order('created_at', { ascending: false })
    //     .limit(50);
    //
    //   if (error) throw error;
    //   setRecords(data || []);
    // } catch (error) {
    //   console.error('Error fetching student records:', error);
    //   toast.error('Failed to load student records');
    // } finally {
    //   setLoading(false);
    // }
  };

  const filteredRecords = records.filter(record =>
    record.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Records Management</CardTitle>
            <CardDescription>
              Comprehensive documentation of student admissions, performance, and progression
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by program or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Intake</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No records found</TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.program}</TableCell>
                    <TableCell>{record.academic_year}</TableCell>
                    <TableCell>{record.intake_session}</TableCell>
                    <TableCell>{record.gpa?.toFixed(2)}</TableCell>
                    <TableCell>{record.attendance_percentage?.toFixed(1)}%</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {record.status}
                      </span>
                    </TableCell>
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

export default StudentRecordsModule;