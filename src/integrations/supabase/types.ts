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
