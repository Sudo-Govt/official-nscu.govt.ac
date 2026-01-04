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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Layout, Wand2, GraduationCap, Building, BookOpen, Users } from "lucide-react";

interface CmsTemplate {
  id: string;
  name: string;
  description: string | null;
  layout_structure: any;
  default_blocks: any;
  created_at: string;
}

// Predefined template configurations
const PREDEFINED_TEMPLATES = {
  school_intro: {
    name: "School Intro",
    description: "Template for school/college introduction pages with hero, overview, departments, and CTA",
    icon: GraduationCap,
    layout_structure: ["hero", "overview", "departments", "cta"],
    default_blocks: [
      {
        block_type: "hero",
        block_key: "main_hero",
        position: 1,
        content: {
          title: "Welcome to [School Name]",
          subtitle: "Empowering minds, shaping futures",
          backgroundImage: "/placeholder.svg",
          ctaText: "Apply Now",
          ctaLink: "/admissions"
        }
      },
      {
        block_type: "overview",
        block_key: "school_overview",
        position: 2,
        content: {
          heading: "About Our School",
          description: "Brief description of the school's mission, vision, and history.",
          features: ["Excellence in Education", "World-class Faculty", "Modern Facilities", "Global Recognition"]
        }
      },
      {
        block_type: "departments",
        block_key: "dept_list",
        position: 3,
        content: {
          heading: "Our Departments",
          departments: [
            { name: "Department 1", description: "Description", link: "/departments/1" },
            { name: "Department 2", description: "Description", link: "/departments/2" }
          ]
        }
      },
      {
        block_type: "cta",
        block_key: "apply_cta",
        position: 4,
        content: {
          heading: "Ready to Join Us?",
          description: "Take the first step towards your future.",
          buttonText: "Start Your Application",
          buttonLink: "/apply"
        }
      }
    ]
  },
  course_detail: {
    name: "Course Detail",
    description: "Template for individual course/program pages with curriculum, faculty, and admission info",
    icon: BookOpen,
    layout_structure: ["hero", "overview", "curriculum", "faculty", "admission", "cta"],
    default_blocks: [
      {
        block_type: "hero",
        block_key: "course_hero",
        position: 1,
        content: {
          title: "[Course Name]",
          subtitle: "[Degree Type] Program",
          duration: "4 Years",
          credits: "120 Credits"
        }
      },
      {
        block_type: "overview",
        block_key: "course_overview",
        position: 2,
        content: {
          heading: "Program Overview",
          description: "Comprehensive description of the course objectives and outcomes.",
          highlights: ["Key Highlight 1", "Key Highlight 2", "Key Highlight 3"]
        }
      },
      {
        block_type: "content",
        block_key: "curriculum",
        position: 3,
        content: {
          heading: "Curriculum",
          semesters: [
            { name: "Semester 1", courses: ["Course 1", "Course 2", "Course 3"] },
            { name: "Semester 2", courses: ["Course 4", "Course 5", "Course 6"] }
          ]
        }
      },
      {
        block_type: "content",
        block_key: "faculty",
        position: 4,
        content: {
          heading: "Faculty",
          members: [
            { name: "Prof. Name", title: "Department Head", specialization: "Area of expertise" }
          ]
        }
      },
      {
        block_type: "content",
        block_key: "admission",
        position: 5,
        content: {
          heading: "Admission Requirements",
          requirements: ["Requirement 1", "Requirement 2"],
          deadline: "Application Deadline: [Date]"
        }
      },
      {
        block_type: "cta",
        block_key: "apply_cta",
        position: 6,
        content: {
          heading: "Ready to Apply?",
          buttonText: "Apply Now",
          buttonLink: "/apply"
        }
      }
    ]
  },
  department_page: {
    name: "Department Page",
    description: "Template for academic department pages with programs, research, and faculty",
    icon: Building,
    layout_structure: ["hero", "about", "programs", "research", "faculty", "contact"],
    default_blocks: [
      {
        block_type: "hero",
        block_key: "dept_hero",
        position: 1,
        content: {
          title: "Department of [Name]",
          subtitle: "Advancing knowledge through innovation",
          backgroundImage: "/placeholder.svg"
        }
      },
      {
        block_type: "content",
        block_key: "about_dept",
        position: 2,
        content: {
          heading: "About the Department",
          description: "History and mission of the department.",
          stats: { students: "500+", faculty: "25", programs: "8" }
        }
      },
      {
        block_type: "content",
        block_key: "programs",
        position: 3,
        content: {
          heading: "Academic Programs",
          undergraduate: ["Program 1", "Program 2"],
          graduate: ["Program 3", "Program 4"],
          doctoral: ["PhD Program"]
        }
      },
      {
        block_type: "content",
        block_key: "research",
        position: 4,
        content: {
          heading: "Research Areas",
          areas: ["Research Area 1", "Research Area 2", "Research Area 3"]
        }
      },
      {
        block_type: "content",
        block_key: "faculty",
        position: 5,
        content: {
          heading: "Our Faculty",
          members: []
        }
      },
      {
        block_type: "content",
        block_key: "contact",
        position: 6,
        content: {
          heading: "Contact Us",
          email: "department@university.edu",
          phone: "+1 (555) 123-4567",
          office: "Building Name, Room 100"
        }
      }
    ]
  },
  landing_page: {
    name: "Landing Page",
    description: "General purpose landing page with hero, features, testimonials, and CTA",
    icon: Users,
    layout_structure: ["hero", "features", "stats", "testimonials", "cta"],
    default_blocks: [
      {
        block_type: "hero_stats",
        block_key: "main_hero",
        position: 1,
        content: {
          title: "Page Title",
          subtitle: "Compelling subtitle that captures attention",
          stats: [
            { value: "10K+", label: "Students" },
            { value: "500+", label: "Faculty" },
            { value: "100+", label: "Programs" }
          ]
        }
      },
      {
        block_type: "content",
        block_key: "features",
        position: 2,
        content: {
          heading: "Why Choose Us",
          features: [
            { title: "Feature 1", description: "Description of feature 1", icon: "star" },
            { title: "Feature 2", description: "Description of feature 2", icon: "award" },
            { title: "Feature 3", description: "Description of feature 3", icon: "check" }
          ]
        }
      },
      {
        block_type: "content",
        block_key: "testimonials",
        position: 3,
        content: {
          heading: "What People Say",
          testimonials: [
            { quote: "Amazing experience!", author: "Student Name", role: "Class of 2024" }
          ]
        }
      },
      {
        block_type: "cta",
        block_key: "main_cta",
        position: 4,
        content: {
          heading: "Get Started Today",
          description: "Join our community",
          buttonText: "Learn More",
          buttonLink: "/about"
        }
      }
    ]
  }
};

