import { useState, useEffect } from "react"
import type { Game } from "../types/game"
import { getGamesByFilter } from "../services/gamesService"

export const useGames = (filter: string) => {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchGames = async () => {
            const data = await getGamesByFilter(filter)
            setGames(data.results)
            setLoading(false)
        }
        fetchGames()
    }, [filter])

    return { games, loading }
}