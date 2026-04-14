import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {motion} from 'framer-motion'
import { getGameDetail, updateGameNote, updateGameRating, updateGameStatus, addGameToLibrary, deleteGameFromLibrary } from '@/services/gamesService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/CyberToast'
import type { Game } from '@/types/game'
import { Glitch } from '@/components/ui/Glitch'

export const GameDetailPage = () => {
    const { game } = useLocation().state
    const user = useAuthStore(state => state.user)
    const { toast } = useToast()
    // Limpiar los campos personales del objeto game para que no interfieran
    const cleanedGame = { ...game, rating: undefined, note: undefined, status: undefined }
    const [gameDetail, setGameDetail] = useState<Game>(cleanedGame)
    const [editNote, setEditNote] = useState(false)
    const [editRating, setEditRating] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [noteValue, setNoteValue] = useState("")
    const [ratingValue, setRatingValue] = useState(0)
    const [statusValue, setStatusValue] = useState<'playing' | 'completed' | 'dropped' | 'wishlist' | null>(null)
    const [isInLibrary, setIsInLibrary] = useState(false)
    const [addingToLibrary, setAddingToLibrary] = useState(false)
    const [deletingFromLibrary, setDeletingFromLibrary] = useState(false)
    const fetchedRef = useRef(false)

    useEffect(() => {
        if (user?.id && !fetchedRef.current) {
            fetchedRef.current = true
            const fetchGameDetail = async () => {
                try {
                    const detail = await getGameDetail(game.id, user.id)
                    setGameDetail(detail)
                    setNoteValue(detail.note || "")
                    setRatingValue(detail.rating || 0)
                    setStatusValue(detail.status || null)
                    // Usar la propiedad _inLibrary que viene del servidor
                    setIsInLibrary(!!(detail as any)._inLibrary)
                } catch (error) {
                    console.error("Error fetching game detail:", error)
                    setGameDetail(game)
                } finally {
                    // Loading complete
                }
            }
            fetchGameDetail()
        } else if (!user?.id) {
            // Not logged in
        }
    }, [game.id, user?.id])

    const handleSaveNote = async () => {
        if (!user?.id) return
        try {
            await updateGameNote(game.id, user.id, noteValue || null)
            setGameDetail({ ...gameDetail, note: noteValue || null })
            setEditNote(false)
        } catch (error) { console.error("Error updating note:", error) }
    }

    const handleSaveRating = async () => {
        if (!user?.id) return
        try {
            await updateGameRating(game.id, user.id, ratingValue || null)
            setGameDetail({ ...gameDetail, rating: ratingValue || null })
            setEditRating(false)
        } catch (error) { console.error("Error updating rating:", error) }
    }

    const handleSaveStatus = async () => {
        if (!user?.id) return
        try {
            await updateGameStatus(game.id, user.id, statusValue)
            setGameDetail({ ...gameDetail, status: statusValue })
            setEditStatus(false)
        } catch (error) { console.error("Error updating status:", error) }
    }

    const handleAddToLibrary = async () => {
        if (!user?.id) return
        setAddingToLibrary(true)
        try {
            await addGameToLibrary(game, user.id)
            // Resetear los valores personales después de agregar
            setNoteValue("")
            setRatingValue(0)
            setStatusValue(null)
            // Actualizar gameDetail para no mostrar datos del juego original
            setGameDetail({
                ...gameDetail,
                note: null,
                rating: null,
                status: null
            })
            setIsInLibrary(true)
            toast({
                variant: 'success',
                title: 'Éxito',
                message: `${game.name} añadido a tu biblioteca`,
                duration: 3500
            })
        } catch (error) {
            console.error("Error adding game to library:", error)
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo añadir el juego',
                duration: 3500
            })
        } finally {
            setAddingToLibrary(false)
        }
    }

    const handleDeleteFromLibrary = async () => {
        if (!user?.id) return
        setDeletingFromLibrary(true)
        try {
            await deleteGameFromLibrary(game.id, user.id)
            setIsInLibrary(false)
            // Resetear los valores personales al eliminar
            setNoteValue("")
            setRatingValue(0)
            setStatusValue(null)
            toast({
                variant: 'success',
                title: 'Eliminado',
                message: `${game.name} eliminado de tu biblioteca`,
                duration: 3500
            })
        } catch (error) {
            console.error("Error deleting game from library:", error)
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo eliminar el juego',
                duration: 3500
            })
        } finally {
            setDeletingFromLibrary(false)
        }
    }

    const statusConfig = {
        completed: { label: "✓ Completado", classes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30" },
        playing:   { label: "▶ Jugando",    classes: "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30" },
        dropped:   { label: "✕ Abandonado", classes: "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30" },
        wishlist:  { label: "♥ Wishlist",   classes: "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30" },
    }

    return (
        <div className=" bg-[#0a0a0a] text-white">

            {/* ══════════════════════════════════════════
                HERO — ocupa pantalla completa estilo Netflix
            ══════════════════════════════════════════ */}
            <div className="relative w-full h-[70vh] overflow-hidden">

                {/* Imagen hero */}
                {gameDetail.background_image && (
                    <motion.img
                        src={ gameDetail.background_image}
                        alt={gameDetail.name}
                        className="absolute inset-0 w-full h-full object-cover object-right-top"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                )}

                {/* Gradientes para legibilidad — capas Netflix */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-transparent to-transparent" />
  
                {/* Contenido encima del hero */}
                <div className="absolute inset-0 flex items-end lg:items-center">
                    <div className="w-full px-6 py-8 lg:px-16 lg:py-12 2xl:px-32 2xl:py-20">
                        <div className="max-w-2xl flex flex-col gap-4">

                            {/* TBA badge */}
                            {gameDetail.tba && (
                                <span className="self-start px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold uppercase tracking-widest">
                                    Por anunciar
                                </span>
                            )}

                            {/* Géneros */}
                            

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
                                    {gameDetail.genres.map((g) => (
                                        <span key={g.id} className="text-xs text-white/60 uppercase tracking-widest font-medium">
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
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
                                            gameDetail.metacritic >= 80 ? "text-green-400 border-green-500/50 bg-green-500/10" :
                                            gameDetail.metacritic >= 60 ? "text-yellow-400 border-yellow-500/50 bg-yellow-500/10" :
                                                                          "text-red-400 border-red-500/50 bg-red-500/10"
                                        }`}>
                                            {gameDetail.metacritic}
                                        </span>
                                        <span className="text-xs text-yellow/40">Metacritic</span>
                                    </div>
                                )}
                                {gameDetail.released && (
                                    <span className="text-sm text-white/50">
                                        {new Date(gameDetail.released).getFullYear()}
                                    </span>
                                )}
                                {gameDetail.playtime != null && gameDetail.playtime > 0 && (
                                    <span className="text-sm text-white/50">{gameDetail.playtime}h promedio</span>
                                )}
                                {gameDetail.esrb_rating && (
                                    <span className="text-xs px-2 py-0.5 border border-white/20 text-white/40 rounded font-mono">
                                        {gameDetail.esrb_rating.name_en}
                                    </span>
                                )}
                            </motion.div>

                            {/* Descripción corta en el hero */}
                            {gameDetail.description && (
                                <motion.div
                                    className="text-white/70 text-sm leading-relaxed line-clamp-3 max-w-xl prose prose-invert prose-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    dangerouslySetInnerHTML={{ __html: gameDetail.description }}
                                />
                            )}

                            {/* Botones de acción */}
                            <motion.div
                                className="flex items-center gap-3 flex-wrap mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                {/* Status — editable */}
                                {user?.id && isInLibrary && (
                                    !editStatus ? (
                                        <button
                                            onClick={() => setEditStatus(true)}
                                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold border backdrop-blur-sm transition-all duration-200 ${
                                                statusValue
                                                    ? statusConfig[statusValue].classes
                                                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                                            }`}
                                        >
                                            {statusValue ? statusConfig[statusValue].label : "+ ESTADO"}
                                        </button>
                                    ) : (
                                        <select
                                            autoFocus
                                            value={statusValue || ""}
                                            onChange={(e) => setStatusValue((e.target.value as any) || null)}
                                            onBlur={handleSaveStatus}
                                            className="bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg text-sm border border-white/20 outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sin estado</option>
                                            <option value="playing">▶ Jugando</option>
                                            <option value="completed">✓ Completado</option>
                                            <option value="dropped">✕ Abandonado</option>
                                            <option value="wishlist">♥ Wishlist</option>
                                        </select>
                                    )
                                )}

                                {/* Website */}
                                {gameDetail.website && (
                                    <a
                                        href={gameDetail.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                                    >
                                        Sitio oficial ↗
                                    </a>
                                )}

                                {/* Añadir a biblioteca */}
                                {user?.id && !isInLibrary && (
                                    <button
                                        onClick={handleAddToLibrary}
                                        disabled={addingToLibrary}
                                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToLibrary ? "Agregando..." : "+ Agregar a biblioteca"}
                                    </button>
                                )}

                                {/* Eliminar de biblioteca */}
                                {user?.id && isInLibrary && (
                                    <button
                                        onClick={handleDeleteFromLibrary}
                                        disabled={deletingFromLibrary}
                                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingFromLibrary ? "Eliminando..." : "✕ Eliminar de biblioteca"}
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                CONTENIDO PRINCIPAL
            ══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-8 py-2 flex flex-col gap-10">

                {/* ── FILA SUPERIOR: Stats + Personal ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Metacritic grande */}
                    {gameDetail.metacritic != null && (
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-1">
                            <span className="text-[11px] text-blue-300 uppercase tracking-widest font-medium">Metacritic</span>
                            <span className={`text-4xl font-black ${
                                gameDetail.metacritic >= 80 ? "text-green-400" :
                                gameDetail.metacritic >= 60 ? "text-yellow-400" : "text-red-400"
                            }`}>{gameDetail.metacritic}</span>
                            <span className="text-[11px] text-white/30">de 100</span>
                        </div>
                    )}

                    {/* Rating personal */}
                    {user?.id && isInLibrary && (
                        <div
                            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-1 cursor-pointer hover:bg-white/[0.06] transition-all group"
                            onClick={() => setEditRating(true)}
                        >
                            <span className="text-[11px] text-blue-300 uppercase tracking-widest font-medium">Mi Rating</span>
                            {!editRating ? (
                                <>
                                    <span className="text-4xl font-black text-amber-400">
                                        {ratingValue ? ratingValue.toFixed(1) : <span className="text-white/20 text-2xl">—</span>}
                                    </span>
                                    <div className="flex gap-0.5 mt-0.5">
                                        {[1,2,3,4,5].map((s) => (
                                            <span key={s} className={`text-xs ${s <= Math.round(ratingValue) ? "text-amber-400" : "text-white/15"}`}>★</span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <input
                                    autoFocus
                                    type="number" min="0" max="5" step="0.5"
                                    value={ratingValue}
                                    onChange={(e) => setRatingValue(parseFloat(e.target.value) || 0)}
                                    onBlur={handleSaveRating}
                                    className="bg-white/10 text-white px-2 py-1 rounded-lg w-20 text-sm text-center border border-white/20 outline-none mt-1"
                                />
                            )}
                        </div>
                    )}

                    {/* Fecha lanzamiento */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-1">
                        <span className="text-[11px] text-blue-300 uppercase tracking-widest font-medium">Lanzamiento</span>
                        <span className="text-lg font-bold text-white/90">
                            {gameDetail.released
                                ? new Date(gameDetail.released).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                                : "—"}
                        </span>
                    </div>

                    {/* Playtime */}
                    {gameDetail.playtime != null && gameDetail.playtime > 0 && (
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-1">
                            <span className="text-[11px] text-blue-300 uppercase tracking-widest font-medium">Tiempo medio</span>
                            <span className="text-4xl font-black text-white/90">{gameDetail.playtime}<span className="text-lg text-white/30 font-normal"> h</span></span>
                        </div>
                    )}
                </div>

                {/* ── DOS COLUMNAS: info + sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Columna izquierda (2/3) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Opiniones / Ratings bar */}
                        {gameDetail.ratings && gameDetail.ratings.length > 0 && (
                            <section>
                                <h2 className="text-xs text-yellow-300 uppercase tracking-widest font-medium mb-4">
                                    Opiniones de la comunidad
                                    {gameDetail.ratings_count && <span className="text-white/25 ml-2">· {gameDetail.ratings_count.toLocaleString()} votos</span>}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {gameDetail.ratings.map((r) => (
                                        <div key={r.id} className="flex items-center gap-4">
                                            <span className="text-xs text-white/50 w-24 shrink-0">{
                                                r.title === "exceptional" ? "Excepcional" :
                                                r.title === "recommended" ? "Recomendado" :
                                                r.title === "meh"         ? "Regular" : "Saltárselo"
                                            }</span>
                                            <div className="flex-1 bg-white/[0.06] rounded-full h-1">
                                                <motion.div
                                                    className={`h-1 rounded-full ${
                                                        r.title === "exceptional" ? "bg-emerald-500" :
                                                        r.title === "recommended" ? "bg-blue-500" :
                                                        r.title === "meh"         ? "bg-amber-500" : "bg-red-500"
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

                        {/* Nota personal */}
                        {user?.id && isInLibrary && (
                            <section>
                                <h2 className="text-xs text-yellow-300 uppercase tracking-widest font-medium mb-3">Tu nota personal</h2>
                                <div
                                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all min-h-[80px]"
                                    onClick={() => setEditNote(true)}
                                >
                                    {!editNote ? (
                                        noteValue
                                            ? <p className="text-white/70 text-sm leading-relaxed">{noteValue}</p>
                                            : <p className="text-white/20 text-sm italic">Haz clic para añadir una nota...</p>
                                    ) : (
                                        <textarea
                                            autoFocus
                                            value={noteValue}
                                            onChange={(e) => setNoteValue(e.target.value)}
                                            onBlur={handleSaveNote}
                                            className="w-full bg-transparent text-white/80 text-sm resize-none outline-none leading-relaxed placeholder:text-white/20"
                                            rows={4}
                                            placeholder="Escribe tu nota aquí..."
                                        />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Screenshots */}
                        {gameDetail.short_screenshots && gameDetail.short_screenshots.length > 1 && (
                            <section>
                                <h2 className="text-xs text-yellow-300 uppercase tracking-widest font-medium mb-3">Capturas</h2>
                                <div className="grid grid-cols-3 gap-2">
                                    {gameDetail.short_screenshots.slice(1, 7).map((s) => (
                                        <motion.img
                                            key={s.id}
                                            src={s.image}
                                            alt=""
                                            className="w-full aspect-video object-cover rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                 
                        {/* Tags */}
                        {(gameDetail.tags?.length ?? 0) > 0 && (
                            <section>
                                <h2 className="text-xs text-yellow-300 uppercase tracking-widest font-medium mb-3">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {gameDetail.tags?.filter(t => t.language === "eng").slice(0, 14).map((t) => (
                                        <span key={t.id} className="px-3 py-1 bg-white/[0.04] text-white/50 text-xs rounded-full border border-white/[0.07] hover:text-white/70 hover:bg-white/[0.07] transition-all cursor-default">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                   

                    {/* Columna derecha — sidebar (1/3) */}
                    <div className="flex flex-col gap-5">
                         {/* Metacritic por plataforma */}
                        {gameDetail.metacritic_platforms && gameDetail.metacritic_platforms.length > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Metacritic por plataforma</p>
                                <div className="flex flex-col gap-2">
                                    {gameDetail.metacritic_platforms.map((mp, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-xs text-white/50">{mp.platform.name}</span>
                                            <span className={`text-sm font-bold ${
                                                mp.metascore >= 80 ? "text-green-400" :
                                                mp.metascore >= 60 ? "text-yellow-400" : "text-red-400"
                                            }`}>{mp.metascore}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Plataformas */}
                        {gameDetail.platforms?.length > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Plataformas</p>
                                <div className="flex flex-col gap-2">
                                    {gameDetail.platforms.map((p) => (
                                        <span key={p.platform.id} className="text-sm text-white/70">{p.platform.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Developers */}
                        {gameDetail.developers && gameDetail.developers.length > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Desarrollador</p>
                                <div className="flex flex-col gap-1">
                                    {gameDetail.developers.map((d) => (
                                        <span key={d.id} className="text-sm text-white/70">{d.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Publishers */}
                        {gameDetail.publishers && gameDetail.publishers.length > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Distribuidora</p>
                                <div className="flex flex-col gap-1">
                                    {gameDetail.publishers.map((p) => (
                                        <span key={p.id} className="text-sm text-white/70">{p.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stores */}
                        {(gameDetail.stores?.length ?? 0) > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Disponible en</p>
                                <div className="flex flex-col gap-2">
                                    {gameDetail.stores?.map((s) => (
                                        <span key={s.store.id} className="text-sm text-white/70">{s.store.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ESRB */}
                        {gameDetail.esrb_rating && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                                <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">Clasificación</p>
                                <span className="text-sm font-mono text-white/60 border border-white/20 px-3 py-1 rounded">
                                    {gameDetail.esrb_rating.name_en}
                                </span>
                            </div>
                        )}

                        {/* Fecha agregado */}
                        {user?.id && isInLibrary && gameDetail.date_created && (
                            <p className="text-xs text-white/20 px-1">
                                Agregado el {new Date(gameDetail.date_created).toLocaleDateString("es-ES", {
                                    day: "numeric", month: "long", year: "numeric"
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}