const TemplateManager = () => {
  const [templates, setTemplates] = useState<CmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
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

  const createFromPreset = async (presetKey: keyof typeof PREDEFINED_TEMPLATES) => {
    const preset = PREDEFINED_TEMPLATES[presetKey];
    try {
      // Check if template with same name exists
      const existing = templates.find(t => t.name === preset.name);
      if (existing) {
        toast.error(`Template "${preset.name}" already exists`);
        return;
      }

      const { error } = await supabase.from("cms_templates").insert({
        name: preset.name,
        description: preset.description,
        layout_structure: preset.layout_structure,
        default_blocks: preset.default_blocks,
      });
      
      if (error) throw error;
      toast.success(`Template "${preset.name}" created`);
      setPresetDialogOpen(false);
      fetchTemplates();
    } catch (error: any) {
      toast.error("Failed to create template: " + error.message);
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

  const getBlockCount = (blocks: any) => {
    if (Array.isArray(blocks)) return blocks.length;
    return 0;
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
        <div className="flex gap-2">
          <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wand2 className="h-4 w-4 mr-2" />
                Use Preset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create from Preset Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                {Object.entries(PREDEFINED_TEMPLATES).map(([key, preset]) => {
                  const Icon = preset.icon;
                  const exists = templates.some(t => t.name === preset.name);
                  return (
                    <Card 
                      key={key} 
                      className={`cursor-pointer transition-colors ${exists ? 'opacity-50' : 'hover:border-primary'}`}
                      onClick={() => !exists && createFromPreset(key as keyof typeof PREDEFINED_TEMPLATES)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">{preset.name}</CardTitle>
                        </div>
                        {exists && (
                          <span className="text-xs text-muted-foreground">(Already exists)</span>
                        )}
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-xs">
                          {preset.description}
                        </CardDescription>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>{preset.default_blocks.length} blocks</span>
                          <span className="mx-2">•</span>
                          <span>{preset.layout_structure.join(", ")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Custom Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Edit Template" : "Create Custom Template"}
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
                  <Label htmlFor="layout">Layout Structure (JSON array of section names)</Label>
                  <Textarea
                    id="layout"
                    value={formData.layout_structure}
                    onChange={(e) =>
                      setFormData({ ...formData, layout_structure: e.target.value })
                    }
                    rows={3}
                    className="font-mono text-sm"
                    placeholder='["hero", "content", "cta"]'
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
                    rows={10}
                    className="font-mono text-sm"
                    placeholder='[{"block_type": "hero", "block_key": "main", "position": 1, "content": {...}}]'
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Each block should have: block_type, block_key, position, content
                  </p>
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
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No templates yet.</p>
            <p className="text-sm mt-1">Use a preset or create a custom template to get started.</p>
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
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Sections:</strong>{" "}
                    {Array.isArray(template.layout_structure)
                      ? template.layout_structure.join(", ")
                      : "—"}
                  </p>
                  <p>
                    <strong>Blocks:</strong> {getBlockCount(template.default_blocks)}
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
