import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getGameDetailFull } from '@/services/gamesService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/CyberToast'
import { ImageModal } from '@/components/ui/ImageModal'
import type { Game } from '@/types/game'
import { useGameDetailHandlers } from '@/hooks/useGameDetailHandlers'
import { GameHero } from '@/components/GameDetailPage/GameHero'
import { GameStats } from '@/components/GameDetailPage/GameStats'
import { GameSidebar } from '@/components/GameDetailPage/GameSidebar'
import { GameContent } from '@/components/GameDetailPage/GameContent'
import { usePageTitle } from '@/hooks/usePageTitle'


export const GameDetailPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const { id } = useParams<{ id: string }>()
    const gameId = parseInt(id || '0', 10)
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const { toast } = useToast()

    const [gameDetail, setGameDetail] = useState<Game | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isInLibrary, setIsInLibrary] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
    const [isNoteFocused, setIsNoteFocused] = useState(false)
    const [shouldSaveRating, setShouldSaveRating] = useState(false)

    usePageTitle(gameDetail ? gameDetail.name : "Cargando...")
      

    const {
        noteValue,
        ratingValue,
        statusValue,
        addingToLibrary,
        deletingFromLibrary,
        setNoteValue,
        setRatingValue,
        setStatusValue,
        handleSaveNote,
        handleSaveRating,
        handleSaveStatus,
        handleAddToLibrary,
        handleDeleteFromLibrary,
    } = useGameDetailHandlers({
        gameId,
        userId: user?.id,
        gameDetail,
        setGameDetail,
        onIsInLibraryChange: setIsInLibrary,
    })

    // Guardar rating cuando cambie
    useEffect(() => {
        if (shouldSaveRating && user?.id && isInLibrary) {
            handleSaveRating()
            setShouldSaveRating(false)
        }
    }, [ratingValue, shouldSaveRating, user?.id, isInLibrary])

    // Cargar detalles del juego
    useEffect(() => {
        if (!gameId) return

        const fetchGameDetail = async () => {
            try {
                setIsLoading(true)
                const detail = await getGameDetailFull(gameId, user?.id ?? null)
                setGameDetail(detail)
                setNoteValue(detail.note || "")
                setRatingValue(detail.rating || 0)
                setStatusValue(detail.status || null)
                setIsInLibrary(!!detail.isInLibrary)
            } catch (error) {
                console.error("Error fetching game detail:", error)
                toast({
                    variant: 'error',
                    title: 'Error',
                    message: 'No se pudo cargar el juego',
                    duration: 3500,
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchGameDetail()
    }, [gameId, user?.id])

    const statusConfig = {
        completed: { label: "✓ Completado", classes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30" },
        playing: { label: "▶ Jugando", classes: "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30" },
        dropped: { label: "✕ Abandonado", classes: "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30" },
        wishlist: { label: "♥ Wishlist", classes: "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30" },
    }
    if (isLoading) {
        return (
            <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-yellow-300 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-sm text-white/60">Cargando juego...</p>
                </div>
            </div>
        )
    }

    if (!gameDetail) {
        return (
            <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Juego no encontrado</p>
                    <p className="text-sm text-white/60">El ID del juego no es válido</p>
                </div>
            </div>
        )
    }


    return (
        <div className="w-full relative pb-36 bg-black/10">
            <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }} />
            <div className="relative z-10 text-white">
                <ImageModal
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                    images={gameDetail.short_screenshots?.map((s) => s.image) || []}
                    initialIndex={selectedImageIndex}
                />

                {/* Hero Section */}
                <GameHero
                    gameDetail={gameDetail}
                    isStatusDropdownOpen={isStatusDropdownOpen}
                    statusValue={statusValue}
                    statusConfig={statusConfig}
                    isInLibrary={isInLibrary}
                    user={user}
                    addingToLibrary={addingToLibrary}
                    deletingFromLibrary={deletingFromLibrary}
                    onStatusToggle={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    onStatusSelect={(value) => {
                        console.log("GameDetailPage onStatusSelect called with:", value)
                        const statusValue = value as "playing" | "completed" | "dropped" | "wishlist" | null
                        setStatusValue(statusValue)
                        console.log("Status value set, calling handleSaveStatus with:", statusValue)
                        handleSaveStatus(statusValue)
                        setIsStatusDropdownOpen(false)
                    }}
                    onAddToLibrary={handleAddToLibrary}
                    onDeleteFromLibrary={handleDeleteFromLibrary}
         
                />

                {/* Main Content */}
                <div className="max-w-7xl min-w-full  px-8 md:px-16 py-8 flex flex-col gap-10">
                    {/* Stats Section */}
                    <GameStats
                        gameDetail={gameDetail}
                        user={user}
                        isInLibrary={isInLibrary}
                        ratingValue={ratingValue}
                        setRatingValue={setRatingValue}
                        setShouldSaveRating={setShouldSaveRating}
                    />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column */}
                        <GameContent
                            gameDetail={gameDetail}
                            user={user}
                            isInLibrary={isInLibrary}
                            noteValue={noteValue}
                            isNoteFocused={isNoteFocused}
                            setNoteValue={setNoteValue}
                            setIsNoteFocused={setIsNoteFocused}
                            handleSaveNote={handleSaveNote}
                            setSelectedImageIndex={setSelectedImageIndex}
                            setIsImageModalOpen={setIsImageModalOpen}
                        />

                        {/* Right Column (Sidebar) */}
                        <GameSidebar
                            gameDetail={gameDetail}
                            user={user}
                            isInLibrary={isInLibrary}
                            setSelectedImageIndex={setSelectedImageIndex}
                            setIsImageModalOpen={setIsImageModalOpen}
                            onNavigate={navigate}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}