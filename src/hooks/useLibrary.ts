import { useState, useEffect, useRef } from "react";
import type { Game } from "../types/game";
import { getFullLibraryGames } from "../services/gamesService";

export const useLibrary = (userId: string) => {

    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        if (!userId || userId === " ") {
            setGames([])
            setLoading(false)
            return
        }
        const fetchGames = async () => {
            const data = await getFullLibraryGames(userId)
            setGames(data.results)
            setLoading(false)
        }
        fetchGames()

    }, [userId])
    return { games, loading }
}