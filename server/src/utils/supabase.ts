import { createClient } from '@supabase/supabase-js'

import { Database } from '../../../types/supabase'

export const supabaseService = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      supabase: typeof supabaseService
    }
  }
}
