import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { createClient } from '@supabase/supabase-js'

import { Database } from '../../../types/supabase'

export const supabase = createClient<Database>(
  Constants.expoConfig.extra.SUPABASE_URL || '',
  Constants.expoConfig.extra.SUPABASE_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false,
      persistSession: true,
    },
  },
)
