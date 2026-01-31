import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { 
  Search, 
  LogOut, 
  Activity, 
  Clock, 
  Users, 
  Shield, 
  AlertTriangle,
  RefreshCw,
  Filter,
  Monitor,
  Smartphone,
  Globe,
  ChevronDown,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow, format, differenceInMinutes } from 'date-fns';

interface UserSession {
  id: string;
  user_id: string;
  session_token: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_info: string | null;
  location: string | null;
  signed_in_at: string;
  signed_out_at: string | null;
  last_activity_at: string;
  is_active: boolean;
  revoked_at: string | null;
  revoked_by: string | null;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
  role?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  session_id: string | null;
  action_type: string;
  action_description: string | null;
  resource_type: string | null;
  resource_id: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profile?: {
    full_name: string;
  };
}

const SessionsLogsManager = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 15;

  const [stats, setStats] = useState({
    activeSessions: 0,
    todayLogins: 0,
    avgSessionDuration: 0,
    uniqueUsers: 0
  });

  useEffect(() => {
    fetchSessions();
    fetchActivityLogs();
    fetchStats();

    // Set up realtime subscription for sessions
    const channel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_sessions' }, () => {
        fetchSessions();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, roleFilter, statusFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_sessions')
        .select('*', { count: 'exact' })
        .order('signed_in_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (statusFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (statusFilter === 'inactive') {
        query = query.eq('is_active', false);
      } else if (statusFilter === 'revoked') {
        query = query.not('revoked_at', 'is', null);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch user profiles and roles for each session
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(s => s.user_id))];
        
        const [profilesRes, rolesRes] = await Promise.all([
          supabase.from('profiles').select('user_id, full_name, avatar_url').in('user_id', userIds),
          supabase.from('user_roles').select('user_id, role').in('user_id', userIds)
        ]);

        const profilesMap = new Map(profilesRes.data?.map(p => [p.user_id, p]) || []);
        const rolesMap = new Map(rolesRes.data?.map(r => [r.user_id, r.role]) || []);

        const sessionsWithProfiles = data.map(session => ({
          ...session,
          profile: profilesMap.get(session.user_id),
          role: rolesMap.get(session.user_id)
        }));

        // Apply role filter client-side
        let filtered = sessionsWithProfiles;
        if (roleFilter !== 'all') {
          filtered = sessionsWithProfiles.filter(s => s.role === roleFilter);
        }

        setSessions(filtered);
      } else {
        setSessions([]);
      }

      setTotalSessions(count || 0);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (actionFilter !== 'all') {
        query = query.eq('action_type', actionFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch user profiles for logs
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(l => l.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

        const logsWithProfiles = data.map(log => ({
          ...log,
          profile: profilesMap.get(log.user_id)
        }));

        setActivityLogs(logsWithProfiles);
      } else {
        setActivityLogs([]);
      }

      setTotalLogs(count || 0);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to load activity logs');
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [activeRes, todayRes, allSessionsRes] = await Promise.all([
        supabase.from('user_sessions').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('user_sessions').select('id', { count: 'exact' }).gte('signed_in_at', today.toISOString()),
        supabase.from('user_sessions').select('user_id, signed_in_at, signed_out_at, last_activity_at').limit(1000)
      ]);

      const uniqueUsers = new Set(allSessionsRes.data?.map(s => s.user_id)).size;

      // Calculate average session duration
      let totalDuration = 0;
      let completedSessions = 0;
      allSessionsRes.data?.forEach(session => {
        const endTime = session.signed_out_at || session.last_activity_at;
        const duration = differenceInMinutes(new Date(endTime), new Date(session.signed_in_at));
        if (duration > 0 && duration < 1440) { // Less than 24 hours
          totalDuration += duration;
          completedSessions++;
        }
      });

      setStats({
        activeSessions: activeRes.count || 0,
        todayLogins: todayRes.count || 0,
        avgSessionDuration: completedSessions > 0 ? Math.round(totalDuration / completedSessions) : 0,
        uniqueUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string, userId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: currentUser.user?.id
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Log this action
      await supabase.from('user_activity_logs').insert({
        user_id: currentUser.user?.id || '',
        action_type: 'session_revoked',
        action_description: `Revoked session for user`,
        resource_type: 'session',
        resource_id: sessionId,
        metadata: { target_user_id: userId }
      });

      toast.success('Session revoked successfully');
      fetchSessions();
      fetchStats();
    } catch (error) {
      console.error('Error revoking session:', error);
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAllUserSessions = async (userId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: currentUser.user?.id
        })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      // Log this action
      await supabase.from('user_activity_logs').insert({
        user_id: currentUser.user?.id || '',
        action_type: 'all_sessions_revoked',
        action_description: `Revoked all sessions for user`,
        resource_type: 'user',
        resource_id: userId
      });

      toast.success('All user sessions revoked');
      fetchSessions();
      fetchStats();
    } catch (error) {
      console.error('Error revoking sessions:', error);
      toast.error('Failed to revoke sessions');
    }
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const parseUserAgent = (userAgent: string | null): string => {
    if (!userAgent) return 'Unknown';
    
    // Simple browser detection
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Browser';
  };

  const getSessionDuration = (signedIn: string, signedOut: string | null, lastActivity: string): string => {
    const endTime = signedOut || lastActivity;
    const minutes = differenceInMinutes(new Date(endTime), new Date(signedIn));
    
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  const getActionBadgeColor = (actionType: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (actionType) {
      case 'login':
      case 'sign_in':
        return 'default';
      case 'logout':
      case 'sign_out':
        return 'secondary';
      case 'session_revoked':
      case 'all_sessions_revoked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.profile?.full_name?.toLowerCase().includes(query) ||
      session.ip_address?.toLowerCase().includes(query) ||
      session.role?.toLowerCase().includes(query)
    );
  });

  const filteredLogs = activityLogs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.profile?.full_name?.toLowerCase().includes(query) ||
      log.action_type?.toLowerCase().includes(query) ||
      log.action_description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Logins</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayLogins}</div>
            <p className="text-xs text-muted-foreground">Sign-ins today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgSessionDuration}m</div>
            <p className="text-xs text-muted-foreground">Average time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Shield className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sessions & Logs
              </CardTitle>
              <CardDescription>
                Monitor user sessions, activity logs, and manage access
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => { fetchSessions(); fetchActivityLogs(); fetchStats(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sessions" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <TabsList>
                <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                <TabsTrigger value="history">Session History</TabsTrigger>
                <TabsTrigger value="activity">Activity Logs</TabsTrigger>
              </TabsList>

              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users, IPs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="admission_agent">Agent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Sessions Tab */}
            <TabsContent value="sessions">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Signed In</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading sessions...
                        </TableCell>
                      </TableRow>
                    ) : filteredSessions.filter(s => s.is_active).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No active sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.filter(s => s.is_active).map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">{session.profile?.full_name || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {session.role?.replace('_', ' ') || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(session.user_agent)}
                              <span className="text-sm">{parseUserAgent(session.user_agent)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {session.ip_address || 'N/A'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(session.signed_in_at), 'MMM d, HH:mm')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(session.signed_in_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(session.last_activity_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-500">
                              <Activity className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id, session.user_id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeAllUserSessions(session.user_id)}
                              >
                                <LogOut className="h-4 w-4 mr-1" />
                                Logout All
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Session History Tab */}
            <TabsContent value="history">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Sign In</TableHead>
                      <TableHead>Sign Out</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading history...
                        </TableCell>
                      </TableRow>
                    ) : filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No session history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">{session.profile?.full_name || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {session.role?.replace('_', ' ') || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(session.user_agent)}
                              <span className="text-sm">{parseUserAgent(session.user_agent)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {session.ip_address || 'N/A'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(session.signed_in_at), 'MMM d, HH:mm')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {session.signed_out_at ? (
                              <div className="text-sm">
                                {format(new Date(session.signed_out_at), 'MMM d, HH:mm')}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {getSessionDuration(session.signed_in_at, session.signed_out_at, session.last_activity_at)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {session.revoked_at ? (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Revoked
                              </Badge>
                            ) : session.is_active ? (
                              <Badge variant="default" className="bg-green-500">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Ended
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalSessions > itemsPerPage && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, Math.ceil(totalSessions / itemsPerPage)) }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalSessions / itemsPerPage), p + 1))}
                          className={currentPage >= Math.ceil(totalSessions / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            {/* Activity Logs Tab */}
            <TabsContent value="activity">
              <div className="mb-4">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="session_revoked">Session Revoked</SelectItem>
                    <SelectItem value="password_change">Password Change</SelectItem>
                    <SelectItem value="profile_update">Profile Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No activity logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{log.profile?.full_name || 'System'}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getActionBadgeColor(log.action_type)}>
                              {log.action_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{log.action_description || '-'}</span>
                          </TableCell>
                          <TableCell>
                            {log.resource_type && (
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {log.resource_type}
                              </code>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {log.ip_address || 'N/A'}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsLogsManager;
