import { useState, useEffect, useRef } from "react";
import { Link} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Glitch } from "@/components/ui/Glitch";
import { CyberBox } from "@/components/ui/CyberBox";
import { HackerText } from "@/components/ui/HackerText";
import { STORES_MAP } from "@/services/storesMap";
import { HeroCarouselSkeleton } from "@/components/main/HeroCarouselSkeleton";
import type { Game } from "@/types/game";
import { ImageModal } from "../ui/ImageModal";


interface HeroCarouselProps {
  title?: string;
  games: Game[];
  loading?: boolean;
}

export const HeroCarousel = ({
  title,
  games,
  loading = false,
}: HeroCarouselProps) => {

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedGame = games[selectedIdx];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Función para resetear el autoplay
  const resetAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (games.length === 0) return;

    intervalRef.current = setInterval(() => {
      setSelectedIdx((prevIdx) => (prevIdx + 1) % games.length);
    }, 10000); // Cambiar cada 10 segundos
  };

  // Autoplay del carrusel
  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [games.length]);

  // Handlers para cambio manual con reseteo del timer
  const handlePrevious = () => {
    setSelectedIdx((prev) => (prev - 1 + games.length) % games.length);
    resetAutoPlay();
  };

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % games.length);
    resetAutoPlay();
  };

  
  if (loading) {
    return <HeroCarouselSkeleton />;
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="w-[75%] sm:w-[90%] lg:w-[85%]">
      <ImageModal
                          isOpen={isImageModalOpen}
                          onClose={() => setIsImageModalOpen(false)}
                          images={selectedGame.short_screenshots?.map((s) => s.image) || []}
                          initialIndex={selectedImageIndex}
                      />
      {title && <h2 className="text-lg sm:text-xl md:text-2xl font-bold my-3 sm:my-5 text-white">{title}</h2>}
      

      {/* Contenedor con flechas */}
      <div className="relative flex items-center gap-1 sm:gap-2 md:gap-4">
        
        {/* Flecha Izquierda */}
        <button
          onClick={handlePrevious}
          className="absolute sm:relative left-0 z-10 p-1 sm:p-2 md:p-3 rounded-full transition-all text-cy"
        >
          <FiChevronLeft size={24} className="sm:hidden" />
          <FiChevronLeft size={32} className="hidden sm:block md:hidden" />
          <FiChevronLeft size={60} className="hidden md:block" />
        </button>

        {/* CyberBox */}
        <div className="flex-1">
          <CyberBox
            label={selectedGame.genres && selectedGame.genres.length > 0 ? selectedGame.genres[0].name : "N/A"}
            cornerLines
            accentColor="#F2FF00"
          >
            {selectedGame && (
              <div className="grid grid-cols-1 md:grid-cols-[60%_40%] h-[55vh] sm:h-[400px] md:h-[560px]">
                {/* Imagen - Izquierda */}
                <div
                  className="relative rounded-lg sm:rounded-2xl overflow-hidden group cursor-pointer"
                 
                >
                 <Link to={`/game/${selectedGame.id}`}>
                  {/* Imagen de fondo */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedIdx}
                      src={selectedGame.background_image || "/placeholder.png"}
                      alt={selectedGame.name}
                      className="w-full h-full object-cover text-white/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    />
                  </AnimatePresence>

                  {/* Gradientes para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/10 to-black/40" />
                  </Link>
                </div>

                {/* Contenido - Derecha */}
                <div className="flex flex-col  sm:p-4 md:p-8 text-white bg-black/40 rounded-lg sm:rounded-2xl overflow-y-hidden overflow-x-hidden max-h-[330px] sm:max-h-[400px] md:max-h-[560px]">
                  <motion.div
                    key={`content-${selectedIdx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-1.5 sm:space-y-3 md:space-y-4"
                  >
                    <Glitch
                      trigger="loop"
                      options={{ frames: 6, speed: 10, intensity: 10 }}
                    >
                      <h2 className="text-lg sm:text-2xl md:text-4xl text-white font-bold pt-3">
                        <HackerText text={selectedGame.name} />
                      </h2>
                    </Glitch>

                    {/* Descripción */}
                    {selectedGame.description && (
                      <p className="text-xs sm:text-sm md:text-base text-white/70 line-clamp-2 sm:line-clamp-3">
                        {selectedGame.description.replace(/<\/?[^>]+(>|$)/g, "")}
                      </p>
                    )}

                    {/* Géneros */}
                    {selectedGame.genres && selectedGame.genres.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 sm:gap-2">
                        {selectedGame.genres.slice(0, 3).map((g) => (
                          <span
                            key={g.id}
                            className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-white/10 text-white/80 text-xs rounded-full font-medium"
                          >
                            {g.name}
                          </span>
                        ))}
                        
                      </div>
                    )}

                    {/* Metacritic */}
                    <div className="flex flex-col gap-2 text-xs sm:text-sm">
                      {selectedGame.metacritic && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span
                            className={`font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm ${
                              selectedGame.metacritic >= 80
                                ? "bg-green-500/20 text-green-400"
                                : selectedGame.metacritic >= 60
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {selectedGame.metacritic}
                          </span>
                          <span className="text-white/60 text-xs">Metacritic</span>
                        </div>
                      )}
                    </div>

                    {/* Screenshots */}
                    {selectedGame.short_screenshots && selectedGame.short_screenshots.length > 0 && (
                      <section className="hidden md:block">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                          {selectedGame.short_screenshots.slice(0, 2).map((s, index) => (
                            <motion.img
                              key={`screenshot-${index}`}
                              src={s.image}
                              alt=""
                              onClick={() => {
                                setSelectedImageIndex(index)
                                    setIsImageModalOpen(true)
                              }}
                              className="w-full aspect-video object-cover rounded opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                            />
                          ))}
                        </div>
                        
                      </section>
                    )}

                    {/* Stores */}
                    {(selectedGame.stores?.length ?? 0) > 0 && (
                      <div className="mt- sm:mt-3">
                          <h3 className="text-white/70">Disponible en:</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-8">
                          {selectedGame.stores?.map((s, sIdx) => {
                            const storeInfo = STORES_MAP[s.store.id];
                            return (
                              <div
                                key={`store-${sIdx}`}
                                className="flex flex-col items-start gap-1 group"
                              >
                                <div className="w-20 h-30 rounded-full flex items-start transition-all">
                                  {storeInfo?.icon ? (
                                    <img
                                      src={storeInfo.icon}
                                      alt={storeInfo.name}
                                      className="w-6 sm:w-8 h-6 sm:h-8 object-contain  group-hover:scale-110 transition-transform"
                                    />
                                  ) : (
                                    <span className="text-xs text-white/50">?</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </CyberBox>
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={handleNext}
          className="absolute sm:relative right-0 z-10 p-1 sm:p-2 md:p-3 rounded-full bg-cy/90 transition-all text-cy "
        >
          <FiChevronRight size={24} className="sm:hidden" />
          <FiChevronRight size={32} className="hidden sm:block md:hidden" />
          <FiChevronRight size={60} className="hidden md:block" />
        </button>
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 flex-wrap px-2">
        {games.map((game, idx) => (
          <button
            key={game.id}
            onClick={() => {
              setSelectedIdx(idx);
              resetAutoPlay();
            }}
            className={`transition-all ${
              selectedIdx === idx
                ? "bg-cy w-6 sm:w-8 md:w-10 h-1.5 sm:h-2 md:h-2.5"
                : "bg-yellow-400/30 w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 hover:bg-yellow-400/50"
            } rounded-full`}
          />
        ))}
      </div>
    </div>
  );
};
