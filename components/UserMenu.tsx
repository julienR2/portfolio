import { Avatar, Menu, UnstyledButton } from '@mantine/core'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { IconPower, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const getInitials = (email?: string) => {
  if (!email) return 'Fo'

  if (email.includes('.')) {
    const [name, surname] = email.split('.')
    console.log('name', name, surname)
    return `${name[0]}${surname[0]}`.toUpperCase()
  }

  return email[0].toUpperCase() + email[1]
}

const UserMenu = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  const onLogout = React.useCallback(async () => {
    await supabaseClient.auth.signOut()
  }, [supabaseClient])

  return (
    <Menu position='bottom-end'>
      <Menu.Target>
        <UnstyledButton>
          <Avatar radius='xl'>{getInitials(user?.email)}</Avatar>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href='/profile'
          icon={<IconUser size={16} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          icon={<IconPower size={16} />}
          color='red'
          onClick={onLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default React.memo(UserMenu)
