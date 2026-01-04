import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  GripVertical,
  ChevronRight,
  Upload,
  Download,
} from "lucide-react";

interface NavItem {
  id: string;
  parent_id: string | null;
  title: string;
  href: string | null;
  position: number;
  is_active: boolean;
  menu_location: string;
  icon: string | null;
}

const NavigationManager = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    href: "",
    parent_id: "",
    menu_location: "main",
    is_active: true,
    icon: "",
  });

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from("site_navigation")
        .select("*")
        .order("position");

      if (error) throw error;
      setNavItems(data || []);
    } catch (error: any) {
      toast.error("Failed to load navigation: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const createCmsPage = async (title: string, href: string | null) => {
    // Only create page for internal links (starting with / or no href)
    const slug = href?.startsWith("/page/") 
      ? href.replace("/page/", "") 
      : href?.startsWith("/") 
        ? href.slice(1) 
        : generateSlug(title);
    
    // Check if page already exists
    const { data: existing } = await supabase
      .from("cms_pages")
      .select("id")
      .eq("slug", slug)
      .single();
    
    if (existing) return; // Page already exists

    const { error } = await supabase.from("cms_pages").insert({
      title,
      slug,
      status: "draft",
      page_type: "standard",
      meta_title: title,
      meta_description: `${title} - NSCU University`,
    });
    
    if (error) {
      console.error("Failed to create CMS page:", error);
    }
  };

  const deleteCmsPage = async (href: string | null, title: string) => {
    if (!href) return;
    
    const slug = href.startsWith("/page/") 
      ? href.replace("/page/", "") 
      : href.startsWith("/") 
        ? href.slice(1) 
        : generateSlug(title);
    
    const { error } = await supabase
      .from("cms_pages")
      .delete()
      .eq("slug", slug);
    
    if (error) {
      console.error("Failed to delete CMS page:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        href: formData.href || null,
        parent_id: formData.parent_id || null,
        menu_location: formData.menu_location,
        is_active: formData.is_active,
        icon: formData.icon || null,
        position: editingItem?.position ?? navItems.length,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("site_navigation")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Navigation item updated");
      } else {
        const { data, error } = await supabase
          .from("site_navigation")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        
        // Auto-create CMS page for new navigation item
        if (!formData.href?.startsWith("http")) {
          await createCmsPage(formData.title, formData.href || `/page/${generateSlug(formData.title)}`);
        }
        toast.success("Navigation item and page created");
      }

      setDialogOpen(false);
      resetForm();
      fetchNavItems();
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    const item = navItems.find((n) => n.id === id);
    const hasChildren = navItems.some((n) => n.parent_id === id);
    
    const confirmMsg = hasChildren 
      ? "This will delete this navigation item and its associated page. Child items will become orphaned. Continue?"
      : "Delete this navigation item and its associated page?";
    
    if (!confirm(confirmMsg)) return;
    
    try {
      // Delete the navigation item
      const { error } = await supabase
        .from("site_navigation")
        .delete()
        .eq("id", id);
      if (error) throw error;
      
      // Also delete the associated CMS page
      if (item && !item.href?.startsWith("http")) {
        await deleteCmsPage(item.href, item.title);
      }
      
      toast.success("Navigation item and page deleted");
      fetchNavItems();
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      href: item.href || "",
      parent_id: item.parent_id || "",
      menu_location: item.menu_location,
      is_active: item.is_active,
      icon: item.icon || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      href: "",
      parent_id: "",
      menu_location: "main",
      is_active: true,
      icon: "",
    });
  };

  const exportCSV = () => {
    const headers = ["id", "title", "href", "parent_id", "position", "menu_location", "is_active", "icon"];
    const csvContent = [
      headers.join(","),
      ...navItems.map((item) =>
        headers.map((h) => `"${item[h as keyof NavItem] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "navigation.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Navigation exported");
  };

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());

    const items = lines.slice(1).map((line) => {
      const values = line.match(/(".*?"|[^,]+)/g)?.map((v) => v.replace(/"/g, "").trim()) || [];
      const obj: {
        title: string;
        href?: string | null;
        parent_id?: string | null;
        position?: number;
        menu_location?: string;
        is_active?: boolean;
        icon?: string | null;
      } = { title: "" };
      headers.forEach((h, i) => {
        if (h === "title") {
          obj.title = values[i] || "Untitled";
        } else if (h === "is_active") {
          obj.is_active = values[i] === "true";
        } else if (h === "position") {
          obj.position = parseInt(values[i]) || 0;
        } else if (h === "href" || h === "parent_id" || h === "icon") {
          obj[h] = values[i] || null;
        } else if (h === "menu_location") {
          obj.menu_location = values[i] || "main";
        }
      });
      return obj;
    });

    try {
      // Clear existing and insert new
      await supabase.from("site_navigation").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error } = await supabase.from("site_navigation").insert(items);
      if (error) throw error;
      toast.success("Navigation imported successfully");
      fetchNavItems();
    } catch (error: any) {
      toast.error("Import failed: " + error.message);
    }
    e.target.value = "";
  };

  const getParentTitle = (parentId: string | null) => {
    if (!parentId) return "—";
    const parent = navItems.find((n) => n.id === parentId);
    return parent?.title || "—";
  };

  const rootItems = navItems.filter((n) => !n.parent_id);
  const getChildren = (parentId: string) =>
    navItems.filter((n) => n.parent_id === parentId);

  const renderNavTree = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const children = getChildren(item.id);
      return (
        <div key={item.id}>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2" style={{ paddingLeft: level * 24 }}>
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                {children.length > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={!item.is_active ? "text-muted-foreground" : ""}>
                  {item.title}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.href || "—"}</TableCell>
            <TableCell>{getParentTitle(item.parent_id)}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  item.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {item.is_active ? "Active" : "Hidden"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {children.length > 0 && renderNavTree(children, level + 1)}
        </div>
      );
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading navigation...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Navigation Menu</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Label htmlFor="csv-import" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
          </Label>
          <input
            id="csv-import"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={importCSV}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="href">Link (URL)</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) =>
                      setFormData({ ...formData, href: e.target.value })
                    }
                    placeholder="/page-slug or https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="parent">Parent Item</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(v) =>
                      setFormData({ ...formData, parent_id: v === "none" ? "" : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (top level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (top level)</SelectItem>
                      {navItems
                        .filter((n) => n.id !== editingItem?.id)
                        .map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Menu Location</Label>
                  <Select
                    value={formData.menu_location}
                    onValueChange={(v) =>
                      setFormData({ ...formData, menu_location: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Menu</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="e.g., Home, BookOpen, Users"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, is_active: v })
                    }
                  />
                  <Label htmlFor="active">Active (visible on site)</Label>
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
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {navItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No navigation items yet.</p>
            <p className="text-sm mt-1">
              Add items manually or import from CSV to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderNavTree(rootItems)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationManager;
