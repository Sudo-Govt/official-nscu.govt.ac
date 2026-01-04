import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Upload,
  Download,
  Code,
} from "lucide-react";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface ContentBlock {
  id: string;
  page_id: string;
  block_type: string;
  block_key: string | null;
  position: number;
  content: Record<string, any>;
  custom_css: string | null;
  is_active: boolean;
}

interface CmsPage {
  id: string;
  slug: string;
  title: string;
}

interface PageEditorProps {
  pageId: string;
  onClose: () => void;
}

const BLOCK_TYPES = [
  { value: "hero_stats", label: "Hero with Stats", fields: ["stat1_title", "stat1_value", "stat2_title", "stat2_value", "stat3_title", "stat3_value", "stat4_title", "stat4_value"] },
  { value: "overview", label: "Overview Section", fields: ["heading", "paragraph", "sidebar_title1", "sidebar_content1", "sidebar_title2", "sidebar_content2", "sidebar_title3", "sidebar_content3"] },
  { value: "departments", label: "Departments Grid", fields: ["title", "items"] },
  { value: "programs", label: "Programs List", fields: ["title", "items"] },
  { value: "research_centers", label: "Research Centers", fields: ["title", "items"] },
  { value: "alumni", label: "Alumni Section", fields: ["title", "items"] },
  { value: "hero", label: "Hero Banner", fields: ["title", "subtitle", "image_url", "cta_text", "cta_link"] },
  { value: "content", label: "Rich Content", fields: ["body"] },
  { value: "features", label: "Features Grid", fields: ["title", "items"] },
  { value: "cta", label: "Call to Action", fields: ["title", "subtitle", "button_text", "button_link"] },
  { value: "custom_html", label: "Custom HTML/CSS", fields: ["html", "css"] },
];

