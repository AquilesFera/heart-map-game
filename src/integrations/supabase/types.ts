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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      game_session: {
        Row: {
          adir: string
          amov: boolean
          ax: number
          ay: number
          collected: Json
          finished: boolean
          gdir: string
          gmov: boolean
          gx: number
          gy: number
          hearts: Json
          id: string
          messages: Json
          updated_at: string
        }
        Insert: {
          adir?: string
          amov?: boolean
          ax?: number
          ay?: number
          collected?: Json
          finished?: boolean
          gdir?: string
          gmov?: boolean
          gx?: number
          gy?: number
          hearts?: Json
          id?: string
          messages?: Json
          updated_at?: string
        }
        Update: {
          adir?: string
          amov?: boolean
          ax?: number
          ay?: number
          collected?: Json
          finished?: boolean
          gdir?: string
          gmov?: boolean
          gx?: number
          gy?: number
          hearts?: Json
          id?: string
          messages?: Json
          updated_at?: string
        }
        Relationships: []
      }
      mem_session: {
        Row: {
          flipped: Json
          id: string
          matched: Json
          room_code: string | null
          score_a: number
          score_g: number
          seed: number
          turn: string
          updated_at: string
        }
        Insert: {
          flipped?: Json
          id?: string
          matched?: Json
          room_code?: string | null
          score_a?: number
          score_g?: number
          seed?: number
          turn?: string
          updated_at?: string
        }
        Update: {
          flipped?: Json
          id?: string
          matched?: Json
          room_code?: string | null
          score_a?: number
          score_g?: number
          seed?: number
          turn?: string
          updated_at?: string
        }
        Relationships: []
      }
      room: {
        Row: {
          actions: Json
          adir: string
          amov: boolean
          ax: number
          ay: number
          code: string
          coins_g: number
          created_at: string
          form_g: string | null
          gdir: string
          gmov: boolean
          gx: number
          gy: number
          hearts: Json
          inv_a: Json
          inv_g: Json
          money_a: number
          player_a: string | null
          player_g: string | null
          scene: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          adir?: string
          amov?: boolean
          ax?: number
          ay?: number
          code: string
          coins_g?: number
          created_at?: string
          form_g?: string | null
          gdir?: string
          gmov?: boolean
          gx?: number
          gy?: number
          hearts?: Json
          inv_a?: Json
          inv_g?: Json
          money_a?: number
          player_a?: string | null
          player_g?: string | null
          scene?: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          adir?: string
          amov?: boolean
          ax?: number
          ay?: number
          code?: string
          coins_g?: number
          created_at?: string
          form_g?: string | null
          gdir?: string
          gmov?: boolean
          gx?: number
          gy?: number
          hearts?: Json
          inv_a?: Json
          inv_g?: Json
          money_a?: number
          player_a?: string | null
          player_g?: string | null
          scene?: string
          updated_at?: string
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
