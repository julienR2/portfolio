'use client'

import React from 'react'

const IS_SERVER = typeof window === 'undefined'

export const createStore = <STORE extends { [key: string]: any }>(
  id: string,
  defaultStore: STORE,
) => {
  let data = defaultStore as STORE
  let hydrated = false

  const listeners = {} as Record<keyof STORE, Array<(value: any) => void>>

  const persistData = () => {
    window.localStorage.setItem(id, JSON.stringify(data))
  }

  const setListeners = <KEY extends keyof STORE>(
    key: KEY,
    fn: (value: STORE[KEY]) => void,
  ) => {
    listeners[key] = [...(listeners[key] || []), fn]

    return () => {
      listeners[key] = listeners[key].filter((callback) => callback === fn)
    }
  }

  const setStoreItem = <KEY extends keyof STORE>(
    key: KEY,
    value: STORE[KEY],
  ) => {
    data[key] = value

    listeners[key].forEach((listener) => listener(value))

    persistData()
  }

  const hydrate = () => {
    if (IS_SERVER) return

    const localStore = window.localStorage.getItem(id)

    if (!localStore) {
      persistData()
    } else {
      data = JSON.parse(localStore)

      Object.keys(data).forEach((key) => {
        listeners[key]?.forEach((listener) => listener(data[key]))
      })
    }
  }

  return { data, setListeners, setStoreItem, hydrate, hydrated }
}

export const useStoreItem = <
  STORE extends ReturnType<typeof createStore>,
  KEY extends keyof STORE['data'],
>(
  store: STORE,
  key: KEY,
): [
  STORE['data'][KEY],
  (
    fnValue:
      | ((prevValue: STORE['data'][KEY]) => STORE['data'][KEY])
      | STORE['data'][KEY],
  ) => void,
] => {
  React.useEffect(() => {}, [store])
  const [value, setValue] = React.useState<STORE['data'][KEY]>(
    store.data[key as string],
  )

  const onValueChange = React.useCallback((newValue: STORE['data'][KEY]) => {
    setValue(newValue)
  }, [])

  const setItem = React.useCallback(
    (
      fnValue:
        | ((prevValue: STORE['data'][KEY]) => STORE['data'][KEY])
        | STORE['data'][KEY],
    ) => {
      let newValue = fnValue

      if (typeof fnValue === 'function') {
        newValue = (
          fnValue as (prevValue: STORE['data'][KEY]) => STORE['data'][KEY]
        )(value)
      }

      store.setStoreItem(key as string, newValue)
    },
    [key, store, value],
  )

  React.useEffect(() => {
    const removeListener = store.setListeners(key as string, onValueChange)

    setValue(store.data[key as string])

    return () => {
      removeListener()
    }
  }, [store, key, onValueChange])

  React.useEffect(() => {
    if (store.hydrated) return

    store.hydrate()
  }, [store, key])

  return [value, setItem]
}
