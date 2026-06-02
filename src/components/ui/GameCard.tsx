import type { Game } from '../../types/game'
import { addGameToLibrary, deleteGameFromLibrary } from '../../services/gamesService'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


type Props = {
  game: Game
  userId?: string
  isInLibrary?: boolean
  onAddToLibrary?: () => void
}

const ACCENT: Record<string, { from: string; to: string; text: string; bg: string; border: string; tag: string }> = {
  RPG:          { from: '#7c3aed', to: '#a855f7', text: '#a78bfa', bg: 'rgba(124,58,237,0.12)',  border: 'rgba(124,58,237,0.22)', tag: 'RPG' },
  Action:       { from: '#ec4899', to: '#f472b6', text: '#f9a8d4', bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.22)', tag: 'Action' },
  Indie:        { from: '#0ea5e9', to: '#38bdf8', text: '#7dd3fc', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.22)', tag: 'Indie' },
  Adventure:    { from: '#f59e0b', to: '#fbbf24', text: '#fde68a', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.22)', tag: 'Adventure' },
  Strategy:     { from: '#10b981', to: '#34d399', text: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.22)', tag: 'Strategy' },
  Shooter:      { from: '#ef4444', to: '#f87171', text: '#fca5a5', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.22)', tag: 'Shooter' },
  Casual:       { from: '#06b6d4', to: '#22d3ee', text: '#67e8f9', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.22)', tag: 'Casual' },
  Simulation:   { from: '#8b5cf6', to: '#c084fc', text: '#ddd6fe', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.22)', tag: 'Simulation' },
  Puzzle:       { from: '#3b82f6', to: '#60a5fa', text: '#93c5fd', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.22)', tag: 'Puzzle' },
  Arcade:       { from: '#f97316', to: '#fb923c', text: '#fdba74', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.22)', tag: 'Arcade' },
  Platformer:   { from: '#14b8a6', to: '#2dd4bf', text: '#99f6e4', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.22)', tag: 'Platformer' },
  'Massively Multiplayer': { from: '#d946ef', to: '#f472b6', text: '#f9a8d4', bg: 'rgba(217,70,239,0.12)',  border: 'rgba(217,70,239,0.22)', tag: 'MMO' },
  Racing:       { from: '#ea580c', to: '#f97316', text: '#fdba74', bg: 'rgba(234,88,12,0.12)',   border: 'rgba(234,88,12,0.22)', tag: 'Racing' },
  Sports:       { from: '#2563eb', to: '#3b82f6', text: '#93c5fd', bg: 'rgba(37,99,235,0.12)',   border: 'rgba(37,99,235,0.22)', tag: 'Sports' },
  Fighting:     { from: '#dc2626', to: '#ef4444', text: '#fca5a5', bg: 'rgba(220,38,38,0.12)',   border: 'rgba(220,38,38,0.22)', tag: 'Fighting' },
  Family:       { from: '#ec4899', to: '#f472b6', text: '#fbcfe8', bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.22)', tag: 'Family' },
  'Board Games': { from: '#f59e0b', to: '#fbbf24', text: '#fde68a', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.22)', tag: 'Board' },
  Card:         { from: '#8b5cf6', to: '#a855f7', text: '#c084fc', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.22)', tag: 'Card' },
  Educational: { from: '#06b6d4', to: '#0ea5e9', text: '#7dd3fc', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.22)', tag: 'Educational' },
  default:      { from: '#6366f1', to: '#818cf8', text: '#a5b4fc', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.22)', tag: '' },
}

function getAccent(genres: string[]) {
  for (const g of genres) if (ACCENT[g]) return ACCENT[g]
  return ACCENT.default
}

