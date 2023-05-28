import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'

import { Database } from '@/types/supabase'

export const publicPageProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx)

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      props: {
        initialSession: session,
      },
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return { props: {} }
}
