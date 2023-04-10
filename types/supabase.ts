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
          balance: number | null
          id: number
          name: string | null
        }
        Insert: {
          balance?: number | null
          id?: number
          name?: string | null
        }
        Update: {
          balance?: number | null
          id?: number
          name?: string | null
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
      Media: {
        Row: {
          creationTime: string
          description: string | null
          extension: string | null
          filename: string
          id: string
          latitude: number | null
          longitude: number | null
          owner: string | null
          path: string
        }
        Insert: {
          creationTime: string
          description?: string | null
          extension?: string | null
          filename: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner?: string | null
          path: string
        }
        Update: {
          creationTime?: string
          description?: string | null
          extension?: string | null
          filename?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner?: string | null
          path?: string
        }
      }
      Transactions: {
        Row: {
          account: number | null
          amount: number | null
          category: number | null
          date: string | null
          description: string | null
          id: number
        }
        Insert: {
          account?: number | null
          amount?: number | null
          category?: number | null
          date?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          account?: number | null
          amount?: number | null
          category?: number | null
          date?: string | null
          description?: string | null
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

