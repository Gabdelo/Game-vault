import { Link } from "react-router-dom"
import { HackerText } from "@/components/ui/HackerText"
import CyberButton from "@/components/ui/CyberButton"
import { OrderingDropdown } from "./OrderingDropdown"
import { FiFilter, FiX } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import { LibrarySidebar } from "./LibrarySidebar"

interface LibraryHeaderProps {
    library: any[]
    searchQuery: string
    onSearchChange: (query: string) => void
    filters: any
    setFilter: (key: string, value: string | null) => void
    clearFilters: () => void
    genres: any[]
    orderDropdownOpen: boolean
    onOrderDropdownToggle: () => void
    onOrderChange: (order: string | null) => void
    currentOrder: string | null
    showSidebarMobile: boolean
    onSidebarMobileToggle: () => void
}

export const LibraryHeader = ({
    library,
    searchQuery,
    onSearchChange,
    filters,
    setFilter,
    clearFilters,
    genres,
    orderDropdownOpen,
    onOrderDropdownToggle,
    onOrderChange,
    currentOrder,
    showSidebarMobile,
    onSidebarMobileToggle
}: LibraryHeaderProps) => {
    const getLibraryCountText = (): string => {
        if (library.length === 0) {
            return "Aquí podrás ver los juegos que has agregado a tu biblioteca."
        }
        const suffix = library.length === 1 ? "" : "s"
        return `${library.length} juego${suffix} en tu colección`
    }

    return (
        <div className="relative z-10 " style={{zIndex: 20}}>
            {/* Modal de Filtros Mobile */}
            <AnimatePresence>
                {showSidebarMobile && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onSidebarMobileToggle}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-400/30 rounded-t-2xl z-50 md:hidden max-h-[80vh] overflow-y-auto"
                        >
                            {/* Encabezado del Modal */}
                            <div className="sticky top-0 flex items-center justify-between px-4 py-4 border-b border-yellow-400/20 bg-black">
                                <h3 className="text-lg font-bold text-yellow-300">Filtros</h3>
                                <button
                                    onClick={onSidebarMobileToggle}
                                    className="text-yellow-300 hover:text-yellow-200 transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Contenido de Filtros */}
                            <div className="px-4 py-4">
                                <LibrarySidebar
                                    filters={filters}
                                    setFilter={setFilter as (key: string, value: string | null) => void}
                                    clearFilters={clearFilters}
                                    genres={genres}
                                />
                            </div>

                            {/* Espaciador */}
                            <div className="h-4" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col py-4">
                {/* Header Mobile */}
                <div className="md:hidden flex flex-col gap-3 mb-6 px-2">
                    {/* Fila 1: Título y Analíticas */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold tracking-wide text-white">
                                <HackerText text="BIBLIOTECA" />
                            </h2>
                            <p className="text-gray-400 mt-1 text-xs">
                                {getLibraryCountText()}
                            </p>
                        </div>
                        <Link to="/stats">
                            <CyberButton variant="primary" accentColor="#FBFF00" className="px-3 py-2  text-xs whitespace-nowrap">
                                ANALÍTICAS
                            </CyberButton>
                        </Link>
                    </div>

                    {/* Fila 2: Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar en tu biblioteca..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                    />

                    {/* Fila 3: Filtros y Ordenar */}
                    <div className="flex gap-2 items-center">
                        {/* Botón Filtros */}
                        <button
                            onClick={onSidebarMobileToggle}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-200/10 text-cy border border-yellow-200/20  hover:bg-yellow-200/20 transition-colors text-sm font-medium"
                        >
                            <FiFilter size={16} />
                            <span>Filtros</span>
                        </button>

                        {/* Ordering Dropdown */}
                        <div className="flex-1">
                            <OrderingDropdown
                                isOpen={orderDropdownOpen}
                                onToggle={onOrderDropdownToggle}
                                currentOrder={currentOrder}
                                onOrderChange={onOrderChange}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Header Desktop */}
                <div className="hidden md:flex flex-col gap-4 mb-6">
                    {/* Primera línea: Título */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold tracking-wide text-white">
                                <HackerText text="BIBLIOTECA" />
                            </h2>
                            <p className="text-gray-400 mt-1 text-sm">
                                {getLibraryCountText()}
                            </p>
                        </div>
                        <Link to="/stats">
                            <CyberButton variant="primary" accentColor="#FBFF00" className="px-4 py-2  text-sm whitespace-nowrap">
                                ANALÍTICAS
                            </CyberButton>
                        </Link>
                    </div>

                    {/* Segunda línea: Buscador y controles */}
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Buscar en tu biblioteca..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20  text-white placeholder-white/50 focus:outline-none focus:border-cyan-300 transition-colors text-sm"
                        />

                        {/* Ordering Dropdown */}
                        <OrderingDropdown
                            isOpen={orderDropdownOpen}
                            onToggle={onOrderDropdownToggle}
                            currentOrder={currentOrder}
                            onOrderChange={onOrderChange}
                            size="md"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
