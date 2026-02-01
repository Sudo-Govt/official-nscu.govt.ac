import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ABET_SYSTEM_PROMPT = `
You are an expert academic curriculum designer following ABET (Accreditation Board for Engineering and Technology) standards strictly. Generate comprehensive course data in JSON format.

ABET STRUCTURE REQUIREMENTS:
1. Student Outcomes (SO): Define measurable outcomes aligned with ABET criteria
2. Performance Indicators (PI): Specific, measurable indicators for each outcome
3. Course Learning Outcomes (CLO): Linked to program outcomes
4. Assessment Methods: Direct and indirect assessment strategies
5. Continuous Improvement: Built-in evaluation mechanisms

RESPONSE FORMAT (STRICT JSON):
{
  "course_info": {
    "name": "Full Course Name",
    "code": "COURSE_CODE",
    "description": "Comprehensive course description (min 200 words)",
    "duration_semesters": 4 or 8,
    "total_credits": number,
    "degree_type": "Bachelor/Master/Diploma",
    "specialization": "Area of specialization"
  },
  "abet_outcomes": {
    "student_outcomes": [
      {
        "id": "SO1",
        "description": "Student outcome description",
        "performance_indicators": ["PI1.1", "PI1.2"]
      }
    ],
    "program_educational_objectives": ["PEO1", "PEO2", "PEO3"]
  },
  "semester_structure": [
    {
      "semester": 1,
      "subjects": [
        {
          "name": "Subject Name",
          "code": "SUB101",
          "credits": 4,
          "type": "Core/Elective/Lab",
          "description": "Subject description",
          "learning_outcomes": ["CLO1", "CLO2"],
          "syllabus": {
            "units": [
              {
                "unit_number": 1,
                "title": "Unit Title",
                "topics": ["Topic 1", "Topic 2"],
                "hours": 10
              }
            ]
          },
          "reference_books": [
            {
              "title": "Book Title",
              "author": "Author Name",
              "isbn": "ISBN-13",
              "publisher": "Publisher",
              "edition": "Edition"
            }
          ],
          "assessment": {
            "internal": 40,
            "external": 60,
            "methods": ["Written Exam", "Assignments", "Projects"]
          }
        }
      ],
      "total_credits": 20,
      "sgpa_scale": 10.0
    }
  ],
  "grading_system": {
    "cgpa_scale": 10.0,
    "grade_points": {
      "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0
    },
    "passing_cgpa": 5.0,
    "distinction_cgpa": 8.5
  },
  "reference_materials": {
    "textbooks": [
      {
        "title": "Book Title",
        "author": "Author Name",
        "isbn": "ISBN number",
        "publisher": "Publisher",
        "edition": "Edition",
        "year": 2023,
        "is_mandatory": true
      }
    ],
    "reference_books": [...],
    "online_resources": [
      {
        "title": "Resource Title",
        "url": "https://...",
        "type": "Video/Article/Course",
        "platform": "Coursera/edX/YouTube/etc"
      }
    ],
    "free_ebooks": [
      {
        "title": "Book Title",
        "url": "https://...",
        "format": "PDF/EPUB"
      }
    ]
  },
  "career_outcomes": {
    "job_roles": ["Role 1", "Role 2"],
    "industries": ["Industry 1", "Industry 2"],
    "higher_studies": ["PhD programs", "Certifications"],
    "average_salary_range": "$50,000 - $80,000"
  },
  "eligibility": {
    "minimum_qualification": "12th Grade / Equivalent",
    "required_subjects": ["Mathematics", "Physics"],
    "entrance_exams": ["JEE", "SAT", "Institution Test"],
    "age_limit": "No upper limit"
  }
}

IMPORTANT RULES:
1. Generate REALISTIC subject names and codes based on the course type
2. Include 5-7 subjects per semester
3. Total credits per semester should be 18-24
4. Include at least 3 textbooks and 5 online resources per course
5. Provide actual, real-world URLs for resources when possible (like MIT OpenCourseWare, Khan Academy, etc.)
6. Follow standard university curriculum patterns
7. Ensure learning outcomes map to ABET student outcomes
8. Include lab subjects where applicable (Engineering, Science courses)
9. Return ONLY valid JSON, no markdown or explanation
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseName, courseType, semesters, specialization } = await req.json();

    if (!courseName) {
      throw new Error('Course name is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Generating ABET course data for: ${courseName}`);

    const userPrompt = `Generate a complete ABET-compliant curriculum for the following course:

Course Name: ${courseName}
Course Type: ${courseType || 'Undergraduate'}
Number of Semesters: ${semesters || 8}
Specialization: ${specialization || 'General'}

Please generate comprehensive academic data including:
1. Complete semester-wise subject breakdown with codes
2. Detailed syllabus for each subject
3. CGPA and GPA grading structure
4. Course learning outcomes mapped to ABET criteria
5. Reference textbooks with real ISBNs where possible
6. Free online learning resources (MIT OCW, Khan Academy, Coursera, etc.)
7. Career outcomes and eligibility criteria

Ensure all subjects have proper codes following standard patterns (e.g., CS101, MATH201).
Return ONLY valid JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: ABET_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const jsonContent = data.choices[0].message.content;
    
    // Parse to validate JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(jsonContent);
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
    console.error('Error in generate-abet-course function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
