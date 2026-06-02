import { getUserProfile } from "@/services/profileService"
import { useAuthStore } from "@/store/authStore"
import { useState, useEffect } from "react"
import { ProfileEditor } from "@/components/profile/Editor"
import { useLibraryStore } from "@/store/libraryStore"
import { getTotalGames, getByStatus, getAverageRating, getTopGenres, getRecentGames, getTopRatedGames } from "@/services/calcStats"
import { usePageTitle } from '@/hooks/usePageTitle'
import { Link } from "react-router-dom"
import { FiMessageCircle } from "react-icons/fi"
import {Pagination} from "@/components/ui/Pagination"

export const ProfilePage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const user = useAuthStore(state => state.user)
    const { library } = useLibraryStore()
    usePageTitle("Mi Perfil")
  // Debug: Verificar contenido de la librería
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string>("/controller.png")
    const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const gamesPerPage = 12

    // Calcular estadísticas
    const stats = {
        total: getTotalGames(library),
        byStatus: getByStatus(library),
        avgRating: getAverageRating(library),
        topGenres: getTopGenres(library, 3),
        recentGames: getRecentGames(library, 3),
        topRatedGames: getTopRatedGames(library, 3),
    }

    // Paginación
    const totalPages = Math.ceil(library.length / gamesPerPage)
    const startIdx = (currentPage - 1) * gamesPerPage
    const endIdx = startIdx + gamesPerPage
    const paginatedGames = library.slice(startIdx, endIdx)
    

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            try {
                const data = await getUserProfile(user.id)
                setProfile(data)
              
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [user?.id])

    // Calcular URL del avatar solo cuando cambia el perfil
    useEffect(() => {
        const DIRECTUS_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL || "https://directus-latest-i2px.onrender.com"
        const url = profile?.avatar ? `${DIRECTUS_URL}/assets/${profile.avatar}` : "/controller.png"
        setAvatarUrl(url)
    }, [profile?.avatar])

    const handleProfileUpdated = async () => {
        if (!user?.id) return
        try {
            const data = await getUserProfile(user.id)
            setProfile(data)
        } catch (error) {
            console.error("Error refetching profile:", error)
        }
    }

    // Helpers
    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'playing': return 'bg-blue-500'
            case 'completed': return 'bg-green-500'
            case 'wishlist': return 'bg-yellow-500'
            case 'dropped': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case 'playing': return 'Jugando'
            case 'completed': return 'Completado'
            case 'wishlist': return 'Deseado'
            case 'dropped': return 'Abandonado'
            default: return 'Sin estado'
        }
    }
    
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black/90">
                <p className="text-yellow-300">Cargando perfil...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black/10 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-400/20 p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-24 h-24 sm:w-32 sm:h-32 border-3 border-cy flex-shrink-0"
                        />
                        
                        {/* User Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-cy mb-2">
                                {profile?.username || "Usuario"}
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base mb-4">
                                {profile?.bio || "Sin biografía"}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                Miembro desde {profile?.date_created ? new Date(profile.date_created).toLocaleDateString() : "Desconocido"}
                            </p>
                            <button
                                onClick={() => setIsEditorOpen(true)}
                                className="bg-cy font-semibold py-2 px-6 transition-colors border border-cy"
                            >
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
                

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Games */}
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-4 hover:border-yellow-400/40 transition-colors">
                        <p className="text-gray-400 text-sm mb-2">Total de Juegos</p>
                        <p className="text-3xl font-bold text-cy">{stats.total}</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-4 hover:border-yellow-400/40 transition-colors">
                        <p className="text-gray-400 text-sm mb-2">Completados</p>
                        <p className="text-3xl font-bold text-cy">{stats.byStatus.completed}</p>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-4 hover:border-yellow-400/40 transition-colors">
                        <p className="text-gray-400 text-sm mb-2">Valoración Media</p>
                        <p className="text-3xl font-bold text-cy">
                            {stats.avgRating ? stats.avgRating.toFixed(1) : "-"}
                        </p>
                    </div>

                    {/* Currently Playing */}
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-4 hover:border-yellow-400/40 transition-colors">
                        <p className="text-gray-400 text-sm mb-2">Jugando Ahora</p>
                        <p className="text-3xl font-bold text-cy">{stats.byStatus.playing}</p>
                    </div>
                </div>
                  {/* Top Rated Games */}
                <div className="bg-gray-800/60 border border-yellow-400/20 p-6 mb-8">
                    <h2 className="text-xl font-bold text-cy mb-6">Juegos Mejor Valorados</h2>
                    {stats.topRatedGames.length > 0 ? (
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 max-w-2xl">
                                {stats.topRatedGames.map((game) => (
                                    <Link key={game.id} to={`/game/${game.id}`}>
                                        <div className="group flex flex-col gap-2">
                                            {/* Cover image */}
                                            <div className="relative w-full aspect-[3/4] overflow-hidden">
                                                {game.background_image ? (
                                                    <img
                                                        src={game.background_image}
                                                        alt={game.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/placeholder.png"
                                                        alt={game.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                )}
                                                {/* Rating overlay */}
                                                {game.rating && (
                                                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-xs font-semibold text-cy flex items-center gap-1">
                                                         {game.rating.toFixed(1)}
                                                    </div>
                                                )}
                                                {/* Status badge */}
                                                    {game.status && (
                                                        <div
                                                            className={`absolute top-2 right-2 w-5 h-5 flex items-center rounded-full justify-center text-xs text-white ${getStatusColor(game.status)}`}
                                                            title={getStatusLabel(game.status)}
                                                        >
                                                            ●
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Game info */}
                                            <div className="text-sm">
                                                <h3 className="text-gray-200 font-medium line-clamp-2 text-xs leading-tight">
                                                    {game.name}
                                                </h3>
                                                {game.note && (
                                                    <p className="text-gray-400 text-xs mt-1 line-clamp-10"><i>"{game.note}"</i></p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Sin juegos valorados aún</p>
                    )}
                </div>

                {/* Favorite Genres */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-6">
                        <h2 className="text-xl font-bold text-cy mb-4">Géneros Favoritos</h2>
                        {stats.topGenres.length > 0 ? (
                            <div className="space-y-3">
                                {stats.topGenres.map((genre, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-gray-300">{genre.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-700 h-2">
                                                <div
                                                    className="bg-cy h-2"
                                                    style={{
                                                        width: `${(genre.total / stats.topGenres[0].total) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-cy text-sm font-semibold w-8">{genre.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">Sin géneros favoritos aún</p>
                        )}
                    </div>

                    {/* Recent Games */}
                    <div className="bg-gray-800/60 border border-yellow-400/20 p-6">
                        <h2 className="text-xl font-bold text-cy mb-4">Juegos Recientes</h2>
                        {stats.recentGames.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentGames.map((game) => (
                                    <div key={game.id} className="flex items-start gap-3 pb-3 border-b border-gray-700 last:border-b-0">
                                        {game.background_image && (
                                            <img
                                                src={game.background_image}
                                                alt={game.name}
                                                className="w-12 h-12 object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-200 text-sm font-medium truncate">{game.name}</p>
                                            <p className="text-gray-500 text-xs">
                                                Añadido el {game.added_at ? new Date(game.added_at).toLocaleDateString() : "Desconocido"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">Sin juegos recientes</p>
                        )}
                    </div>
                </div>

              

                {/* Biblioteca Section */}
                <div className="bg-gray-800/60 border border-yellow-400/20 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-cy mb-6">Biblioteca ({library.length} juegos)</h2>
                    
                    {library.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Tu biblioteca está vacía</p>
                    ) : (
                        <>
                            {/* Games Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                {paginatedGames.map((game) => (
                                    <div key={game.id} className="group flex flex-col gap-2 relative">
                                        <div className="relative w-full flex flex-col gap-2">
                                            <Link to={`/game/${game.id}`} >
                                                {/* Cover image */}
                                                <div className="relative w-full aspect-[3/4] overflow-hidden">
                                                    {game.background_image ? (
                                                        <img
                                                            src={game.background_image}
                                                            alt={game.name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                         <img
                                                            src="/placeholder.png"
                                                            alt={game.name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    )}

                                                    {/* Status badge */}
                                                    {game.status && (
                                                        <div
                                                            className={`absolute top-2 right-2 w-5 h-5 flex items-center rounded-full justify-center text-xs text-white ${getStatusColor(game.status)}`}
                                                            title={getStatusLabel(game.status)}
                                                        >
                                                            ●
                                                        </div>
                                                    )}

                                                    {/* Rating overlay */}
                                                    {game.rating && (
                                                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-xs font-semibold text-cy flex items-center gap-1">
                                                             {game.rating.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Game info */}
                                                <div className="text-sm">
                                                    <h3 className="text-gray-200 font-medium line-clamp-2 text-xs leading-tight">
                                                        {game.name}
                                                    </h3>
                                                  
                                                </div>
                                            </Link>

                                            {/* Mobile Note Button - Inside Card */}
                                            {game.note && (
                                                <button
                                                    onClick={() => setExpandedNoteId(expandedNoteId === game.id ? null : game.id)}
                                                    className="md:hidden flex items-center justify-center gap-1 text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 px-2 py-1.5 border border-yellow-400/30 transition-colors"
                                                >
                                                    <FiMessageCircle size={14} />
                                                    {expandedNoteId === game.id ? "Ocultar" : "Ver nota"}
                                                </button>
                                            )}

                                            {/* Mobile Note Tooltip */}
                                            {game.note && expandedNoteId === game.id && (
                                                <div className="md:hidden absolute -top-32 left-7 -translate-x-[4rem] translate-y-full opacity-100 transition-opacity duration-200 z-50">
                                                    <div className="bg-gray-900 border border-yellow-400/50 p-4 w-52 shadow-lg">
                                                        <p className="text-gray-300 text-sm leading-relaxed">{`"${game.note}"`}</p>
                                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop Tooltip on Hover */}
                                        {game.note && (
                                            <div className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                                <div className="bg-gray-900 border border-yellow-400/50 p-4 w-72 shadow-lg">
                                                    <p className="text-gray-300 text-sm leading-relaxed"><i>"{game.note}"</i></p>
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    isLoading={false}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Editor Modal */}
            <ProfileEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                userId={user?.id || ""}
                currentProfile={profile}
                onProfileUpdated={handleProfileUpdated}
            />
        </div>
    )
}