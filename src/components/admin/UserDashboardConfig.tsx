import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserDashboardConfigProps {
  userId: string;
  userRole: string;
  fullName: string;
}

// Define available dashboard sections by role
const DASHBOARD_SECTIONS: Record<string, { id: string; label: string; description: string }[]> = {
  student: [
    { id: 'my_courses', label: 'My Courses', description: 'Display enrolled courses and subjects' },
    { id: 'grades', label: 'Grades & Progress', description: 'Show grades and academic progress' },
    { id: 'assignments', label: 'Assignments', description: 'Upcoming and pending assignments' },
    { id: 'schedule', label: 'Class Schedule', description: 'Weekly class timetable' },
    { id: 'library', label: 'Library Resources', description: 'Assigned books and materials' },
    { id: 'financial', label: 'Financial Overview', description: 'Fees and payment status' },
    { id: 'notifications', label: 'Notifications', description: 'Important announcements' },
    { id: 'quick_actions', label: 'Quick Actions', description: 'Course registration, forms, etc.' },
    { id: 'degree_progress', label: 'Degree Progress', description: 'Credits and requirements tracking' },
    { id: 'study_materials', label: 'Study Materials', description: 'Assigned study materials' },
  ],
  alumni: [
    { id: 'profile', label: 'Profile Overview', description: 'Personal and professional info' },
    { id: 'network', label: 'Alumni Network', description: 'Connect with other alumni' },
    { id: 'career', label: 'Career Services', description: 'Job listings and opportunities' },
    { id: 'events', label: 'Alumni Events', description: 'Upcoming alumni events' },
    { id: 'documents', label: 'Documents', description: 'Transcripts and credentials' },
    { id: 'giving', label: 'Giving History', description: 'Donation records' },
    { id: 'mentorship', label: 'Mentorship', description: 'Mentoring programs' },
    { id: 'chatroom', label: 'Chat Room', description: 'Alumni community chat' },
    { id: 'resources', label: 'Resources', description: 'Assigned downloadable resources' },
  ],
  faculty: [
    { id: 'my_courses', label: 'My Courses', description: 'Courses you are teaching' },
    { id: 'students', label: 'Student Roster', description: 'Enrolled students list' },
    { id: 'grades', label: 'Grade Management', description: 'Submit and manage grades' },
    { id: 'schedule', label: 'Teaching Schedule', description: 'Class timetable' },
    { id: 'research', label: 'Research', description: 'Research projects and publications' },
    { id: 'notifications', label: 'Notifications', description: 'Important announcements' },
  ],
  default: [
    { id: 'overview', label: 'Dashboard Overview', description: 'Main dashboard view' },
    { id: 'notifications', label: 'Notifications', description: 'Important announcements' },
    { id: 'quick_actions', label: 'Quick Actions', description: 'Common actions' },
  ]
};

const UserDashboardConfig: React.FC<UserDashboardConfigProps> = ({ userId, userRole, fullName }) => {
  const { toast } = useToast();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sections = DASHBOARD_SECTIONS[userRole] || DASHBOARD_SECTIONS.default;

  useEffect(() => {
    fetchDashboardConfig();
  }, [userId, userRole]);

  const fetchDashboardConfig = async () => {
    try {
      // Fetch from appropriate dashboard data table based on role
      let data = null;
      
      if (userRole === 'student') {
        const { data: studentData } = await supabase
          .from('student_dashboard_data')
          .select('visible_sections')
          .eq('student_id', userId)
          .maybeSingle();
        data = studentData;
      } else if (userRole === 'alumni') {
        const { data: alumniData } = await supabase
          .from('alumni_dashboard_data')
          .select('visible_sections')
          .eq('user_id', userId)
          .maybeSingle();
        data = alumniData;
      }

      if (data?.visible_sections) {
        setVisibleSections(data.visible_sections);
      } else {
        // Default: all sections visible
        setVisibleSections(sections.map(s => s.id));
      }
    } catch (error) {
      console.error('Error fetching dashboard config:', error);
      // Default to all visible
      setVisibleSections(sections.map(s => s.id));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = async (sectionId: string) => {
    const newSections = visibleSections.includes(sectionId)
      ? visibleSections.filter(s => s !== sectionId)
      : [...visibleSections, sectionId];

    setVisibleSections(newSections);
    setSaving(true);

    try {
      if (userRole === 'student') {
        // Check if record exists
        const { data: existing } = await supabase
          .from('student_dashboard_data')
          .select('id')
          .eq('student_id', userId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('student_dashboard_data')
            .update({ visible_sections: newSections })
            .eq('student_id', userId);
        } else {
          await supabase
            .from('student_dashboard_data')
            .insert({ student_id: userId, visible_sections: newSections });
        }
      } else if (userRole === 'alumni') {
        const { data: existing } = await supabase
          .from('alumni_dashboard_data')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('alumni_dashboard_data')
            .update({ visible_sections: newSections })
            .eq('user_id', userId);
        } else {
          await supabase
            .from('alumni_dashboard_data')
            .insert({ user_id: userId, visible_sections: newSections });
        }
      }

      toast({ title: 'Saved', description: 'Dashboard configuration updated' });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({ title: 'Error', description: 'Failed to save configuration', variant: 'destructive' });
      // Revert
      setVisibleSections(visibleSections);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <LayoutDashboard className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Dashboard Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Control which sections {fullName} sees on their dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{userRole}</Badge>
        <span className="text-sm text-muted-foreground">
          {visibleSections.length} of {sections.length} sections visible
        </span>
        {saving && <Badge variant="outline">Saving...</Badge>}
      </div>

      <Separator />

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4 py-2">
          {sections.map((section) => {
            const isVisible = visibleSections.includes(section.id);
            return (
              <Card key={section.id} className={!isVisible ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isVisible ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <Label className="font-medium cursor-pointer" onClick={() => handleToggleSection(section.id)}>
                          {section.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={isVisible}
                      onCheckedChange={() => handleToggleSection(section.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserDashboardConfig;
