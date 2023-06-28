export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
      post: {
        Row: {
          created_at: string | null
          description: string
          draft: boolean
          id: string
          markdown: string
          slug: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string
          draft?: boolean
          id?: string
          markdown?: string
          slug?: string | null
          title?: string
        }
        Update: {
          created_at?: string | null
          description?: string
          draft?: boolean
          id?: string
          markdown?: string
          slug?: string | null
          title?: string
        }
        Relationships: []
      }
      project: {
        Row: {
          description: string
          draft: boolean
          id: number
          image: string
          link: string
          name: string
          position: number | null
        }
        Insert: {
          description: string
          draft?: boolean
          id?: number
          image: string
          link: string
          name: string
          position?: number | null
        }
        Update: {
          description?: string
          draft?: boolean
          id?: number
          image?: string
          link?: string
          name?: string
          position?: number | null
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
