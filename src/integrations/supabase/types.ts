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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_calendar: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          is_important: boolean | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          is_important?: boolean | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_important?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      alumni_chapter_members: {
        Row: {
          chapter_id: string | null
          id: string
          is_active: boolean | null
          joined_date: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_chapter_members_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "alumni_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_chapter_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_chapters: {
        Row: {
          chapter_head: string | null
          contact_email: string | null
          country: string
          created_at: string
          description: string | null
          founded_date: string | null
          id: string
          is_active: boolean | null
          location: string
          member_count: number | null
          name: string
          region: string | null
          social_links: Json | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          chapter_head?: string | null
          contact_email?: string | null
          country: string
          created_at?: string
          description?: string | null
          founded_date?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          member_count?: number | null
          name: string
          region?: string | null
          social_links?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          chapter_head?: string | null
          contact_email?: string | null
          country?: string
          created_at?: string
          description?: string | null
          founded_date?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          member_count?: number | null
          name?: string
          region?: string | null
          social_links?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_chapters_chapter_head_fkey"
            columns: ["chapter_head"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_credentials: {
        Row: {
          blockchain_hash: string | null
          created_at: string
          credential_type: string
          description: string | null
          expiry_date: string | null
          file_path: string | null
          id: string
          is_verified: boolean | null
          issue_date: string
          last_verified_at: string | null
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string | null
          verification_count: number | null
          verification_hash: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          created_at?: string
          credential_type: string
          description?: string | null
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          is_verified?: boolean | null
          issue_date: string
          last_verified_at?: string | null
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id?: string | null
          verification_count?: number | null
          verification_hash?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          created_at?: string
          credential_type?: string
          description?: string | null
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          is_verified?: boolean | null
          issue_date?: string
          last_verified_at?: string | null
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
          verification_count?: number | null
          verification_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_document_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          delivered_at: string | null
          delivery_address: string | null
          delivery_method: string
          document_type: string
          estimated_delivery: string | null
          fee: number | null
          id: string
          notes: string | null
          payment_status: string | null
          purpose: string
          quantity: number | null
          requester_id: string | null
          status: string | null
          updated_at: string
          urgent: boolean | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_method: string
          document_type: string
          estimated_delivery?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          purpose: string
          quantity?: number | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_method?: string
          document_type?: string
          estimated_delivery?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          purpose?: string
          quantity?: number | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_document_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_donations: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          donation_type: string
          donor_id: string | null
          id: string
          is_anonymous: boolean | null
          payment_method: string | null
          payment_status: string | null
          purpose: string | null
          receipt_url: string | null
          tax_receipt_sent: boolean | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          donation_type: string
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          purpose?: string | null
          receipt_url?: string | null
          tax_receipt_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          donation_type?: string
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          purpose?: string | null
          receipt_url?: string | null
          tax_receipt_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_event_registrations: {
        Row: {
          event_id: string | null
          guest_count: number | null
          id: string
          payment_status: string | null
          registration_date: string
          special_requirements: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          guest_count?: number | null
          id?: string
          payment_status?: string | null
          registration_date?: string
          special_requirements?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          guest_count?: number | null
          id?: string
          payment_status?: string | null
          registration_date?: string
          special_requirements?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "alumni_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_virtual: boolean | null
          location: string | null
          max_attendees: number | null
          registration_fee: number | null
          start_date: string
          target_colleges: string[] | null
          target_graduation_years: number[] | null
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_fee?: number | null
          start_date: string
          target_colleges?: string[] | null
          target_graduation_years?: number[] | null
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_fee?: number | null
          start_date?: string
          target_colleges?: string[] | null
          target_graduation_years?: number[] | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_jobs: {
        Row: {
          application_email: string | null
          application_url: string | null
          company: string
          created_at: string
          currency: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: string
          location: string | null
          posted_by: string | null
          remote_ok: boolean | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          application_email?: string | null
          application_url?: string | null
          company: string
          created_at?: string
          currency?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type: string
          location?: string | null
          posted_by?: string | null
          remote_ok?: boolean | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          application_email?: string | null
          application_url?: string | null
          company?: string
          created_at?: string
          currency?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          location?: string | null
          posted_by?: string | null
          remote_ok?: boolean | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_mentorship: {
        Row: {
          created_at: string
          end_date: string | null
          goals: string | null
          id: string
          meeting_frequency: string | null
          mentee_id: string | null
          mentor_id: string | null
          notes: string | null
          program_type: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          program_type: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          program_type?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_mentorship_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "alumni_mentorship_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_profiles: {
        Row: {
          achievements: string[] | null
          allow_mentorship: boolean | null
          allow_networking: boolean | null
          alumni_id: string
          bio: string | null
          college: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          degree_type: string
          gpa: number | null
          graduation_month: number | null
          graduation_year: number
          honors: string | null
          id: string
          industry: string | null
          interests: string[] | null
          is_active: boolean | null
          is_public_profile: boolean | null
          linkedin_url: string | null
          location: string | null
          major: string | null
          minor: string | null
          personal_website: string | null
          program: string
          skills: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          achievements?: string[] | null
          allow_mentorship?: boolean | null
          allow_networking?: boolean | null
          alumni_id?: string
          bio?: string | null
          college?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree_type: string
          gpa?: number | null
          graduation_month?: number | null
          graduation_year: number
          honors?: string | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          is_public_profile?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          minor?: string | null
          personal_website?: string | null
          program: string
          skills?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          achievements?: string[] | null
          allow_mentorship?: boolean | null
          allow_networking?: boolean | null
          alumni_id?: string
          bio?: string | null
          college?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree_type?: string
          gpa?: number | null
          graduation_month?: number | null
          graduation_year?: number
          honors?: string | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          is_active?: boolean | null
          is_public_profile?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          minor?: string | null
          personal_website?: string | null
          program?: string
          skills?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string | null
          resolution: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "alumni_support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      alumni_verification_requests: {
        Row: {
          admin_notes: string | null
          alumni_id: string | null
          alumni_name: string | null
          created_at: string
          documents_needed: string[] | null
          fee: number | null
          id: string
          payment_status: string | null
          purpose: string
          requester_email: string
          requester_name: string
          requester_organization: string | null
          status: string | null
          updated_at: string
          verification_result: Json | null
          verification_type: string
        }
        Insert: {
          admin_notes?: string | null
          alumni_id?: string | null
          alumni_name?: string | null
          created_at?: string
          documents_needed?: string[] | null
          fee?: number | null
          id?: string
          payment_status?: string | null
          purpose: string
          requester_email: string
          requester_name: string
          requester_organization?: string | null
          status?: string | null
          updated_at?: string
          verification_result?: Json | null
          verification_type: string
        }
        Update: {
          admin_notes?: string | null
          alumni_id?: string | null
          alumni_name?: string | null
          created_at?: string
          documents_needed?: string[] | null
          fee?: number | null
          id?: string
          payment_status?: string | null
          purpose?: string
          requester_email?: string
          requester_name?: string
          requester_organization?: string | null
          status?: string | null
          updated_at?: string
          verification_result?: Json | null
          verification_type?: string
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          module: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          module?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          module?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_public: boolean | null
          target_audience: string | null
          target_user_id: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          target_audience?: string | null
          target_user_id?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          target_audience?: string | null
          target_user_id?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_info: Json | null
          address: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          emergency_contact: Json | null
          employee_id: string | null
          enrollment_year: number | null
          full_name: string
          graduation_year: number | null
          id: string
          metadata: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_info?: Json | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          emergency_contact?: Json | null
          employee_id?: string | null
          enrollment_year?: number | null
          full_name: string
          graduation_year?: number | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_info?: Json | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          emergency_contact?: Json | null
          employee_id?: string | null
          enrollment_year?: number | null
          full_name?: string
          graduation_year?: number | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean | null
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          key?: string
          name?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string
          id: string
          permission_id: string | null
          user_id: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id?: string | null
          user_id?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permission: {
        Args: {
          module_key: string
          permission_action: string
          user_uuid: string
        }
        Returns: Database["public"]["Enums"]["access_level"]
      }
      has_permission: {
        Args: {
          module_key: string
          permission_action: string
          required_level?: Database["public"]["Enums"]["access_level"]
          user_uuid: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      access_level:
        | "none"
        | "access"
        | "read"
        | "write"
        | "delete"
        | "approve"
        | "manage"
        | "full"
      user_role:
        | "superadmin"
        | "student"
        | "alumni"
        | "faculty"
        | "staff"
        | "accounts"
        | "admission_agent"
        | "registrar"
        | "auditor"
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
      access_level: [
        "none",
        "access",
        "read",
        "write",
        "delete",
        "approve",
        "manage",
        "full",
      ],
      user_role: [
        "superadmin",
        "student",
        "alumni",
        "faculty",
        "staff",
        "accounts",
        "admission_agent",
        "registrar",
        "auditor",
      ],
    },
  },
} as const