export default function GameCard({ game, userId, isInLibrary, onAddToLibrary }: Props) {
  const [inLibrary, setInLibrary] = useState(isInLibrary || false)

  useEffect(() => { setInLibrary(isInLibrary || false) }, [isInLibrary])

  const handleAddToLibrary = async () => {
    if (!userId) return
    try {
      setInLibrary(true)
      await addGameToLibrary(game, userId)
      onAddToLibrary?.()
    } catch {
      setInLibrary(false)
    }
  }

  const handleDeleteFromLibrary = async () => {
    if (!userId) return
    try {
      setInLibrary(false)
      await deleteGameFromLibrary(game.id, userId)
    } catch {
      setInLibrary(true)
    }
  }

  const handleToggleLibrary = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (inLibrary) {
      await handleDeleteFromLibrary()
    } else {
      await handleAddToLibrary()
    }
  }

  const metacritic = game.metacritic ?? "No rated"
  const score      = metacritic 
  const genres     = game.genres?.map(g => g.name) || []
  const platforms  = game.platforms?.map(p => p.platform.name) || []
  const year       = game.released ? new Date(game.released).getFullYear() : null
  const accent     = getAccent(genres)
  const primaryTag = genres[0] ?? ''

  return (
    <Link to={`/game/${game.id}`} className="block w-[19rem] md:w-[17rem] min-h-[270px] md:h-[370px] p-3" >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className=" relative  overflow-hidden cursor-pointer h-full flex flex-col"
        style={{
          background: '#131318',
          border: inLibrary ? '1px solid rgba(34,197,94,0.18)' : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0 md:min-h-[200px]" style={{ height: 180 }}>
          {game.background_image ? (
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-300 "
            />
          ) : (
            <img
              src={'/placeholder.png'}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(0,0,0,0) 30%,rgba(9,9,15,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 50%,#131318 100%)' }} />

          {/* Top row */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center min-h-7">
           
            {score && (
              <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(20,20,28,0.82)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                
                <span className="text-[10px] font-bold text-cy">{score} </span>
              </div>
            )}
          </div>

          {/* Title on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-extrabold leading-tight line-clamp-2" style={{ fontSize: 16, letterSpacing: '-0.03em', textShadow: '0 2px 12px rgba(0,0,0,0.8)', minHeight: '2.5rem' }}>
              {game.name}
            </h3>
            <p className="font-medium mt-0.5 h-4" style={{ fontSize: 10, color: 'rgba(255,255,0,0.9)' }}>
              {year ? `${year}` : ''}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-3.5 pb-3.5 pt-3 flex flex-col flex-grow">
          {/* Platform + score bar */}
          <div className="flex items-center gap-2 mb-3 h-3">
            <span className="font-bold uppercase tracking-wider shrink-0 text-cyan-400" style={{ fontSize: 9 }}>
              {platforms.slice(0, 3).map(p => p.split(' ')[0]).join(' · ') || 'N/A'}
            </span>
            
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3.5 min-h-7">
            {primaryTag && (
              <span className="text-[9px] font-semibold px-2 py-1.5 " style={{ color: accent.text, background: accent.bg, border: `1px solid ${accent.border}` }}>
                {primaryTag}
              </span>
            )}
            {genres.slice(1, 3).map(g => (
              <span key={g} className="text-[9px] font-semibold px-2 py-1.5 " style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {g}
              </span>
            ))}
          </div>

          {/* Spacer para empujar el botón al final */}
          <div className="flex-grow" />

          {/* Button */}
          {userId && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleToggleLibrary}
              className="w-full py-2.5  text-[11px] font-bold uppercase tracking-wider border-none text-white transition-all "
              style={inLibrary
                ? { background: 'rgba(39, 221, 245, 0.2)', border: '1px solid cyan', color: 'rgba(39, 221, 245, 0.8)', cursor: 'pointer' }
                : { background: 'linear-gradient(135deg, #F2FF00, #FBFF00)', cursor: 'pointer', color: '#000000', clipPath: 'polygon(0% 0%, 95% 0%, 100% 30%, 100% 100%, 5% 100%, 0% 70%)' }
              }
            >
              {inLibrary ? '✕ Eliminar de biblioteca' : '+ Añadir a biblioteca'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </Link>
  )
}