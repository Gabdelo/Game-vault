import { Link } from "react-router-dom"
import { STATUS_MENU_OPTIONS, getStatusColor, getStatusTooltip } from "@/constants/gameStatus"
import { FaStar } from "react-icons/fa"


interface LibraryGameCardProps {
    game: any
    isStatusMenuOpen: boolean
    onStatusMenuToggle: () => void
    onStatusChange: (gameId: number, status: string) => void
    onMouseEnter: (image: string | null) => void
    onMouseLeave: () => void
}

export const LibraryGameCard = ({
    game,
    isStatusMenuOpen,
    onStatusMenuToggle,
    onStatusChange,
    onMouseEnter,
    onMouseLeave
}: LibraryGameCardProps) => {
    const statusColor = getStatusColor(game.status ?? null)
    const statusTooltip = getStatusTooltip(game.status ?? null)

    const handleStatusClick = (status: string) => {
        onStatusChange(game.id, status)
        onStatusMenuToggle()
    }

    return (
        <Link key={game.id} to={`/game/${game.id}`}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                className="group flex flex-col gap-2 cursor-pointer relative"
                onMouseEnter={() => onMouseEnter(game.background_image || null)}
                onMouseLeave={onMouseLeave}
    
            >
                {/* Cover image */}
                <div className="relative w-full h-[260px] overflow-hidden " style={{clipPath: 'polygon(0 13%, 13% 0, 100% 0, 100% 86%, 87% 100%, 0 100%)'}}>
                    {game.background_image ? (
                        <img
                            src={game.background_image}
                            alt={game.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <img
                            src={'/placeholder.png'}
                            alt={game.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}

                    {/* Status dropdown button */}
                    <div className="absolute top-2 right-2" data-dropdown="true">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                onStatusMenuToggle()
                            }}
                            className={`rounded-full w-6 h-6 flex items-center justify-center text-xs text-white transition-all hover:scale-110 ${statusColor}`}
                            title={statusTooltip}
                        >
                            ●
                        </button>

                        {/* Status dropdown menu */}
                        {isStatusMenuOpen && (
                            <div className="absolute top-8 right-0 bg-gray-900  shadow-xl border border-gray-700 z-50 w-44 transform-gpu" data-dropdown="true">
                                <div className="p-2 border-b border-gray-700">
                                    <p className="text-gray-400 text-xs font-semibold px-2 py-1">CAMBIAR ESTADO</p>
                                    {STATUS_MENU_OPTIONS.map((option) => (
                                        <button
                                            key={option.status}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleStatusClick(option.status)
                                            }}
                                            className={`w-full px-3 py-2 text-left text-sm  transition-colors ${
                                                game.status === option.status
                                                    ? `${option.bgClass} text-white`
                                                    : "text-gray-300 hover:bg-gray-800"
                                            }`}
                                        >
                                            {option.icon} {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Game info */}
                <div className="text-sm">
                    <h3 className="text-gray-200 font-medium line-clamp-2">{game.name}</h3>
                    {game.rating && (
                        <div className="text-cy text-xs flex items-center gap-1">
                            <FaStar /> {game.rating.toFixed(1)}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
