import { useState, useEffect } from "react"
import type { Game } from "../types/game"
import { getGamesByFilters, type GameFilters } from "../services/gamesService"

export const useGames = (filters: GameFilters) => {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchGames = async () => {
            try {
                const data = await getGamesByFilters(filters)
                setGames(data.results)
            } catch (error) {
                console.error("Error fetching games:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchGames()
    }, [JSON.stringify(filters)])

    return { games, loading }
}