const BASE_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL ?? "http://localhost:8055"
const DIRECTUS_URL = import.meta.env.DEV ? `${window.location.origin}/api` : BASE_URL

import { createDirectus, rest, authentication } from "@directus/sdk"

// Configuración de Directus con autenticación personalizada usando localStorage
export const directus = createDirectus(DIRECTUS_URL)
// Configuramos la autenticación para que use localStorage para guardar el token y refrescarlo automáticamente
  .with(authentication("json", {
    autoRefresh: true,
    // Implementamos la lógica de almacenamiento personalizada para guardar el token en localStorage
    storage: {
      get: () => {
        const data = localStorage.getItem("directus_auth")
        return data ? JSON.parse(data) : null
      },
      // Cuando se establece un nuevo token, lo guardamos en localStorage. Si se establece a null, lo eliminamos.
      set: (data) => {
        if (data) {
          localStorage.setItem("directus_auth", JSON.stringify(data))
        } else {
          localStorage.removeItem("directus_auth")
        }
      },
    },
  }))
  .with(rest())

export default directus