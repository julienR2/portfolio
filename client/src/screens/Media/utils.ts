import { supabase } from '../../libs/supabase'

export const getUriFromPath = async (path: string) => {
  const user = await supabase.auth.getUser()
  console.log('user', user)

  return path
}
