import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Glitch } from '@/components/ui/Glitch'
import { DescriptionModal } from '@/components/ui/DescriptionModal'
import { STORES_MAP } from '@/services/storesMap'
import type { Game } from '@/types/game'

interface GameHeroProps {
    gameDetail: Game
    isStatusDropdownOpen: boolean
    statusValue: string | null
    statusConfig: Record<string, { label: string; classes: string }>
    isInLibrary: boolean
    user: any
    addingToLibrary: boolean
    deletingFromLibrary: boolean
    onStatusToggle: () => void
    onStatusSelect: (status: string | null) => void
    onAddToLibrary: () => void
    onDeleteFromLibrary: () => void
}

export const GameHero = ({
    gameDetail,
    isStatusDropdownOpen,
    statusValue,
    statusConfig,
    isInLibrary,
    user,
    addingToLibrary,
    deletingFromLibrary,
    onStatusToggle,
    onStatusSelect,
    onAddToLibrary,
    onDeleteFromLibrary,
}: GameHeroProps) => {
    const [showDescriptionModal, setShowDescriptionModal] = useState(false)

    // Memoizar botones para evitar re-renders innecesarios
    const buttons = useMemo(() => {
        const buttonsList = []

      
        // 2. Botón Agregar a Biblioteca
        if (user?.id && !isInLibrary) {
            buttonsList.push({
                id: 'add',
                type: 'primary',
                render: () => (
                    <button
                        onClick={onAddToLibrary}
                        disabled={addingToLibrary}
                        className="px-5 py-2.5 text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {addingToLibrary ? "Agregando..." : "+ Añadir a biblioteca"}
                    </button>
                )
            })
        }

        // 3. Botón Eliminar de Biblioteca
        if (user?.id && isInLibrary) {
            buttonsList.push({
                id: 'delete',
                type: 'danger',
                render: () => (
                    <button
                        onClick={onDeleteFromLibrary}
                        disabled={deletingFromLibrary}
                        className="px-5 py-2.5 text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deletingFromLibrary ? "Eliminando..." : "✕ Eliminar de biblioteca"}
                    </button>
                )
            })
        }
          // 1. Botón de Estado (solo si está en biblioteca)
        if (user?.id && isInLibrary) {
            buttonsList.push({
                id: 'status',
                type: 'status',
                render: () => (
                    <div className="relative">
                        <button
                            onClick={onStatusToggle}
                            className={`px-5 py-2.5 text-sm font-semibold border backdrop-blur-sm transition-all duration-200 flex items-center gap-2 ${
                                statusValue
                                    ? statusConfig[statusValue].classes
                                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                            }`}
                        >
                            {statusValue ? statusConfig[statusValue].label : "ESTADO"}
                            <svg
                                className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>

                        {isStatusDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e] border border-white/20 shadow-lg z-50">
                                {[
                                    { value: null, label: "Sin estado" },
                                    { value: "playing", label: "▶ Jugando" },
                                    { value: "completed", label: "✓ Completado" },
                                    { value: "dropped", label: "✕ Abandonado" },
                                    { value: "wishlist", label: "♥ Wishlist" },
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => onStatusSelect(option.value as any)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                            statusValue === option.value
                                                ? "bg-white/20 text-white font-semibold"
                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })
        }


        // 4. Sitio Oficial (siempre aparece si existe)
        if (gameDetail.website) {
            buttonsList.push({
                id: 'website',
                type: 'secondary',
                render: () => (
                    <a
                        href={gameDetail.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                        Sitio oficial ↗
                    </a>
                )
            })
        }

        return buttonsList
    }, [user?.id, isInLibrary, statusValue, statusConfig, isStatusDropdownOpen, gameDetail.website, addingToLibrary, deletingFromLibrary])

    return (
        <div className="relative w-full h-[90vh] overflow-hidden">
            {/* Imagen hero */}
            {gameDetail?.background_image && (
                <motion.img
                    src={gameDetail.background_image}
                    alt={gameDetail.name}
                    className="absolute inset-0 w-full h-full object-cover object-right-top"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />
            )}

            {/* Gradientes para legibilidad — capas Netflix */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-transparent to-transparent" />

            {/* Contenido encima del hero */}
            <div className="absolute inset-0 flex items-end lg:items-center">
                <div className="w-full px-6 py-8 lg:px-16 lg:py-12 2xl:px-32 2xl:py-20">
                    <div className="max-w-2xl flex flex-col gap-4">
                        {/* TBA badge */}
                        {gameDetail.tba && (
                            <span className="self-start px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase tracking-widest">
                                Por anunciar
                            </span>
                        )}

                        {/* Título */}
                        <motion.h1
                            className="text-5xl lg:text-7xl font-black tracking-tight leading-none text-white mt-20"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Glitch trigger="loop" options={{ frames: 6, speed: 10, intensity: 10 }}>
                                {gameDetail.name}
                            </Glitch>
                        </motion.h1>

                        {/* Géneros */}
                        {gameDetail.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {gameDetail.genres.map((g, gIdx) => (
                                    <span key={`genre-${gIdx}`} className="text-xs text-white/60 uppercase tracking-widest font-medium">
                                        {g.name}{gameDetail.genres.indexOf(g) < gameDetail.genres.length - 1 ? " ·" : ""}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Métricas inline */}
                        <motion.div
                            className="flex items-center gap-4 flex-wrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            {gameDetail.metacritic != null && (
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`text-sm font-bold px-2 py-0.5 border ${
                                            gameDetail.metacritic >= 80
                                                ? "text-green-400 border-green-500/50 bg-green-500/10"
                                                : gameDetail.metacritic >= 60
                                                  ? "text-yellow-400 border-yellow-500/50 bg-yellow-500/10"
                                                  : "text-red-400 border-red-500/50 bg-red-500/10"
                                        }`}
                                    >
                                        {gameDetail.metacritic}
                                    </span>
                                    <span className="text-xs text-yellow/40">Metacritic</span>
                                </div>
                            )}
                            {gameDetail.released
                        ? new Date(gameDetail.released).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })
                        : "—"}
                            {gameDetail.playtime != null && gameDetail.playtime > 0 && (
                                <span className="text-sm text-white">{gameDetail.playtime}h promedio</span>
                            )}
                          
                        </motion.div>

                        {/* Descripción corta en el hero */}
                        {gameDetail.description && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div
                                    className="text-white/70 text-sm leading-relaxed line-clamp-4 max-w-xl prose prose-invert prose-sm"
                                    dangerouslySetInnerHTML={{ __html: gameDetail.description }}
                                />
                                <button
                                    onClick={() => setShowDescriptionModal(true)}
                                    className="self-start text-sm font-semibold bg-black/20 text-white border border-white/30 hover:bg-black/30 transition-colors px-4 py-2"
                                >
                                    Ver descripción completa
                                </button>
                            </motion.div>
                        )}

                        {/* Botones de acción */}
                        <motion.div
                            className="flex items-center gap-3 flex-wrap mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            {/* Renderizar botones del array */}
                            {buttons.map((btn) => (
                                <div key={btn.id}>
                                    {btn.render()}
                                </div>
                            ))}

                            {/* Stores — siempre al final */}
                            {(gameDetail.stores?.length ?? 0) > 0 && (
                                <div className="p-5">
                                    <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Disponible en</p>
                                    <div className="flex flex-wrap gap-3">
                                        {gameDetail.stores?.map((s, sIdx) => {
                                            const storeInfo = STORES_MAP[s.store.id]
                                            return (
                                                <div key={`store-${sIdx}`} className="flex flex-col items-center gap-1 group">
                                                    <div className="w-20 h-20 flex items-center justify-center transition-all">
                                                        {storeInfo?.icon ? (
                                                            <img
                                                                src={storeInfo.icon}
                                                                alt={storeInfo.name}
                                                                className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-white/50">?</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modal de Descripción Completa */}
            <DescriptionModal 
                isOpen={showDescriptionModal}
                title={gameDetail.name}
                content={gameDetail.description || ""}
                onClose={() => setShowDescriptionModal(false)}
            />
        </div>
    )
}
