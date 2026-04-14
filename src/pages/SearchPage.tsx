import { useState, useEffect } from "react";
import { searchGames, getGamesByGenre, getGamesByFilter } from "../services/gamesService";
import type { Game } from "../types/game";

import GameCard from "../components/ui/GameCard";
import GameCardSkeleton from "../components/ui/GameCardSkeleton";
import { useAuthStore } from "../store/authStore";
import { useLocation, Link } from "react-router-dom";
import { getGamesInLibrary } from "../services/gamesService";
import { MainPage } from "./MainPage";
import { FilterSidebar } from "../components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { useSearch } from "@/hooks/useSearch";




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
    const [showSidebarMobile, setShowSidebarMobile] = useState(false)
    const { games: searchResults, loading: searchLoading } = useSearch(query)
    
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            setSubmitted(true)
            setActiveGenre("")
            setActiveFilter("")
            setCurrentPage(1)
        }
    }

    const handleInputChange = (value: string) => {
        setQuery(value)
        setSubmitted(false)
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background con blur */}
            
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/blackbg.jpg')",
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

            {/* TOP SECTION: Botón de filtros + Buscador solo en mobile */}
            <div className="relative z-20 pt-[5rem]">
                <div className="md:hidden flex items-center gap-2 px-2 sm:px-4 py-3 border-b border-white/10">
                    <button 
                        onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                        className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded border border-white/20 hover:border-yellow-400 text-white hover:text-yellow-400 transition-colors whitespace-nowrap text-sm"
                        title="Filtros"
                    >
                        ☰ Filtros
                    </button>

                    {/* Buscador mobile */}
                    <div className="flex-1 min-w-0 relative">
                        <input
                            type="text"
                            placeholder="Buscar juego..."
                            value={query}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-2 sm:px-3 py-1.5 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-400"
                        />

                        {/* Dropdown de resultados */}
                        {query && !submitted && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white/20 rounded max-h-64 overflow-y-auto z-50">
                                {searchLoading && (
                                    <div className="p-3 text-white/50 text-sm">Cargando...</div>
                                )}
                                {!searchLoading && searchResults.length === 0 && (
                                    <div className="p-3 text-white/50 text-sm">Sin resultados</div>
                                )}
                                {!searchLoading && searchResults.length > 0 && (
                                    <ul className="divide-y divide-gray-900">
                                        {searchResults.map(game => (
                                            <Link key={game.id} to={`/game/${game.id}`} state={{ game }}>
                                                <li className="p-2 hover:bg-white/10 cursor-pointer transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        {game.background_image && (
                                                            <img
                                                                src={game.background_image}
                                                                alt={game.name}
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-xs text-white truncate">{game.name}</p>
                                                            <p className="text-xs text-white/50">{game.released}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dropdown Filtros Mobile - bajo el botón */}
                {showSidebarMobile && (
                    <div className="md:hidden bg-black/90 border-b border-white/10 overflow-y-auto max-h-[50vh] z-20">
                        <div className="p-4">
                            <FilterSidebar
                                onGenreSelect={(genre) => {
                                    handleGenreSelect(genre)
                                    setShowSidebarMobile(false)
                                }}
                                onFilterSelect={(filter) => {
                                    handleFilterSelect(filter)
                                    setShowSidebarMobile(false)
                                }}
                                activeGenre={activeGenre}
                                activeFilter={activeFilter}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex-1 flex gap-2 sm:gap-4 md:gap-6 px-2 sm:px-4 pt-[4rem] w-full min-w-0">
                    {submitted ? (
                        <div className="w-full flex gap-2 sm:gap-4 md:gap-6">
                            {/* Sidebar Desktop - hidden en móviles */}
                            <div className="hidden md:flex w-64 flex-shrink-0 sticky top-0 h-full overflow-y-auto">
                                <FilterSidebar
                                    onGenreSelect={handleGenreSelect}
                                    onFilterSelect={handleFilterSelect}
                                    activeGenre={activeGenre}
                                    activeFilter={activeFilter}
                                />
                            </div>

                            {/* Contenido SCROLLEABLE */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 w-full min-w-0 px-1 sm:px-2 md:px-4">
                                {!isLoading && gamesToDisplay.length > 0 && (
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{currentTitle}</h1>
                                )}

                                <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 sm:gap-2 md:gap-8">
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
                        </div>
                    ) : (
                        <div className="w-full flex gap-2 sm:gap-4 md:gap-6">
                            {/* Sidebar Desktop - hidden en móviles */}
                            <div className="hidden md:flex w-64 flex-shrink-0 sticky top-0 h-full overflow-y-auto">
                                <FilterSidebar
                                    onGenreSelect={handleGenreSelect}
                                    onFilterSelect={handleFilterSelect}
                                    activeGenre={activeGenre}
                                    activeFilter={activeFilter}
                                />
                            </div>
                            
                            {/* Contenido SCROLLEABLE */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 w-full min-w-0 px-1 sm:px-2">
                                <MainPage />
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )

}