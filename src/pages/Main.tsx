import { useGames } from "@/hooks/useGames";
import { useState, useEffect } from "react";
import { HorizontalCarousel } from "@/components/main/HorizontalCarousel";
import { useAuthStore } from "@/store/authStore";
import { useLibraryStore } from "../store/libraryStore";
import { getTopAddedGames } from "@/services/gamesService";
import { genres, type Game } from "@/types/game";
import { CarrusellGenres } from "@/components/main/genres";
import { HeroCarousel } from "@/components/main/HeroCarousel";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FiBox, FiGlobe, FiUnlock } from "react-icons/fi";
import { motion } from "framer-motion";

export const Main = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const user = useAuthStore((state) => state.user);
  const { library } = useLibraryStore();
  const [libraryGameIds, setLibraryGameIds] = useState<Set<number>>(new Set());
  const [showOpenWorld, setShowOpenWorld] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showHiddenGems, setShowHiddenGems] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const { games: openWorldGames, loading: loadingOpenWorld } = useGames({
    tags: "open-world",
    ordering: "-added",
    pageSize: 9,
  });

  const { games: multiplayerGames, loading: loadingMultiplayer } = useGames({
    tags: "multiplayer",
    ordering: "-added",
    pageSize: 9,
  });

  const { games: hiddenGemsGames, loading: loadingHiddenGems } = useGames({
    ordering: "-rating",
    rating: "4,5",
    metacritic: "70,85",
    pageSize: 9,
  });

  usePageTitle("Inicio");

  useEffect(() => {
    const loadTopGames = async () => {
      try {
        setLoading(true);
        const topGames = await getTopAddedGames();
        setGames(topGames);
      } catch (error) {
        console.error("Error cargando juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopGames();
  }, []);

  // Obtener juegos en librería
  useEffect(() => {
    if (user?.id && library.length > 0) {
      const ids = new Set(library.map((item) => item.id));
      setLibraryGameIds(ids);
    }
  }, [user?.id, library]);

  const handleAddToLibrary = (gameId: number) => {
    setLibraryGameIds(new Set([...libraryGameIds, gameId]));
  };

  // Cargar carruseles con delay para evitar bombardeo de requests
  useEffect(() => {
    const timer1 = setTimeout(() => setShowOpenWorld(true), 800);
    const timer2 = setTimeout(() => setShowMultiplayer(true), 1600);
    const timer3 = setTimeout(() => setShowHiddenGems(true), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-black">
        <div className="container mx-auto px-1 sm:px-2 md:px-3 flex flex-col gap-4 sm:gap-6 md:gap-8">
          {/* Skeleton Carrusel Principal */}
          <div className="w-full mt-0 sm:mt-2 md:mt-4">
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-r from-black/50 via-black/30 to-black/50 animate-pulse border border-yellow-400/20" />
          </div>

          {/* Skeleton Carruseles */}
          <div className="w-full space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-32 bg-gradient-to-r from-black/50 to-black/30 rounded animate-pulse" />
                <div className="flex gap-3 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="w-32 sm:w-40 h-44 sm:h-56 flex-shrink-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 rounded-lg animate-pulse border border-yellow-400/10"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/10 pb-16">
      <div className="mx-auto lg:mx-2 flex flex-col gap-4 sm:gap-6 md:gap-8 justify-center items-center">
        <div className="h-screen flex flex-col gap-8 md:gap-16 pt-16">
          <div className="flex items-center justify-center gap-4">
            {/* Línea izquierda */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-[2px] bg-white"
            />

            {/* Texto */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white text-3xl md:text-5xl text-center whitespace-nowrap font-bold"
            >
              DESTACADOS
            </motion.h2>

            {/* Línea derecha */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-[2px] bg-white"
            />
          </div>
          {/* CARRUSEL PRINCIPAL */}
          <div className="w-full flex justify-center items-center ">
            <HeroCarousel games={games} loading={loading} />
          </div>
        </div>

        {/* FILAS NETFLIX */}
        <div className="w-full">
          <div className=" md:h-screen flex flex-col gap-4 justify-center items-center ">
            <div className="flex flex-row justify-center items-center ">
            <h2 className="text-white text-center">
              EXPLORAR TUS GÉNEROS FAVORITOS
            </h2>
          </div>
          {/* FILAS NETFLIX */}
          <div className="w-full space-y-8">
            <div>
              <CarrusellGenres
                title=""
                genres={genres}
                loading={loading}
              ></CarrusellGenres>
            </div>
          </div>
          </div>

          <div className=" ">
            {showOpenWorld && (
            <div className=" ">
              <div className="flex items-center justify-center ">
                <h2 className="text-white text-center mb-4 inline-block">
                  <FiBox size={30} className="inline-block text-cy mr-4" />
                  MUNDOS ABIERTOS
                </h2>
              </div>
              <HorizontalCarousel
                title=" "
                games={openWorldGames}
                loading={loadingOpenWorld}
                userId={user?.id}
                libraryGameIds={libraryGameIds}
                onAddToLibrary={handleAddToLibrary}
              />
            </div>
          )}

          {showMultiplayer && (
            <div>
              <div className="flex items-center justify-center gap-2 ">
                <h2 className="text-white text-center mb-4 inline-block">
                  <FiGlobe size={30} className="inline-block mr-4 text-cy" />
                  JUEGOS MULTIJUGADOR
                </h2>
              </div>
              <HorizontalCarousel
                title=""
                games={multiplayerGames}
                loading={loadingMultiplayer}
                userId={user?.id}
                libraryGameIds={libraryGameIds}
                onAddToLibrary={handleAddToLibrary}
              />
            </div>
          )}

          {showHiddenGems && (
            <div>
              <div className="flex items-center justify-center gap-2 ">
                <h2 className="text-white text-center mb-4 inline-block">
                  <FiUnlock
                    size={30}
                    className="inline-block mr-4 text-cy me-4"
                  />
                  JOYAS OCULTAS{" "}
                </h2>
              </div>

              <HorizontalCarousel
                title=""
                games={hiddenGemsGames}
                loading={loadingHiddenGems}
                userId={user?.id}
                libraryGameIds={libraryGameIds}
                onAddToLibrary={handleAddToLibrary}
              />
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
