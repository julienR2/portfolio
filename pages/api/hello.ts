import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { Database } from '@/types/supabase'

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()

  res.status(200).json({ email: user?.email ?? '' })
}
