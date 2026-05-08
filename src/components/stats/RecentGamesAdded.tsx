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
        <CyberBox padding="10px" label="RECENT GAMES" cornerLines glow accentColor="#F2FF00" bgColor="#000000">
        <div className=" rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-cy mb-4 uppercase tracking-wider">
                ◄ Últimos Juegos Añadidos
            </h3>
            <div className="space-y-3">
                {games.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No hay juegos añadidos</p>
                ) : (
                    games.map((game) => (
                        <Link key={game.id} to={`/game/${game.id}`}>
                            <div className="group flex gap-3 p-3 rounded-lg hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-200/20 cursor-pointer">
                                {/* Portada */}
                                <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                                    <img
                                        src={game.background_image || "/placeholder.png"}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-100 group-hover:text-cy transition-colors truncate">
                                        {game.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                         {formatDate(game.added_at ?? null)}
                                    </p>
                                    <p className="text-xs text-cyan-400 mt-1">
                                        {getStatusLabel(game.status ?? null)}
                                    </p>
                                </div>

                               
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
        </CyberBox>
    )
}
