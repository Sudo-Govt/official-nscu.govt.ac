export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      academic_calendar: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          is_active: boolean | null
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          start_date: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      academic_courses: {
        Row: {
          ai_generated_content: Json | null
          available_seats: number | null
          college: string | null
          content_generated_at: string | null
          course_code: string
          created_at: string | null
          degree_type: string | null
          department: string | null
          department_id: string | null
          duration_months: number
          eligibility_criteria: string | null
          end_date: string | null
          enrollment_status: string | null
          featured: boolean | null
          fee_structure: Json | null
          id: string
          is_active: boolean | null
          is_visible_on_website: boolean | null
          long_description: string | null
          name: string
          seat_capacity: number | null
          short_description: string | null
          slug: string | null
          start_date: string | null
          thumbnail_image_url: string | null
          total_credits: number
          updated_at: string | null
        }
        Insert: {
          ai_generated_content?: Json | null
          available_seats?: number | null
          college?: string | null
          content_generated_at?: string | null
          course_code: string
          created_at?: string | null
          degree_type?: string | null
          department?: string | null
          department_id?: string | null
          duration_months?: number
          eligibility_criteria?: string | null
          end_date?: string | null
          enrollment_status?: string | null
          featured?: boolean | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          is_visible_on_website?: boolean | null
          long_description?: string | null
          name: string
          seat_capacity?: number | null
          short_description?: string | null
          slug?: string | null
          start_date?: string | null
          thumbnail_image_url?: string | null
          total_credits?: number
          updated_at?: string | null
        }
        Update: {
          ai_generated_content?: Json | null
          available_seats?: number | null
          college?: string | null
          content_generated_at?: string | null
          course_code?: string
          created_at?: string | null
          degree_type?: string | null
          department?: string | null
          department_id?: string | null
          duration_months?: number
          eligibility_criteria?: string | null
          end_date?: string | null
          enrollment_status?: string | null
          featured?: boolean | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          is_visible_on_website?: boolean | null
          long_description?: string | null
          name?: string
          seat_capacity?: number | null
          short_description?: string | null
          slug?: string | null
          start_date?: string | null
          thumbnail_image_url?: string | null
          total_credits?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "academic_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_departments: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          faculty_id: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          faculty_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          faculty_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "academic_faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_faculties: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      academic_lessons: {
        Row: {
          content: string | null
          created_at: string | null
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean | null
          lesson_code: string
          name: string
          order_index: number | null
          topic_id: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          lesson_code: string
          name: string
          order_index?: number | null
          topic_id: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          lesson_code?: string
          name?: string
          order_index?: number | null
          topic_id?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "academic_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_students: {
        Row: {
          course_id: string
          created_at: string | null
          email: string
          enrollment_date: string | null
          enrollment_number: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          email: string
          enrollment_date?: string | null
          enrollment_number: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          email?: string
          enrollment_date?: string | null
          enrollment_number?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_subjects: {
        Row: {
          course_id: string
          created_at: string | null
          credits: number | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          semester: number | null
          subject_code: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          semester?: number | null
          subject_code: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          credits?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          semester?: number | null
          subject_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_subjects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          subject_id: string
          topic_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          subject_id: string
          topic_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          subject_id?: string
          topic_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "academic_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliation_requests: {
        Row: {
          created_at: string | null
          email: string
          expected_start_date: string
          full_name: string
          id: string
          institution_type: string
          location: string
          notes: string | null
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expected_start_date: string
          full_name: string
          id?: string
          institution_type: string
          location: string
          notes?: string | null
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expected_start_date?: string
          full_name?: string
          id?: string
          institution_type?: string
          location?: string
          notes?: string | null
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_commissions: {
        Row: {
          agent_id: string
          amount: number
          application_id: string | null
          commission_rate: number
          created_at: string | null
          id: string
          paid_at: string | null
          status: string | null
        }
        Insert: {
          agent_id: string
          amount: number
          application_id?: string | null
          commission_rate: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string
          amount?: number
          application_id?: string | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_communications: {
        Row: {
          agent_id: string | null
          application_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          priority: string | null
          sender_type: string
          subject: string
        }
        Insert: {
          agent_id?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          priority?: string | null
          sender_type: string
          subject: string
        }
        Update: {
          agent_id?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          priority?: string | null
          sender_type?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_communications_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_communications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          application_id: string | null
          attachment_name: string | null
          attachment_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender_id: string
        }
        Insert: {
          application_id?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender_id: string
        }
        Update: {
          application_id?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          agency_name: string | null
          agent_id: string | null
          commission_rate: number | null
          contact_info: Json | null
          created_at: string | null
          id: string
          kyc_status: string | null
          languages: string[] | null
          preferred_currency: string | null
          status: string | null
          total_applications: number | null
          total_commission: number | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_name?: string | null
          agent_id?: string | null
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          languages?: string[] | null
          preferred_currency?: string | null
          status?: string | null
          total_applications?: number | null
          total_commission?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_name?: string | null
          agent_id?: string | null
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          languages?: string[] | null
          preferred_currency?: string | null
          status?: string | null
          total_applications?: number | null
          total_commission?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_resources: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          target_type: string
          target_user_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_type?: string
          target_user_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_type?: string
          target_user_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      alumni_chapters: {
        Row: {
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string
          name: string
          president_id: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          president_id?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          president_id?: string | null
        }
        Relationships: []
      }
      alumni_chat_presence: {
        Row: {
          id: string
          is_online: boolean
          last_seen: string
          user_id: string
        }
        Insert: {
          id?: string
          is_online?: boolean
          last_seen?: string
          user_id: string
        }
        Update: {
          id?: string
          is_online?: boolean
          last_seen?: string
          user_id?: string
        }
        Relationships: []
      }
      alumni_chat_room: {
        Row: {
          created_at: string
          deleted_by: string | null
          id: string
          is_deleted: boolean
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      alumni_credentials: {
        Row: {
          created_at: string | null
          credential_number: string | null
          credential_type: string
          expires_at: string | null
          file_path: string | null
          id: string
          issued_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credential_number?: string | null
          credential_type: string
          expires_at?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credential_number?: string | null
          credential_type?: string
          expires_at?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_cta_buttons: {
        Row: {
          action_type: string
          action_value: string
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          action_type?: string
          action_value: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          action_value?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      alumni_dashboard_data: {
        Row: {
          achievements: Json | null
          assigned_resources: string[] | null
          career_history: Json | null
          created_at: string | null
          custom_data: Json | null
          graduation_info: Json | null
          id: string
          updated_at: string | null
          user_id: string
          visible_sections: string[] | null
        }
        Insert: {
          achievements?: Json | null
          assigned_resources?: string[] | null
          career_history?: Json | null
          created_at?: string | null
          custom_data?: Json | null
          graduation_info?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
          visible_sections?: string[] | null
        }
        Update: {
          achievements?: Json | null
          assigned_resources?: string[] | null
          career_history?: Json | null
          created_at?: string | null
          custom_data?: Json | null
          graduation_info?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
          visible_sections?: string[] | null
        }
        Relationships: []
      }
      alumni_document_requests: {
        Row: {
          completed_at: string | null
          delivery_address: string | null
          delivery_method: string | null
          document_type: string
          fee: number | null
          id: string
          notes: string | null
          payment_status: string | null
          processed_by: string | null
          purpose: string | null
          quantity: number | null
          requested_at: string | null
          requester_id: string | null
          status: string | null
          urgent: boolean | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          document_type: string
          fee?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          processed_by?: string | null
          purpose?: string | null
          quantity?: number | null
          requested_at?: string | null
          requester_id?: string | null
          status?: string | null
          urgent?: boolean | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          document_type?: string
          fee?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          processed_by?: string | null
          purpose?: string | null
          quantity?: number | null
          requested_at?: string | null
          requester_id?: string | null
          status?: string | null
          urgent?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_downloadable_resources: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          download_count: number | null
          expires_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          last_downloaded_at: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          last_downloaded_at?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          last_downloaded_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_jobs: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          posted_by: string | null
          salary_range: string | null
          title: string
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          salary_range?: string | null
          title: string
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          salary_range?: string | null
          title?: string
        }
        Relationships: []
      }
      alumni_mentorship: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          mentee_id: string | null
          mentor_id: string
          program_name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id: string
          program_name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string
          program_name?: string
          status?: string | null
        }
        Relationships: []
      }
      alumni_private_messages: {
        Row: {
          created_at: string
          id: string
          is_deleted_by_recipient: boolean
          is_deleted_by_sender: boolean
          is_read: boolean
          message: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean
          is_deleted_by_sender?: boolean
          is_read?: boolean
          message: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted_by_recipient?: boolean
          is_deleted_by_sender?: boolean
          is_read?: boolean
          message?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      alumni_profiles: {
        Row: {
          achievements: string[] | null
          bio: string | null
          college: string | null
          created_at: string | null
          current_company: string | null
          current_employer: string | null
          current_position: string | null
          degree_type: string | null
          graduation_year: number | null
          id: string
          industry: string | null
          interests: string[] | null
          is_mentor_available: boolean | null
          linkedin_url: string | null
          location: string | null
          major: string | null
          minor: string | null
          personal_website: string | null
          program: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          college?: string | null
          created_at?: string | null
          current_company?: string | null
          current_employer?: string | null
          current_position?: string | null
          degree_type?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          is_mentor_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          minor?: string | null
          personal_website?: string | null
          program?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          college?: string | null
          created_at?: string | null
          current_company?: string | null
          current_employer?: string | null
          current_position?: string | null
          degree_type?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          is_mentor_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          minor?: string | null
          personal_website?: string | null
          program?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_transcripts: {
        Row: {
          academic_year: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          issued_at: string | null
          user_id: string
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          issued_at?: string | null
          user_id: string
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          issued_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          first_attempt_at: string | null
          id: string
          identifier: string
          identifier_type: string
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          identifier: string
          identifier_type?: string
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      channel_messages: {
        Row: {
          channel_id: string | null
          created_at: string | null
          document_references: Json | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message: string
          reactions: Json | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          document_references?: Json | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message: string
          reactions?: Json | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          document_references?: Json | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message?: string
          reactions?: Json | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "channel_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_channels: {
        Row: {
          channel_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          members: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          channel_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          members?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          channel_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          members?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      cms_content_blocks: {
        Row: {
          block_key: string | null
          block_type: string
          content: Json | null
          created_at: string | null
          custom_css: string | null
          id: string
          is_active: boolean | null
          page_id: string | null
          position: number
          updated_at: string | null
        }
        Insert: {
          block_key?: string | null
          block_type: string
          content?: Json | null
          created_at?: string | null
          custom_css?: string | null
          id?: string
          is_active?: boolean | null
          page_id?: string | null
          position?: number
          updated_at?: string | null
        }
        Update: {
          block_key?: string | null
          block_type?: string
          content?: Json | null
          created_at?: string | null
          custom_css?: string | null
          id?: string
          is_active?: boolean | null
          page_id?: string | null
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          page_type: string
          slug: string
          status: string
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          page_type?: string
          slug: string
          status?: string
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          page_type?: string
          slug?: string
          status?: string
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_pages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cms_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_templates: {
        Row: {
          created_at: string | null
          default_blocks: Json | null
          description: string | null
          id: string
          layout_structure: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_blocks?: Json | null
          description?: string | null
          id?: string
          layout_structure?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_blocks?: Json | null
          description?: string | null
          id?: string
          layout_structure?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_rate_limits: {
        Row: {
          blocked_until: string | null
          captcha_fail_count: number | null
          created_at: string | null
          id: string
          ip_address: string
          last_submission_at: string | null
          submission_count: number | null
        }
        Insert: {
          blocked_until?: string | null
          captcha_fail_count?: number | null
          created_at?: string | null
          id?: string
          ip_address: string
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Update: {
          blocked_until?: string | null
          captcha_fail_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string
          last_submission_at?: string | null
          submission_count?: number | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          captcha_data: Json | null
          country: string | null
          created_at: string | null
          email: string
          flow: string
          full_name: string
          id: string
          ip_address: string | null
          isd_code: string
          message: string | null
          phone: string
          status: string | null
          topics: Json | null
          type: string | null
          user_agent: string | null
        }
        Insert: {
          captcha_data?: Json | null
          country?: string | null
          created_at?: string | null
          email: string
          flow: string
          full_name: string
          id?: string
          ip_address?: string | null
          isd_code: string
          message?: string | null
          phone: string
          status?: string | null
          topics?: Json | null
          type?: string | null
          user_agent?: string | null
        }
        Update: {
          captcha_data?: Json | null
          country?: string | null
          created_at?: string | null
          email?: string
          flow?: string
          full_name?: string
          id?: string
          ip_address?: string | null
          isd_code?: string
          message?: string | null
          phone?: string
          status?: string | null
          topics?: Json | null
          type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      course_books: {
        Row: {
          book_id: string
          course_id: string
          created_at: string | null
          id: string
          is_required: boolean | null
        }
        Insert: {
          book_id: string
          course_id: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
        }
        Update: {
          book_id?: string
          course_id?: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "course_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_books_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academic_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          application_deadline: string | null
          available_seats: number
          brochure_url: string | null
          career_outcomes: Json | null
          college: string
          course_code: string
          course_name: string
          created_at: string | null
          credit_hours: number
          curriculum_data: Json | null
          degree_type: string
          department: string
          description: string | null
          duration_years: number
          eligibility_criteria: string | null
          faculty_info: Json | null
          featured: boolean | null
          fee_structure: Json | null
          id: string
          is_active: boolean | null
          navigation_parent_id: string | null
          payment_link: string | null
          reference_books: Json | null
          seat_capacity: number
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          available_seats: number
          brochure_url?: string | null
          career_outcomes?: Json | null
          college: string
          course_code: string
          course_name: string
          created_at?: string | null
          credit_hours: number
          curriculum_data?: Json | null
          degree_type: string
          department: string
          description?: string | null
          duration_years: number
          eligibility_criteria?: string | null
          faculty_info?: Json | null
          featured?: boolean | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          navigation_parent_id?: string | null
          payment_link?: string | null
          reference_books?: Json | null
          seat_capacity: number
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          available_seats?: number
          brochure_url?: string | null
          career_outcomes?: Json | null
          college?: string
          course_code?: string
          course_name?: string
          created_at?: string | null
          credit_hours?: number
          curriculum_data?: Json | null
          degree_type?: string
          department?: string
          description?: string | null
          duration_years?: number
          eligibility_criteria?: string | null
          faculty_info?: Json | null
          featured?: boolean | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          navigation_parent_id?: string | null
          payment_link?: string | null
          reference_books?: Json | null
          seat_capacity?: number
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_navigation_parent_id_fkey"
            columns: ["navigation_parent_id"]
            isOneToOne: false
            referencedRelation: "site_navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_name: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_public: boolean | null
          target_audience: string | null
          target_user_id: string | null
          title: string
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_public?: boolean | null
          target_audience?: string | null
          target_user_id?: string | null
          title: string
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_public?: boolean | null
          target_audience?: string | null
          target_user_id?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      documents_generated: {
        Row: {
          created_at: string | null
          doc_type: string | null
          document_type: string
          file_path: string
          generated_at: string | null
          generated_by: string
          id: string
          json_content: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type?: string | null
          document_type: string
          file_path: string
          generated_at?: string | null
          generated_by: string
          id?: string
          json_content?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string | null
          document_type?: string
          file_path?: string
          generated_at?: string | null
          generated_by?: string
          id?: string
          json_content?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_generated_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      dummy_alumni: {
        Row: {
          bio: string | null
          college: string | null
          created_at: string | null
          current_company: string | null
          current_position: string | null
          degree_type: string | null
          full_name: string
          graduation_year: number | null
          id: string
          is_mentor_available: boolean | null
          location: string | null
          major: string | null
          program: string | null
        }
        Insert: {
          bio?: string | null
          college?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          degree_type?: string | null
          full_name: string
          graduation_year?: number | null
          id?: string
          is_mentor_available?: boolean | null
          location?: string | null
          major?: string | null
          program?: string | null
        }
        Update: {
          bio?: string | null
          college?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          degree_type?: string | null
          full_name?: string
          graduation_year?: number | null
          id?: string
          is_mentor_available?: boolean | null
          location?: string | null
          major?: string | null
          program?: string | null
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          cpanel_account_created: boolean | null
          created_at: string | null
          display_name: string | null
          email_address: string
          encrypted_password: string
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          quota_mb: number | null
          user_id: string
        }
        Insert: {
          cpanel_account_created?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email_address: string
          encrypted_password: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          quota_mb?: number | null
          user_id: string
        }
        Update: {
          cpanel_account_created?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email_address?: string
          encrypted_password?: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          quota_mb?: number | null
          user_id?: string
        }
        Relationships: []
      }
      email_attachments: {
        Row: {
          created_at: string | null
          email_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
        }
        Insert: {
          created_at?: string | null
          email_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          unread_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          unread_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          unread_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      email_labels: {
        Row: {
          color: string
          created_at: string | null
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          account_id: string | null
          body: string | null
          created_at: string | null
          folder: string | null
          from_address: string
          id: string
          is_read: boolean | null
          message_id: string | null
          received_at: string | null
          subject: string | null
          to_address: string
        }
        Insert: {
          account_id?: string | null
          body?: string | null
          created_at?: string | null
          folder?: string | null
          from_address: string
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          received_at?: string | null
          subject?: string | null
          to_address: string
        }
        Update: {
          account_id?: string | null
          body?: string | null
          created_at?: string | null
          folder?: string | null
          from_address?: string
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          received_at?: string | null
          subject?: string | null
          to_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_signatures: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_system: boolean | null
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          attachments: Json | null
          bcc: string | null
          body: string | null
          cc: string | null
          created_at: string | null
          email_type: string | null
          folder: string | null
          from_email: string
          from_name: string | null
          has_attachments: boolean | null
          html_body: string | null
          id: string
          is_archived: boolean | null
          is_deleted: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          labels: Json | null
          priority: string | null
          received_at: string | null
          reply_to_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          thread_id: string | null
          to_email: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          bcc?: string | null
          body?: string | null
          cc?: string | null
          created_at?: string | null
          email_type?: string | null
          folder?: string | null
          from_email: string
          from_name?: string | null
          has_attachments?: boolean | null
          html_body?: string | null
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: Json | null
          priority?: string | null
          received_at?: string | null
          reply_to_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          thread_id?: string | null
          to_email: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          bcc?: string | null
          body?: string | null
          cc?: string | null
          created_at?: string | null
          email_type?: string | null
          folder?: string | null
          from_email?: string
          from_name?: string | null
          has_attachments?: boolean | null
          html_body?: string | null
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: Json | null
          priority?: string | null
          received_at?: string | null
          reply_to_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          thread_id?: string | null
          to_email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          is_active: boolean | null
          is_virtual: boolean | null
          location: string | null
          max_attendees: number | null
          registration_required: boolean | null
          start_date: string
          title: string
          updated_at: string | null
          virtual_link: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          start_date: string
          title: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_date: string | null
          payment_method: string
          payment_status: string | null
          student_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          payment_status?: string | null
          student_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          payment_status?: string | null
          student_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submission_comments: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          submission_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          submission_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          submission_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submission_comments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          attachments: Json | null
          created_at: string | null
          form_data: Json
          form_id: string
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string | null
          tracking_number: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          form_data?: Json
          form_id: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          tracking_number: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          form_data?: Json
          form_id?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          tracking_number?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          access_level: Database["public"]["Enums"]["form_access_level"]
          category: Database["public"]["Enums"]["form_category"]
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_time: string | null
          fields: Json
          icon: string | null
          id: string
          is_popular: boolean | null
          required_documents: string[] | null
          settings: Json | null
          slug: string
          sort_order: number | null
          status: Database["public"]["Enums"]["form_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["form_access_level"]
          category: Database["public"]["Enums"]["form_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          is_popular?: boolean | null
          required_documents?: string[] | null
          settings?: Json | null
          slug: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["form_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["form_access_level"]
          category?: Database["public"]["Enums"]["form_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          is_popular?: boolean | null
          required_documents?: string[] | null
          settings?: Json | null
          slug?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["form_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internal_labels: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      internal_message_attachments: {
        Row: {
          created_at: string | null
          document_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_system_document: boolean | null
          message_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_system_document?: boolean | null
          message_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_system_document?: boolean | null
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "internal_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_messages: {
        Row: {
          bcc: string[] | null
          body: string
          cc: string[] | null
          created_at: string | null
          document_references: Json | null
          folder: string | null
          id: string
          is_archived: boolean | null
          is_draft: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          labels: Json | null
          priority: string | null
          recipient_id: string
          reply_to_id: string | null
          scheduled_at: string | null
          sender_id: string
          subject: string
          thread_id: string | null
        }
        Insert: {
          bcc?: string[] | null
          body: string
          cc?: string[] | null
          created_at?: string | null
          document_references?: Json | null
          folder?: string | null
          id?: string
          is_archived?: boolean | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: Json | null
          priority?: string | null
          recipient_id: string
          reply_to_id?: string | null
          scheduled_at?: string | null
          sender_id: string
          subject: string
          thread_id?: string | null
        }
        Update: {
          bcc?: string[] | null
          body?: string
          cc?: string[] | null
          created_at?: string | null
          document_references?: Json | null
          folder?: string | null
          id?: string
          is_archived?: boolean | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: Json | null
          priority?: string | null
          recipient_id?: string
          reply_to_id?: string | null
          scheduled_at?: string | null
          sender_id?: string
          subject?: string
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "internal_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          current_address: string
          date_of_birth: string
          education: Json | null
          email: string
          experience: Json | null
          full_name: string
          gender: string | null
          id: string
          identification_number: string | null
          job_id: string
          languages_known: Json | null
          nationality: string
          permanent_address: string | null
          phone: string
          preferred_work_mode: string | null
          resume_filename: string | null
          resume_path: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          software_tools: string[] | null
          status: string | null
          technical_skills: string[] | null
          tracking_number: string
          updated_at: string | null
          willing_to_relocate: boolean | null
          willing_to_travel: boolean | null
          working_hours_availability: string | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          current_address: string
          date_of_birth: string
          education?: Json | null
          email: string
          experience?: Json | null
          full_name: string
          gender?: string | null
          id?: string
          identification_number?: string | null
          job_id: string
          languages_known?: Json | null
          nationality: string
          permanent_address?: string | null
          phone: string
          preferred_work_mode?: string | null
          resume_filename?: string | null
          resume_path?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          software_tools?: string[] | null
          status?: string | null
          technical_skills?: string[] | null
          tracking_number: string
          updated_at?: string | null
          willing_to_relocate?: boolean | null
          willing_to_travel?: boolean | null
          working_hours_availability?: string | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          current_address?: string
          date_of_birth?: string
          education?: Json | null
          email?: string
          experience?: Json | null
          full_name?: string
          gender?: string | null
          id?: string
          identification_number?: string | null
          job_id?: string
          languages_known?: Json | null
          nationality?: string
          permanent_address?: string | null
          phone?: string
          preferred_work_mode?: string | null
          resume_filename?: string | null
          resume_path?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          software_tools?: string[] | null
          status?: string | null
          technical_skills?: string[] | null
          tracking_number?: string
          updated_at?: string | null
          willing_to_relocate?: boolean | null
          willing_to_travel?: boolean | null
          working_hours_availability?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          benefits: string[] | null
          created_at: string | null
          created_by: string | null
          department: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: string
          location: string | null
          requirements: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type: string
          location?: string | null
          requirements?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          location?: string | null
          requirements?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      library_books: {
        Row: {
          author: string | null
          book_code: string
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          isbn: string | null
          publication_year: number | null
          publisher: string | null
          title: string
          updated_at: string | null
          volume: string | null
        }
        Insert: {
          author?: string | null
          book_code: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          isbn?: string | null
          publication_year?: number | null
          publisher?: string | null
          title: string
          updated_at?: string | null
          volume?: string | null
        }
        Update: {
          author?: string | null
          book_code?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          isbn?: string | null
          publication_year?: number | null
          publisher?: string | null
          title?: string
          updated_at?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      phd_applications: {
        Row: {
          country: string
          created_at: string
          email: string
          expected_start: string
          full_name: string
          id: string
          phone: string
          research_interest: string
          status: string | null
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          email: string
          expected_start: string
          full_name: string
          id?: string
          phone: string
          research_interest: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          expected_start?: string
          full_name?: string
          id?: string
          phone?: string
          research_interest?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          is_test_account: boolean | null
          metadata: Json | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_test_account?: boolean | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_test_account?: boolean | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_action: string
          permission_category: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_action: string
          permission_category: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_action?: string
          permission_category?: string
          role?: string
        }
        Relationships: []
      }
      site_navigation: {
        Row: {
          created_at: string | null
          href: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          menu_location: string
          parent_id: string | null
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_location?: string
          parent_id?: string | null
          position?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_location?: string
          parent_id?: string | null
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "site_navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      smtp_settings: {
        Row: {
          created_at: string | null
          from_email: string
          from_name: string | null
          id: string
          is_active: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_user: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_email: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_user: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_email?: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_user?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_applications: {
        Row: {
          academic_documents: Json | null
          admission_month: number | null
          admission_year: number | null
          agent_id: string | null
          application_data: Json | null
          application_number: string | null
          application_score: number | null
          approved_fee: number | null
          course_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string
          id: string
          last_name: string | null
          nationality: string | null
          payment_code: string | null
          payment_completed_at: string | null
          payment_status: string | null
          phone: string | null
          previous_education: Json | null
          program: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scoring_breakdown: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          academic_documents?: Json | null
          admission_month?: number | null
          admission_year?: number | null
          agent_id?: string | null
          application_data?: Json | null
          application_number?: string | null
          application_score?: number | null
          approved_fee?: number | null
          course_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name: string
          id?: string
          last_name?: string | null
          nationality?: string | null
          payment_code?: string | null
          payment_completed_at?: string | null
          payment_status?: string | null
          phone?: string | null
          previous_education?: Json | null
          program: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scoring_breakdown?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          academic_documents?: Json | null
          admission_month?: number | null
          admission_year?: number | null
          agent_id?: string | null
          application_data?: Json | null
          application_number?: string | null
          application_score?: number | null
          approved_fee?: number | null
          course_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string
          id?: string
          last_name?: string | null
          nationality?: string | null
          payment_code?: string | null
          payment_completed_at?: string | null
          payment_status?: string | null
          phone?: string | null
          previous_education?: Json | null
          program?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scoring_breakdown?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_applications_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_dashboard_data: {
        Row: {
          assigned_library_books: string[] | null
          assignments: Json | null
          courses: Json | null
          created_at: string
          custom_resources: string[] | null
          degree_progress: Json | null
          enrolled_course_id: string | null
          enrolled_subjects: string[] | null
          financial_data: Json | null
          gpa_data: Json | null
          grades: Json | null
          id: string
          library_resources: Json | null
          progress_graph_data: Json | null
          quick_actions_config: Json | null
          schedule: Json | null
          student_id: string
          updated_at: string
          visible_sections: string[] | null
        }
        Insert: {
          assigned_library_books?: string[] | null
          assignments?: Json | null
          courses?: Json | null
          created_at?: string
          custom_resources?: string[] | null
          degree_progress?: Json | null
          enrolled_course_id?: string | null
          enrolled_subjects?: string[] | null
          financial_data?: Json | null
          gpa_data?: Json | null
          grades?: Json | null
          id?: string
          library_resources?: Json | null
          progress_graph_data?: Json | null
          quick_actions_config?: Json | null
          schedule?: Json | null
          student_id: string
          updated_at?: string
          visible_sections?: string[] | null
        }
        Update: {
          assigned_library_books?: string[] | null
          assignments?: Json | null
          courses?: Json | null
          created_at?: string
          custom_resources?: string[] | null
          degree_progress?: Json | null
          enrolled_course_id?: string | null
          enrolled_subjects?: string[] | null
          financial_data?: Json | null
          gpa_data?: Json | null
          grades?: Json | null
          id?: string
          library_resources?: Json | null
          progress_graph_data?: Json | null
          quick_actions_config?: Json | null
          schedule?: Json | null
          student_id?: string
          updated_at?: string
          visible_sections?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "student_dashboard_data_enrolled_course_id_fkey"
            columns: ["enrolled_course_id"]
            isOneToOne: false
            referencedRelation: "academic_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_dashboard_data_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_documents: {
        Row: {
          ai_fraud_score: number | null
          application_id: string | null
          blockchain_hash: string | null
          created_at: string | null
          document_name: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_verified: boolean | null
          mime_type: string | null
          student_id: string | null
          uploaded_at: string | null
          verification_notes: string | null
        }
        Insert: {
          ai_fraud_score?: number | null
          application_id?: string | null
          blockchain_hash?: string | null
          created_at?: string | null
          document_name?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          student_id?: string | null
          uploaded_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          ai_fraud_score?: number | null
          application_id?: string | null
          blockchain_hash?: string | null
          created_at?: string | null
          document_name?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          student_id?: string | null
          uploaded_at?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_payments: {
        Row: {
          agent_currency: string | null
          amount: number
          application_id: string | null
          balance_amount: number | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          exchange_rate: number | null
          id: string
          notes: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_method: string
          payment_status: string | null
          payment_type: string
          receipt_url: string | null
          student_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_currency?: string | null
          amount: number
          application_id?: string | null
          balance_amount?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method: string
          payment_status?: string | null
          payment_type: string
          receipt_url?: string | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_currency?: string | null
          amount?: number
          application_id?: string | null
          balance_amount?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string
          payment_status?: string | null
          payment_type?: string
          receipt_url?: string | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completion_date: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          lesson_id: string
          progress_percentage: number | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          lesson_id: string
          progress_percentage?: number | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          lesson_id?: string
          progress_percentage?: number | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "academic_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "academic_students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_resources: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          target_type: string
          target_user_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_type?: string
          target_user_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_type?: string
          target_user_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string | null
          cgpa: number | null
          city: string | null
          course_id: string | null
          course_name: string | null
          created_at: string | null
          dob: string | null
          enrollment_year: number
          exam_format: string | null
          father_name: string | null
          id: string
          mother_name: string | null
          name: string | null
          nationality: string | null
          pincode: string | null
          program: string
          specialization: string | null
          state: string | null
          status: string | null
          student_id: string
          student_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          cgpa?: number | null
          city?: string | null
          course_id?: string | null
          course_name?: string | null
          created_at?: string | null
          dob?: string | null
          enrollment_year: number
          exam_format?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          name?: string | null
          nationality?: string | null
          pincode?: string | null
          program: string
          specialization?: string | null
          state?: string | null
          status?: string | null
          student_id: string
          student_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          cgpa?: number | null
          city?: string | null
          course_id?: string | null
          course_name?: string | null
          created_at?: string | null
          dob?: string | null
          enrollment_year?: number
          exam_format?: string | null
          father_name?: string | null
          id?: string
          mother_name?: string | null
          name?: string | null
          nationality?: string | null
          pincode?: string | null
          program?: string
          specialization?: string | null
          state?: string | null
          status?: string | null
          student_id?: string
          student_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          target_roles: string[] | null
          target_type: string
          target_user_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_roles?: string[] | null
          target_type?: string
          target_user_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          target_roles?: string[] | null
          target_type?: string
          target_user_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_identities: {
        Row: {
          created_at: string | null
          department: string | null
          display_name: string | null
          id: string
          internal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          id?: string
          internal_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          id?: string
          internal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          id: string
          is_online: boolean | null
          last_seen: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_payment_code: { Args: never; Returns: string }
      get_course_catalog_nav_id: { Args: never; Returns: string }
      has_permission: {
        Args: { _action: string; _category: string; _user_id: string }
        Returns: boolean
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "superadmin"
        | "student"
        | "faculty"
        | "admission_agent"
        | "finance"
        | "alumni"
        | "staff"
        | "accounts"
        | "registrar"
        | "auditor"
        | "delegator"
        | "platform_admin"
        | "hr_admin"
        | "compliance_admin"
        | "admission_admin"
        | "admission_staff"
        | "master_agent"
        | "support"
        | "marketing_admin"
      form_access_level:
        | "public"
        | "student"
        | "faculty"
        | "staff"
        | "admin"
        | "all_authenticated"
      form_category:
        | "admission"
        | "partnership"
        | "visitor"
        | "inquiry"
        | "academic"
        | "student_services"
        | "financial"
        | "hostel"
        | "library"
        | "facilities"
        | "events"
        | "lost_found"
        | "health_safety"
        | "complaints"
        | "hr"
      form_status: "draft" | "published" | "archived"
      submission_status:
        | "draft"
        | "pending"
        | "in_review"
        | "approved"
        | "rejected"
        | "requires_action"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "superadmin",
        "student",
        "faculty",
        "admission_agent",
        "finance",
        "alumni",
        "staff",
        "accounts",
        "registrar",
        "auditor",
        "delegator",
        "platform_admin",
        "hr_admin",
        "compliance_admin",
        "admission_admin",
        "admission_staff",
        "master_agent",
        "support",
        "marketing_admin",
      ],
      form_access_level: [
        "public",
        "student",
        "faculty",
        "staff",
        "admin",
        "all_authenticated",
      ],
      form_category: [
        "admission",
        "partnership",
        "visitor",
        "inquiry",
        "academic",
        "student_services",
        "financial",
        "hostel",
        "library",
        "facilities",
        "events",
        "lost_found",
        "health_safety",
        "complaints",
        "hr",
      ],
      form_status: ["draft", "published", "archived"],
      submission_status: [
        "draft",
        "pending",
        "in_review",
        "approved",
        "rejected",
        "requires_action",
        "cancelled",
      ],
    },
  },
} as const
