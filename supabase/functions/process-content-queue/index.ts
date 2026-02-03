import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if queue is paused
    const { data: settings } = await supabase
      .from("content_generation_settings")
      .select("value")
      .eq("key", "queue_status")
      .single();

    if (settings?.value?.status === "paused") {
      return new Response(
        JSON.stringify({
          processed: false,
          paused: true,
          reason: settings.value.pauseReason || "Queue is paused",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch next pending item
    const { data: queueItem, error: fetchError } = await supabase
      .from("content_generation_queue")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (fetchError || !queueItem) {
      // No pending items
      return new Response(
        JSON.stringify({
          processed: false,
          idle: true,
          message: "No pending items in queue",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as processing
    await supabase
      .from("content_generation_queue")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
      })
      .eq("id", queueItem.id);

    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from("academic_courses")
      .select(`
        id, name, course_code, duration_months, total_credits,
        department_id,
        academic_departments!academic_courses_department_id_fkey (
          id, name, code, faculty_id,
          academic_faculties!academic_departments_faculty_id_fkey (
            id, name, code
          )
        )
      `)
      .eq("id", queueItem.course_id)
      .single();

    if (courseError || !course) {
      // Course not found, mark as failed
      await markFailed(supabase, queueItem, "Course not found");
      return new Response(
        JSON.stringify({
          processed: true,
          failed: true,
          courseCode: queueItem.course_code,
          courseName: queueItem.course_name,
          error: "Course not found",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get department and faculty info
    const department = course.academic_departments as any;
    const faculty = department?.academic_faculties;

    // Call generate-curriculum-v2 function
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      await markFailed(supabase, queueItem, "LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({
          processed: true,
          failed: true,
          courseCode: queueItem.course_code,
          error: "API key not configured",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the 7-layer prompt
    const durationSemesters = Math.ceil(course.duration_months / 6);
    const degreeType = inferDegreeType(course.name);

    const systemPrompt = `You are an expert academic curriculum designer specializing in ABET-compliant degree programs.
Generate a comprehensive 7-layer curriculum framework following these strict requirements:

Layer 1 - Master Context: Create context for ${faculty?.name || 'General'} faculty, ${department?.name || 'General'} department
Layer 2 - Structural Skeleton: ${durationSemesters} semesters, ${course.total_credits} total credits, 5-7 subjects per semester
Layer 3 - Semester Themes: Year 1 = Foundations, Year 2 = Analysis/Specialization, Year 3+ = Advanced/Capstone
Layer 4 - Topics: 5 major topics per subject, 4 sub-topics per topic (specific, teachable concepts)
Layer 5 - Books: 5 materials per subject (1 primary textbook, 1-2 primary sources, 1 supplementary, 1 reference)
Layer 6 - Assessment: Mid-Term 20-25%, Final 25-35%, Research 20-35%, Presentation 10-15%, Participation 10-15%
Layer 7 - Validation: All weights must sum to 100%, all credits must match, prerequisites must be logical

Respond with a valid JSON object only, no markdown.`;

    const userPrompt = `Generate a complete curriculum for:
- Course: ${course.name} (${course.course_code})
- Degree Type: ${degreeType}
- Duration: ${durationSemesters} semesters (${course.duration_months} months)
- Total Credits: ${course.total_credits}
- Faculty: ${faculty?.name || 'General Faculty'}
- Department: ${department?.name || 'General Department'}

Return JSON with this exact structure:
{
  "skeleton": {
    "semesterCount": number,
    "creditsPerSemester": number,
    "subjectsPerSemester": number,
    "coreElectiveRatio": "70:30",
    "topicsPerSubject": 5,
    "subTopicsPerTopic": 4,
    "booksPerSubject": 5,
    "assessmentTemplate": {}
  },
  "programInfo": {
    "name": string,
    "code": string,
    "degreeType": string,
    "durationSemesters": number,
    "totalCredits": number,
    "description": string
  },
  "semesters": [
    {
      "number": number,
      "theme": string,
      "totalCredits": number,
      "subjects": [
        {
          "code": string,
          "name": string,
          "credits": number,
          "contactHours": number,
          "type": "Core" | "Elective",
          "description": string,
          "prerequisites": string[],
          "topics": [
            {
              "title": string,
              "subTopics": [string, string, string, string]
            }
          ],
          "books": [
            {
              "title": string,
              "author": string,
              "year": number,
              "type": string,
              "usage": string
            }
          ],
          "assessment": {
            "midTerm": number,
            "final": number,
            "research": number,
            "presentation": number,
            "participation": number
          },
          "learningOutcomes": string[]
        }
      ]
    }
  ],
  "gradingSystem": {
    "scale": 4,
    "grades": {},
    "passingGrade": number,
    "distinctionGrade": number,
    "graduationRequirements": string
  },
  "careerOutcomes": {
    "overview": string,
    "jobRoles": string[],
    "industries": string[],
    "salaryRange": string,
    "higherStudies": string[]
  },
  "eligibility": {
    "minimumQualification": string,
    "requiredSubjects": string[],
    "entranceRequirements": string[],
    "preferredProfile": string
  },
  "validation": {
    "totalCreditsValid": true,
    "subjectStructureValid": true,
    "assessmentValid": true,
    "booksValid": true,
    "errors": []
  }
}`;

    try {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        const status = aiResponse.status;
        
        if (status === 429) {
          // Rate limited - requeue with retry
          await supabase
            .from("content_generation_queue")
            .update({
              status: "pending",
              retries: queueItem.retries + 1,
              error_message: "Rate limited - will retry",
              started_at: null,
            })
            .eq("id", queueItem.id);

          return new Response(
            JSON.stringify({
              processed: false,
              rateLimited: true,
              courseCode: queueItem.course_code,
              retryAfter: 60,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (status === 402) {
          // Credits exhausted - pause queue
          await supabase
            .from("content_generation_settings")
            .update({
              value: {
                status: "paused",
                pausedAt: new Date().toISOString(),
                pauseReason: "credits_exhausted",
              },
              updated_at: new Date().toISOString(),
            })
            .eq("key", "queue_status");

          // Mark item as pending again
          await supabase
            .from("content_generation_queue")
            .update({
              status: "pending",
              started_at: null,
            })
            .eq("id", queueItem.id);

          // Create notification
          await createNotification(supabase, queueItem, "paused", "Credits exhausted - queue paused");

          return new Response(
            JSON.stringify({
              processed: false,
              paused: true,
              reason: "credits_exhausted",
              courseCode: queueItem.course_code,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        throw new Error(`AI API error: ${status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from AI");
      }

      // Parse the JSON response
      let curriculum;
      try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        curriculum = JSON.parse(cleanContent);
      } catch (parseError) {
        throw new Error("Failed to parse AI response as JSON");
      }

      // AUTO-SAVE: Update course with generated content
      const longDescription = buildLongDescription(curriculum);

      const { error: updateError } = await supabase
        .from("academic_courses")
        .update({
          long_description: longDescription,
          short_description: curriculum.programInfo?.description?.slice(0, 200) || null,
          ai_generated_content: curriculum,
          semester_details: curriculum.semesters,
          content_generated_at: new Date().toISOString(),
        })
        .eq("id", queueItem.course_id);

      if (updateError) {
        throw new Error(`Failed to save content: ${updateError.message}`);
      }

      // Create subjects for each semester
      if (curriculum.semesters) {
        for (const semester of curriculum.semesters) {
          for (const subject of semester.subjects || []) {
            const { data: existing } = await supabase
              .from("academic_subjects")
              .select("id")
              .eq("course_id", queueItem.course_id)
              .eq("subject_code", subject.code)
              .single();

            if (!existing) {
              await supabase.from("academic_subjects").insert({
                course_id: queueItem.course_id,
                name: subject.name,
                subject_code: subject.code,
                credits: subject.credits,
                semester: semester.number,
                description: subject.description,
                subject_type: subject.type,
                syllabus_units: subject.topics,
                reference_books: subject.books,
                learning_outcomes: subject.learningOutcomes,
                assessment_methods: subject.assessment,
                is_active: true,
              });
            }
          }
        }
      }

      // Fetch the course slug (may have been auto-generated by trigger)
      const { data: updatedCourse } = await supabase
        .from("academic_courses")
        .select("slug")
        .eq("id", queueItem.course_id)
        .single();

      // Mark as completed with course_slug for View Page link
      await supabase
        .from("content_generation_queue")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          error_message: null,
          course_slug: updatedCourse?.slug || null,
        })
        .eq("id", queueItem.id);

      // Create success notification
      await createNotification(
        supabase,
        queueItem,
        "completed",
        `Generated curriculum for ${queueItem.course_code}`
      );

      // Get remaining count
      const { count } = await supabase
        .from("content_generation_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      return new Response(
        JSON.stringify({
          processed: true,
          success: true,
          courseCode: queueItem.course_code,
          courseName: queueItem.course_name,
          queueRemaining: count || 0,
          nextProcessIn: 30,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (genError: any) {
      // Generation failed
      const errorMessage = genError.message || "Unknown generation error";
      
      if (queueItem.retries >= 2) {
        // Max retries reached
        await markFailed(supabase, queueItem, errorMessage);
        await createNotification(supabase, queueItem, "failed", errorMessage);
      } else {
        // Retry later
        await supabase
          .from("content_generation_queue")
          .update({
            status: "pending",
            retries: queueItem.retries + 1,
            error_message: `Retry ${queueItem.retries + 1}: ${errorMessage}`,
            started_at: null,
          })
          .eq("id", queueItem.id);
      }

      return new Response(
        JSON.stringify({
          processed: true,
          failed: queueItem.retries >= 2,
          retrying: queueItem.retries < 2,
          courseCode: queueItem.course_code,
          error: errorMessage,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error: any) {
    console.error("Queue processor error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function markFailed(supabase: any, queueItem: any, errorMessage: string) {
  await supabase
    .from("content_generation_queue")
    .update({
      status: "failed",
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
    })
    .eq("id", queueItem.id);
}

async function createNotification(
  supabase: any,
  queueItem: any,
  status: "completed" | "failed" | "paused",
  message: string
) {
  await supabase.from("content_generation_notifications").insert({
    queue_item_id: queueItem.id,
    course_code: queueItem.course_code,
    course_name: queueItem.course_name,
    status,
    message,
    user_id: queueItem.created_by,
  });
}

function inferDegreeType(courseName: string): string {
  const name = courseName.toLowerCase();
  if (name.includes("phd") || name.includes("doctor")) return "PhD";
  if (name.includes("master") || name.includes("mba") || name.includes("msc") || name.includes("ma ")) return "Master";
  if (name.includes("diploma")) return "Diploma";
  if (name.includes("certificate")) return "Certificate";
  return "Bachelor";
}

function buildLongDescription(curriculum: any): string {
  if (!curriculum.programInfo) return "";
  
  return `
# ${curriculum.programInfo.name}

${curriculum.programInfo.description || ""}

## Program Overview
- **Degree Type:** ${curriculum.programInfo.degreeType}
- **Duration:** ${curriculum.programInfo.durationSemesters} Semesters
- **Total Credits:** ${curriculum.programInfo.totalCredits}

## Career Outcomes
${curriculum.careerOutcomes?.overview || ""}

### Job Roles
${(curriculum.careerOutcomes?.jobRoles || []).map((r: string) => `- ${r}`).join("\n")}

### Industries
${(curriculum.careerOutcomes?.industries || []).map((i: string) => `- ${i}`).join("\n")}

**Expected Salary:** ${curriculum.careerOutcomes?.salaryRange || "Varies"}

## Eligibility
**Minimum Qualification:** ${curriculum.eligibility?.minimumQualification || "As per university guidelines"}

${curriculum.eligibility?.preferredProfile || ""}

### Required Subjects
${(curriculum.eligibility?.requiredSubjects || []).map((s: string) => `- ${s}`).join("\n")}

## Grading System
- **GPA Scale:** ${curriculum.gradingSystem?.scale || 4}
- **Passing Grade:** ${curriculum.gradingSystem?.passingGrade || 40}%
- **Distinction:** ${curriculum.gradingSystem?.distinctionGrade || 75}%

${curriculum.gradingSystem?.graduationRequirements || ""}
  `.trim();
}
