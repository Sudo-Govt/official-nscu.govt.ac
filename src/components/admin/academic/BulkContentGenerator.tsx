import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Play, Pause, RotateCcw, Trash2, Search, Filter,
  CheckCircle2, XCircle, Clock, Loader2, Bell,
  AlertTriangle, Zap, Building2, Users, RefreshCw, ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useContentQueue } from '@/hooks/useContentQueue';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  name: string;
  course_code: string;
  slug: string | null;
  department_id: string | null;
  ai_generated_content: unknown;
}

interface Department {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
}

interface Faculty {
  id: string;
  name: string;
  code: string;
}

const BulkContentGenerator = () => {
  const { user } = useAuth();
  const {
    queueItems,
    notifications,
    stats,
    queueStatus,
    isLoading,
    isProcessing,
    unreadCount,
    estimatedTimeMinutes,
    startProcessing,
    pauseQueue,
    resumeQueue,
    addToQueue,
    removeFromQueue,
    clearCompleted,
    retryFailed,
    markNotificationsRead,
    refresh,
  } = useContentQueue();

  // Data state
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filter state
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showWithoutContent, setShowWithoutContent] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    const [facRes, deptRes, courseRes] = await Promise.all([
      supabase.from('academic_faculties').select('id, name, code').eq('is_active', true).order('name'),
      supabase.from('academic_departments').select('id, name, code, faculty_id').eq('is_active', true).order('name'),
      supabase.from('academic_courses').select('id, name, course_code, slug, department_id, ai_generated_content').eq('is_active', true).order('name'),
    ]);

    if (facRes.data) setFaculties(facRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    if (courseRes.data) setCourses(courseRes.data);
    setDataLoading(false);
  };

  // Filter courses
  const filteredDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  const filteredCourses = courses.filter(c => {
    // Department filter
    if (selectedDepartment && c.department_id !== selectedDepartment) return false;
    
    // Faculty filter (via department)
    if (selectedFaculty && !selectedDepartment) {
      const dept = departments.find(d => d.id === c.department_id);
      if (!dept || dept.faculty_id !== selectedFaculty) return false;
    }

    // Content filter
    if (showWithoutContent && c.ai_generated_content) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(query) && !c.course_code.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Exclude already queued items
    const isQueued = queueItems.some(qi => qi.course_id === c.id && qi.status !== 'completed' && qi.status !== 'failed');
    if (isQueued) return false;

    return true;
  });

  const toggleCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const selectAll = () => {
    setSelectedCourses(new Set(filteredCourses.map(c => c.id)));
  };

  const deselectAll = () => {
    setSelectedCourses(new Set());
  };

  const handleAddToQueue = async () => {
    if (!user) return;
    
    const coursesToAdd = filteredCourses.filter(c => selectedCourses.has(c.id));
    const success = await addToQueue(
      coursesToAdd.map(c => ({ id: c.id, course_code: c.course_code, name: c.name, slug: c.slug })),
      user.id
    );

    if (success) {
      setSelectedCourses(new Set());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      paused: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={cn('text-xs', variants[status] || '')}>{status}</Badge>;
  };

  const progressPercent = stats.pending + stats.processing + stats.completed + stats.failed > 0
    ? Math.round((stats.completed / (stats.pending + stats.processing + stats.completed + stats.failed)) * 100)
    : 0;

  if (isLoading || dataLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Status Dashboard */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Bulk Content Generator
                {queueStatus === 'running' && (
                  <Badge variant="default" className="ml-2 animate-pulse">
                    Running
                  </Badge>
                )}
                {queueStatus === 'paused' && (
                  <Badge variant="secondary" className="ml-2">
                    Paused
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                Generate AI curriculum for multiple courses with 30-second intervals
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={refresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{stats.processing}</div>
              <div className="text-sm text-blue-600">Processing</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          {/* Progress Bar */}
          {(stats.pending > 0 || stats.processing > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {stats.completed} of {stats.pending + stats.processing + stats.completed} completed</span>
                <span>~{estimatedTimeMinutes} min remaining</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* Queue Controls */}
          <div className="flex flex-wrap gap-2">
            {queueStatus !== 'running' ? (
              <Button onClick={startProcessing} disabled={stats.pending === 0}>
                <Play className="h-4 w-4 mr-2" />
                Start Queue
              </Button>
            ) : (
              <Button variant="secondary" onClick={pauseQueue}>
                <Pause className="h-4 w-4 mr-2" />
                Pause Queue
              </Button>
            )}
            <Button variant="outline" onClick={retryFailed} disabled={stats.failed === 0}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Failed ({stats.failed})
            </Button>
            <Button variant="outline" onClick={clearCompleted} disabled={stats.completed === 0 && stats.failed === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Completed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Notifications</CardTitle>
              <Button variant="ghost" size="sm" onClick={markNotificationsRead}>
                Mark all read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 20).map(n => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3 flex items-center gap-3',
                        !n.is_read && 'bg-blue-50/50'
                      )}
                    >
                      {getStatusIcon(n.status)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {n.status === 'completed' ? '✓' : '✗'} {n.course_code}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {n.course_name}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Add Courses to Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Faculty
                </Label>
                <Select
                  value={selectedFaculty}
                  onValueChange={(v) => {
                    setSelectedFaculty(v === 'all' ? '' : v);
                    setSelectedDepartment('');
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Faculties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Faculties</SelectItem>
                    {faculties.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Users className="h-3 w-3" /> Department
                </Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={(v) => setSelectedDepartment(v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {filteredDepartments.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={showWithoutContent}
                  onCheckedChange={(checked) => setShowWithoutContent(checked === true)}
                />
                Without content only
              </label>
              <div className="text-sm text-muted-foreground">
                {filteredCourses.length} courses
              </div>
            </div>

            <Separator />

            {/* Course List */}
            <ScrollArea className="h-72">
              {filteredCourses.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No courses match your filters
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCourses.map(course => (
                    <label
                      key={course.id}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50',
                        selectedCourses.has(course.id) && 'bg-primary/10'
                      )}
                    >
                      <Checkbox
                        checked={selectedCourses.has(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{course.name}</div>
                        <div className="text-xs text-muted-foreground">{course.course_code}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator />

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All ({filteredCourses.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Clear
                </Button>
              </div>
              <Button
                onClick={handleAddToQueue}
                disabled={selectedCourses.size === 0}
              >
                Add {selectedCourses.size} to Queue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Queue Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Queue Items
              <Badge variant="secondary">{queueItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {queueItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Queue is empty</p>
                  <p className="text-sm">Add courses to start generating content</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queueItems.map(item => (
                    <div
                      key={item.id}
                      className={cn(
                        'p-3 rounded-lg border',
                        item.status === 'processing' && 'bg-blue-50 border-blue-200',
                        item.status === 'completed' && 'bg-green-50 border-green-200',
                        item.status === 'failed' && 'bg-red-50 border-red-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.course_code}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.course_name}
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                        {item.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFromQueue(item.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {item.status === 'processing' && item.started_at && (
                        <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Started {new Date(item.started_at).toLocaleTimeString()}
                        </div>
                      )}
                      {item.status === 'failed' && item.error_message && (
                        <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {item.error_message}
                        </div>
                      )}
                      {item.status === 'completed' && (
                        <div className="mt-2 text-xs text-green-600 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Auto-saved at {new Date(item.completed_at!).toLocaleTimeString()}
                          </span>
                          {item.course_slug && (
                            <Link 
                              to={`/courses/${item.course_slug}`}
                              target="_blank"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              View Page <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkContentGenerator;
