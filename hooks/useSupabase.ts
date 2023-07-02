import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetResult } from '@supabase/postgrest-js/src/select-query-parser'
import React from 'react'

import { Database } from '@/types/supabase'

export const useSupabaseSelect = <
  FROM extends keyof Database['public']['Tables'],
  QUERY extends string = '*',
>(
  from: FROM,
  select?: QUERY,
  lazy = false,
) => {
  const [data, setData] =
    React.useState<
      GetResult<
        Database['public'],
        Database['public']['Tables'][FROM]['Row'],
        [],
        QUERY
      >[]
    >()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<any>()
  const supabaseClient = useSupabaseClient<Database>()

  const query = React.useCallback(async () => {
    setLoading(true)

    try {
      const res = await supabaseClient.from(from).select(select)

      if (res.error) throw res.error

      setData(res.data as unknown as typeof data)
      setError(undefined)
    } catch (error) {
      setData(undefined)
      setError(error)
    }

    setLoading(false)
  }, [supabaseClient, from, select])

  React.useEffect(() => {
    if (lazy) return

    query()
  }, [lazy, query])

  return {
    data,
    query,
    loading,
    error,
  }
}
