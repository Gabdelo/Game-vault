import { useState, useEffect } from "react"

interface UseLibraryFilteringProps {
    library: any[]
    filters: any
    searchQuery: string
    gamesPerPage: number
}

export const useLibraryFiltering = ({
    library,
    filters,
    searchQuery,
    gamesPerPage
}: UseLibraryFilteringProps) => {
    const [currentPage, setCurrentPage] = useState(1)

    // Obtener juegos filtrados del store
    const storeFilteredGames = Array.isArray(library) ? library : []

    // Aplicar búsqueda local
    const filteredGames = storeFilteredGames.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Paginación
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
    const startIdx = (currentPage - 1) * gamesPerPage
    const endIdx = startIdx + gamesPerPage
    const paginatedGames = filteredGames.slice(startIdx, endIdx)

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [filters, searchQuery])

    return {
        currentPage,
        setCurrentPage,
        filteredGames,
        paginatedGames,
        totalPages
    }
}
