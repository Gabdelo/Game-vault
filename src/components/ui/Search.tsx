import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Link } from "react-router-dom";

type GameSearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  resultCount?: number;
};

export function GameSearch({
  value: controlled,
  onChange,
  onKeyDown,
  placeholder = "Busca tus juegos...",
}: GameSearchProps) {
  const [internal, setInternal] = useState("");
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { games: searchResults, loading: searchLoading, count: totalCount } = useSearch(value);

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
    setShowDropdown(v.length > 0);
  };

  // Enfocar el input al presionar "/"
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="w-full max-w-md font-mono relative">
      {/* Campo de búsqueda */}
      <div className="relative flex items-center border-b border-gray-700 focus-within:border-cy transition-colors py-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-cy placeholder:text-cy tracking-wider text-sm" style={{color:'#F2FF00'}}
        />

        {/* Indicador de atajo */}
        {value.length === 0 && (
          <span className="text-[10px] border border-cy px-1.5 py-0.5 rounded" style={{color:'#F2FF00'}}>
            /
          </span>
        )}

        {/* Botón para limpiar */}
        {value.length > 0 && (
          <button
            onClick={() => handleChange("")}
            aria-label="Clear search"
            className=" text-cy hover:text-cyan-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="4" y1="4" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="4" x2="4" y2="12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && value.length > 0 && (
        <div>
       
        <div 
          className="search-dropdown-scrollbar absolute left-0 right-0 top-full mt-1 bg-black/95 border border-yellow-400/30 rounded max-h-80 overflow-y-auto z-[9999] p-3"
        >
          {searchLoading && (
            <div className="p-3 text-white/50 text-sm">Cargando...</div>
          )}
          {!searchLoading && searchResults.length === 0 && (
            <div className="p-3 text-white/50 text-sm">Sin resultados</div>
          )}
          {!searchLoading && searchResults.length > 0 && (
            <div>
              <p className="text-xs text-cyan-300/90 mb-2">Mostrando {Math.min(8, searchResults.length)} de {totalCount} resultados</p>
            <ul className="divide-y divide-gray-900">
              {searchResults.slice(0, 8).map(game => (
                <Link key={game.id} to={`/game/${game.id}`}>
                  <li className="p-2 hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      {game.background_image && (
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs  truncate" style={{color:'#F2FF00'}}>{game.name}</p>
                        <p className="text-xs text-white/50">{game.released}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
            </div>
          )}
        </div>
        </div>
      )}

      
    </div>
  );
}