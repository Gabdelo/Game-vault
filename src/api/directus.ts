import { createDirectus, rest, authentication } from "@directus/sdk"

const DIRECTUS_URL = import.meta.env.DEV 
  ? `${window.location.origin}/api`
  : "https://directus-latest-i2px.onrender.com"

// ─── Cliente con autenticación (para login, datos del usuario, etc.) ───
export const directus = createDirectus(DIRECTUS_URL)
  .with(authentication("json", {
    autoRefresh: true,
    storage: {
      get: () => {
        const data = localStorage.getItem("directus_auth")
        return data ? JSON.parse(data) : null
      },
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

// ─── Cliente sin autenticación (para registro público) ───
export const directusPublic = createDirectus(DIRECTUS_URL)
  .with(rest())

export default directus