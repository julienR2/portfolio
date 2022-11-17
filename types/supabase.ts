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
      Accounts: {
        Row: {
          id: number
          name: string | null
          balance: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          balance?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          balance?: number | null
        }
      }
      Articles: {
        Row: {
          created_at: string | null
          content: string | null
          published_at: string | null
          title: string
          description: string | null
          id: string
          slug: string | null
          twitterLink: string | null
          hackerNewsLink: string | null
        }
        Insert: {
          created_at?: string | null
          content?: string | null
          published_at?: string | null
          title: string
          description?: string | null
          id?: string
          slug?: string | null
          twitterLink?: string | null
          hackerNewsLink?: string | null
        }
        Update: {
          created_at?: string | null
          content?: string | null
          published_at?: string | null
          title?: string
          description?: string | null
          id?: string
          slug?: string | null
          twitterLink?: string | null
          hackerNewsLink?: string | null
        }
      }
      Categories: {
        Row: {
          id: number
          name: string | null
          parent: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          parent?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          parent?: number | null
        }
      }
      Transactions: {
        Row: {
          id: number
          description: string | null
          amount: number
          date: string
          account: number | null
          category: number | null
        }
        Insert: {
          id?: number
          description?: string | null
          amount: number
          date: string
          account?: number | null
          category?: number | null
        }
        Update: {
          id?: number
          description?: string | null
          amount?: number
          date?: string
          account?: number | null
          category?: number | null
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
  }
}
