import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, Edit, Save, X, Eye, GraduationCap, Briefcase, Award, 
  FileText, Calendar, Heart, Plus, Trash2, Download, RefreshCw, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlumniProfile {
  id: string;
  user_id: string;
  graduation_year: number | null;
  degree_type: string | null;
  college: string | null;
  major: string | null;
  current_employer: string | null;
  current_position: string | null;
  location: string | null;
  bio: string | null;
  is_mentor_available: boolean | null;
  full_name?: string;
  email?: string;
}

interface AlumniDashboardData {
  id: string;
  user_id: string;
  graduation_info: Record<string, unknown>;
  career_history: unknown[];
  achievements: unknown[];
  assigned_resources: string[];
  visible_sections: string[];
  custom_data: Record<string, unknown>;
}

interface AlumniResource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_type: string | null;
  is_active: boolean;
  expires_at: string | null;
  download_count: number;
}

const AVAILABLE_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: Users },
  { id: 'career', label: 'Career Center', icon: Briefcase },
  { id: 'networking', label: 'Networking', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'chatroom', label: 'Chat Room', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'giving', label: 'Giving', icon: Heart },
];

const AlumniDataManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<AlumniDashboardData | null>(null);
  const [resources, setResources] = useState<AlumniResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<AlumniDashboardData>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    if (selectedAlumni) {
      fetchAlumniDashboardData(selectedAlumni.user_id);
      fetchAlumniResources(selectedAlumni.user_id);
    }
  }, [selectedAlumni]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      // Get alumni profiles with user info
      const { data: profiles, error } = await supabase
        .from('alumni_profiles')
        .select('*')
        .order('graduation_year', { ascending: false });

      if (error) throw error;

      // Get profile names
      const userIds = profiles?.map(p => p.user_id) || [];
      
      if (userIds.length > 0) {
        const { data: userProfiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        const profileMap: Record<string, { full_name: string }> = {};
        userProfiles?.forEach(p => {
          profileMap[p.user_id] = { full_name: p.full_name || 'Alumni' };
        });

        const enrichedAlumni = (profiles || []).map(p => ({
          ...p,
          full_name: profileMap[p.user_id]?.full_name || 'Alumni',
          email: ''
        }));

        setAlumni(enrichedAlumni);
      } else {
        setAlumni([]);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast({ title: 'Error', description: 'Failed to fetch alumni', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumniDashboardData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('alumni_dashboard_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setDashboardData(data as unknown as AlumniDashboardData);
        setEditingData(data as unknown as AlumniDashboardData);
      } else {
        // Initialize with defaults
        const defaultData: Partial<AlumniDashboardData> = {
          user_id: userId,
          graduation_info: {},
          career_history: [],
          achievements: [],
          assigned_resources: [],
          visible_sections: ['profile', 'career', 'networking', 'documents', 'chatroom'],
          custom_data: {}
        };
        setDashboardData(null);
        setEditingData(defaultData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchAlumniResources = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('alumni_downloadable_resources')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources((data as unknown as AlumniResource[]) || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const saveDashboardData = async () => {
    if (!selectedAlumni) return;

    try {
      if (dashboardData?.id) {
        // Update
        const { error } = await supabase
          .from('alumni_dashboard_data')
          .update({
            visible_sections: editingData.visible_sections,
            graduation_info: editingData.graduation_info as any,
            career_history: editingData.career_history as any,
            achievements: editingData.achievements as any,
            custom_data: editingData.custom_data as any
          })
          .eq('id', dashboardData.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('alumni_dashboard_data')
          .insert([{
            user_id: selectedAlumni.user_id,
            visible_sections: editingData.visible_sections || ['profile', 'career', 'networking', 'documents', 'chatroom'],
            graduation_info: (editingData.graduation_info || {}) as any,
            career_history: (editingData.career_history || []) as any,
            achievements: (editingData.achievements || []) as any,
            custom_data: (editingData.custom_data || {}) as any
          }]);

        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Dashboard settings saved' });
      fetchAlumniDashboardData(selectedAlumni.user_id);
    } catch (error) {
      console.error('Error saving dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  const toggleSection = (sectionId: string) => {
    const current = editingData.visible_sections || [];
    if (current.includes(sectionId)) {
      setEditingData({ ...editingData, visible_sections: current.filter(s => s !== sectionId) });
    } else {
      setEditingData({ ...editingData, visible_sections: [...current, sectionId] });
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('alumni_downloadable_resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;
      toast({ title: 'Success', description: 'Resource deleted' });
      if (selectedAlumni) fetchAlumniResources(selectedAlumni.user_id);
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const filteredAlumni = alumni.filter(a =>
    a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.current_employer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(a.graduation_year || '').includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alumni Data Management</h2>
          <p className="text-muted-foreground">Control individual alumni dashboard content and resources</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Alumni Directory
          </CardTitle>
          <CardDescription>{alumni.length} alumni registered</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Refresh */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alumni by name, employer, major, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                setLoading(true);
                fetchAlumni();
              }}
              title="Refresh alumni"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Visible Alumni Table */}
          <div className="rounded-md border mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Graduation Year</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Current Employer</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead className="w-[120px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredAlumni.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No alumni found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlumni.map((alumnus) => (
                    <TableRow key={alumnus.id} className={selectedAlumni?.id === alumnus.id ? 'bg-primary/5' : ''}>
                      <TableCell className="font-medium">{alumnus.full_name}</TableCell>
                      <TableCell>{alumnus.graduation_year || '—'}</TableCell>
                      <TableCell>{alumnus.major || '—'}</TableCell>
                      <TableCell>{alumnus.current_employer || '—'}</TableCell>
                      <TableCell>{alumnus.current_position || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={alumnus.is_mentor_available ? 'default' : 'secondary'}>
                          {alumnus.is_mentor_available ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAlumni(alumnus)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alumni Details Panel */}
      {selectedAlumni && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedAlumni ? selectedAlumni.full_name : 'Select an Alumni'}
              </span>
              {selectedAlumni && (
                <Button size="sm" onClick={saveDashboardData}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAlumni ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Graduation Year</Label>
                      <div className="text-lg font-medium">{selectedAlumni.graduation_year || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>Degree Type</Label>
                      <div className="text-lg font-medium">{selectedAlumni.degree_type || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>College</Label>
                      <div className="text-lg font-medium">{selectedAlumni.college || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>Major</Label>
                      <div className="text-lg font-medium">{selectedAlumni.major || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>Current Employer</Label>
                      <div className="text-lg font-medium">{selectedAlumni.current_employer || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <div className="text-lg font-medium">{selectedAlumni.current_position || 'N/A'}</div>
                    </div>
                  </div>
                  {selectedAlumni.bio && (
                    <div>
                      <Label>Bio</Label>
                      <p className="text-muted-foreground mt-1">{selectedAlumni.bio}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Visible Dashboard Sections</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control which sections this alumni can see on their dashboard
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_SECTIONS.map((section) => (
                      <div key={section.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <section.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{section.label}</span>
                        </div>
                        <Switch
                          checked={(editingData.visible_sections || []).includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Assigned Resources</Label>
                      <p className="text-sm text-muted-foreground">
                        Files and documents this alumni can download
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </div>
                  {resources.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Downloads</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resources.map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.title}</TableCell>
                            <TableCell>{resource.file_type || 'File'}</TableCell>
                            <TableCell>{resource.download_count}</TableCell>
                            <TableCell>
                              <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                                {resource.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteResource(resource.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      <Download className="h-8 w-8 mx-auto mb-2" />
                      No resources assigned
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Awards, publications, and milestones
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    No achievements recorded
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select an Alumni</h3>
                <p>Choose an alumni from the table above to manage their dashboard</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlumniDataManagement;