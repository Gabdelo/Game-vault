import { useState, useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { useLibrary } from "../hooks/useLibrary"
import { Link } from "react-router-dom"
import { deleteGameFromLibrary, updateGameStatus } from "@/services/gamesService"
import directus from "@/api/directus"
import { readItems } from "@directus/sdk"
import { LibrarySidebar } from "@/components/LibrarySidebar"
import { LibraryStatusMenu } from "@/components/LibraryStatusMenu"
import CyberButton from "@/components/ui/CyberButton"
import GameCardSkeleton from "@/components/ui/GameCardSkeleton"

export const LibraryPage = () => {
    const user = useAuthStore(state => state.user)
    const id = user?.id || ""
    const { games, loading } = useLibrary(id)
    const [openMenu, setOpenMenu] = useState<number | null>(null)
    const [gamesList, setGamesList] = useState(games)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<"all" | "recent" | "favorites">("all")
    const [genres, setGenres] = useState<any[]>([])
    const [gameGenres, setGameGenres] = useState<Map<number, number[]>>(new Map())
    const [showSidebarMobile, setShowSidebarMobile] = useState(false)
    // Sincronizar gamesList cuando games carga
    useEffect(() => {
        setGamesList(games)
    }, [games])
    // Obtener géneros de las relaciones game_genres
    useEffect(() => {
        const fetchGameGenres = async () => {
            try {
                const ggItems = await directus.request(readItems("game_genres", {
                    fields: ["true_game_id", "genre_id"]
                }))
                
                const genreMap = new Map<number, number[]>()

                ggItems.forEach((item: any) => {
                    if (!genreMap.has(item.true_game_id)) {
                        genreMap.set(item.true_game_id, [])
                    }
                    genreMap.get(item.true_game_id)?.push(item.genre_id)
                })
                setGameGenres(genreMap)

                // Obtener géneros únicos
                const genresItems = await directus.request(readItems("genres", {
                    fields: ["id", "name"]
                }))
                setGenres(genresItems)
            } catch (error) {
                console.error("Error fetching genres:", error)
            }
        }
        fetchGameGenres()
    }, [])
    // Filtrar juegos según búsqueda, género, status y ordenamiento
    const filteredGames = gamesList.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase())
        const gameGenreIds = gameGenres.get(game.id) || []
        const matchesGenre = selectedGenre === null || gameGenreIds.includes(selectedGenre)
        const matchesStatus = selectedStatus === null || game.status === selectedStatus
        return matchesSearch && matchesGenre && matchesStatus
    }).sort((a, b) => {
        if (sortBy === "recent") {
            return new Date(b.date_created || 0).getTime() - new Date(a.date_created || 0).getTime()
        }
        if (sortBy === "favorites") {
            return (b.rating || 0) - (a.rating || 0)
        }
        return 0
    })
    const handleDeleteGame = async (gameId: number) => {
        if (!user?.id) return
        try {
            await deleteGameFromLibrary(gameId, user.id)
            setGamesList(gamesList.filter(g => g.id !== gameId))
            setOpenMenu(null)
        } catch (error) {
            console.error("Error al eliminar juego:", error)
        }
    }
    const handleChangeStatus = async (gameId: number, newStatus: string) => {
        if (!user?.id) return
        try {
            const status = newStatus as 'playing' | 'completed' | 'dropped' | 'wishlist' | null
            await updateGameStatus(gameId, user.id, status)
            // Actualizar el estado local
            setGamesList(gamesList.map(g => 
                g.id === gameId ? { ...g, status } : g
            ))
            setOpenMenu(null)
        } catch (error) {
            console.error("Error al cambiar status:", error)
        }
    }
    const getStatusColor = (status: string | null) => {
        switch(status) {
            case 'playing': return 'bg-blue-500'
            case 'completed': return 'bg-green-500'
            case 'wishlist': return 'bg-yellow-500'
            case 'dropped': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }
    const getStatusTooltip = (status: string | null) => {
        switch(status) {
            case 'playing': return 'Jugando'
            case 'completed': return 'Completado'
            case 'wishlist': return 'Deseado'
            case 'dropped': return 'Abandonado'
            default: return 'Sin estado'
        }
    }
    return (
        <div className="h-screen flex flex-col relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/80 z-0"></div>

            {/* TOP SECTION: Botón de filtros + Buscador (mobile) */}
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
                    <div className="flex-1 min-w-0">
                        <input
                            type="text"
                            placeholder="Buscar juego..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-400"
                        />
                    </div>
                </div>

                {/* Dropdown Filtros Mobile */}
                {showSidebarMobile && (
                    <div className="md:hidden bg-black/90 border-b border-white/10 overflow-y-auto max-h-[50vh] z-20">
                        <div className="p-4">
                            <LibrarySidebar
                                searchQuery=""
                                onSearchChange={() => {}}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                selectedStatus={selectedStatus}
                                onStatusChange={setSelectedStatus}
                                genres={genres}
                                selectedGenre={selectedGenre}
                                onGenreChange={setSelectedGenre}
                                hideSearch={true}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8 px-2 sm:px-4 md:px-8 pt-4">
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-wide text-white">
                            TU BIBLIOTECA
                        </h2>
                        <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                            {gamesList.length > 0
                                ? `${gamesList.length} juego${gamesList.length !== 1 ? "s" : ""} en tu colección`
                                : "Aquí podrás ver los juegos que has agregado a tu biblioteca."}
                        </p>
                    </div>
                    <Link to="/stats">      
                        <CyberButton variant="primary" accentColor="#FBFF00" className="mt-2 sm:mt-0 px-3 py-1 rounded-md text-xs sm:text-sm">
                            ANALÍTICAS
                        </CyberButton>
                    </Link>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 px-2 sm:px-4 md:px-8">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <GameCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && gamesList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <p className="text-lg font-medium">Tu biblioteca está vacía</p>
                        <p className="text-sm mt-1">Agrega juegos para verlos aquí</p>
                    </div>
                )}

                {/* Main content with sidebar */}
                {!loading && gamesList.length > 0 && (
                    <div className="flex gap-4 md:gap-8 overflow-hidden flex-1">
                        {/* Sidebar Desktop - hidden en móviles */}
                        <div className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-full overflow-y-auto">
                            <LibrarySidebar
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                selectedStatus={selectedStatus}
                                onStatusChange={setSelectedStatus}
                                genres={genres}
                                selectedGenre={selectedGenre}
                                onGenreChange={setSelectedGenre}
                            />
                        </div>

                        {/* GRID - Games display */}
                        <div className="flex-1 overflow-y-auto pb-8 px-2 sm:px-4">
                        {filteredGames.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                                <p className="text-lg">No se encontraron juegos</p>
                                <p className="text-sm mt-1">Intenta ajustar los filtros</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filteredGames.map(game => (
                                    <Link key={game.id} to={`/game/${game.id}`} state={{ game }}>

                                        <div className="group cursor-pointer flex flex-col gap-2">
                                            {/* Cover image */}
                                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl">
                                                <img
                                                    src={game.background_image || "https://placehold.co/300x400"}
                                                    alt={game.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {/* Status indicator circle */}
                                                <div className="absolute top-3 left-3 w-4 h-4 rounded-full shadow-lg ring-2 ring-black/30 hover:w-5 hover:h-5 transition-all group:cursor-pointer peer" title={getStatusTooltip(game.status ?? null)}>
                                                    <div className={`w-full h-full rounded-full ${getStatusColor(game.status ?? null)}`}></div>
                                                    {/* Tooltip */}
                                                    <div className="absolute left-6 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                        {getStatusTooltip(game.status ?? null)}
                                                    </div>
                                                </div>
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-between p-4 rounded-xl">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setOpenMenu(openMenu === game.id ? null : game.id)
                                                        }}
                                                        className="self-end text-white text-xl hover:scale-125 transition-transform"
                                                    >
                                                        ⋯
                                                    </button>
                                                    <p className="text-white font-semibold text-sm text-center px-3 leading-tight">
                                                        {game.name}
                                                    </p>
                                                    {/* Menu desplegable */}
                                                    {openMenu === game.id && (
                                                        <LibraryStatusMenu
                                                            gameId={game.id}
                                                            currentStatus={game.status ?? null}
                                                            onStatusChange={handleChangeStatus}
                                                            onDelete={handleDeleteGame}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Game info */}
                                            <div className="text-sm">
                                                <h3 className="text-gray-200 font-medium line-clamp-2">{game.name}</h3>
                                                {game.rating && (
                                                    <p className="text-yellow-400 text-xs">⭐ {game.rating.toFixed(1)}</p>
                                                )}
                                            </div>
                                        </div>
                                   
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    </div>
                )}
            </div>
        </div>
    )
}