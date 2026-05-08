import type { LibraryFilters } from "@/store/libraryStore"
import { CyberButton } from "@/components/ui/CyberButton"


interface LibrarySidebarProps {
    filters: LibraryFilters
    setFilter: (key: string, value: string | null) => void
    clearFilters: () => void
    genres: any[]
}

export const LibrarySidebar = ({
    filters,
    setFilter,
    clearFilters,
    genres
}: LibrarySidebarProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Clear Filters Button */}
            <CyberButton
                onClick={clearFilters}
                className="w-full justify-center text-sm"
                variant="primary"
            >
                Limpiar Filtros
            </CyberButton>

            {/* Status Filter - Buttons */}
            <div className="border border-yellow-200/20 p-4 bg-black/40">
                <h3 className="text-cy font-bold mb-3 text-sm">Estado</h3>
                <div className="flex flex-col gap-2">
                    {[
                        { value: null, label: "Todos" },
                        { value: "playing", label: "Jugando" },
                        { value: "completed", label: "Completado" },
                        { value: "wishlist", label: "Deseado" },
                        { value: "dropped", label: "Abandonado" }
                    ].map((status) => (
                        <button
                            key={status.label}
                            onClick={() => setFilter("status", status.value)}
                            className={`px-3 py-2 transition-all font-medium text-sm ${
                                filters.status === status.value
                                    ? "bg-cy text-black border border-cy"
                                    : "bg-yellow-200/10 text-cy border border-yellow-200/20  hover:bg-yellow-200/20"
                            }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Genre Filter */}
            <div className="border border-yellow-200/20  p-4 bg-black/40">
                <h3 className="text-cy font-bold mb-3 text-sm ml-2">Géneros</h3>
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-yellow-400/10 p-2 rounded transition-colors">
                        <input
                            type="radio"
                            name="genre"
                            checked={filters.genre === null}
                            onChange={() => setFilter("genre", null)}
                            className="w-4 h-4 cursor-pointer accent-yellow-300"
                        />
                        <span className="text-cy text-sm hover:text-yellow-300">Todos</span>
                    </label>
                    {genres.map((genre) => (
                        <label key={genre.id} className="flex items-center gap-2 cursor-pointer hover:bg-yellow-400/10 p-2 rounded transition-colors">
                            <input
                                type="radio"
                                name="genre"
                                checked={filters.genre === genre.name}
                                onChange={() => setFilter("genre", genre.name)}
                                className="w-4 h-4 cursor-pointer accent-yellow-200"
                            />
                            <span className="text-cy text-sm hover:text-yellow-300">{genre.name}</span>
                        </label>
                    ))}
                </div>
            </div>


        </div>
    )
}
