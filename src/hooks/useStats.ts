import { useMemo } from "react"
import type { Game } from "../types/game"

export interface GenreStats {
    name: string
    count: number
    percentage: number
}

export interface StatusStats {
    status: string
    count: number
    label: string
}

export const useStats = (games: Game[]) => {
    
    // Géneros favoritos
    const favoriteGenres = useMemo(() => {
        const genreMap = new Map<string, number>()
        
        games.forEach(game => {
            if (game.genres && Array.isArray(game.genres)) {
                game.genres.forEach(genre => {
                    const count = genreMap.get(genre.name) || 0
                    genreMap.set(genre.name, count + 1)
                })
            }
        })
        
        const sorted = Array.from(genreMap.entries())
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / games.length) * 100)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 géneros
        
        return sorted
    }, [games])

    // Juegos por estado
    const statusBreakdown = useMemo(() => {
        const statusMap = new Map<string, number>()
        
        games.forEach(game => {
            const status = game.status || "sin-estado"
            const count = statusMap.get(status) || 0
            statusMap.set(status, count + 1)
        })
        
        const statuses: StatusStats[] = [
            { status: "playing", label: "Jugando", count: statusMap.get("playing") || 0 },
            { status: "completed", label: "Completado", count: statusMap.get("completed") || 0 },
            { status: "wishlist", label: "Deseado", count: statusMap.get("wishlist") || 0 },
            { status: "dropped", label: "Abandonado", count: statusMap.get("dropped") || 0 },
            { status: "sin-estado", label: "Sin estado", count: statusMap.get("sin-estado") || 0 }
        ].filter(s => s.count > 0)
        
        return statuses
    }, [games])

    // Últimos juegos añadidos (últimos 6)
    const recentGames = useMemo(() => {
        return [...games]
            .sort((a, b) => {
                const dateA = new Date(a.date_created || 0).getTime()
                const dateB = new Date(b.date_created || 0).getTime()
                return dateB - dateA
            })
            .slice(0, 6)
    }, [games])

    // Métricas totales
    const totalGames = games.length
    const totalGenres = favoriteGenres.length
    const averageGenresPerGame = games.length > 0
        ? (games.reduce((sum, game) => sum + (game.genres?.length || 0), 0) / games.length).toFixed(1)
        : "0"

    return {
        favoriteGenres,
        statusBreakdown,
        recentGames,
        totalGames,
        totalGenres,
        averageGenresPerGame
    }
}
