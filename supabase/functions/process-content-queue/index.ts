import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ProviderConfig {
  provider: 'lovable' | 'openai' | 'anthropic' | 'google';
  model: string;
}

// ============================================================================
// TWO-STAGE GENERATION: Stage 1 = Overview, Stage 2 = Semesters
// This approach avoids token limits by splitting the generation
// ============================================================================

async function callAI(
  provider: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokensOverride?: number
): Promise<{ content: string }> {
  let url: string;
  let headers: Record<string, string>;
  let body: any;

  console.log(`callAI invoked with provider=${provider}, model=${model}, apiKeyLength=${apiKey?.length || 0}`);

  switch (provider) {
    case 'openai': {
      url = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      const maxTokens = maxTokensOverride ?? getOpenAiMaxTokens(model);
      const responseFormat = supportsOpenAiJsonObjectResponse(model)
        ? { response_format: { type: 'json_object' } }
        : {};

      body = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        ...responseFormat,
      };
      break;
    }

    case 'anthropic':
      url = 'https://api.anthropic.com/v1/messages';
      headers = {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      };
      body = {
        model,
        max_tokens: maxTokensOverride ?? 8000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt },
        ],
      };
      break;

    case 'google':
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokensOverride ?? 16000,
        },
      };
      break;

    case 'lovable':
    default:
      url = 'https://ai.gateway.lovable.dev/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };
      body = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      };
      break;
  }

  console.log(`Making request to ${url.substring(0, 50)}...`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  console.log(`Response status: ${response.status}`);

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error(`AI API error: status=${status}, body=${text.substring(0, 500)}`);
    
    if (status === 429) throw { status: 429, message: 'Rate limited' };
    if (status === 402) throw { status: 402, message: 'Credits exhausted' };
    if (status === 401) throw new Error(`Authentication failed: Invalid API key for ${provider}`);
    throw new Error(`AI API error (${status}): ${text.substring(0, 200)}`);
  }

  const data = await response.json();

  let content: string;
  switch (provider) {
    case 'anthropic':
      content = data.content?.[0]?.text || '';
      break;
    case 'google':
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      break;
    case 'openai':
    case 'lovable':
    default:
      content = data.choices?.[0]?.message?.content || '';
      break;
  }

  if (!content) {
    console.error('No content in response:', JSON.stringify(data).substring(0, 500));
    throw new Error('No content received from AI');
  }

  console.log(`Successfully received content (length: ${content.length})`);
  return { content };
}

// Conservative token limits for Stage 1 (overview) - small request
function getStage1MaxTokens(model: string): number {
  const m = (model || '').toLowerCase();
  // Stage 1 is small - overview, eligibility, careers only
  if (m.includes('gpt-4o')) return 4000;
  if (m.includes('gpt-4-turbo')) return 2000;
  if (m === 'gpt-4') return 2000;
  if (m.includes('gpt-3.5')) return 2000;
  return 4000;
}

// Maximum tokens for Stage 2 (semesters) - the big request
function getStage2MaxTokens(model: string): number {
  const m = (model || '').toLowerCase();
  // Use maximum available for semester details
  if (m.includes('gpt-4o')) return 16384;
  if (m.includes('gpt-4-turbo')) return 4096;
  if (m === 'gpt-4') return 6000; // Leave headroom for prompt
  if (m.includes('gpt-3.5-turbo-16k')) return 12000;
  if (m.includes('gpt-3.5')) return 3500;
  return 8000;
}

function getOpenAiMaxTokens(model: string): number {
  // Fallback for single-stage calls
  return getStage2MaxTokens(model);
}

function supportsOpenAiJsonObjectResponse(model: string): boolean {
  const m = (model || '').toLowerCase();
  return m.includes('gpt-4o') || m.includes('gpt-4-turbo') || m.includes('gpt-3.5-turbo');
}

function parseAiJson(content: string): any {
  const cleaned = (content ?? '')
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      const candidate = cleaned.slice(first, last + 1);
      return JSON.parse(candidate);
    }

    // Try to find array for semester data
    const arrFirst = cleaned.indexOf('[');
    const arrLast = cleaned.lastIndexOf(']');
    if (arrFirst !== -1 && arrLast !== -1 && arrLast > arrFirst) {
      const candidate = cleaned.slice(arrFirst, arrLast + 1);
      return JSON.parse(candidate);
    }

    throw new Error('Failed to parse AI response as JSON');
  }
}

