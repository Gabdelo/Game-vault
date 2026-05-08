import { useState, useEffect } from "react"
import directus from "@/api/directus"
import { readItems } from "@directus/sdk"
import { LibrarySidebar } from "@/components/library/LibrarySidebar"
import { LibraryGameCard } from "@/components/library/LibraryGameCard"
import { LibraryHeader } from "@/components/library/LibraryHeader"
import GameCardSkeleton from "@/components/ui/GameCardSkeleton"
import { Pagination } from "@/components/ui/Pagination"
import { useLibraryStore } from "@/store/libraryStore"
import { updateGameStatus } from "@/services/gamesService"
import { useAuthStore } from "@/store/authStore"
import { usePageTitle } from '@/hooks/usePageTitle'
import { useLibraryFiltering } from "@/hooks/useLibraryFiltering"
import { useDropdownState } from "@/hooks/useDropdownState"

const GAMES_PER_PAGE = 20
const SKELETON_IDS = Array.from({ length: GAMES_PER_PAGE }).map((_, i) => `skeleton-${i}`)

export const LibraryPage = () => {
     useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const { library, loading, filters, setFilter, clearFilters, getFilteredLibrary } = useLibraryStore()
    
    // Estados locales
    const user = useAuthStore((state) => state.user)
    
    // Estados
    const [hoverGameImage, setHoverGameImage] = useState<string | null>(null)
    const [genres, setGenres] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    
    // Dropdowns
    const { toggleDropdown, isOpen } = useDropdownState()
    
    // Filtrado y paginación
    const { currentPage, setCurrentPage, filteredGames, paginatedGames, totalPages } = 
        useLibraryFiltering({
            library: getFilteredLibrary(),
            filters,
            searchQuery,
            gamesPerPage: GAMES_PER_PAGE
        })

    usePageTitle("Mi Biblioteca")

    // Fetch genres al montar
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genresData = await directus.request(readItems("genres", {
                    fields: ["id", "name", "slug"]
                }))
                setGenres(genresData)
            } catch (error) {
                console.error("Error fetching genres:", error)
            }
        }
        fetchGenres()
    }, [])
     

    // Handlers
    const handleChangeStatus = (gameId: number, newStatus: string) => {
        const status = newStatus as 'playing' | 'completed' | 'dropped' | 'wishlist' | null
        updateGameStatus(gameId, user?.id || "", status)
        toggleDropdown('none')
    }

    // States
    const isSidebarMobileOpen = isOpen('sidebar')
    const isOrderDropdownOpen = isOpen('order')

    return (
        <div className="w-full flex flex-col relative px-4 md:px-8 pt-8 pb-16 bg-black/90">
            {/* Background */}
            <div
                className="fixed inset-0 z-0 transition-all duration-300"
                style={{
                    backgroundImage: hoverGameImage
                        ? `url(${hoverGameImage})`
                        : 'url(/blackbg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px)',
                }}
            ></div>
            <div className="fixed inset-0 bg-black/60 z-0"></div>

            {/* Header */}
            <LibraryHeader
                library={library}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                setFilter={(key: string, value: string | null) => setFilter(key as any, value)}
                clearFilters={clearFilters}
                genres={genres}
                orderDropdownOpen={isOrderDropdownOpen}
                onOrderDropdownToggle={() => toggleDropdown('order')}
                onOrderChange={(order) => setFilter("ordering" as any, order)}
                currentOrder={filters.ordering}
                showSidebarMobile={isSidebarMobileOpen}
                onSidebarMobileToggle={() => toggleDropdown('sidebar' as any)}
            />

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col py-4">
                {/* Loading state */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 px-2 sm:px-4">
                        {SKELETON_IDS.map((id) => (
                            <GameCardSkeleton key={id} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && library.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <p className="text-lg font-medium">Tu biblioteca está vacía</p>
                        <p className="text-sm mt-1">Agrega juegos para verlos aquí</p>
                    </div>
                )}

                {/* Content with sidebar */}
                {!loading && library.length > 0 && (
                    <div className="flex gap-4 md:gap-8 overflow-hidden flex-1">
                        {/* Sidebar Desktop */}
                        <div className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-full overflow-y-auto">
                            <LibrarySidebar
                                filters={filters}
                                setFilter={(key: string, value: string | null) => setFilter(key as any, value)}
                                clearFilters={clearFilters}
                                genres={genres}
                            />
                        </div>

                        {/* Games Grid */}
                        <div className="flex-1 overflow-y-auto pb-8 px-2 sm:px-4">
                            {filteredGames.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                                    <p className="text-lg">No se encontraron juegos</p>
                                    <p className="text-sm mt-1">Intenta ajustar los filtros</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                                        {paginatedGames.map((game) => (
                                            <LibraryGameCard
                                                key={game.id}
                                                game={game}
                                                isStatusMenuOpen={isOpen('status', game.id)}
                                                onStatusMenuToggle={() => toggleDropdown('status', game.id)}
                                                onStatusChange={handleChangeStatus}
                                                onMouseEnter={setHoverGameImage}
                                                onMouseLeave={() => setHoverGameImage(null)}
                                            />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                            isLoading={loading}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}