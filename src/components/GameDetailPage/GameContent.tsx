import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Game } from '@/types/game'

interface GameContentProps {
    gameDetail: Game
    user: any
    isInLibrary: boolean
    noteValue: string
    isNoteFocused: boolean
    setNoteValue: (value: string) => void
    setIsNoteFocused: (value: boolean) => void
    handleSaveNote: () => void
    setSelectedImageIndex: (index: number) => void
    setIsImageModalOpen: (open: boolean) => void
}

export const GameContent = ({
    gameDetail,
    user,
    isInLibrary,
    noteValue,
    isNoteFocused,
    setNoteValue,
    setIsNoteFocused,
    handleSaveNote,
    setSelectedImageIndex,
    setIsImageModalOpen,
}: GameContentProps) => {
    const navigate = useNavigate()
  

    return (
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Opiniones / Ratings bar */}
            {/* Nota personal */}
            {user?.id && isInLibrary && (
                <section>
                    <h2 className="text-xs text-cy uppercase tracking-widest font-medium mb-3">Tu nota personal</h2>
                    <div className="bg-white/[0.03] border border-white/[0.06] p-4 transition-all">
                        <textarea
                            value={noteValue}
                            onChange={(e) => setNoteValue(e.target.value)}
                            onFocus={() => setIsNoteFocused(true)}
                            onBlur={() => {
                                handleSaveNote()
                                setIsNoteFocused(false)
                            }}
                            className="w-full bg-transparent text-white/80 text-sm resize-none outline-none leading-relaxed placeholder:text-white/20 transition-colors"
                            rows={4}
                            placeholder="Haz clic para añadir una nota..."
                        />
                        {isNoteFocused && (
                            <div className="flex gap-2 justify-end mt-3 pt-3 border-t border-white/10">
                                <button
                                    onClick={() => {
                                        handleSaveNote()
                                        setIsNoteFocused(false)
                                    }}
                                    className="px-3 py-1.5 bg-blue-500/40 text-blue-300 text-sm font-semibold hover:bg-blue-500/50 transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}
            {gameDetail.ratings && gameDetail.ratings.length > 0 && (
                <section>
                    <h2 className="text-xs text-cy uppercase tracking-widest font-medium mb-4">
                        Opiniones de la comunidad
                        {gameDetail.ratings_count && <span className="text-white/25 ml-2">· {gameDetail.ratings_count.toLocaleString()} votos</span>}
                    </h2>
                    <div className="flex flex-col gap-3">
                        {gameDetail.ratings.map((r, rIdx) => (
                            <div key={`rating-${rIdx}`} className="flex items-center gap-4">
                                <span className="text-xs text-white/50 w-24 shrink-0">
                                    {r.title === "exceptional"
                                        ? "Excepcional"
                                        : r.title === "recommended"
                                          ? "Recomendado"
                                          : r.title === "meh"
                                            ? "Regular"
                                            : "Saltárselo"}
                                </span>
                                <div className="flex-1 bg-white/[0.06] h-1">
                                    <motion.div
                                        className={`h-1 ${
                                            r.title === "exceptional"
                                                ? "bg-emerald-500"
                                                : r.title === "recommended"
                                                  ? "bg-blue-500"
                                                  : r.title === "meh"
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${r.percent}%` }}
                                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                    />
                                </div>
                                <span className="text-xs text-white/30 w-8 text-right">{r.percent.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            

            {/* Screenshots */}
            {gameDetail.short_screenshots && gameDetail.short_screenshots.length > 0 && (
                <section>
                    <h2 className="text-xs text-cy uppercase tracking-widest font-medium mb-3">Capturas</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {gameDetail.short_screenshots.slice(0, 8).map((s, index) => (
                            <motion.img
                                key={`screenshot-${index}`}
                                src={s.image}
                                alt=""
                                className="w-full aspect-video object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => {
                                    setSelectedImageIndex(index)
                                    setIsImageModalOpen(true)
                                }}
                                whileHover={{ scale: 1.05 }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Requisitos del sistema */}
            {gameDetail.platforms &&
                gameDetail.platforms.length > 0 &&
                gameDetail.platforms.some((p) => p.platform.name.toLowerCase() === "pc" && p.requirements) && (
                    <section>
                        <h2 className="text-xs text-cy uppercase tracking-widest font-medium mb-3">Requisitos del sistema</h2>
                        <div className="space-y-4">
                            {gameDetail.platforms.map((p, idx) => {
                                if (p.platform.name.toLowerCase() !== "pc" || !p.requirements) return null
                                return (
                                    <div key={`requirements-${idx}`} className="bg-white/[0.03] border border-white/[0.06] p-3">
                                        <h3 className="text-xs text-cyan-300 font-semibold mb-2">{p.platform.name}</h3>

                                        {p.requirements.minimum && (
                                            <div className="mb-2">
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">Mínimo</p>
                                                <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{p.requirements.minimum}</p>
                                            </div>
                                        )}

                                        {p.requirements.recommended && (
                                            <div>
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1">Recomendado</p>
                                                <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{p.requirements.recommended}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

            {/* Tags */}
            {(gameDetail.tags?.length ?? 0) > 0 && (
                <section>
                    <h2 className="text-xs text-cy uppercase tracking-widest font-medium mb-3">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {gameDetail.tags?.filter((t) => t.language === "eng")
                            .slice(0, 14)
                            .map((t, idx) => {
                                const tagSlug = t.slug || t.name.toLowerCase().replace(/\s+/g, "-")
                                return (
                                    <button
                                        key={`tag-${idx}`}
                                        onClick={() => navigate(`/explore?tags=${encodeURIComponent(tagSlug)}`)}
                                        className="px-3 py-1 bg-white/[0.04] text-white/50 text-xs border border-white/[0.07] hover:text-white/70 hover:bg-white/[0.07] transition-all cursor-pointer"
                                    >
                                        {t.name}
                                    </button>
                                )
                            })}
                    </div>
                </section>
            )}
        </div>
    )
}
