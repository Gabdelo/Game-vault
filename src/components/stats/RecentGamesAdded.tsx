import { Link } from "react-router-dom"
import type { Game } from "../../types/game"
import { CyberBox } from "../ui/CyberBox"

interface Props {
    games: Game[]
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

const getStatusLabel = (status: string | null) => {
    switch(status) {
        case 'playing': return ' Jugando'
        case 'completed': return ' Completado'
        case 'wishlist': return ' Deseado'
        case 'dropped': return ' Abandonado'
        default: return 'Sin estado'
    }
}

export const RecentGamesAdded = ({ games }: Props) => {
    return (
        <CyberBox padding="10px" label="RECENT GAMES" cornerLines glow accentColor="#F2FF00" bgColor="#0a160f">
        <div className=" rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
                ◄ Últimos Juegos Añadidos
            </h3>
            <div className="space-y-3">
                {games.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No hay juegos añadidos</p>
                ) : (
                    games.map((game) => (
                        <Link key={game.id} to={`/game/${game.id}`} state={{ game }}>
                            <div className="group flex gap-3 p-3 rounded-lg hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-500/30 cursor-pointer">
                                {/* Portada */}
                                <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                                    <img
                                        src={game.background_image || "https://placehold.co/48x64"}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors truncate">
                                        {game.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                         {formatDate(game.date_created ?? null)}
                                    </p>
                                    <p className="text-xs text-cyan-400 mt-1">
                                        {getStatusLabel(game.status ?? null)}
                                    </p>
                                </div>

                                {/* Rating */}
                                {game.rating && (
                                    <div className="flex-shrink-0 flex items-center">
                                        <span className="text-yellow-400 font-bold text-sm">
                                             {game.rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
        </CyberBox>
    )
}
