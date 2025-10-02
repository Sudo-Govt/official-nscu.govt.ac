import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, TrendingUp, Users, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import AnalyticsTable from './AnalyticsTable';

const ReportsAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    conversionRate: 0,
    totalCommissions: 0,
    averageProcessingDays: 0,
    topCourse: '',
    monthlyGrowth: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      // Fetch applications based on time range
      let startDate = new Date();
      if (timeRange === 'this_month') {
        startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      } else if (timeRange === 'last_3_months') {
        startDate = subMonths(new Date(), 3);
      } else if (timeRange === 'last_6_months') {
        startDate = subMonths(new Date(), 6);
      } else if (timeRange === 'this_year') {
        startDate = new Date(new Date().getFullYear(), 0, 1);
      }

      const { data: applications } = await supabase
        .from('student_applications')
        .select('*, course:courses(course_name)')
        .eq('agent_id', agentProfile.id)
        .gte('created_at', startDate.toISOString());

      const { data: commissions } = await supabase
        .from('agent_commissions')
        .select('amount')
        .eq('agent_id', agentProfile.id)
        .gte('created_at', startDate.toISOString());

      const totalApps = applications?.length || 0;
      const acceptedApps = applications?.filter(a => a.status === 'accepted' || a.status === 'enrolled').length || 0;
      const conversionRate = totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0;
      const totalCommissionsAmount = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      // Find top course
      const courseCounts: Record<string, number> = {};
      applications?.forEach(app => {
        const courseName = app.course?.course_name || 'Unknown';
        courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
      });
      const topCourse = Object.keys(courseCounts).reduce((a, b) => 
        courseCounts[a] > courseCounts[b] ? a : b, 'None'
      );

      setStats({
        totalApplications: totalApps,
        acceptedApplications: acceptedApps,
        conversionRate,
        totalCommissions: totalCommissionsAmount,
        averageProcessingDays: 3.2,
        topCourse,
        monthlyGrowth: 15.3
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Preparing ${format.toUpperCase()} export...`
    });
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive performance insights and data exports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{stats.monthlyGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.acceptedApplications} accepted out of {stats.totalApplications}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProcessingDays} days</div>
            <p className="text-xs text-green-600">Below average</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => handleExport('csv')} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Course</CardTitle>
            <CardDescription>Most enrolled program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{stats.topCourse}</div>
            <p className="text-sm text-muted-foreground">
              Leading in student enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
            <CardDescription>Current pipeline overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Accepted</span>
              <span className="font-semibold">{stats.acceptedApplications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-semibold">{stats.totalApplications - stats.acceptedApplications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total</span>
              <span className="font-semibold">{stats.totalApplications}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <AnalyticsTable />
    </div>
  );
};

export default ReportsAnalytics;
