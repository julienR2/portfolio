import { cookies, headers } from 'next/headers'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'

const supabaseService = createServerComponentSupabaseClient({
  supabaseKey: process.env.SUPABASE_SERVICE_KEY,
  cookies,
  headers,
})

export default supabaseService
