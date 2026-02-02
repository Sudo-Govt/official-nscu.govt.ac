import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const COURSE_CONTENT_PROMPT = `
You are an expert academic content writer. Generate comprehensive, engaging content for a university course page that will be displayed publicly on the website.

RESPONSE FORMAT (STRICT JSON):
{
  "hero": {
    "tagline": "Short catchy phrase (max 10 words)",
    "headline": "Compelling course headline (max 15 words)"
  },
  "overview": {
    "introduction": "Engaging 150-200 word introduction about the course",
    "highlights": ["5-7 key program highlights"],
    "unique_selling_points": ["3-4 unique aspects that set this program apart"]
  },
  "program_details": {
    "description": "Detailed 300-400 word description covering curriculum philosophy, teaching methodology, and learning approach",
    "learning_outcomes": ["8-12 specific learning outcomes students will achieve"],
    "skills_acquired": ["10-15 practical skills students will develop"]
  },
  "career_prospects": {
    "overview": "150-200 word description of career opportunities",
    "job_roles": ["10-15 specific job titles graduates can pursue"],
    "industries": ["8-10 industries where graduates find employment"],
    "average_salary_range": "Expected salary range for fresh graduates",
    "placement_rate": "Expected placement percentage (e.g., '95%')"
  },
  "eligibility": {
    "minimum_qualification": "Required educational background",
    "required_subjects": ["Subjects required in previous education"],
    "entrance_requirements": ["Any entrance exams or tests required"],
    "preferred_profile": "Description of ideal candidate profile"
  },
  "faculty_info": {
    "overview": "Brief description of faculty expertise (50-100 words)",
    "specializations": ["Areas of faculty expertise"]
  },
  "testimonial_prompts": [
    "3 realistic student testimonial texts that could be attributed to students"
  ],
  "faq": [
    {
      "question": "Common question about the program",
      "answer": "Detailed answer (50-100 words)"
    }
  ],
  "meta": {
    "seo_title": "SEO-optimized page title (max 60 chars)",
    "seo_description": "SEO meta description (max 160 chars)",
    "keywords": ["10-15 relevant keywords for SEO"]
  }
}

IMPORTANT RULES:
1. Write in professional but engaging academic tone
2. Be specific to the course field - don't use generic content
3. Include field-specific terminology and concepts
4. Make content compelling for prospective students
5. Ensure all salary/placement figures are realistic for the field
6. Return ONLY valid JSON, no markdown or explanation
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseName, departmentName, facultyName, duration, credits, existingDescription } = await req.json();

    if (!courseName) {
      throw new Error('Course name is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating content for course: ${courseName}`);

    const userPrompt = `Generate comprehensive website content for the following university course:

Course Name: ${courseName}
Department: ${departmentName || 'Not specified'}
Faculty/College: ${facultyName || 'Not specified'}
Duration: ${duration || 'Not specified'} months
Total Credits: ${credits || 'Not specified'}
${existingDescription ? `Existing Description: ${existingDescription}` : ''}

Create engaging, informative content that will help prospective students understand:
1. What makes this program unique and valuable
2. What they will learn and skills they will acquire
3. Career opportunities after graduation
4. Eligibility and admission requirements

The content should be suitable for a public-facing university website.
Return ONLY valid JSON.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: COURSE_CONTENT_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'API credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }

    // Clean the response
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('AI generated invalid JSON. Please try again.');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-course-content function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
