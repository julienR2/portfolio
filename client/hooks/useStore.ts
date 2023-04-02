import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ignoreList } from '../utils/store'

type State = {
  accessToken?: string
}

type Controls = {
  getItem: <K extends keyof State>(key: K) => State[K]
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
  flush: () => void
}

type StoreState = State & {
  controls: Controls
}

const DEFAULT_STATE: State = {
  accessToken: undefined,
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      controls: {
        getItem: (key) => get()[key],
        setItem: (key, value) => set({ [key]: value } as Partial<State>),
        flush: () => set(DEFAULT_STATE),
      },
    }),
    {
      name: 'nowmad-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ignoreList(['controls']),
    },
  ),
)

// State
export const useStoreItemValue = <K extends keyof State>(key: K): State[K] => {
  const itemSelector = React.useCallback(
    (state: StoreState) => state[key],
    [key],
  )

  return useStore(itemSelector)
}

// Controls
const controlsSelector = (state: StoreState) => state.controls

export const useStoreControls = () => {
  return useStore(controlsSelector)
}

// Utils
export const useStoreItem = <K extends keyof State>(
  key: K,
): [State[K], (value: State[K]) => void] => {
  const item = useStoreItemValue(key)
  const { setItem: setStoreItem } = useStoreControls()

  const setItem = React.useCallback(
    (value: State[K]) => setStoreItem(key, value),
    [key, setStoreItem],
  )

  return [item, setItem]
}
