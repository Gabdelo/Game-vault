import '../../styles/styles.css'
import type { Game } from '../../types/game'
import { addGameToLibrary } from '../../services/gamesService'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cardStyles } from '../../styles/cardStyle'

type Props = {
    game: Game
    userId?: string
    isInLibrary?: boolean
    onAddToLibrary?: () => void
}


export default function GameCard({ game, userId, isInLibrary, onAddToLibrary }: Props) {
  const [inLibrary, setInLibrary] = useState(isInLibrary || false)
  
  // Actualizar estado local cuando la prop cambia
  useEffect(() => {
    setInLibrary(isInLibrary || false)
  }, [isInLibrary])
  
  const handleAddToLibrary = async () => {
    if (!userId) {
      console.warn("No se puede añadir a la biblioteca: usuario no autenticado")
      return
    }
    try {
      // Cambio inmediato del estado local
      setInLibrary(true)
      await addGameToLibrary(game, userId)
      onAddToLibrary?.()
    } catch (error) {
      console.error("Error añadiendo juego a la biblioteca:", error)
      // Revertir en caso de error
      setInLibrary(false)
    }
  }
  

  const metacritic = game.metacritic ?? 0
  const genres = game.genres?.map(g => g.name) || []
  const platforms = game.platforms?.map(p => p.platform.name).join(", ") || "N/A"

  return (
    <>
      <style>{cardStyles}</style>
      <Link to={`/game/${game.id}`} state={{ game }}>
        <motion.div
          className="cp-card"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image Section */}
          <div className="cp-card__img-wrap">
            <img
              className="cp-card__img"
              src={game.background_image ?? "https://placehold.co/600x400"}
              alt={game.name}
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement
                target.src = "https://placehold.co/600x400"
              }}
            />
            <div className="cp-card__img-overlay" />
            <div className="cp-card__img-scanlines" />

            {/* Rating Badge */}
            {metacritic > 0 && (
              <div className="cp-card__rating">{metacritic}</div>
            )}

            {/* Corner Accent */}
            <div className="cp-card__corner-accent" />
          </div>

          {/* Body Section */}
          <div className="cp-card__body">
            {/* Title */}
            <h3 className="cp-card__title">{game.name}</h3>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="cp-card__genres">
                {genres.slice(0, 2).map(genre => (
                  <span key={genre} className="cp-card__genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Meta Info */}
            <div className="cp-card__meta">
              {platforms && (
                <div className="cp-card__meta-item">
                  <span className="cp-card__meta-key">Plataformas</span>
                  <span className="cp-card__meta-val" style={{ fontSize: 11 }}>
                    {platforms.substring(0, 20)}...
                  </span>
                </div>
              )}
              {game.released && (
                <div className="cp-card__meta-item">
                  <span className="cp-card__meta-key">Año</span>
                  <span className="cp-card__meta-val">
                    {new Date(game.released).getFullYear()}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="cp-card__divider" />

            {/* Footer with Button */}
            <div className="cp-card__footer">
              <button
                className="cp-card__add-btn"
                onClick={(e) => {
                  e.preventDefault()
                  if (!inLibrary) {
                    handleAddToLibrary()
                  }
                }}
                disabled={inLibrary}
                style={{
                  opacity: inLibrary ? 0.5 : 1,
                  cursor: inLibrary ? "not-allowed" : "pointer"
                }}
              >
                {inLibrary ? "✓ EN LIBRERÍA" : "AÑADIR"}
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </>
  )
}