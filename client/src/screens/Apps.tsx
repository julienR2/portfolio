import React from 'react'

import { supabase } from '../libs/supabase'
import { useStoreItem } from '../hooks/useStore'

import Media from './Media'

const Apps = () => {
  const [, setAccessToken] = useStoreItem('accessToken')

  React.useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      console.log('user', data)

      if (data.user) return

      setAccessToken(undefined)
    }

    fetchUser()
  })
  return <Media />
}

export default Apps
