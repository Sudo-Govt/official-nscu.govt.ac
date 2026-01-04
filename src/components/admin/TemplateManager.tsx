import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Layout } from "lucide-react";

interface CmsTemplate {
  id: string;
  name: string;
  description: string | null;
  layout_structure: any;
  default_blocks: any;
  created_at: string;
}

const TemplateManager = () => {
  const [templates, setTemplates] = useState<CmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CmsTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    layout_structure: "[]",
    default_blocks: "[]",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_templates")
        .select("*")
        .order("name");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast.error("Failed to load templates: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let layoutStructure, defaultBlocks;
      try {
        layoutStructure = JSON.parse(formData.layout_structure);
        defaultBlocks = JSON.parse(formData.default_blocks);
      } catch {
        toast.error("Invalid JSON format");
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        layout_structure: layoutStructure,
        default_blocks: defaultBlocks,
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from("cms_templates")
          .update(payload)
          .eq("id", editingTemplate.id);
        if (error) throw error;
        toast.success("Template updated");
      } else {
        const { error } = await supabase.from("cms_templates").insert(payload);
        if (error) throw error;
        toast.success("Template created");
      }

      setDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template? Pages using it will keep their content but lose template reference.")) return;
    try {
      const { error } = await supabase.from("cms_templates").delete().eq("id", id);
      if (error) throw error;
      toast.success("Template deleted");
      fetchTemplates();
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const handleEdit = (template: CmsTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      layout_structure: JSON.stringify(template.layout_structure, null, 2),
      default_blocks: JSON.stringify(template.default_blocks, null, 2),
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      description: "",
      layout_structure: "[]",
      default_blocks: "[]",
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Page Templates</h3>
          <p className="text-sm text-muted-foreground">
            Define reusable page layouts with predefined content blocks
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Create Template"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="layout">Layout Structure (JSON array)</Label>
                <Textarea
                  id="layout"
                  value={formData.layout_structure}
                  onChange={(e) =>
                    setFormData({ ...formData, layout_structure: e.target.value })
                  }
                  rows={4}
                  className="font-mono text-sm"
                  placeholder='["hero", "content", "sidebar"]'
                />
              </div>
              <div>
                <Label htmlFor="blocks">Default Blocks (JSON array)</Label>
                <Textarea
                  id="blocks"
                  value={formData.default_blocks}
                  onChange={(e) =>
                    setFormData({ ...formData, default_blocks: e.target.value })
                  }
                  rows={6}
                  className="font-mono text-sm"
                  placeholder='[{"type": "hero", "fields": ["title", "subtitle"]}]'
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTemplate ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No templates yet.</p>
            <p className="text-sm mt-1">Create templates to standardize page layouts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(template.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {template.description && (
                  <CardDescription>{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <p>
                    <strong>Sections:</strong>{" "}
                    {Array.isArray(template.layout_structure)
                      ? template.layout_structure.join(", ")
                      : "—"}
                  </p>
                  <p className="mt-1">
                    <strong>Blocks:</strong>{" "}
                    {Array.isArray(template.default_blocks)
                      ? template.default_blocks.length
                      : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
