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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booked_trips: {
        Row: {
          activities_booked: boolean
          booking_reference: string | null
          booking_status: string
          created_at: string
          flights_booked: boolean
          hotels_booked: boolean
          id: string
          is_private: boolean
          itinerary_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activities_booked?: boolean
          booking_reference?: string | null
          booking_status?: string
          created_at?: string
          flights_booked?: boolean
          hotels_booked?: boolean
          id?: string
          is_private?: boolean
          itinerary_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activities_booked?: boolean
          booking_reference?: string | null
          booking_status?: string
          created_at?: string
          flights_booked?: boolean
          hotels_booked?: boolean
          id?: string
          is_private?: boolean
          itinerary_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booked_trips_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          budget: string | null
          country: string | null
          cover_image: string | null
          created_at: string
          destination: string
          end_date: string | null
          id: string
          is_ai_generated: boolean
          is_public: boolean
          likes_count: number
          nights: number | null
          place_id: string | null
          start_date: string | null
          title: string
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          destination: string
          end_date?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          likes_count?: number
          nights?: number | null
          place_id?: string | null
          start_date?: string | null
          title: string
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          destination?: string
          end_date?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          likes_count?: number
          nights?: number | null
          place_id?: string | null
          start_date?: string | null
          title?: string
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_activities: {
        Row: {
          category: string | null
          created_at: string
          day_id: string
          description: string | null
          duration: string | null
          id: string
          name: string
          price: number | null
          time: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          day_id: string
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          price?: number | null
          time?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          day_id?: string
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          price?: number | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_activities_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string
          date: string | null
          day_number: number
          id: string
          itinerary_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          day_number: number
          id?: string
          itinerary_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          day_number?: number
          id?: string
          itinerary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_flights: {
        Row: {
          airline: string | null
          arrival_airport: string
          arrival_time: string | null
          created_at: string
          departure_airport: string
          departure_time: string | null
          flight_number: string | null
          id: string
          itinerary_id: string
          price: number | null
        }
        Insert: {
          airline?: string | null
          arrival_airport: string
          arrival_time?: string | null
          created_at?: string
          departure_airport: string
          departure_time?: string | null
          flight_number?: string | null
          id?: string
          itinerary_id: string
          price?: number | null
        }
        Update: {
          airline?: string | null
          arrival_airport?: string
          arrival_time?: string | null
          created_at?: string
          departure_airport?: string
          departure_time?: string | null
          flight_number?: string | null
          id?: string
          itinerary_id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_flights_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_hotels: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          id: string
          image_url: string | null
          itinerary_id: string
          name: string
          price_per_night: number | null
          rating: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          itinerary_id: string
          name: string
          price_per_night?: number | null
          rating?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          itinerary_id?: string
          name?: string
          price_per_night?: number | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_hotels_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_likes: {
        Row: {
          created_at: string
          id: string
          itinerary_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          itinerary_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          itinerary_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_likes_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          itinerary_id: string
          photo_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          itinerary_id: string
          photo_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          itinerary_id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_photos_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_restaurants: {
        Row: {
          created_at: string
          cuisine: string | null
          day_id: string
          id: string
          meal_type: string | null
          name: string
          price_range: string | null
        }
        Insert: {
          created_at?: string
          cuisine?: string | null
          day_id: string
          id?: string
          meal_type?: string | null
          name: string
          price_range?: string | null
        }
        Update: {
          created_at?: string
          cuisine?: string | null
          day_id?: string
          id?: string
          meal_type?: string | null
          name?: string
          price_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_restaurants_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      place_events: {
        Row: {
          created_at: string
          events: string[]
          id: string
          month: string
          place_id: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          month: string
          place_id: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          month?: string
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_events_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_rules: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          place_id: string
          rule: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          place_id: string
          rule: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          place_id?: string
          rule?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_rules_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_tips: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          place_id: string
          tip: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          place_id: string
          tip: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          place_id?: string
          tip?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_tips_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          best_time_description: string | null
          best_time_period: string | null
          best_time_weather: string | null
          country: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_featured: boolean
          long_description: string | null
          name: string
          updated_at: string
        }
        Insert: {
          best_time_description?: string | null
          best_time_period?: string | null
          best_time_weather?: string | null
          country: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          long_description?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          best_time_description?: string | null
          best_time_period?: string | null
          best_time_weather?: string | null
          country?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          long_description?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      places_to_visit: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          name: string
          place_id: string
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          place_id: string
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          place_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_to_visit_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          location: string | null
          updated_at: string
          user_id: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      saved_itineraries: {
        Row: {
          created_at: string
          id: string
          itinerary_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          itinerary_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          itinerary_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_itineraries_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_expenses: {
        Row: {
          amount: number
          booked_trip_id: string
          category: string
          created_at: string
          currency: string
          description: string
          expense_date: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount?: number
          booked_trip_id: string
          category: string
          created_at?: string
          currency?: string
          description: string
          expense_date?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          booked_trip_id?: string
          category?: string
          created_at?: string
          currency?: string
          description?: string
          expense_date?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_booked_trip_id_fkey"
            columns: ["booked_trip_id"]
            isOneToOne: false
            referencedRelation: "booked_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
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
