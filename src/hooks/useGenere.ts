import { useState, useEffect } from "react";
import type { Game } from "../types/game";
import { getGamesByGenre } from "../services/gamesService";

export const useGenere = (genre: string) => {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchGames = async () => {
            const data = await getGamesByGenre(genre)
            setGames(data.results)
            setLoading(false)
        }
        fetchGames()
    }, [genre])

    return { games, loading }
}