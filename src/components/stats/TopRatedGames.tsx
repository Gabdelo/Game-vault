import { Link } from "react-router-dom"
import type { Game } from "@/types/game"
import { CyberBox } from "../ui/CyberBox"

interface Props {
    games: Game[]
}

export const TopRatedGames = ({ games }: Props) => {
    if (games.length === 0) {
        return (
            <CyberBox padding="10px" label="TOP RATED" cornerLines glow accentColor="#F2FF00" bgColor="#000000">
                <div className="rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-cy mb-4 uppercase tracking-wider">
                        ★ Juegos Mejor Valorados
                    </h3>
                    <p className="text-gray-400 text-center py-8">No hay juegos valorados</p>
                </div>
            </CyberBox>
        )
    }

    return (
        <CyberBox padding="10px" label="TOP RATED" cornerLines glow accentColor="#F2FF00" bgColor="#000000">
            <div className="rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-cy mb-4 uppercase tracking-wider">
                    ★ Juegos Mejor Valorados
                </h3>
                <div className="space-y-3">
                    {games.map((game, index) => (
                        <Link key={game.id} to={`/game/${game.id}`}>
                            <div className="group flex gap-3 p-3 rounded-lg hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-200/20 cursor-pointer">
                                {/* Ranking number */}
                                <div className="flex-shrink-0 w-8 h-16 flex items-center justify-center">
                                    <span className="text-lg font-bold text-cy">#{index + 1}</span>
                                </div>

                                {/* Cover image */}
                                <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                                    <img
                                        src={game.background_image || "/placeholder.png"}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-cy transition-colors">
                                        {game.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-cy font-bold">★ {game.rating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </CyberBox>
    )
}
