const API_URL = import.meta.env.VITE_RAWG_API_URL
const API_KEY = import.meta.env.VITE_RAWG_API_KEY
//esta función hace una consulta a la api, recibe el endpoint como parámetro y devuelve la respuesta en formato json
export const apiFetch = async (endpoint: string, signal?: AbortSignal) => {
    try {
        const separator = endpoint.includes("?") ? "&" : "?"
        //se hace la consulta a la api, se verifica que la respuesta sea correcta y se devuelve en formato json, si hay un error se muestra en consola
        const response = await fetch(`${API_URL}${endpoint}${separator}key=${API_KEY}`, { signal })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        //se devuelve la respuesta en formato json
        return await response.json()
    }catch (error) {
        //si hay un error se muestra en consola y se lanza el error para que pueda ser manejado por quien llame a esta función
        console.error('Error fetching data:', error)
        throw error
    }
}