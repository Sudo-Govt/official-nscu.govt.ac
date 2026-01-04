import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface CourseFeeStructure {
  [key: string]: number | undefined;
  delaware_campus?: number;
  belize_campus?: number;
  online?: number;
  hybrid?: number;
  offshore_campus?: number;
  distance?: number;
  fast_mode?: number;
}

export interface CourseRecord {
  id: string;
  course_code: string;
  course_name: string;
  degree_type: string;
  college: string;
  department: string | null;
  duration_years: number;
  credit_hours: number | null;
  eligibility_criteria: string | null;
  seat_capacity: number | null;
  available_seats: number | null;
  is_active: boolean;
  created_at?: string;
  description: string | null;
  slug: string | null;
  featured: boolean;
  brochure_url: string | null;
  application_deadline: string | null;
  career_outcomes: any[];
  reference_books: any[];
  fee_structure: CourseFeeStructure | null;
  navigation_parent_id: string | null;
}

interface NavLocation {
  id: string;
  title: string;
  href: string | null;
}

const COURSE_MODES = [
  { key: "delaware_campus", label: "Delaware Campus" },
  { key: "belize_campus", label: "Belize Campus" },
  { key: "online", label: "Online" },
  { key: "hybrid", label: "Hybrid" },
  { key: "offshore_campus", label: "Offshore Campus" },
  { key: "distance", label: "Distance" },
  { key: "fast_mode", label: "Fast Mode" },
] as const;

function generateSlug(name: string, degree: string): string {
  const combined = `${degree}-${name}`.toLowerCase();
  return combined
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseRecord | null;
  onSaved?: () => void;
};

