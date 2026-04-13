import { useGames } from "@/hooks/useGames";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { useAuthStore } from "@/store/authStore";
import { getGamesInLibrary } from "@/services/gamesService";
import { Glitch } from "@/components/ui/Glitch";
import { CyberpunkButton } from "@/components/ui/Button";
import {CyberBox} from "@/components/ui/CyberBox";

export const MainPage = () => {

    const user = useAuthStore(state => state.user)
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [libraryGameIds, setLibraryGameIds] = useState<Set<number>>(new Set())
    
    const { games, loading } = useGames("added")
    const { games: valorados, loading: loadingValorados } = useGames("rating")
    const { games: critica, loading: loadingCritica } = useGames("metacritic")
    const { games: populares, loading: loadingPopulares } = useGames("added")
    
    const navigate = useNavigate()

    const selectedGame = games[selectedIdx]

    // Obtener juegos en librería
    useEffect(() => {
        if (user?.id) {
            const fetchLibraryGames = async () => {
                const libraryItems = await getGamesInLibrary(user.id)
                const ids = new Set(libraryItems.map(item => item.game_id))
                setLibraryGameIds(ids)
            }
            fetchLibraryGames()
        }
    }, [user?.id])

    const handleGameDetail = () => {
        if (selectedGame) {
            navigate(`/game/${selectedGame.id}`, { state: { game: selectedGame } })
        }
    }

    const handleAddToLibrary = (gameId: number) => {
        setLibraryGameIds(new Set([...libraryGameIds, gameId]))
    }

    // Autoplay del carrusel
    useEffect(() => {
        if (games.length === 0) return
        
        const interval = setInterval(() => {
            setSelectedIdx((prevIdx) => (prevIdx + 1) % games.length)
        }, 10000) // Cambiar cada 10 segundos

        return () => clearInterval(interval)
    }, [games.length])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 h-screen flex items-center justify-center">
                <div className="text-white/50">Cargando juegos...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 flex flex-col gap-4 sm:gap-6 md:gap-8">
            {/* CARRUSEL PRINCIPAL */}
            <div className="w-full mt-0 sm:mt-2 md:mt-4">
       
                <CyberBox label={selectedGame?.name}
  cornerLines
  glow
  accentColor="#F2FF00"
  bgColor="#0a160f"
  padding="10px">
                {selectedGame && (
                    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer" onClick={handleGameDetail}>
                        {/* Imagen de fondo */}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedIdx}
                                src={selectedGame.background_image || ""}
                                alt={selectedGame.name}
                                className="absolute inset-0 w-full h-full object-cover text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.8 }}
                            />
                        </AnimatePresence>

                        {/* Gradientes para legibilidad */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                        {/* Contenido */}
                        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6 md:p-8 text-white">
                            <motion.div
                                key={`content-${selectedIdx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-2 sm:space-y-3 md:space-y-4"
                            >
                                <Glitch trigger="loop" options={{ frames: 6, speed: 10, intensity: 10 }}>
                                <h2 className="text-2xl sm:text-3xl md:text-5xl text-white  leading-tight">{selectedGame.name}</h2>
                                </Glitch>
                                
                                {/* Géneros */}
                                {selectedGame.genres && selectedGame.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                        {selectedGame.genres.map((g) => (
                                            <span key={g.id} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 text-white/80 text-xs rounded-full font-medium">
                                                {g.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Metacritic + Released */}
                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                    {selectedGame.metacritic && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <span className={`font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm ${
                                                selectedGame.metacritic >= 80 ? "bg-green-500/20 text-green-400" :
                                                selectedGame.metacritic >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                                                "bg-red-500/20 text-red-400"
                                            }`}>
                                                {selectedGame.metacritic}
                                            </span>
                                            <span className="text-white/60 text-xs">Metacritic</span>
                                        </div>
                                    )}
                                    {selectedGame.released && (
                                        <span className="text-white/60">
                                            {new Date(selectedGame.released).getFullYear()}
                                        </span>
                                    )}
                                </div>
                                <CyberpunkButton>
                                    <Glitch trigger="hover" options={{ frames: 4, speed: 2, intensity: 15 }}>
                                    Ver detalles →

                                    </Glitch>
                                </CyberpunkButton>
                                
                            </motion.div>
                        </div>
                    </div>

                )}
                </CyberBox>
            </div>

            {/* FILAS NETFLIX */}
            <div className="w-full space-y-8">
                {/* Populares */}
                <HorizontalCarousel
                    title="◉ Populares"
                    games={populares}
                    loading={loadingPopulares}
                    userId={user?.id}
                    libraryGameIds={libraryGameIds}
                    onAddToLibrary={handleAddToLibrary}
                />
                {/* Más valorados */}
                <HorizontalCarousel
                    title="◈ Más valorados"
                    games={valorados}
                    loading={loadingValorados}
                    userId={user?.id}
                    libraryGameIds={libraryGameIds}
                    onAddToLibrary={handleAddToLibrary}
                />

                {/* Crítica */}
                <HorizontalCarousel
                    title="◆ Según la crítica"
                    games={critica}
                    loading={loadingCritica}
                    userId={user?.id}
                    libraryGameIds={libraryGameIds}
                    onAddToLibrary={handleAddToLibrary}
                />

                
            </div>
        </div>
    )
}
