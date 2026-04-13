import { filterStyles } from "../styles/filterStyle"

type Props = {
    searchQuery: string
    onSearchChange: (value: string) => void
    sortBy: "all" | "recent" | "favorites"
    onSortChange: (value: "all" | "recent" | "favorites") => void
    selectedStatus: string | null
    onStatusChange: (value: string | null) => void
    genres: any[]
    selectedGenre: number | null
    onGenreChange: (value: number | null) => void
    hideSearch?: boolean
}

export const LibrarySidebar = ({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    selectedStatus,
    onStatusChange,
    genres,
    selectedGenre,
    onGenreChange,
    hideSearch = false,
}: Props) => {
    return (
        <>
            <style>{filterStyles}</style>
            <div className=" w-64 flex-shrink-0">
                {/* Buscador */}
              {!hideSearch && (
              <div className="mb-6">
  <div className="relative">
    <input
  type="text"
  placeholder="Buscar juego..."
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  className="
    w-full px-4 py-2 text-sm text-yellow-200
    bg-black/80 backdrop-blur-sm
    border border-cyan-500/40 rounded-lg
    placeholder-cyan-400/60
    focus:outline-none
    focus:border-cyan-500/40
    focus:ring-0
  "
/>

    {/* Glow line inferior */}
    <span
      className="
        pointer-events-none absolute inset-x-0 bottom-0 h-px
     
        opacity-70
      "
    />
  </div>
</div>
              )}

                {/* Ordenamiento */}
                <div className="sb-panel mb-6">
                    <p className="sb-heading">Ordenar por</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => onSortChange("all")}
                            className={`sb-filter-btn ${sortBy === "all" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">◆</span>
                            Todos
                        </button>
                        <button
                            onClick={() => onSortChange("recent")}
                            className={`sb-filter-btn ${sortBy === "recent" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">◄</span>
                            Recientes
                        </button>
                        <button
                            onClick={() => onSortChange("favorites")}
                            className={`sb-filter-btn ${sortBy === "favorites" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">★</span>
                            Favoritos
                        </button>
                    </div>
                </div>

                {/* Status */}
                <div className=" sb-panel mb-6">
                    <p className="sb-heading">Estado</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => onStatusChange(null)}
                            className={`sb-filter-btn ${selectedStatus === null ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">◆</span>
                            Todos
                        </button>
                        <button
                            onClick={() => onStatusChange("playing")}
                            className={`sb-filter-btn ${selectedStatus === "playing" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">▶</span>
                            Jugando
                        </button>
                        <button
                            onClick={() => onStatusChange("completed")}
                            className={`sb-filter-btn ${selectedStatus === "completed" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">█</span>
                            Completado
                        </button>
                        <button
                            onClick={() => onStatusChange("wishlist")}
                            className={`sb-filter-btn ${selectedStatus === "wishlist" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">◊</span>
                            Deseados
                        </button>
                        <button
                            onClick={() => onStatusChange("dropped")}
                            className={`sb-filter-btn ${selectedStatus === "dropped" ? "active" : ""}`}
                        >
                            <span className="sb-btn-icon">■</span>
                            Abandonado
                        </button>
                    </div>
                </div>

                {/* Géneros */}
                <div className="sb-panel">
                    <p className="sb-heading">Géneros</p>
                    <div className="sb-genre-list">
                        <button
                            onClick={() => onGenreChange(null)}
                            className={`sb-genre-btn ${selectedGenre === null ? "active" : ""}`}
                        >
                            Todos los géneros
                        </button>
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                onClick={() => onGenreChange(genre.id)}
                                className={`sb-genre-btn ${selectedGenre === genre.id ? "active" : ""}`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
