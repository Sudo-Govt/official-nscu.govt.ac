import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useFaculties } from '@/hooks/useAcademicData';
import { BulkActionsToolbar, FACULTY_DEPARTMENT_BULK_ACTIONS } from './BulkActionsToolbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Faculty } from '@/types/academic';

// Faculty is now the top-level entity (no parent department)
export function FacultyManagement() {
  const { data: faculties, loading, fetch, create, update, remove } = useFaculties();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenDialog = (faculty?: Faculty) => {
    if (faculty) {
      setEditingFaculty(faculty);
      setFormData({
        name: faculty.name,
        description: faculty.description || '',
        is_active: faculty.is_active,
      });
    } else {
      setEditingFaculty(null);
      setFormData({ name: '', description: '', is_active: true });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (editingFaculty) {
      await update(editingFaculty.id, formData);
    } else {
      await create(formData);
    }
    setDialogOpen(false);
    setEditingFaculty(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will delete all departments and courses under this faculty.')) {
      await remove(id);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(faculties.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBulkAction = async (actionId: string, ids: string[]) => {
    try {
      switch (actionId) {
        case 'discontinue':
          await supabase
            .from('academic_faculties')
            .update({ is_active: false })
            .in('id', ids);
          toast({ title: 'Success', description: `${ids.length} faculties discontinued.` });
          break;
        case 'delete':
          for (const id of ids) {
            await remove(id);
          }
          toast({ title: 'Success', description: `${ids.length} faculties deleted.` });
          break;
      }
      setSelectedIds([]);
      fetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Faculty Management
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Faculty Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Faculty of Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the faculty"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingFaculty ? 'Update' : 'Create'} Faculty
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <BulkActionsToolbar
          selectedIds={selectedIds}
          totalItems={faculties.length}
          onSelectAll={handleSelectAll}
          allSelected={selectedIds.length === faculties.length && faculties.length > 0}
          actions={FACULTY_DEPARTMENT_BULK_ACTIONS}
          onAction={handleBulkAction}
          entityName="faculties"
        />

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : faculties.length === 0 ? (
          <p className="text-muted-foreground">No faculties found. Add one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculties.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(faculty.id)}
                      onCheckedChange={(checked) => handleSelectOne(faculty.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{faculty.code}</TableCell>
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {faculty.description || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      faculty.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {faculty.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(faculty)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(faculty.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
