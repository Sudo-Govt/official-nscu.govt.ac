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
      agent_messages: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender_id: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender_id: string
        }
        Update: {
          application_id?: string | null
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
          commission_rate: number | null
          created_at: string | null
          id: string
          status: string | null
          total_applications: number | null
          total_commission: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_name?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          total_applications?: number | null
          total_commission?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_name?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          total_applications?: number | null
          total_commission?: number | null
          updated_at?: string | null
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
      courses: {
        Row: {
          available_seats: number
          college: string
          course_code: string
          course_name: string
          created_at: string | null
          credit_hours: number
          degree_type: string
          department: string
          duration_years: number
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          seat_capacity: number
          updated_at: string | null
        }
        Insert: {
          available_seats: number
          college: string
          course_code: string
          course_name: string
          created_at?: string | null
          credit_hours: number
          degree_type: string
          department: string
          duration_years: number
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          seat_capacity: number
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          college?: string
          course_code?: string
          course_name?: string
          created_at?: string | null
          credit_hours?: number
          degree_type?: string
          department?: string
          duration_years?: number
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          seat_capacity?: number
          updated_at?: string | null
        }
        Relationships: []
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
      emails: {
        Row: {
          attachments: Json | null
          body: string | null
          created_at: string | null
          folder: string | null
          from_email: string
          from_name: string | null
          html_body: string | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          subject: string
          to_email: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          folder?: string | null
          from_email: string
          from_name?: string | null
          html_body?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          subject: string
          to_email: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          folder?: string | null
          from_email?: string
          from_name?: string | null
          html_body?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          subject?: string
          to_email?: string
          user_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
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
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          application_data: Json | null
          application_number: string | null
          application_score: number | null
          course_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string
          id: string
          last_name: string | null
          nationality: string | null
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
          application_data?: Json | null
          application_number?: string | null
          application_score?: number | null
          course_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name: string
          id?: string
          last_name?: string | null
          nationality?: string | null
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
          application_data?: Json | null
          application_number?: string | null
          application_score?: number | null
          course_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string
          id?: string
          last_name?: string | null
          nationality?: string | null
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
            foreignKeyName: "student_applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_documents: {
        Row: {
          application_id: string | null
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
        }
        Insert: {
          application_id?: string | null
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
        }
        Update: {
          application_id?: string | null
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
      students: {
        Row: {
          address: string | null
          cgpa: number | null
          city: string | null
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
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          cgpa?: number | null
          city?: string | null
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
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          cgpa?: number | null
          city?: string | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
