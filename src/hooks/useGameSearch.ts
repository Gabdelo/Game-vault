import { useState, useCallback } from "react";
import { getGamesByFilters, type GameFilters } from "@/services/gamesService";
import type { Game } from "@/types/game";

export const useGameSearch = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Filtros activos
  const [filters, setFilters] = useState<GameFilters>({
    page: 1,
    pageSize: 20,
  });

  // Ejecutar búsqueda con filtros
  const search = useCallback(async (newFilters: Partial<GameFilters>) => {
    const mergedFilters: GameFilters = {
      ...filters,
      ...newFilters,
      page: newFilters.page ?? filters.page ?? 1,
      pageSize: newFilters.pageSize ?? filters.pageSize ?? 20,
    };

    setLoading(true);
    setError(null);
    setCurrentPage(mergedFilters.page ?? 1);

    try {
      const response = await getGamesByFilters(mergedFilters);
      setGames(response.results || []);
      setTotalPages(Math.max(1, Math.ceil((response.count || 0) / (mergedFilters.pageSize ?? 20))));
      setFilters(mergedFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching games");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cambiar página
  const changePage = useCallback(
    (page: number) => {
      search({ ...filters, page });
    },
    [filters, search]
  );

  // Cambiar géneros
  const setGenres = useCallback(
    (genreIds: number[]) => {
      const genresString = genreIds.join(",");
      search({ ...filters, genres: genresString, page: 1 });
    },
    [filters, search]
  );

  // Cambiar tags
  const setTags = useCallback(
    (tagNames: string[]) => {
      const tagsString = tagNames.join(",");
      search({ ...filters, tags: tagsString, page: 1 });
    },
    [filters, search]
  );

  // Cambiar ordering
  const setOrdering = useCallback(
    (ordering: string) => {
      search({ ...filters, ordering, page: 1 });
    },
    [filters, search]
  );

  // Búsqueda por texto
  const searchByText = useCallback(
    (searchText: string) => {
      search({ ...filters, search: searchText, page: 1 });
    },
    [filters, search]
  );

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({ page: 1, pageSize: 20 });
    setGames([]);
  }, []);

  return {
    games,
    loading,
    totalPages,
    currentPage,
    error,
    filters,
    search,
    changePage,
    setGenres,
    setTags,
    setOrdering,
    searchByText,
    clearFilters,
  };
};
