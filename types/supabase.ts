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
      Project: {
        Row: {
          description: string
          id: number
          image: string
          link: string
          name: string
          position: number | null
          wip: boolean | null
        }
        Insert: {
          description: string
          id?: number
          image: string
          link: string
          name: string
          position?: number | null
          wip?: boolean | null
        }
        Update: {
          description?: string
          id?: number
          image?: string
          link?: string
          name?: string
          position?: number | null
          wip?: boolean | null
        }
      }
      TobyUsers: {
        Row: {
          created_at: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
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
