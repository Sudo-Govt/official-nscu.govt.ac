import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ApplicationData {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  course: {
    course_name: string;
  };
  commission?: {
    amount: number;
    status: string;
  };
}

const AnalyticsTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsData();
  }, [user]);

  const fetchApplicationsData = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (agentProfile) {
        const { data: applicationsData } = await supabase
          .from('student_applications')
          .select(`
            id,
            application_number,
            first_name,
            last_name,
            status,
            created_at,
            course:courses(course_name)
          `)
          .eq('agent_id', agentProfile.id)
          .order('created_at', { ascending: false });

        if (applicationsData) {
          // Fetch commissions for each application
          const applicationsWithCommissions = await Promise.all(
            applicationsData.map(async (app) => {
              const { data: commission } = await supabase
                .from('agent_commissions')
                .select('amount, status')
                .eq('application_id', app.id)
                .maybeSingle();

              return {
                ...app,
                commission
              };
            })
          );

          setApplications(applicationsWithCommissions);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'enrolled': return 'default';
      case 'submitted': return 'secondary';
      case 'in_review': return 'outline';
      case 'on_hold': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const exportToCSV = () => {
    const headers = ['Application #', 'Student Name', 'Course', 'Status', 'Submission Date', 'Commission', 'Commission Status'];
    const rows = applications.map(app => [
      app.application_number,
      `${app.first_name} ${app.last_name}`,
      app.course?.course_name || 'N/A',
      getStatusLabel(app.status),
      format(new Date(app.created_at), 'MMM dd, yyyy'),
      app.commission?.amount ? `$${app.commission.amount}` : '$0',
      app.commission?.status || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Analytics data exported successfully"
    });
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Analytics Report</CardTitle>
            <CardDescription>Complete breakdown of all your submitted applications</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application #</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Commission Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-sm">
                      {app.application_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {app.first_name} {app.last_name}
                    </TableCell>
                    <TableCell>
                      {app.course?.course_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {getStatusLabel(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(app.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {app.commission?.amount ? `$${app.commission.amount}` : '$0'}
                    </TableCell>
                    <TableCell>
                      {app.commission?.status ? (
                        <Badge variant={app.commission.status === 'paid' ? 'default' : 'secondary'}>
                          {app.commission.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTable;
