import { create } from 'zustand'
import directus from '../api/directus'
import { readMe, refresh, createItem } from '@directus/sdk'
import {login} from '../services/authService'
import {register} from '../services/authService'
import { useLibraryStore } from './libraryStore'

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
          await directus.request(refresh(parsed.refresh_token))
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
    const me = await directus.request(readMe())
    await useLibraryStore.getState().fetchLibrary(me.id)
    // Después de iniciar sesión, actualizamos los datos del usuario pero claro generara otro rederizado, lo que no es ideal, pero es la forma más sencilla de mantener el estado sincronizado con Directus
    await get().refreshUser()
  },

  authRegister: async (username, email, password) => {
    console.log('🔐 Iniciando registro:', { username, email })
    try {
      await register(username, email, password)
      console.log('✅ Registro exitoso')
      
      await get().authLogin(email, password)
      console.log('✅ Login automático exitoso')
      
      const me = await directus.request(readMe())
      console.log('✅ User data recuperado:', me)
      
      await directus.request(createItem("user_profiles", {
            user_id: me.id,
            username: me.first_name,
            is_public: true
        }))
      console.log('✅ user_profiles creado')
    } catch (error) {
      console.error('❌ Error en registro:', error)
      throw error
    }
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