import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an academic document generator.

CRITICAL RULES:
- Always output complete academic documents in valid HTML format.
- Do not output Markdown, JSON, or code blocks.
- The output should be ready-to-render in a browser (no escaping).
- Each document must be A4-length, structured, and professional.
- Minimum length: 500 words per document. Make it detailed, comprehensive, and realistic.

DOCUMENT RULES:
1. Do not include the institution's name/logo/address (these will be added via letterhead when printing).
2. Use student data exactly as given (do not invent names, dates, addresses).
3. Randomly generate marks/grades and paper codes, but keep them realistic.
4. Use the exact final CGPA provided.
5. Vary the writing style so each document feels unique.
6. Use <h1>, <h2>, <p>, <table> for formatting.
7. No inline CSS needed (keep structure clean).
8. Always wrap output in <html><body> … </body></html>.

Generate realistic academic documents based on the document type:
- University: Official transcripts with detailed course records
- College: Degree certificates and academic records
- School: Mark sheets and certificates
- Board: Board examination results and certificates`;

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
        const htmlContent = data.choices[0].message.content;

        // Save document to Supabase
        const { data: savedDoc, error: saveError } = await supabase
          .from('documents_generated')
          .insert({
            student_id: studentId,
            doc_type: docType,
            html_content: htmlContent,
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