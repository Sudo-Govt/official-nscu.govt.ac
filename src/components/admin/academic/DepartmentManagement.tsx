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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { useDepartments, useFaculties } from '@/hooks/useAcademicData';
import { BulkActionsToolbar, FACULTY_DEPARTMENT_BULK_ACTIONS } from './BulkActionsToolbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Department } from '@/types/academic';

// Department now belongs to Faculty (Faculty -> Department -> Course)
export function DepartmentManagement() {
  const { data: departments, loading, fetchWithFaculty, create, update, remove } = useDepartments();
  const { data: faculties, fetch: fetchFaculties } = useFaculties();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    faculty_id: '',
    name: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchWithFaculty();
    fetchFaculties();
  }, []);

  const handleOpenDialog = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        faculty_id: dept.faculty_id,
        name: dept.name,
        description: dept.description || '',
        is_active: dept.is_active,
      });
    } else {
      setEditingDept(null);
      setFormData({ faculty_id: '', name: '', description: '', is_active: true });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.faculty_id) return;

    if (editingDept) {
      await update(editingDept.id, formData);
    } else {
      await create(formData);
    }
    setDialogOpen(false);
    setEditingDept(null);
    fetchWithFaculty();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will delete all courses under this department.')) {
      await remove(id);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(departments.map(d => d.id));
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
            .from('academic_departments')
            .update({ is_active: false })
            .in('id', ids);
          toast({ title: 'Success', description: `${ids.length} departments discontinued.` });
          break;
        case 'delete':
          for (const id of ids) {
            await remove(id);
          }
          toast({ title: 'Success', description: `${ids.length} departments deleted.` });
          break;
      }
      setSelectedIds([]);
      fetchWithFaculty();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Department Management
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDept ? 'Edit Department' : 'Add Department'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Faculty *</Label>
                <Select
                  value={formData.faculty_id}
                  onValueChange={(value) => setFormData({ ...formData, faculty_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.filter(f => f.is_active).map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name} ({faculty.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electrical Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the department"
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
                {editingDept ? 'Update' : 'Create'} Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <BulkActionsToolbar
          selectedIds={selectedIds}
          totalItems={departments.length}
          onSelectAll={handleSelectAll}
          allSelected={selectedIds.length === departments.length && departments.length > 0}
          actions={FACULTY_DEPARTMENT_BULK_ACTIONS}
          onAction={handleBulkAction}
          entityName="departments"
        />

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : departments.length === 0 ? (
          <p className="text-muted-foreground">No departments found. Add one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(dept.id)}
                      onCheckedChange={(checked) => handleSelectOne(dept.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{dept.code}</TableCell>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {(dept as any).faculty?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dept.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(dept)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(dept.id)}
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
