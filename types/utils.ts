import { Database } from './supabase'

export type DatabaseRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type DatabaseInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type DatabaseUpdate<T extends keyof Database['public']['Tables']> =
Database['public']['Tables'][T]['Update']
