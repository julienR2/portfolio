import React from 'react'

import { supabase } from '../../../libs/supabase'
import { DatabaseRow } from '../../../../../types/utils'

export const useRemoteMedia = () => {
  const [media, setMedia] = React.useState<DatabaseRow<'Media'>[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    async function fetchRemotePhotos() {
      setLoading(true)

      try {
        const { data } = await supabase
          .from('Media')
          .select('*', { count: 'exact' })
          .order('creationTime', { ascending: false })
          .range(0, 10)

        console.log('data', data)
        setMedia(data || [])
      } catch (error) {}

      setLoading(false)
    }

    fetchRemotePhotos()
  }, [])

  return { media, loading }
}
