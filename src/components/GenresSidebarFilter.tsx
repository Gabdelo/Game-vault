import { GENRES } from "@/services/genresMap";

interface GenresSidebarFilterProps {
  selectedGenres: number[];
  onGenresChange: (genreIds: number[]) => void;
  onOrderingChange: (ordering: string) => void;
  activeOrdering?: string;
  searchTerm?: string;
  onClearSearchTerm?: () => void;
  isMobileModal?: boolean;
  onApplyFilters?: () => void;
}

export const GenresSidebarFilter = ({
  selectedGenres,
  onGenresChange,
  onOrderingChange,
  activeOrdering = "",
  searchTerm = "",
  onClearSearchTerm,
  isMobileModal = false,
  onApplyFilters,
}: GenresSidebarFilterProps) => {
  const handleGenreToggle = (genreId: number) => {
    const updated = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    onGenresChange(updated);
  };

  const handleOrderingChange = (ordering: string) => {
    if (activeOrdering === ordering) {
      onOrderingChange("");
    } else {
      onOrderingChange(ordering);
    }
  };

  return (
    <aside className="w-full md:w-[280px] flex flex-col gap-4">
      {/* Botón Aplicar Filtros - Solo en Mobile/Modal */}
      {isMobileModal && (
        <button
          onClick={onApplyFilters}
          className="w-full bg-cy text-black font-bold transition-all shadow-lg hover:shadow-xl mt-4"
        >
          Aplicar Filtros
        </button>
      )}
      {/* Chip de búsqueda si existe */}
      {searchTerm && (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/40  px-3 py-2">
          <span className="text-cy text-sm font-medium flex-1 truncate">
            "{searchTerm}"
          </span>
          <button
            onClick={onClearSearchTerm}
            className="text-cy hover:text-yellow-300 transition-colors font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sección de Ordenamiento */}
      <div className="border border-yellow-400/20  p-4 bg-black/40">
        <h3 className="text-cy font-bold text-sm uppercase mb-3">Ordenar</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: " Mejor valorados", value: "rating" },
            { label: " Más recientes", value: "released" },
            { label: " Más populares", value: "added" },
            { label: " Mejor crítica", value: "metacritic" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleOrderingChange(value)}
              className={`px-3 py-2 text-sm transition-all text-left ${
                activeOrdering === value
                  ? "bg-cy text-black border border-cy"
                  : "bg-yellow-200/10 text-cy border border-yellow-200/20 hover:bg-yellow-200/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sección de Géneros */}
      <div className="border border-yellow-400/20  p-4 bg-black/40">
        <h3 className="text-cy font-bold text-sm uppercase mb-3 ml-2">
          Géneros ({selectedGenres.length})
        </h3>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          {GENRES.map(genre => (
            <label
              key={genre.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-yellow-400/10 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}

                onChange={() => handleGenreToggle(genre.id)}
                className="w-4 h-4 accent-cy"
              />
              <span className="text-cy text-sm">
                {genre.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      
    </aside>
  );
};
