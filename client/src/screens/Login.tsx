import React from 'react'
import { Image, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

import { useStoreItem } from '../hooks/useStore'
import { supabase } from '../libs/supabase'

const Login = () => {
  const [email, setEmail] = React.useState('julien.rougeron@gmail.com')
  const [password, setPassword] = React.useState('KITnow23*')
  const [isSecure, setIsSecure] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [, setAccessToken] = useStoreItem('accessToken')

  const onSubmit = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      setAccessToken(data.session.access_token)
    } catch (error) {
      console.log('error', error)
    }

    setIsLoading(false)
  }, [email, password, setAccessToken])

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 300,
        alignSelf: 'center',
      }}>
      <Image
        style={{ width: 100, height: 100, marginBottom: 72 }}
        source={require('../../assets/icon.png')}
      />
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        style={{ marginBottom: 12, width: '100%' }}
      />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={isSecure}
        right={
          <TextInput.Icon
            icon="eye"
            onPress={() => setIsSecure((prev) => !prev)}
          />
        }
        style={{ marginBottom: 48, width: '100%' }}
      />
      <Button
        mode="contained"
        uppercase
        style={{
          borderRadius: 4,
          marginBottom: 72,
        }}
        onPress={onSubmit}
        disabled={isLoading}
        loading={isLoading}>
        Submit
      </Button>
    </View>
  )
}

export default Login
