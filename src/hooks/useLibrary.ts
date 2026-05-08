import { useState, useEffect } from "react";
import type { Game } from "../types/game";
import { getUserLibrary } from "../services/gamesService";

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
            const data = await getUserLibrary(userId)
            setGames(data)
            setLoading(false)
        }
        fetchGames()

    }, [userId])
    return { games, loading }
}