const PageEditor = ({ pageId, onClose }: PageEditorProps) => {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState("");
  const [activeTab, setActiveTab] = useState("visual");

  useEffect(() => {
    fetchPageData();
  }, [pageId]);

  const fetchPageData = async () => {
    try {
      const [pageRes, blocksRes] = await Promise.all([
        supabase.from("cms_pages").select("id, slug, title").eq("id", pageId).single(),
        supabase.from("cms_content_blocks").select("*").eq("page_id", pageId).order("position"),
      ]);

      if (pageRes.error) throw pageRes.error;
      if (blocksRes.error) throw blocksRes.error;

      setPage(pageRes.data);
      // Cast content from Json to Record<string, any>
      const typedBlocks: ContentBlock[] = (blocksRes.data || []).map((b) => ({
        ...b,
        content: (b.content && typeof b.content === 'object' && !Array.isArray(b.content)) 
          ? b.content as Record<string, any> 
          : {},
      }));
      setBlocks(typedBlocks);
    } catch (error: any) {
      toast.error("Failed to load page: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = async () => {
    if (!newBlockType) return;
    try {
      const blockDef = BLOCK_TYPES.find((b) => b.value === newBlockType);
      const defaultContent: Record<string, any> = {};
      blockDef?.fields.forEach((f) => (defaultContent[f] = ""));

      const { data, error } = await supabase
        .from("cms_content_blocks")
        .insert({
          page_id: pageId,
          block_type: newBlockType,
          position: blocks.length,
          content: defaultContent,
        })
        .select()
        .single();

      if (error) throw error;
      const newBlock: ContentBlock = {
        ...data,
        content: (data.content && typeof data.content === 'object' && !Array.isArray(data.content))
          ? data.content as Record<string, any>
          : {},
      };
      setBlocks([...blocks, newBlock]);
      setDialogOpen(false);
      setNewBlockType("");
      toast.success("Block added");
    } catch (error: any) {
      toast.error("Failed to add block: " + error.message);
    }
  };

  const updateBlockContent = (blockId: string, field: string, value: any) => {
    setBlocks(
      blocks.map((b) =>
        b.id === blockId ? { ...b, content: { ...b.content, [field]: value } } : b
      )
    );
  };

  const updateBlockCSS = (blockId: string, css: string) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, custom_css: css } : b)));
  };

  const deleteBlock = async (blockId: string) => {
    if (!confirm("Delete this content block?")) return;
    try {
      const { error } = await supabase
        .from("cms_content_blocks")
        .delete()
        .eq("id", blockId);
      if (error) throw error;
      setBlocks(blocks.filter((b) => b.id !== blockId));
      toast.success("Block deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const saveAllBlocks = async () => {
    setSaving(true);
    try {
      for (const block of blocks) {
        const { error } = await supabase
          .from("cms_content_blocks")
          .update({
            content: block.content,
            custom_css: block.custom_css,
            position: block.position,
          })
          .eq("id", block.id);
        if (error) throw error;
      }
      toast.success("All changes saved");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const rows = blocks.flatMap((block) =>
      Object.entries(block.content).map(([key, value]) => ({
        block_type: block.block_type,
        block_key: block.block_key || "",
        position: block.position,
        field_name: key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }))
    );

    const csvContent = [
      "block_type,block_key,position,field_name,value",
      ...rows.map(
        (r) =>
          `"${r.block_type}","${r.block_key}",${r.position},"${r.field_name}","${r.value.replace(/"/g, '""')}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page?.slug || "page"}-content.csv`;
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

    const updatedBlocks = [...blocks];

    lines.slice(1).forEach((line) => {
      const values = line.match(/(".*?"|[^,]+)/g)?.map((v) => 
        v.replace(/^"|"$/g, "").replace(/""/g, '"').trim()
      ) || [];
      
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = values[i] || ""));

      const block = updatedBlocks.find(
        (b) =>
          b.block_type === row.block_type &&
          b.position === parseInt(row.position)
      );

      if (block) {
        let value: any = row.value;
        try {
          value = JSON.parse(row.value);
        } catch {}
        block.content[row.field_name] = value;
      }
    });

    setBlocks(updatedBlocks);
    toast.success("CSV imported - click Save to persist changes");
    e.target.value = "";
  };

  const getBlockLabel = (type: string) => {
    return BLOCK_TYPES.find((b) => b.value === type)?.label || type;
  };

  const renderBlockFields = (block: ContentBlock) => {
    const blockDef = BLOCK_TYPES.find((b) => b.value === block.block_type);
    if (!blockDef) return null;

    return blockDef.fields.map((field) => {
      const value = block.content[field] || "";
      const isItems = field === "items";
      const isBody = field === "body" || field === "html" || field === "paragraph";

      if (isItems) {
        return (
          <div key={field} className="space-y-2">
            <Label>{field} (JSON array)</Label>
            <Textarea
              value={typeof value === "object" ? JSON.stringify(value, null, 2) : value}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateBlockContent(block.id, field, parsed);
                } catch {
                  updateBlockContent(block.id, field, e.target.value);
                }
              }}
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        );
      }

      if (isBody) {
        return (
          <div key={field} className="space-y-2">
            <Label>{field}</Label>
            <Textarea
              value={value}
              onChange={(e) => updateBlockContent(block.id, field, e.target.value)}
              rows={6}
            />
          </div>
        );
      }

      return (
        <div key={field} className="space-y-2">
          <Label>{field}</Label>
          <Input
            value={value}
            onChange={(e) => updateBlockContent(block.id, field, e.target.value)}
          />
        </div>
      );
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading editor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{page?.title}</h2>
            <p className="text-sm text-muted-foreground">/{page?.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Label htmlFor="block-csv-import" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
          </Label>
          <input
            id="block-csv-import"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={importCSV}
          />
          <Button onClick={saveAllBlocks} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="csv">CSV View</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4 mt-4">
          {blocks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>No content blocks yet.</p>
                <p className="text-sm mt-1">Add blocks to build your page content.</p>
              </CardContent>
            </Card>
          ) : (
            blocks.map((block, index) => (
              <Card key={block.id}>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <CardTitle className="text-base">
                      {getBlockLabel(block.block_type)}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      (Position: {index})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBlock(block.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderBlockFields(block)}
                  {block.block_type === "custom_html" && (
                    <div className="space-y-2">
                      <Label>Custom CSS (scoped)</Label>
                      <Textarea
                        value={block.custom_css || ""}
                        onChange={(e) => updateBlockCSS(block.id, e.target.value)}
                        rows={4}
                        className="font-mono text-sm"
                        placeholder=".my-class { color: red; }"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Content Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Content Block</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Block Type</Label>
                  <Select value={newBlockType} onValueChange={setNewBlockType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOCK_TYPES.map((bt) => (
                        <SelectItem key={bt.value} value={bt.value}>
                          {bt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addBlock} disabled={!newBlockType}>
                    Add Block
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="csv" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <pre className="text-xs font-mono bg-muted p-4 rounded overflow-auto max-h-96">
                block_type,block_key,position,field_name,value{"\n"}
                {blocks.flatMap((block) =>
                  Object.entries(block.content).map(
                    ([key, value]) =>
                      `"${block.block_type}","${block.block_key || ""}",${block.position},"${key}","${typeof value === "object" ? JSON.stringify(value) : String(value).replace(/"/g, '""')}"\n`
                  )
                )}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;
