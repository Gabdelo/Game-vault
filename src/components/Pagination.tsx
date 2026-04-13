interface Props {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: Props) => {
    const pages = []
    const maxVisible = 5
    
    // Calcular rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            {/* Anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1 || isLoading
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50"
                }`}
            >
                ◄ Anterior
            </button>

            {/* Primera página si no está visible */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="text-gray-400">...</span>}
                </>
            )}

            {/* Números de página */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === page
                            ? "bg-yellow-500 text-black hover:bg-yellow-600 shadow-lg shadow-yellow-500/50"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Última página si no está visible */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages || isLoading
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50"
                }`}
            >
                Siguiente ►
            </button>

            {/* Info de página */}
            <div className="ml-4 text-gray-400 text-sm">
                Página <span className="text-yellow-400 font-bold">{currentPage}</span> de{" "}
                <span className="text-yellow-400 font-bold">{totalPages}</span>
            </div>
        </div>
    )
}