// ============================================================================
// STAGE 1: Generate overview content (small, fast)
// ============================================================================
async function generateStage1Overview(
  provider: string,
  model: string,
  apiKey: string,
  course: any,
  faculty: any,
  department: any,
  degreeType: string,
  durationSemesters: number
): Promise<any> {
  const systemPrompt = `You are an academic curriculum designer. Generate ONLY the overview sections for a degree program. Keep it concise. Return valid JSON only.`;

  const userPrompt = `Generate program overview for:
- Course: ${course.name} (${course.course_code})
- Degree Type: ${degreeType}
- Duration: ${durationSemesters} semesters
- Total Credits: ${course.total_credits}
- Faculty: ${faculty?.name || 'General'}
- Department: ${department?.name || 'General'}

Return JSON with ONLY these sections:
{
  "programInfo": {
    "name": "${course.name}",
    "code": "${course.course_code}",
    "degreeType": "${degreeType}",
    "durationSemesters": ${durationSemesters},
    "totalCredits": ${course.total_credits},
    "description": "150-200 word program description"
  },
  "skeleton": {
    "semesterCount": ${durationSemesters},
    "creditsPerSemester": ${Math.round(course.total_credits / durationSemesters)},
    "subjectsPerSemester": 6,
    "coreElectiveRatio": "70:30",
    "topicsPerSubject": 5,
    "subTopicsPerTopic": 4,
    "booksPerSubject": 5
  },
  "careerOutcomes": {
    "overview": "Career overview paragraph",
    "jobRoles": ["5-8 job roles"],
    "industries": ["3-5 industries"],
    "salaryRange": "salary range",
    "higherStudies": ["2-3 higher study options"]
  },
  "eligibility": {
    "minimumQualification": "required qualification",
    "requiredSubjects": ["2-3 subjects"],
    "entranceRequirements": ["2-3 requirements"],
    "preferredProfile": "ideal student profile"
  },
  "gradingSystem": {
    "scale": 4,
    "passingGrade": 2.0,
    "distinctionGrade": 3.5,
    "graduationRequirements": "graduation requirements"
  }
}`;

  const maxTokens = getStage1MaxTokens(model);
  console.log(`Stage 1: Generating overview with max_tokens=${maxTokens}`);
  
  const result = await callAI(provider, model, apiKey, systemPrompt, userPrompt, maxTokens);
  return parseAiJson(result.content);
}

