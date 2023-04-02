import 'react-native-url-polyfill/auto'

import Config from 'react-native-config'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Database } from '../../types/supabase'

export const supabase = createClient<Database>(
  Config.SUPABASE_URL,
  Config.SUPABASE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false,
      persistSession: true,
    },
  },
)
