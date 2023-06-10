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
      beach_cams: {
        Row: {
          id: string
          location: string | null
          name: string | null
          url: string | null
          video_url: string | null
        }
        Insert: {
          id: string
          location?: string | null
          name?: string | null
          url?: string | null
          video_url?: string | null
        }
        Update: {
          id?: string
          location?: string | null
          name?: string | null
          url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      project: {
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
        Relationships: []
      }
      toby_users: {
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
