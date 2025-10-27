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
      learning_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          language: string
          subject: Database["public"]["Enums"]["subject_type"]
          topic: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          language: string
          subject: Database["public"]["Enums"]["subject_type"]
          topic: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          language?: string
          subject?: Database["public"]["Enums"]["subject_type"]
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          learning_pace: string | null
          preferred_language: string | null
          reminder_enabled: boolean | null
          teacher_avatar_url: string | null
          teacher_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          learning_pace?: string | null
          preferred_language?: string | null
          reminder_enabled?: boolean | null
          teacher_avatar_url?: string | null
          teacher_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          learning_pace?: string | null
          preferred_language?: string | null
          reminder_enabled?: boolean | null
          teacher_avatar_url?: string | null
          teacher_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completed_at: string | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"] | null
          id: string
          score: number
          subject: Database["public"]["Enums"]["subject_type"]
          time_taken_seconds: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"] | null
          id?: string
          score: number
          subject: Database["public"]["Enums"]["subject_type"]
          time_taken_seconds?: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"] | null
          id?: string
          score?: number
          subject?: Database["public"]["Enums"]["subject_type"]
          time_taken_seconds?: number | null
          topic?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"] | null
          id: string
          notes_generated: boolean | null
          score: number | null
          subject: string
          time_spent_minutes: number | null
          topic: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"] | null
          id?: string
          notes_generated?: boolean | null
          score?: number | null
          subject: string
          time_spent_minutes?: number | null
          topic: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"] | null
          id?: string
          notes_generated?: boolean | null
          score?: number | null
          subject?: string
          time_spent_minutes?: number | null
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_customization: {
        Row: {
          attire_style: string | null
          created_at: string | null
          generated_avatar_url: string | null
          id: string
          original_image_url: string | null
          teacher_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attire_style?: string | null
          created_at?: string | null
          generated_avatar_url?: string | null
          id?: string
          original_image_url?: string | null
          teacher_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attire_style?: string | null
          created_at?: string | null
          generated_avatar_url?: string | null
          id?: string
          original_image_url?: string | null
          teacher_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_customization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      quiz_difficulty: "easy" | "medium" | "hard"
      subject_type: "mathematics" | "science" | "history" | "geography"
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
      quiz_difficulty: ["easy", "medium", "hard"],
      subject_type: ["mathematics", "science", "history", "geography"],
    },
  },
} as const
