import type { Game } from '@/types/game'

export const getTotalGames = (library: Game[]) => library.length

export const getByStatus = (library: Game[]) => ({
    playing: library.filter(g => g.status === 'playing').length,
    completed: library.filter(g => g.status === 'completed').length,
    dropped: library.filter(g => g.status === 'dropped').length,
    wishlist: library.filter(g => g.status === 'wishlist').length,
})

export const getAverageRating = (library: Game[]) => {
    const rated = library.filter(g => g.rating != null)
    if (rated.length === 0) return null
    return rated.reduce((acc, g) => acc + (g.rating ?? 0), 0) / rated.length
}

export const getTopGenres = (library: Game[], limit = 5) => {
    const count: Record<string, number> = {}
    library.forEach(game => {
        game.genres?.forEach(genre => {
            const genreName = genre.name || `Genre-${genre.id}`
            count[genreName] = (count[genreName] ?? 0) + 1
        })
    })
    return Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, total]) => ({ name, total }))
}

export const getTopRatedGames = (library: Game[], limit = 5) => {
    return [...library]
        .filter(g => g.rating != null)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, limit)
}

export const getRecentGames = (library: Game[], limit = 5) => {
    return [...library]
        .sort((a, b) =>
            new Date(b.added_at ?? '').getTime() - new Date(a.added_at ?? '').getTime()
        )
        .slice(0, limit)
}

export const getTopPlatforms = (library: Game[], limit = 5) => {
    const count: Record<string, number> = {}
    library.forEach(game => {
        game.platforms?.forEach(p => {
            const name = p.platform.name
            count[name] = (count[name] ?? 0) + 1
        })
    })
    return Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, total]) => ({ name, total }))
}

export const getAveragePlaytime = (library: Game[]) => {
    const withPlaytime = library.filter(g => g.playtime != null && g.playtime > 0)
    if (withPlaytime.length === 0) return null
    return withPlaytime.reduce((acc, g) => acc + (g.playtime ?? 0), 0) / withPlaytime.length
}

export const getGamesByMonth = (library: Game[]) => {
    const count: Record<string, number> = {}
    library.forEach(game => {
        if (!game.added_at) return
        const month = game.added_at.slice(0, 7) // "2024-03"
        count[month] = (count[month] ?? 0) + 1
    })
    return Object.entries(count)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, total]) => ({ month, total }))
}