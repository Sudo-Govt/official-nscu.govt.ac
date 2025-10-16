import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const ResearchModule = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // TODO: Uncomment when research_projects table is created
    setLoading(false);
    toast.info('Research module will be available after database migration');
    
    // try {
    //   const { data, error } = await supabase
    //     .from('research_projects')
    //     .select('*')
    //     .order('created_at', { ascending: false });
    //
    //   if (error) throw error;
    //   setProjects(data || []);
    // } catch (error) {
    //   console.error('Error fetching research projects:', error);
    //   toast.error('Failed to load research projects');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Research & Innovation</CardTitle>
            <CardDescription>
              Research projects, grants, publications, and patents
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Grant Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No projects found</TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.project_title}</TableCell>
                    <TableCell>${project.grant_amount?.toLocaleString()}</TableCell>
                    <TableCell>{project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={project.published_flag ? 'default' : 'secondary'}>
                        {project.published_flag ? 'Public' : 'Private'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{project.hash_signature?.substring(0, 12)}...</TableCell>
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

export default ResearchModule;