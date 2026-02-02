import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ==========================================
// 7-LAYER CURRICULUM GENERATION FRAMEWORK
// ==========================================

const LAYER_1_MASTER_CONTEXT = `You are a university curriculum architect specialising in Western-style academic program design. You must generate a COMPLETE course nomenclature for the provided program. Follow ALL layers below in strict order. Do not skip any section. Ensure all degree types, durations, and credits are realistic and consistent with international accreditation standards.`;

const LAYER_2_STRUCTURAL_SKELETON = `Before generating content, first determine the structural skeleton:
1. Number of semesters and credits per semester
2. Number of subjects per semester (5-7)
3. Subject type ratio (Core : Elective) - aim for 70:30
4. Assessment weight distribution
5. Number of topics per subject: exactly 5
6. Number of sub-topics per topic: exactly 4
7. Number of books per subject: exactly 5`;

const LAYER_3_SEMESTER_GENERATION = `Generate each semester with a thematic label. The program must follow this arc:
• Year 1: Foundations (broad, introductory, interdisciplinary exposure)
• Year 2: Analysis & Specialisation (theory deepening, research methods, elective branching)
• Year 3+: Advanced & Capstone (independent research, professional ethics, dissertation)

For EACH subject provide:
• Subject code (consistent format: [DEPT]-[SEM_NUM][SUBJECT_NUM])
• Full subject name
• Credit value (2-4 credits each)
• Contact hours (15 hours per credit)
• Core or Elective tag
• One-line description (50-100 words)
• Prerequisites (if any)

Use degree-appropriate subject names.`;

const LAYER_4_TOPIC_DRILL_DOWN = `For EACH subject, generate:
• Exactly 5 major topics (one per ~3 weeks of teaching)
• Each topic must have exactly 4 sub-topics
• Each sub-topic must be a SPECIFIC, teachable concept (not vague)
• Sub-topics should progress logically: define → explain → apply → analyse

Example of GOOD sub-topics:
✓ 'Durkheim's concept of collective effervescence — definition and evidence'
✓ 'Applying strain theory to juvenile delinquency statistics'

Example of BAD sub-topics:
✗ 'Overview of the topic'
✗ 'Further reading'

Be HIGHLY SPECIFIC. Avoid generic phrases like overview, introduction, further reading. Every sub-topic must be a concrete, teachable concept.`;

const LAYER_5_BOOKS_MATERIALS = `For EACH subject, assign exactly 5 study materials:
• 1 Primary Textbook (the main course book)
• 1-2 Primary Source texts (foundational works students must read)
• 1 Supplementary text (accessible, engaging secondary read)
• 1 Reference/Online Resource

For each, specify:
• Title, Author, Year
• Type: "Primary Textbook" | "Primary Source" | "Supplementary" | "Reference" | "Online Resource"
• Usage note: 'Compulsory Ch.1-3' / 'Reference for essays' etc.

IMPORTANT: Use REAL, well-known books where possible. If inventing, make the title and author realistic.
Do NOT use placeholder titles like 'Introduction to X' by 'John Smith'.`;

const LAYER_6_ASSESSMENT_STRUCTURE = `Generate assessment for each subject using this weight template:
• Mid-Term Exam: 20-25%
• Final Exam: 25-35% (higher for exam-heavy fields like medicine, law)
• Research Paper/Essay: 20-35% (higher for humanities and social sciences)
• Presentation: 10-15%
• Participation: 10-15%

SPECIAL RULES:
• Dissertation/Capstone courses: No mid-term or final exam. Use 60-70% paper + 20-30% supervision + 10% defense.
• Lab/Methods courses: Add 10-15% practical component.
• Weights must sum to exactly 100% for every subject.

Also provide: grading scale (A+ to F with GPA), graduation requirements.`;

const LAYER_7_VALIDATION = `Before finalising, validate:
1. Total credits across all semesters = stated total credits
2. Every subject has exactly 5 topics × 4 sub-topics = 20 teachable units
3. Every subject has exactly 5 books/materials
4. Assessment weights sum to exactly 100% for every subject
5. No degree types contradict the field
6. Prerequisites are logical and sequential
7. Dissertation subjects appear only in final year
8. Core/Elective ratio matches approximately 70:30

Report any validation errors found.`;

