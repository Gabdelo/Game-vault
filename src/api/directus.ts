const BASE_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL ?? "http://localhost:8055"
const DIRECTUS_URL = import.meta.env.DEV ? `${window.location.origin}/api` : BASE_URL

import { createDirectus, rest, authentication } from "@directus/sdk"


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

export default directus