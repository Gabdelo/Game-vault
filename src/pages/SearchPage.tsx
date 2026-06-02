import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { GenresSidebarFilter } from "@/components/GenresSidebarFilter";
import { HeroCarousel } from "@/components/main/HeroCarousel";
import { SearchPageFiltersLoadingSkeleton } from "@/components/main/SearchPageSkeleton";
import { useGameSearch } from "@/hooks/useGameSearch";
import { useLibraryStore } from "@/store/libraryStore";
import { GENRES } from "@/services/genresMap";
import type { Game } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX } from "react-icons/fi";
import { usePageTitle } from '@/hooks/usePageTitle'

export const SearchPage = () => {
  const { library } = useLibraryStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [libraryGameIds, setLibraryGameIds] = useState<Set<number>>(new Set());
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedGenreNames, setSelectedGenreNames] = useState<string[]>([]);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [activeOrdering, setActiveOrdering] = useState("");
  const [heroGames, setHeroGames] = useState<Game[]>([]);
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroLoading] = useState(false);
  const [heroInitializedRef, setHeroInitialized] = useState(false);
  const [initialFilterRef, setInitialFilter] = useState(false); // Rastrear si vino de URL con filtros
  const [heroDisabledManually, setHeroDisabledManually] = useState(false); // Rastrear si fue limpiado manualmente
  const [defaultOrderingApplied, setDefaultOrderingApplied] = useState(false); // Rastrear si se aplicó el ordenamiento por defecto
  const [loadingAll, setLoadingAll] = useState(false); // true si cualquiera está cargando
  const [showMobileFilters, setShowMobileFilters] = useState(false) // Modal de filtros en mobile
  const searchTerm = searchParams.get("q") || "";
  const tagsParam = searchParams.get("tags") || "";
  const genresParamInitial = useRef(searchParams.get("genres") || "");
  const hasInitializedRef = useRef(false);
  const hasInitializedTagsRef = useRef("");
  const hasInitializedTagsCallRef = useRef(false);
  
  usePageTitle(searchTerm ? `Búsqueda: ${searchTerm}` : "Explorar Juegos")

  

  const {games,loading,totalPages,currentPage,
    changePage,
    setGenres,
    setTags,
    setOrdering,
    searchByText,
    clearFilters,
  } = useGameSearch();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Actualizar loadingAll cuando loading o heroLoading cambien
  useEffect(() => {
    setLoadingAll(loading || heroLoading);
  }, [loading, heroLoading]);

  // Detectar si vino con filtros en la URL al montar
  useEffect(() => {
    const hasInitialFilter = genresParamInitial.current || tagsParam;
    if (hasInitialFilter) {
      setInitialFilter(true);
    }
  }, []);

  // Aplicar ordenamiento por defecto si no hay filtros en la URL
  useEffect(() => {
    if (!defaultOrderingApplied && !searchTerm && !genresParamInitial.current && !tagsParam) {
      setOrdering("-added");
      setActiveOrdering("added");
      setDefaultOrderingApplied(true);
    }
  }, []);
  // Obtener juegos en la librería del usuario
  useEffect(() => {
    if (library.length > 0) {
      const ids = new Set(library.map((item) => item.id));
      setLibraryGameIds(ids);
    }
  }, [library]);
  // Ejecutar búsqueda cuando hay término en URL
  useEffect(() => {
    if (searchTerm) {
      searchByText(searchTerm);
    }
  }, [searchTerm]);
  // Leer géneros y tags de la URL UNA SOLA VEZ al montar
  useEffect(() => {
    // Leer géneros
    if (!hasInitializedRef.current) {
      const genresParam = searchParams.get("genres");
      if (genresParam) {
        const genreIds = genresParam.split(",").map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (genreIds.length > 0) {
          setSelectedGenreIds(genreIds);
          setGenres(genreIds);
          hasInitializedRef.current = true;
        }
      }
    }
  }, []);
  // Detectar cambios en tags - ejecutar solo cuando el parámetro tags cambie
  useEffect(() => {
    if (tagsParam && tagsParam !== hasInitializedTagsRef.current) {
      const tagNames = tagsParam.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      console.log("Tags desde URL:", tagNames);
      if (tagNames.length > 0 && !hasInitializedTagsCallRef.current) {
        setSelectedTagNames(tagNames);
        setTags(tagNames);
        setHeroGames([]); // Limpiar carrusel cuando cambian los tags
        setHeroInitialized(false);
        hasInitializedTagsCallRef.current = true;
      }
      hasInitializedTagsRef.current = tagsParam;
    } else if (!tagsParam && hasInitializedTagsRef.current) {
      // Si no hay tags en URL y había antes, limpiar
      setSelectedTagNames([]);
      hasInitializedTagsRef.current = "";
      hasInitializedTagsCallRef.current = false;
    }
  }, [tagsParam, setTags]);
  // Actualizar nombres de géneros cuando cambian los IDs
  useEffect(() => {
    const names = selectedGenreIds
      .map(id => {
        const genre = GENRES.find(g => g.id === id);
        return genre?.name || null;
      })
      .filter((name): name is string => name !== null);
    setSelectedGenreNames(names);
  }, [selectedGenreIds]);

  // Inicializar hero games solo si vino de URL con filtros
  useEffect(() => {
    if (initialFilterRef && !heroInitializedRef && games.length > 0 && (selectedGenreIds.length > 0 || selectedTagNames.length > 0)) {
      setHeroGames(games.slice(0, 10));
      const title = selectedTagNames.length > 0
        ? selectedTagNames.join(" • ")
        : selectedGenreNames.length > 0
        ? selectedGenreNames.join(" • ")
        : "Juegos destacados";
      setHeroTitle(title);
      setHeroInitialized(true);
    }
  }, [games, selectedGenreIds, selectedTagNames, heroInitializedRef, selectedGenreNames, initialFilterRef]);

  // Limpiar filtro de búsqueda
  const handleClearSearchTerm = () => {
    clearFilters();
    setHeroDisabledManually(true);
    navigate("/explore");
  };
  // Manejar cambio de géneros
  const handleGenresChange = (genreIds: number[]) => {
    setSelectedGenreIds(genreIds);
    setGenres(genreIds);
  };
  // Manejar cambio de ordenamiento
  const handleOrderingChange = (ordering: string) => {
    setActiveOrdering(ordering);
    setOrdering(`-${ordering}`);
  };
  // Renderizar contenido de juegos
  const renderGamesContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center sm:justify-items-start">
          {Array.from({ length: 8 }, (_, i) => (
            <GameCardSkeleton key={`skeleton-${i}-${Date.now()}`} />
          ))}
        </div>
      );
    }
    if (games.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-yellow-300/60 text-lg">Sin resultados</p>
          <p className="text-yellow-300/40 text-sm mt-2">
            Intenta con otros filtros o busca un juego diferente
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center sm:justify-items-start">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              userId={user?.id}
              isInLibrary={libraryGameIds.has(game.id)}
              onAddToLibrary={() => setLibraryGameIds(new Set([...libraryGameIds, game.id]))}
            />
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </div>
        )}
      </>
    );
  };


  // Mostrar skeleton si está cargando con filtros de URL (géneros o tags)
  const hasUrlFilters = genresParamInitial.current || tagsParam;
  if (loadingAll && hasUrlFilters && !heroInitializedRef) {
    return <SearchPageFiltersLoadingSkeleton />;
  }

  return (
    <div className="w-full flex flex-col px-4 py-0 md:px-6 md:py-6 bg-black/10">
      {/* Título del carrusel si hay filtros */}
      {/* HERO TITLE */}
{heroTitle && !searchTerm && !heroDisabledManually && (
  <motion.div
    initial={{ opacity: 0, filter: "blur(8px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
   
  >
    <div className="flex items-center justify-center gap-4 my-6">
      
      {/* Línea izquierda */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100px", opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-[2px] bg-cy"
      />

      {/* Texto */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-cy text-2xl md:text-5xl text-center whitespace-nowrap font-bold ine-clamp-2 uppercase tracking-wide"
      >
        {heroTitle.toUpperCase()}
      </motion.h2>

      {/* Línea derecha */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100px", opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-[2px] bg-cy"
      />
      
    </div>
  </motion.div>
)}

{/* HERO CAROUSEL */}
{heroGames.length > 0 && !searchTerm && !heroDisabledManually && (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    className="flex flex-row justify-center pb-16"
  >
    <HeroCarousel
      games={heroGames}
      loading={heroLoading}
      
    />
  </motion.div>
)}
      {/* Contenido Principal */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 mt-8">
        {/* Sidebar de Filtros - Solo Desktop */}
        <div className="hidden md:block">
          <GenresSidebarFilter
            selectedGenres={selectedGenreIds}
            onGenresChange={handleGenresChange}
            onOrderingChange={handleOrderingChange}
            activeOrdering={activeOrdering}
            searchTerm={searchTerm}
            onClearSearchTerm={handleClearSearchTerm}
          />
        </div>

        {/* Grid de Juegos */}
        <main className="flex flex-col gap-6">
          {/* Encabezado con Título y Botón de Filtros Móvil */}
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold text-cy uppercase tracking-wide">
                {searchTerm
                  ? `Resultados de búsqueda: ${searchTerm.toUpperCase()}`
                  : selectedTagNames.length > 0
                  ? `Filtrado por: ${selectedTagNames.join(", ")}`
                  : selectedGenreIds.length > 0
                  ? `Filtrado por géneros`
                  : "Descubre Juegos"}
              </h2>
            </div>

            {/* Botón Filtros Mobile */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-200/10 text-cy border border-yellow-200/20 hover:bg-yellow-200/20 transition-colors text-sm font-medium"
            >
              <FiFilter size={16} />
              <span>Filtros</span>
            </button>
          </div>

          {/* Juegos */}
          {renderGamesContent()}
        </main>
      </div>

      {/* Modal de Filtros Mobile */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
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
                <h3 className="text-lg font-bold text-cy">Filtros</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-cy hover:text-yellow-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Contenido de Filtros */}
              <div className="px-4 py-4">
                <GenresSidebarFilter
                  selectedGenres={selectedGenreIds}
                  onGenresChange={handleGenresChange}
                  onOrderingChange={handleOrderingChange}
                  activeOrdering={activeOrdering}
                  searchTerm={searchTerm}
                  onClearSearchTerm={handleClearSearchTerm}
                  isMobileModal={true}
                  onApplyFilters={() => setShowMobileFilters(false)}
                />
              </div>

              {/* Espaciador para que no quede pegado */}
              <div className="h-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};