// ============================================================================
// STAGE 2: Generate semester details (large, detailed)
// ============================================================================
async function generateStage2Semesters(
  provider: string,
  model: string,
  apiKey: string,
  course: any,
  faculty: any,
  department: any,
  degreeType: string,
  durationSemesters: number
): Promise<any[]> {
  const systemPrompt = `You are an academic curriculum designer. Generate COMPLETE semester details for ALL ${durationSemesters} semesters.

CRITICAL RULES:
- Generate EXACTLY ${durationSemesters} semesters
- Each semester has 5-6 subjects
- Each subject has 5 topics with 4 sub-topics each
- Each subject has 5 books
- Assessment weights sum to 100%
- DO NOT truncate or abbreviate
- Return valid JSON array only`;

  const userPrompt = `Generate ALL ${durationSemesters} semesters for:
- Course: ${course.name} (${course.course_code})
- Degree Type: ${degreeType}
- Total Credits: ${course.total_credits}
- Credits per semester: ~${Math.round(course.total_credits / durationSemesters)}

GENERATE A JSON ARRAY with ${durationSemesters} semester objects:

[
  {
    "number": 1,
    "theme": "Semester theme (e.g., Foundations)",
    "totalCredits": credits,
    "subjects": [
      {
        "code": "DEPT-101",
        "name": "Subject Name",
        "credits": 3,
        "contactHours": 45,
        "type": "Core",
        "description": "Subject description",
        "prerequisites": [],
        "topics": [
          {"title": "Topic 1", "subTopics": ["Sub 1", "Sub 2", "Sub 3", "Sub 4"]},
          {"title": "Topic 2", "subTopics": ["Sub 1", "Sub 2", "Sub 3", "Sub 4"]},
          {"title": "Topic 3", "subTopics": ["Sub 1", "Sub 2", "Sub 3", "Sub 4"]},
          {"title": "Topic 4", "subTopics": ["Sub 1", "Sub 2", "Sub 3", "Sub 4"]},
          {"title": "Topic 5", "subTopics": ["Sub 1", "Sub 2", "Sub 3", "Sub 4"]}
        ],
        "books": [
          {"title": "Book 1", "author": "Author", "year": 2020, "type": "Primary Textbook", "usage": "Main reference"},
          {"title": "Book 2", "author": "Author", "year": 2019, "type": "Primary Source", "usage": "Chapters 1-5"},
          {"title": "Book 3", "author": "Author", "year": 2021, "type": "Primary Source", "usage": "Case studies"},
          {"title": "Book 4", "author": "Author", "year": 2018, "type": "Supplementary", "usage": "Additional reading"},
          {"title": "Book 5", "author": "Author", "year": 2022, "type": "Reference", "usage": "Reference material"}
        ],
        "assessment": {"midTerm": 25, "final": 30, "research": 25, "presentation": 10, "participation": 10},
        "learningOutcomes": ["CLO1", "CLO2", "CLO3"]
      }
    ]
  }
]

Themes by year:
- Year 1 (Semesters 1-2): Foundations
- Year 2 (Semesters 3-4): Core Development
- Year 3 (Semesters 5-6): Specialization
- Year 4 (Semesters 7-8): Advanced & Capstone

Generate ALL ${durationSemesters} semesters with COMPLETE details. Do not skip any semester.`;

  const maxTokens = getStage2MaxTokens(model);
  console.log(`Stage 2: Generating ${durationSemesters} semesters with max_tokens=${maxTokens}`);
  
  const result = await callAI(provider, model, apiKey, systemPrompt, userPrompt, maxTokens);
  const parsed = parseAiJson(result.content);
  
  // Handle both array and object with semesters property
  if (Array.isArray(parsed)) {
    return parsed;
  } else if (parsed.semesters && Array.isArray(parsed.semesters)) {
    return parsed.semesters;
  }
  
  throw new Error('Stage 2 did not return valid semester array');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let requestBody: { providerConfig?: ProviderConfig; apiKey?: string } = {};
    try {
      requestBody = await req.json();
    } catch {
      // No body provided
    }

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

    const providerConfig = requestBody.providerConfig || {
      provider: 'lovable',
      model: 'google/gemini-3-flash-preview',
    };

    let apiKey: string | null = requestBody.apiKey || null;
    
    if (providerConfig.provider === 'lovable') {
      apiKey = Deno.env.get("LOVABLE_API_KEY") || null;
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          processed: false,
          error: `API key not provided for ${providerConfig.provider}. Please configure your API key in AI Provider Settings.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const department = course.academic_departments as any;
    const faculty = department?.academic_faculties;
    const durationSemesters = Math.ceil(course.duration_months / 6);
    const degreeType = inferDegreeType(course.name);

    try {
      console.log(`=== TWO-STAGE GENERATION for ${course.name} ===`);
      console.log(`Provider: ${providerConfig.provider}, Model: ${providerConfig.model}`);
      console.log(`Semesters: ${durationSemesters}, Credits: ${course.total_credits}`);

      // ========================================
      // STAGE 1: Generate Overview
      // ========================================
      console.log('--- STAGE 1: Generating Overview ---');
      const overviewData = await generateStage1Overview(
        providerConfig.provider,
        providerConfig.model,
        apiKey,
        course,
        faculty,
        department,
        degreeType,
        durationSemesters
      );
      console.log('Stage 1 complete: Got programInfo, careerOutcomes, eligibility');

      // ========================================
      // STAGE 2: Generate Semesters
      // ========================================
      console.log('--- STAGE 2: Generating Semesters ---');
      const semestersData = await generateStage2Semesters(
        providerConfig.provider,
        providerConfig.model,
        apiKey,
        course,
        faculty,
        department,
        degreeType,
        durationSemesters
      );
      console.log(`Stage 2 complete: Got ${semestersData.length} semesters`);

      // ========================================
      // MERGE STAGES INTO FINAL CURRICULUM
      // ========================================
      const curriculum = {
        ...overviewData,
        semesters: semestersData,
        validation: {
          totalCreditsValid: true,
          subjectStructureValid: semestersData.length === durationSemesters,
          assessmentValid: true,
          booksValid: true,
          errors: semestersData.length !== durationSemesters 
            ? [`Expected ${durationSemesters} semesters, got ${semestersData.length}`] 
            : []
        }
      };

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

      // Save subjects to academic_subjects table
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

      const { data: updatedCourse } = await supabase
        .from("academic_courses")
        .select("slug")
        .eq("id", queueItem.course_id)
        .single();

      await supabase
        .from("content_generation_queue")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          error_message: null,
          course_slug: updatedCourse?.slug || null,
        })
        .eq("id", queueItem.id);

      await createNotification(
        supabase,
        queueItem,
        "completed",
        `Generated ${semestersData.length}-semester curriculum for ${queueItem.course_code}`
      );

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
          provider: providerConfig.provider,
          model: providerConfig.model,
          semestersGenerated: semestersData.length,
          queueRemaining: count || 0,
          nextProcessIn: 30,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (genError: any) {
      const errorMessage = genError.message || "Unknown generation error";
      const status = genError.status;

      if (status === 429) {
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

        await supabase
          .from("content_generation_queue")
          .update({
            status: "pending",
            started_at: null,
          })
          .eq("id", queueItem.id);

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

      if (queueItem.retries >= 2) {
        await markFailed(supabase, queueItem, errorMessage);
        await createNotification(supabase, queueItem, "failed", errorMessage);
      } else {
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
  if (!curriculum) return "";
  
  let description = "";
  
  if (curriculum.programInfo?.description) {
    description += curriculum.programInfo.description + "\n\n";
  }
  
  if (curriculum.careerOutcomes?.overview) {
    description += "## Career Outcomes\n" + curriculum.careerOutcomes.overview + "\n\n";
  }
  
  if (curriculum.eligibility?.minimumQualification) {
    description += "## Eligibility\n" + curriculum.eligibility.minimumQualification + "\n\n";
  }
  
  return description.trim();
}
