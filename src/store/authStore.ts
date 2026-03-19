import { create } from 'zustand'
import directus from '../api/directus'
import { readMe, refresh } from '@directus/sdk'
import {login} from '../services/authService'
import {register} from '../services/authService'

type User = {
  id: string
  email: string
  first_name?: string
}

type AuthStore = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean

  initAuth: () => Promise<void>
  authLogin: (email: string, password: string) => Promise<void>
  authRegister: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({

  user: null,
  loading: true,
  isAuthenticated: false,

  initAuth: async () => {
    try {
      const authData = localStorage.getItem('directus_auth')

      if (!authData) {
        set({ loading: false, isAuthenticated: false })
        return
      }

      const parsed = JSON.parse(authData)

      if (!parsed?.refresh_token && !parsed?.access_token) {
        set({ loading: false, isAuthenticated: false })
        return
      }

      // Si hay token, está autenticado
      set({ isAuthenticated: true })

      // Intenta refrescar el token
      if (parsed?.refresh_token) {
        try {
          await directus.request(refresh('json', parsed.refresh_token))
        } catch (error) {
          console.warn('Token refresh failed:', error)
        }
      }

      // Solo intenta cargar datos si hay token válido
      try {
        await get().refreshUser()
      } catch (error) {
        console.warn('Could not refresh user data:', error)
      } finally {
        set({ loading: false })
      }

    } catch (error) {
      console.error('Init auth error:', error)
      set({ user: null, loading: false, isAuthenticated: false })
    }
  },

  refreshUser: async () => {
    try {
      const me = await directus.request(
        readMe({
          fields: ['id', 'email', 'first_name', 'last_name']
        })
      )

      set({
        user: me as User,
        isAuthenticated: true,
        loading: false
      })

    } catch (error) {
      console.warn('Could not refresh user data:', error)
      // No desautentica si ya estaba autenticado
      // Solo intenta actualizar los datos del usuario
      set({ loading: false })
    }
  },

  authLogin: async (email, password) => {
    await login(email, password)
    // Después de iniciar sesión, actualizamos los datos del usuario pero claro generara otro rederizado, lo que no es ideal, pero es la forma más sencilla de mantener el estado sincronizado con Directus
    await get().refreshUser()
  },

  authRegister: async (username, email, password) => {
    await register(username, email, password)
    await get().authLogin(email, password)
  },

  logout: async () => {
    try {
      await directus.logout()
    } catch {}

    localStorage.removeItem('directus_auth')

    set({
      user: null,
      isAuthenticated: false
    })
  }

}))