export function CourseFormDialog({ open, onOpenChange, course, onSaved }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [navLocations, setNavLocations] = useState<NavLocation[]>([]);

  // Basic
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [durationYears, setDurationYears] = useState("4");
  const [creditHours, setCreditHours] = useState("");
  const [seatCapacity, setSeatCapacity] = useState("50");
  const [navigationParentId, setNavigationParentId] = useState<string>("");

  // Details
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");

  // Content
  const [careerOutcomes, setCareerOutcomes] = useState("");
  const [referenceBooks, setReferenceBooks] = useState("");

  // Flags
  const [featured, setFeatured] = useState(false);

  // Fees
  const [feeStructure, setFeeStructure] = useState<CourseFeeStructure>({});

  const degreeTypes = useMemo(
    () => [
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "PhD", label: "PhD" },
      { value: "Diploma", label: "Diploma" },
      { value: "Certificate", label: "Certificate" },
    ],
    []
  );

  const colleges = useMemo(
    () => [
      { value: "College of Arts and Sciences", label: "College of Arts and Sciences" },
      { value: "College of Engineering", label: "College of Engineering" },
      { value: "College of Business", label: "College of Business" },
      { value: "College of Health Sciences", label: "College of Health Sciences" },
      { value: "College of Education", label: "College of Education" },
      { value: "School of Law", label: "School of Law" },
      { value: "School of Medicine", label: "School of Medicine" },
    ],
    []
  );

  useEffect(() => {
    const fetchNavLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("site_navigation")
          .select("id, title, href")
          .order("title");

        if (error) throw error;
        setNavLocations((data || []) as NavLocation[]);
      } catch (e) {
        // Non-blocking
        console.error("Error fetching nav locations:", e);
      }
    };

    fetchNavLocations();
  }, []);

  const defaultNavLocationId = useMemo(() => {
    const courseCatalog = navLocations.find((n) => n.href === "/academics/course-catalog");
    return courseCatalog?.id || "";
  }, [navLocations]);

  useEffect(() => {
    if (!open) return;

    if (course) {
      setCourseCode(course.course_code || "");
      setCourseName(course.course_name || "");
      setDegreeType(course.degree_type || "");
      setCollege(course.college || "");
      setDepartment(course.department || "");
      setDurationYears((course.duration_years ?? 4).toString());
      setCreditHours(course.credit_hours?.toString() || "");
      setSeatCapacity(course.seat_capacity?.toString() || "50");
      setFeatured(!!course.featured);
      setDescription(course.description || "");
      setEligibility(course.eligibility_criteria || "");
      setBrochureUrl(course.brochure_url || "");
      setApplicationDeadline(course.application_deadline || "");
      setCareerOutcomes(Array.isArray(course.career_outcomes) ? course.career_outcomes.join("\n") : "");
      setReferenceBooks(Array.isArray(course.reference_books) ? course.reference_books.join("\n") : "");
      setFeeStructure(course.fee_structure || {});
      setNavigationParentId(course.navigation_parent_id || defaultNavLocationId);
      return;
    }

    // New course defaults
    setCourseCode("");
    setCourseName("");
    setDegreeType("");
    setCollege("");
    setDepartment("");
    setDurationYears("4");
    setCreditHours("");
    setSeatCapacity("50");
    setFeatured(false);
    setDescription("");
    setEligibility("");
    setBrochureUrl("");
    setApplicationDeadline("");
    setCareerOutcomes("");
    setReferenceBooks("");
    setFeeStructure({});
    setNavigationParentId(defaultNavLocationId);
  }, [open, course, defaultNavLocationId]);

  const handleFeeChange = (mode: string, value: string) => {
    const numValue = value ? Number(value) : undefined;
    setFeeStructure((prev) => ({
      ...prev,
      [mode]: Number.isFinite(numValue) ? numValue : undefined,
    }));
  };

  const handleSave = async () => {
    if (!courseCode || !courseName || !degreeType || !college || !durationYears) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Clean fee structure - remove undefined values
      const cleanedFees: CourseFeeStructure = {};
      Object.entries(feeStructure).forEach(([key, value]) => {
        if (value !== undefined && value !== null && Number.isFinite(value)) {
          cleanedFees[key] = value;
        }
      });

      const computedSlug = generateSlug(courseName, degreeType);
      const seats = seatCapacity ? parseInt(seatCapacity, 10) : 50;

      const courseData = {
        course_code: courseCode,
        course_name: courseName,
        degree_type: degreeType,
        college,
        department: department || null,
        duration_years: parseInt(durationYears, 10),
        credit_hours: creditHours ? parseInt(creditHours, 10) : null,
        eligibility_criteria: eligibility || null,
        seat_capacity: Number.isFinite(seats) ? seats : 50,
        available_seats: Number.isFinite(seats) ? seats : 50,
        description: description || null,
        slug: computedSlug,
        featured,
        brochure_url: brochureUrl || null,
        application_deadline: applicationDeadline || null,
        career_outcomes: careerOutcomes ? careerOutcomes.split("\n").filter((c) => c.trim()) : [],
        reference_books: referenceBooks ? referenceBooks.split("\n").filter((b) => b.trim()) : [],
        fee_structure: Object.keys(cleanedFees).length > 0 ? cleanedFees : null,
        navigation_parent_id: navigationParentId || null,
        is_active: course?.is_active ?? true,
      };

      if (course) {
        const { error } = await supabase.from("courses").update(courseData).eq("id", course.id);
        if (error) throw error;
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        const { error } = await supabase.from("courses").insert(courseData);
        if (error) throw error;
        toast({ title: "Success", description: "Course created successfully" });
      }

      onOpenChange(false);
      onSaved?.();
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course
              ? "Update course information."
              : "Create a new course. It will appear on the website automatically."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Course Code *</Label>
                <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g., CS101" />
              </div>
              <div>
                <Label>Degree Type *</Label>
                <Select value={degreeType} onValueChange={setDegreeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Course Name *</Label>
              <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g., Computer Science" />
              {courseName && degreeType && (
                <p className="text-xs text-muted-foreground mt-1">URL: /programs/{generateSlug(courseName, degreeType)}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>College *</Label>
                <Select value={college} onValueChange={setCollege}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Duration (Years) *</Label>
                <Input type="number" min="1" max="10" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} />
              </div>
              <div>
                <Label>Credit Hours</Label>
                <Input type="number" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} placeholder="e.g., 120" />
              </div>
              <div>
                <Label>Seat Capacity</Label>
                <Input type="number" value={seatCapacity} onChange={(e) => setSeatCapacity(e.target.value)} placeholder="e.g., 50" />
              </div>
            </div>

            <div>
              <Label>Navigation Location</Label>
              <Select value={navigationParentId} onValueChange={setNavigationParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select navigation location" />
                </SelectTrigger>
                <SelectContent>
                  {navLocations.map((nav) => (
                    <SelectItem key={nav.id} value={nav.id}>
                      {nav.title} {nav.href ? `(${nav.href})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Default: Academics → Course Catalog</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Featured Program</Label>
                <p className="text-sm text-muted-foreground">Show on homepage and in navigation</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Course Fees by Delivery Mode</h4>
              <p className="text-sm text-muted-foreground">Leave blank if mode is not available.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {COURSE_MODES.map((mode) => (
                <div key={mode.key}>
                  <Label>{mode.label} Fee (USD)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={feeStructure[mode.key] ?? ""}
                    onChange={(e) => handleFeeChange(mode.key, e.target.value)}
                    placeholder="e.g., 25000"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div>
              <Label>Program Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Enter a detailed description..." />
            </div>

            <div>
              <Label>Eligibility Criteria</Label>
              <Textarea value={eligibility} onChange={(e) => setEligibility(e.target.value)} rows={3} placeholder="Enter eligibility requirements..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Application Deadline</Label>
                <Input type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} />
              </div>
              <div>
                <Label>Brochure URL</Label>
                <Input value={brochureUrl} onChange={(e) => setBrochureUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <Label>Career Outcomes (one per line)</Label>
              <Textarea value={careerOutcomes} onChange={(e) => setCareerOutcomes(e.target.value)} rows={4} placeholder="Software Engineer\nData Scientist\nSystem Architect" />
            </div>

            <div>
              <Label>Reference Books (one per line)</Label>
              <Textarea value={referenceBooks} onChange={(e) => setReferenceBooks(e.target.value)} rows={4} placeholder="Introduction to Algorithms\nClean Code" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : course ? "Update Course" : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
