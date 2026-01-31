import { useAuth } from '~/composables/useAuth'

export const useApi = () => {
  const auth = useAuth()

  const fetchWithAuth = async (url: string, options: any = {}) => {
    try {
      return await $fetch(url, {
        ...options,
        credentials: 'include', 
      })
    } catch (err: any) {

      if (err?.response?.status === 401) {
        try {

          await auth.refreshToken()


          return await $fetch(url, {
            ...options,
            credentials: 'include',
          })
        } catch (refreshErr) {
          // console.log('Refresh failed, redirecting to login')
          window.location.href = '/'
          throw refreshErr
        }
      }
      throw err
    }
  }

  return { fetchWithAuth }
}