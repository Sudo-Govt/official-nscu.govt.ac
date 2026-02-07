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
 
async function callAI(
  provider: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
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

      const maxTokens = getOpenAiMaxTokens(model);
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
        max_tokens: 16000,
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
          maxOutputTokens: 16000,
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

function getOpenAiMaxTokens(model: string): number {
  const m = (model || '').toLowerCase();

  // NOTE: Different OpenAI models have different max output/context limits.
  // We keep these conservative to avoid 400s like:
  // - "max_tokens is too large"
  // - "maximum context length is 8192 tokens"
  if (m.includes('gpt-4o')) return 8000;
  if (m.includes('gpt-4-turbo')) return 3500;
  if (m === 'gpt-4') return 3000;
  if (m.includes('gpt-3.5')) return 2500;
  return 3000;
}

function supportsOpenAiJsonObjectResponse(model: string): boolean {
  const m = (model || '').toLowerCase();

  // JSON mode support is model-dependent; sending it to unsupported models can 400.
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
    // Common failure: model adds a preamble like "Sure, here's the JSON:".
    // Extract the first JSON object block and parse that.
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      const candidate = cleaned.slice(first, last + 1);
      return JSON.parse(candidate);
    }

    throw new Error('Failed to parse AI response as JSON');
  }
}
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Get provider config and API key from request body (passed from frontend)
     let requestBody: { providerConfig?: ProviderConfig; apiKey?: string } = {};
     try {
       requestBody = await req.json();
     } catch {
       // No body provided, will use defaults
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
 
     // Use provider config from request or default to lovable
     const providerConfig = requestBody.providerConfig || {
       provider: 'lovable',
       model: 'google/gemini-3-flash-preview',
     };
 
     // Determine API key
     let apiKey: string | null = requestBody.apiKey || null;
     
     // For lovable provider, always use the env key
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
       console.log(`Processing with ${providerConfig.provider} (${providerConfig.model})`);
       
       const aiResult = await callAI(
         providerConfig.provider,
         providerConfig.model,
         apiKey,
         systemPrompt,
         userPrompt
       );
 
        let curriculum;
        try {
          curriculum = parseAiJson(aiResult.content);
        } catch (parseError) {
          throw new Error("Failed to parse AI response as JSON");
        }
 
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
         `Generated curriculum for ${queueItem.course_code}`
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