const FULL_SYSTEM_PROMPT = `${LAYER_1_MASTER_CONTEXT}

=== LAYER 2: STRUCTURAL SKELETON ===
${LAYER_2_STRUCTURAL_SKELETON}

=== LAYER 3: SEMESTER & SUBJECT GENERATION ===
${LAYER_3_SEMESTER_GENERATION}

=== LAYER 4: TOPIC & SUB-TOPIC DRILL-DOWN ===
${LAYER_4_TOPIC_DRILL_DOWN}

=== LAYER 5: BOOKS & STUDY MATERIALS ===
${LAYER_5_BOOKS_MATERIALS}

=== LAYER 6: ASSESSMENT STRUCTURE ===
${LAYER_6_ASSESSMENT_STRUCTURE}

=== LAYER 7: VALIDATION ===
${LAYER_7_VALIDATION}

=== OUTPUT FORMAT ===
Return a single JSON object with this exact structure:
{
  "skeleton": {
    "semesterCount": number,
    "creditsPerSemester": number,
    "subjectsPerSemester": number,
    "coreElectiveRatio": "70:30",
    "topicsPerSubject": 5,
    "subTopicsPerTopic": 4,
    "booksPerSubject": 5,
    "assessmentTemplate": {
      "midTerm": "20-25%",
      "final": "25-35%",
      "research": "20-35%",
      "presentation": "10-15%",
      "participation": "10-15%"
    }
  },
  "programInfo": {
    "name": "Full Program Name",
    "code": "PROGRAM_CODE",
    "degreeType": "BA/BS/BEng/MA/MS/PhD",
    "durationSemesters": number,
    "totalCredits": number,
    "description": "Program description (100-150 words)"
  },
  "semesters": [
    {
      "number": 1,
      "theme": "Foundations",
      "totalCredits": number,
      "subjects": [
        {
          "code": "DEPT-101",
          "name": "Subject Name",
          "credits": 3,
          "contactHours": 45,
          "type": "Core" | "Elective",
          "description": "Subject description",
          "prerequisites": [],
          "topics": [
            {
              "title": "Topic Title",
              "subTopics": [
                "Sub-topic 1: Specific teachable concept",
                "Sub-topic 2: Specific teachable concept",
                "Sub-topic 3: Specific teachable concept",
                "Sub-topic 4: Specific teachable concept"
              ]
            }
          ],
          "books": [
            {
              "title": "Book Title",
              "author": "Author Name",
              "year": 2020,
              "type": "Primary Textbook",
              "usage": "Compulsory Chapters 1-5"
            }
          ],
          "assessment": {
            "midTerm": 25,
            "final": 30,
            "research": 25,
            "presentation": 10,
            "participation": 10
          },
          "learningOutcomes": ["CLO1", "CLO2", "CLO3"]
        }
      ]
    }
  ],
  "gradingSystem": {
    "scale": 4.0,
    "grades": {
      "A+": { "min": 97, "max": 100, "points": 4.0 },
      "A": { "min": 93, "max": 96, "points": 4.0 },
      "A-": { "min": 90, "max": 92, "points": 3.7 },
      "B+": { "min": 87, "max": 89, "points": 3.3 },
      "B": { "min": 83, "max": 86, "points": 3.0 },
      "B-": { "min": 80, "max": 82, "points": 2.7 },
      "C+": { "min": 77, "max": 79, "points": 2.3 },
      "C": { "min": 73, "max": 76, "points": 2.0 },
      "C-": { "min": 70, "max": 72, "points": 1.7 },
      "D": { "min": 60, "max": 69, "points": 1.0 },
      "F": { "min": 0, "max": 59, "points": 0.0 }
    },
    "passingGrade": 2.0,
    "distinctionGrade": 3.5,
    "graduationRequirements": "Minimum CGPA of 2.0 with no F grades in core subjects"
  },
  "careerOutcomes": {
    "overview": "Career overview paragraph",
    "jobRoles": ["Role 1", "Role 2"],
    "industries": ["Industry 1", "Industry 2"],
    "salaryRange": "$50,000 - $80,000",
    "higherStudies": ["PhD programs", "Professional certifications"]
  },
  "eligibility": {
    "minimumQualification": "High School Diploma or equivalent",
    "requiredSubjects": ["Mathematics", "English"],
    "entranceRequirements": ["SAT/ACT scores", "Application essay"],
    "preferredProfile": "Students with strong analytical skills"
  },
  "validation": {
    "totalCreditsValid": true,
    "subjectStructureValid": true,
    "assessmentValid": true,
    "booksValid": true,
    "errors": []
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no code blocks.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      facultyName, 
      facultyCode,
      departmentName, 
      departmentCode,
      courseName, 
      courseCode,
      degreeType,
      durationSemesters,
      totalCredits,
      institutionType,
      specialization 
    } = await req.json();

    if (!courseName) {
      throw new Error('Course name is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating 7-layer curriculum for: ${courseName}`);

    const userPrompt = `Generate a complete academic curriculum using the 7-layer framework for:

=== MASTER CONTEXT (Layer 1) ===
• Faculty Name: ${facultyName || 'Not specified'}
• Faculty Code: ${facultyCode || 'FAC'}
• Department Name: ${departmentName || 'Not specified'}
• Department Code: ${departmentCode || 'DEPT'}
• Course/Program Name: ${courseName}
• Course Code: ${courseCode || 'PROG'}
• Degree Type: ${degreeType || 'Bachelor'}
• Duration: ${durationSemesters || 8} semesters
• Total Credits: ${totalCredits || 120}
• Institution Type: ${institutionType || 'Research University'}
• Specialization: ${specialization || 'General'}

=== REQUIREMENTS ===
1. Follow the 7-layer framework strictly
2. Generate ${durationSemesters || 8} complete semesters
3. Each semester should have 5-7 subjects
4. Each subject must have exactly 5 topics with 4 sub-topics each
5. Each subject must have exactly 5 books/materials
6. Assessment weights must sum to 100%
7. Use realistic, field-appropriate subject names
8. Include prerequisites where logical
9. Apply thematic progression: Foundations → Specialization → Capstone

Generate the complete curriculum now.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: FULL_SYSTEM_PROMPT },
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

    // Clean the response - remove markdown code blocks if present
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

    // Parse and validate
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', cleanedContent.substring(0, 500));
      throw new Error('AI generated invalid JSON. Please try again.');
    }

    // Run validation
    const validationErrors: string[] = [];
    
    // Check skeleton exists
    if (!parsedContent.skeleton) {
      validationErrors.push('Missing skeleton structure');
    }
    
    // Check semesters
    if (!parsedContent.semesters || !Array.isArray(parsedContent.semesters)) {
      validationErrors.push('Missing or invalid semesters array');
    } else {
      // Validate each semester
      let totalCreditCount = 0;
      parsedContent.semesters.forEach((sem: any, semIdx: number) => {
        if (!sem.subjects || !Array.isArray(sem.subjects)) {
          validationErrors.push(`Semester ${semIdx + 1}: Missing subjects`);
        } else {
          sem.subjects.forEach((subj: any, subjIdx: number) => {
            totalCreditCount += subj.credits || 0;
            
            // Check topics
            if (!subj.topics || subj.topics.length !== 5) {
              validationErrors.push(`Semester ${semIdx + 1}, Subject ${subjIdx + 1}: Should have exactly 5 topics`);
            } else {
              subj.topics.forEach((topic: any, topicIdx: number) => {
                if (!topic.subTopics || topic.subTopics.length !== 4) {
                  validationErrors.push(`Semester ${semIdx + 1}, Subject ${subjIdx + 1}, Topic ${topicIdx + 1}: Should have exactly 4 sub-topics`);
                }
              });
            }
            
            // Check books
            if (!subj.books || subj.books.length !== 5) {
              validationErrors.push(`Semester ${semIdx + 1}, Subject ${subjIdx + 1}: Should have exactly 5 books`);
            }
            
            // Check assessment
            if (subj.assessment) {
              const total = Object.values(subj.assessment).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
              if (total !== 100) {
                validationErrors.push(`Semester ${semIdx + 1}, Subject ${subjIdx + 1}: Assessment weights sum to ${total}, not 100`);
              }
            }
          });
        }
      });
    }

    // Add validation results
    parsedContent.validation = {
      totalCreditsValid: validationErrors.filter(e => e.includes('credits')).length === 0,
      subjectStructureValid: validationErrors.filter(e => e.includes('topics') || e.includes('sub-topics')).length === 0,
      assessmentValid: validationErrors.filter(e => e.includes('Assessment')).length === 0,
      booksValid: validationErrors.filter(e => e.includes('books')).length === 0,
      errors: validationErrors
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-curriculum-v2 function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
