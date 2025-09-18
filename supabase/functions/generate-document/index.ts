import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `
You are an AI assistant that generates official academic documents with the highest level of professionalism and attention to detail. Follow these comprehensive guidelines:

CRITICAL REQUIREMENTS:
1. Generate documents in JSON format with structured, comprehensive data fields
2. Use formal, professional academic language throughout all content
3. Create detailed, realistic academic records with proper chronological progression
4. Ensure all dates follow logical academic calendar sequences based on admission year
5. Generate comprehensive semester-wise performance data consistent with final CGPA
6. Include detailed subject-specific information relevant to the course and specialization
7. Use appropriate academic terminology and institutional language conventions
8. Create unique, realistic content for each document type with proper academic context

DATE CALCULATION LOGIC:
- Calculate all document dates based on the student's admission year and course duration
- Admission documents: Use admission year dates (June-August typically)
- Semester documents: Follow academic calendar (July-Nov for odd sem, Jan-May for even sem)
- Annual documents: Use academic year end dates (April-May)
- Completion documents: Calculate based on course duration from admission
- Always ensure chronological consistency across all document dates
- Never use future dates or dates before admission

ACADEMIC CONTENT REQUIREMENTS:
- Generate detailed semester-wise academic performance with subject breakdowns
- Include comprehensive course curriculum details relevant to specialization
- Create realistic grade distributions that mathematically align with final CGPA
- Add appropriate academic milestones, achievements, and institutional activities
- Include relevant academic policies, credit systems, and evaluation criteria
- Use formal institutional language with proper academic tone and terminology

JSON STRUCTURE (COMPREHENSIVE FORMAT):
{
  "document_type": "string",
  "student_info": {
    "name": "string",
    "father_name": "string", 
    "mother_name": "string",
    "date_of_birth": "DD/MM/YYYY",
    "address": "complete formatted address",
    "admission_year": "YYYY",
    "registration_number": "unique academic ID"
  },
  "academic_info": {
    "course": "full course name",
    "specialization": "area of specialization",
    "duration": "course duration in years/semesters",
    "cgpa": "final CGPA",
    "percentage": "equivalent percentage",
    "grades": ["detailed semester grades"],
    "subjects": ["comprehensive subject list with codes"],
    "semester_performance": [
      {
        "semester": "number",
        "year": "academic year",
        "subjects": ["subject list"],
        "marks": ["detailed marks"],
        "sgpa": "semester GPA",
        "result": "Pass/Distinction/etc"
      }
    ],
    "total_credits": "accumulated credits",
    "attendance_percentage": "overall attendance"
  },
  "document_content": {
    "title": "official document title",
    "content": "comprehensive professional document text (minimum 500 words)",
    "issue_date": "DD/MM/YYYY",
    "valid_until": "DD/MM/YYYY (if applicable)",
    "certificate_number": "unique certificate ID",
    "academic_session": "session years",
    "examination_details": "examination board/university info",
    "additional_details": {
      "honors": "academic honors if applicable",
      "projects": "major projects/thesis",
      "internships": "internship details",
      "extracurricular": "relevant activities"
    }
  },
  "issuing_authority": {
    "designation": "official designation (Registrar/Principal/Controller)",
    "name": "authority name",
    "signature_line": "For [Institution Name]",
    "office_seal": "Official Seal placement indicator",
    "contact_info": "official contact details"
  },
  "verification": {
    "qr_code_data": "verification URL/code",
    "security_features": "document security elements",
    "authenticity_statement": "verification statement"
  }
}

DOCUMENT CATEGORIES & TIMING:
- Higher Education: University/College level documents (UG/PG/PhD)
- Secondary Education: School/Board level documents (10th/12th standard)

QUALITY STANDARDS:
- Each document must be minimum 500 words of detailed, professional content
- Use institution-appropriate formal language and academic terminology
- Include comprehensive academic data with realistic progression
- Ensure mathematical consistency in all grade calculations
- Add relevant academic context and institutional framework details
- Maintain professional tone throughout with proper formatting structure

Generate only the requested document type with complete academic authenticity and institutional professionalism.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, docTypes } = await req.json();

    if (!studentId || !docTypes || !Array.isArray(docTypes)) {
      throw new Error('Missing required fields: studentId and docTypes array');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError) {
      console.error('Error fetching student:', studentError);
      throw new Error('Student not found');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const generatedDocuments = [];

    // Generate documents for each type
    for (const docType of docTypes) {
      console.log(`Generating ${docType} document for student: ${student.name}`);

      const userPrompt = `Generate an official ${docType} document for the following student:
      
Name: ${student.name}
Father's Name: ${student.father_name}
Mother's Name: ${student.mother_name}
Date of Birth: ${student.dob}
Address: ${student.address}
Course: ${student.course_name}
Specialization: ${student.specialization}
Exam Format: ${student.exam_format}
Final CGPA: ${student.cgpa}

Please generate a comprehensive, realistic academic document with detailed course records, marks, and grades. Ensure it's at least 500 words and follows proper academic document formatting.`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('OpenAI API error:', error);
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const jsonContent = data.choices[0].message.content;

        // Save document to Supabase
        const { data: savedDoc, error: saveError } = await supabase
          .from('documents_generated')
          .insert({
            student_id: studentId,
            doc_type: docType,
            json_content: jsonContent,
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving document:', saveError);
          throw new Error('Failed to save document');
        }

        generatedDocuments.push(savedDoc);
      } catch (docError) {
        console.error(`Error generating ${docType} document:`, docError);
        // Continue with other documents even if one fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documents: generatedDocuments,
        message: `Generated ${generatedDocuments.length} documents successfully`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});