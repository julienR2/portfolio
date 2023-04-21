import { createClient } from '@supabase/supabase-js'

import { Database } from '../../../types/supabase'
import { env } from '../constants'

export const supabaseService = createClient<Database>(
  env.SUPABASE_URL || '',
  env.SUPABASE_SERVICE_KEY || '',
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      supabase: typeof supabaseService
    }
  }
}
