import { directus, directusPublic } from "../api/directus"
import { registerUser } from "@directus/sdk"

export const register = async (username: string, email: string, password: string) => {
  try {
    const result = await directusPublic.request(registerUser(email, password, {first_name: username,}))
    console.log("Registered user:", result)
    return result
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export const login = async (email: string, password: string) => {
  return directus.login({ email: email, password: password })
}

