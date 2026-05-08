interface Props {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: Props) => {
    const pages = []
    // Responsive: mostrar menos páginas en móviles
    const maxVisible = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5
    
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
        <div className="flex items-center justify-center gap-1 sm:gap-2 py-4 sm:py-8 px-2 overflow-x-auto">
            {/* Anterior */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`px-2 sm:px-3 py-1.5 sm:py-2  font-semibold transition-all text-xs sm:text-sm flex-shrink-0 ${
                    currentPage === 1 || isLoading
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-cyan-500 text-white hover:bg-cyan-600 "
                }`}
            >
                <span className="hidden sm:inline">◄ </span>
                <span className="sm:hidden">◄</span>
            </button>

            {/* Primera página si no está visible */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={isLoading}
                        className="px-2 sm:px-3 py-1.5 sm:py-2  font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm flex-shrink-0"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0">...</span>}
                </>
            )}

            {/* Números de página */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2  font-semibold transition-all text-xs sm:text-sm flex-shrink-0 ${
                        currentPage === page
                            ? "bg-cy text-black shadow-lg "
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
             
                >
                    {page}
                </button>
            ))}

            {/* Última página si no está visible */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={isLoading}
                        className="px-2 sm:px-3 py-1.5 sm:py-2  font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm flex-shrink-0"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Siguiente */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 font-semibold transition-all text-xs sm:text-sm flex-shrink-0 ${
                    currentPage === totalPages || isLoading
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-cyan-500 text-white hover:bg-cyan-600 "
                }`}
            >
                <span className="hidden sm:inline"> ►</span>
                <span className="sm:hidden">►</span>
            </button>

        
        </div>
    )
}
