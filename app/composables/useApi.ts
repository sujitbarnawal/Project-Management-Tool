import { useAuth } from '~/composables/useAuth'

export const useApi = () => {
  const auth = useAuth()

  // Generic wrapper for $fetch
  const fetchWithAuth = async (url: string, options: any = {}) => {
    try {
      return await $fetch(url, {
        ...options,
        credentials: 'include', // include cookies
      })
    } catch (err: any) {
      // If 401 → token expired
      if (err?.response?.status === 401) {
        try {
          // Refresh the token
          await auth.refreshToken()

          // Retry the original request
          return await $fetch(url, {
            ...options,
            credentials: 'include',
          })
        } catch (refreshErr) {
          console.log('Refresh failed, redirecting to login')
          window.location.href = '/'
          throw refreshErr
        }
      }
      throw err
    }
  }

  return { fetchWithAuth }
}