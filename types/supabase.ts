export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Media: {
        Row: {
          creationTime: string
          description: string | null
          extension: string
          id: string
          latitude: number | null
          longitude: number | null
          owner: string
          path: string
          uri: string | null
        }
        Insert: {
          creationTime: string
          description?: string | null
          extension: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner: string
          path: string
          uri?: string | null
        }
        Update: {
          creationTime?: string
          description?: string | null
          extension?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner?: string
          path?: string
          uri?: string | null
        }
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

