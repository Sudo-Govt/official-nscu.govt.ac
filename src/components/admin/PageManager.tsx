import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileCode,
  Upload,
  Download,
  ExternalLink,
} from "lucide-react";
import PageEditor from "./PageEditor";

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  page_type: string;
  template_id: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface CmsTemplate {
  id: string;
  name: string;
  description: string | null;
}

const PageManager = () => {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [templates, setTemplates] = useState<CmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    template_id: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, templatesRes] = await Promise.all([
        supabase.from("cms_pages").select("*").order("updated_at", { ascending: false }),
        supabase.from("cms_templates").select("*"),
      ]);

      if (pagesRes.error) throw pagesRes.error;
      if (templatesRes.error) throw templatesRes.error;

      setPages(pagesRes.data || []);
      setTemplates(templatesRes.data || []);
    } catch (error: any) {
      toast.error("Failed to load pages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description || null,
        template_id: formData.template_id || null,
        status: formData.status,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (editingPage) {
        const { error } = await supabase
          .from("cms_pages")
          .update(payload)
          .eq("id", editingPage.id);
        if (error) throw error;
        toast.success("Page updated");
      } else {
        const { error } = await supabase.from("cms_pages").insert(payload);
        if (error) throw error;
        toast.success("Page created");
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page and all its content blocks?")) return;
    try {
      const { error } = await supabase.from("cms_pages").delete().eq("id", id);
      if (error) throw error;
      toast.success("Page deleted");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const handleEdit = (page: CmsPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      template_id: page.template_id || "",
      status: page.status,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
    });
    setDialogOpen(true);
  };

  const openEditor = (pageId: string) => {
    setSelectedPageId(pageId);
    setEditorOpen(true);
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      template_id: "",
      status: "draft",
      meta_title: "",
      meta_description: "",
    });
  };

  const getTemplateName = (templateId: string | null) => {
    if (!templateId) return "—";
    const template = templates.find((t) => t.id === templateId);
    return template?.name || "—";
  };

  const exportCSV = async () => {
    // Export pages with their content blocks
    const { data: blocks } = await supabase
      .from("cms_content_blocks")
      .select("*")
      .order("position");

    const csvContent = [
      "page_slug,block_type,block_key,position,field_name,value",
      ...(blocks || []).flatMap((block) => {
        const page = pages.find((p) => p.id === block.page_id);
        if (!page) return [];
        const content = block.content as Record<string, any>;
        return Object.entries(content).map(
          ([key, value]) =>
            `"${page.slug}","${block.block_type}","${block.block_key || ""}",${block.position},"${key}","${String(value).replace(/"/g, '""')}"`
        );
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pages-content.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Content exported");
  };

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());

    // Group by page_slug and block_key
    const blockMap: Record<string, Record<string, any>> = {};

    lines.slice(1).forEach((line) => {
      const values = line.match(/(".*?"|[^,]+)/g)?.map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"').trim()) || [];
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = values[i] || ""));

      const key = `${row.page_slug}|${row.block_type}|${row.block_key}|${row.position}`;
      if (!blockMap[key]) {
        blockMap[key] = {
          page_slug: row.page_slug,
          block_type: row.block_type,
          block_key: row.block_key,
          position: parseInt(row.position) || 0,
          content: {},
        };
      }
      blockMap[key].content[row.field_name] = row.value;
    });

    try {
      for (const block of Object.values(blockMap)) {
        const page = pages.find((p) => p.slug === block.page_slug);
        if (!page) continue;

        // Upsert block
        const { data: existing } = await supabase
          .from("cms_content_blocks")
          .select("id")
          .eq("page_id", page.id)
          .eq("block_type", block.block_type)
          .eq("block_key", block.block_key || "")
          .single();

        if (existing) {
          await supabase
            .from("cms_content_blocks")
            .update({ content: block.content, position: block.position })
            .eq("id", existing.id);
        } else {
          await supabase.from("cms_content_blocks").insert({
            page_id: page.id,
            block_type: block.block_type,
            block_key: block.block_key || null,
            position: block.position,
            content: block.content,
          });
        }
      }
      toast.success("Content imported successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Import failed: " + error.message);
    }
    e.target.value = "";
  };

  if (loading) {
    return <div className="p-6 text-center">Loading pages...</div>;
  }

  if (editorOpen && selectedPageId) {
    return (
      <PageEditor
        pageId={selectedPageId}
        onClose={() => {
          setEditorOpen(false);
          setSelectedPageId(null);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>CMS Pages</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Label htmlFor="page-csv-import" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
          </Label>
          <input
            id="page-csv-import"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={importCSV}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingPage ? "Edit Page" : "Create Page"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: editingPage
                          ? formData.slug
                          : e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      });
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    placeholder="e.g., school-of-arts"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={formData.template_id}
                    onValueChange={(v) =>
                      setFormData({ ...formData, template_id: v === "none" ? "" : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No template</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meta_title">SEO Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData({ ...formData, meta_title: e.target.value })
                    }
                    placeholder="Override page title for SEO"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">SEO Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({ ...formData, meta_description: e.target.value })
                    }
                    rows={2}
                    placeholder="Meta description for search engines"
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
                  <Button type="submit">{editingPage ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No CMS pages yet.</p>
            <p className="text-sm mt-1">Create a page to start building content.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>{getTemplateName(page.template_id)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={page.status === "published" ? "default" : "secondary"}
                    >
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditor(page.id)}
                        title="Edit Content"
                      >
                        <FileCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(page)}
                        title="Edit Settings"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Preview"
                      >
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(page.id)}
                        className="text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PageManager;
