type Props = {
    gameId: number
    currentStatus: string | null
    onStatusChange: (gameId: number, status: string) => void
    onDelete: (gameId: number) => void
}

export const LibraryStatusMenu = ({
    gameId,
    currentStatus,
    onStatusChange,
    onDelete,
}: Props) => {
    return (
        <div className="absolute top-12 right-2 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-50 min-w-48">
            <div className="p-2 border-b border-gray-700">
                <p className="text-gray-400 text-xs font-semibold px-2 py-1">CAMBIAR ESTADO</p>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onStatusChange(gameId, 'playing')
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        currentStatus === 'playing'
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                     Jugando
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onStatusChange(gameId, 'completed')
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        currentStatus === 'completed'
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                     Completado
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onStatusChange(gameId, 'wishlist')
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        currentStatus === 'wishlist'
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                     Deseado
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onStatusChange(gameId, 'dropped')
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                        currentStatus === 'dropped'
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                     Abandonado
                </button>
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    onDelete(gameId)
                }}
                className="w-full px-4 py-2 text-red-400 hover:bg-red-900/20 transition-colors rounded-lg text-sm font-medium whitespace-nowrap m-2"
            >
                 Eliminar
            </button>
        </div>
    )
}
