import { StatCard } from './StatCard'
import { StarRating } from '@/components/ui/StarRating'
import type { Game } from '@/types/game'

interface GameStatsProps {
    gameDetail: Game
    user: any
    isInLibrary: boolean
    ratingValue: number
    setRatingValue: (value: number) => void
    setShouldSaveRating: (value: boolean) => void
}

export const GameStats = ({
    gameDetail,
    user,
    isInLibrary,
    ratingValue,
    setRatingValue,
    setShouldSaveRating,
}: GameStatsProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Metacritic grande */}
            {gameDetail.metacritic != null && (
                <StatCard label="Metacritic">
                    <span
                        className={`text-4xl font-black ${
                            gameDetail.metacritic >= 80
                                ? "text-green-400"
                                : gameDetail.metacritic >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                        }`}
                    >
                        {gameDetail.metacritic}
                    </span>

                </StatCard>
            )}

            {/* Rating personal */}
            {user?.id && isInLibrary && (
                <StatCard label="Mi Rating">
                    <div className="flex items-center justify-center gap-2">
                        <StarRating
                            value={ratingValue}
                            onChange={(newRating) => {
                                setRatingValue(newRating)
                                setShouldSaveRating(true)
                            }}
                            size={24}
                        />

                    </div>
                </StatCard>
            )}

            {/* Fecha lanzamiento */}
            <StatCard label="Lanzamiento">
                <span className="text-lg font-bold text-white/90">
                    {gameDetail.released
                        ? new Date(gameDetail.released).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })
                        : "—"}
                </span>
            </StatCard>

            {/* Playtime */}
            {gameDetail.playtime != null && gameDetail.playtime > 0 && (
                <StatCard label="Tiempo medio">
                    <span className="text-4xl font-black text-white/90">
                        {gameDetail.playtime}
                        <span className="text-lg text-white/30 font-normal"> h</span>
                    </span>
                </StatCard>
            )}
        </div>
    )
}
