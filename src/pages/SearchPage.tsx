import { useState, useEffect } from "react";
import { searchGames, getGamesByGenre, getGamesByFilter } from "../services/gamesService";
import type { Game } from "../types/game";

import GameCard from "../components/ui/GameCard";
import GameCardSkeleton from "../components/ui/GameCardSkeleton";
import { useAuthStore } from "../store/authStore";
import { useLocation } from "react-router-dom";
import { getGamesInLibrary } from "../services/gamesService";
import { MainPage } from "./MainPage";
import { FilterSidebar } from "../components/FilterSidebar";
import { Pagination } from "@/components/Pagination";




export const SearchPage = () => {
    const location = useLocation()
    
    const user = useAuthStore(state => state.user)
    const [query, setQuery] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const [libraryGameIds, setLibraryGameIds] = useState<Set<number>>(new Set())
    
    const [activeGenre, setActiveGenre] = useState<string>("")
    const [activeFilter, setActiveFilter] = useState<string>("")
    const [filteredGames, setFilteredGames] = useState<Game[]>([])
    const [filterLoading, setFilterLoading] = useState(false)
    
    // Paginación para búsqueda
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [paginatedGames, setPaginatedGames] = useState<Game[]>([])

    // Cargar desde location.state (búsqueda)
    useEffect(() => {
        if (location.state?.query) {
            setQuery(location.state.query)
            setSubmitted(location.state.submitted || true)
            setActiveGenre("")
            setActiveFilter("")
            setCurrentPage(1)
        }
    }, [location.state])

    // Cuando navega a "/" (home), mostrar MainPage
    useEffect(() => {
        if (location.pathname === "/") {
            setSubmitted(false)
            setQuery("")
        }
    }, [location.pathname])

    // Cargar juegos paginados cuando se busca
    useEffect(() => {
        if (submitted && query.trim() && !activeGenre && !activeFilter) {
            const fetchPaginatedGames = async () => {
                setFilterLoading(true)
                try {
                    const data = await searchGames(query, currentPage)
                    setPaginatedGames(data.results)
                    // RAWG devuelve "count" (total de resultados)
                    const pages = Math.ceil((data.count || 0) / 20)
                    setTotalPages(Math.max(1, pages))
                } catch (error) {
                    console.error("Error fetching paginated games:", error)
                } finally {
                    setFilterLoading(false)
                }
            }
            fetchPaginatedGames()
        }
    }, [submitted, query, currentPage, activeGenre, activeFilter])

    // Cargar juegos paginados cuando hay filtros activos
    useEffect(() => {
        if (submitted && (activeGenre || activeFilter)) {
            const fetchFilteredPaginatedGames = async () => {
                setFilterLoading(true)
                try {
                    let data
                    if (activeGenre) {
                        data = await getGamesByGenre(activeGenre, currentPage)
                    } else {
                        data = await getGamesByFilter(activeFilter, currentPage)
                    }
                    setFilteredGames(data.results)
                    const pages = Math.ceil((data.count || 0) / 20)
                    setTotalPages(Math.max(1, pages))
                } catch (error) {
                    console.error("Error fetching filtered paginated games:", error)
                } finally {
                    setFilterLoading(false)
                }
            }
            fetchFilteredPaginatedGames()
        }
    }, [submitted, currentPage, activeGenre, activeFilter])

    // Obtener juegos en la librería del usuario
    useEffect(() => {
        if (user?.id) {
            const fetchLibraryGames = async () => {
                const libraryItems = await getGamesInLibrary(user.id)
                const ids = new Set(libraryItems.map(item => item.game_id))
                setLibraryGameIds(ids)
            }
            fetchLibraryGames()
        }
    }, [user?.id])

    // Manejar filtros de género
    const handleGenreSelect = async (genre: string) => {
        setActiveGenre(genre)
        setActiveFilter("")
        setSubmitted(true)
        setCurrentPage(1) // Reset a página 1
        setTotalPages(1)
        
        if (genre === "") {
            setFilteredGames([])
            return
        }

        setFilterLoading(true)
        try {
            const data = await getGamesByGenre(genre, 1)
            setFilteredGames(data.results)
            const pages = Math.ceil((data.count || 0) / 20)
            setTotalPages(Math.max(1, pages))
        } catch (error) {
            console.error("Error fetching games by genre:", error)
        } finally {
            setFilterLoading(false)
        }
    }

    // Manejar filtros rápidos
    const handleFilterSelect = async (filter: string) => {
        setActiveFilter(filter)
        setActiveGenre("")
        setSubmitted(true)
        setCurrentPage(1) // Reset a página 1
        setTotalPages(1)

        if (filter === "") {
            setFilteredGames([])
            return
        }

        setFilterLoading(true)
        try {
            const data = await getGamesByFilter(filter, 1)
            setFilteredGames(data.results)
            const pages = Math.ceil((data.count || 0) / 40)
            setTotalPages(Math.max(1, pages))
        } catch (error) {
            console.error("Error fetching games by filter:", error)
        } finally {
            setFilterLoading(false)
        }
    }

    // Determinar qué juegos mostrar
    const gamesToDisplay = activeGenre || activeFilter ? filteredGames : paginatedGames
    const isLoading = activeGenre || activeFilter ? filterLoading : filterLoading
    const currentTitle = activeGenre 
        ? `Género: ${activeGenre.toUpperCase()}`
        : activeFilter
        ? `${activeFilter === 'rating' ? 'Más valorados' : activeFilter === 'added' ? 'Populares' : activeFilter === 'released' ? 'Más recientes' : 'Según crítica'}`
        : `Resultados de búsqueda: ${query.toUpperCase()}`
    
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        // Scroll al top
        document.querySelector(".flex-1.overflow-y-auto.pt-8")?.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background con blur */}
            
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    filter: 'blur(8px)',
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)' // Capa oscura para mejorar contraste
                }}
            />
            

            {/* Overlay oscuro opcional para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Contenido */}
            <div className="relative z-10 h-[calc(100vh-100px)] flex gap-6 px-4 pt-[3rem]">
                {submitted ? (
                    <>
                        {/* Sidebar FIJO */}
                        <div className="w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                            <FilterSidebar
                                onGenreSelect={handleGenreSelect}
                                onFilterSelect={handleFilterSelect}
                                activeGenre={activeGenre}
                                activeFilter={activeFilter}
                            />
                        </div>

                        {/* Contenido SCROLLEABLE */}
                        <div className="flex-1 overflow-y-auto pt-8">
                            {!isLoading && gamesToDisplay.length > 0 && (
                                <h1 className="text-4xl font-bold text-white">{currentTitle}</h1>
                            )}

                            <div className="flex flex-wrap gap-4">
                                {isLoading && (
                                    <>
                                        {[...Array(8)].map((_, i) => (
                                            <GameCardSkeleton key={`skeleton-${i}`} />
                                        ))}
                                    </>
                                )}

                                {!isLoading && gamesToDisplay.map(game => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        userId={user?.id}
                                        isInLibrary={libraryGameIds.has(game.id)}
                                        onAddToLibrary={() => setLibraryGameIds(new Set([...libraryGameIds, game.id]))}
                                    />
                                ))}
                            </div>

                            {!isLoading && gamesToDisplay.length === 0 && (
                                <p className="text-center text-gray-400 mt-4">No se encontraron juegos</p>
                            )}

                            {/* Paginación - para búsquedas y filtros */}
                            {submitted && totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    isLoading={filterLoading}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Sidebar FIJO */}
                        <div className="w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                            <FilterSidebar
                                onGenreSelect={handleGenreSelect}
                                onFilterSelect={handleFilterSelect}
                                activeGenre={activeGenre}
                                activeFilter={activeFilter}
                            />
                        </div>
                        {/* Contenido SCROLLEABLE */}
                        <div className="flex-1 overflow-y-auto pt-8">
                            <MainPage />
                        </div>
                    </>
                )}
            </div>
        </div>
    )

}