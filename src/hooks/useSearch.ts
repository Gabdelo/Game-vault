import { useState, useEffect, useRef } from "react";
import type { Game } from "../types/game";
import { searchGames } from "../services/gamesService";

export const useSearch = (GameName:string) => {

    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    //referencia para cancelar la peticion anterior
    const abortController =  useRef<AbortController | null>(null)

    useEffect(() => {
        //si lo dejaramos vacio  se haria una peticion por default, lo que no es deseable
        if (GameName.trim().length < 1) {
            setGames([])
            return
        } 
        const timeout = setTimeout(async() => {
            abortController.current?.abort() //cancelamos la peticion anterior
            const controller = new AbortController() //creamos una nueva instancia de AbortController
            abortController.current = controller //asignamos la nueva instancia a la referencia
            try{
                setLoading(true)
                const data = await searchGames(GameName, controller.signal) //pasamos la señal de abort a la funcion de busqueda
                setGames(data.results)
            } catch (error) {
                console.error("Error fetching games:", error)
            } finally {
                setLoading(false)
            }
        }, 400) //debounce de 400ms para evitar hacer una peticion por cada letra que se escriba

        return () => clearTimeout(timeout) //si el usuario escribe algo antes de que se cumpla el timeout, se cancela el timeout anterior para evitar hacer una peticion innecesaria
    }, [GameName])
    return { games, loading }
}