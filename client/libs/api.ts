import { useStore } from '../hooks/useStore'

export const BASE_URL = __DEV__
  ? 'http://nowmad.io:5000/api'
  : 'https://nowmad.io/api'

type Request = (
  url: string,
  params?: object,
  customHeaders?: object,
  bodyParse?: (x: any) => any,
) => Promise<any>

type Api = { get: Request; post: Request }

const api = ['get', 'post'].reduce<Api>(
  (acc, method) => ({
    ...acc,
    [method]: async (
      url: string,
      params: Record<string, string>,
      customHeaders = {},
      bodyParse = JSON.stringify,
    ) => {
      const isExternal = url.startsWith('http')

      const fullUrl = isExternal ? url : BASE_URL + url

      const accessToken = useStore.getState().accessToken

      const headers = isExternal
        ? customHeaders
        : {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
            ...customHeaders,
          }

      const query =
        method === 'get' && params
          ? '?' + new URLSearchParams(params).toString()
          : ''

      const body = method === 'post' ? bodyParse(params) : undefined

      const res = await fetch(fullUrl + query, {
        method: method.toUpperCase(),
        headers,
        body,
      })

      if (isExternal) return res

      if (res.status === 401) {
        useStore.setState({ accessToken: undefined })
        return
      }

      return res.json()
    },
  }),
  {} as Api,
)

export default api
