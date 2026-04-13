import { useAuthStore } from "@/store/authStore"
import { useLibrary } from "@/hooks/useLibrary"
import { useStats } from "@/hooks/useStats"
import { StatsCard } from "@/components/stats/StatsCard"
import { FavoriteGenresChart } from "@/components/stats/FavoriteGenresChart"
import { StatusBreakdown } from "@/components/stats/StatusBreakdown"
import { RecentGamesAdded } from "@/components/stats/RecentGamesAdded"
import { Glitch } from "@/components/ui/Glitch"

export const StatsPage = () => {
    const user = useAuthStore(state => state.user)
    const id = user?.id || ""
    const { games, loading } = useLibrary(id)
    const { 
        favoriteGenres, 
        statusBreakdown, 
        recentGames, 
        totalGames, 
        totalGenres
    } = useStats(games)

    return (
        <div className="pt-20 sm:pt-28 md:pt-36 px-2 sm:px-4 md:px-8 min-h-screen w-full bg-black/80 overflow-x-hidden">
            {/* Header */}
            <div className="mb-8 sm:mb-12">
                <Glitch trigger="loop" options={{ frames: 6, speed: 10, intensity: 10 }}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">
                     ANALÍTICAS
                </h2>
                </Glitch>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="animate-spin text-lg"></span>
                    <p>Cargando estadísticas...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && totalGames === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                    <p className="text-5xl mb-4"></p>
                    <p className="text-lg font-medium">Tu biblioteca está vacía</p>
                    <p className="text-sm mt-1">Agrega juegos para ver estadísticas</p>
                </div>
            )}

            {/* Stats content */}
            {!loading && totalGames > 0 && (
                <div className="space-y-8">
                    {/* Métrica Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatsCard
                            icon=""
                            label="Total de Juegos"
                            value={totalGames}
                            color="cyan"
                        />
                        <StatsCard
                            icon=""
                            label="Géneros Únicos"
                            value={totalGenres}
                            color="yellow"
                        />
                    </div>
                    {/* Gráficos principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Géneros favoritos */}
                        <FavoriteGenresChart data={favoriteGenres} />
                        {/* Estado de juegos */}
                        <StatusBreakdown data={statusBreakdown} />
                    </div>

                    {/* Últimos juegos */}
                    <RecentGamesAdded games={recentGames} />
                </div>
            )}
        </div>
    )
}