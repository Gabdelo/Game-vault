import '../styles/styles.css'
import type { Game } from '../types/game'
import { addGameToLibrary } from '../services/gamesService'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
type Props = {
    game: Game
    userId?: string

}


export default function GameCard({ game, userId}: Props) {



  const handleAddToLibrary = () => {
    // Aquí iría la lógica para añadir el juego a la biblioteca del usuario
    if (!userId) {
      console.warn("No se puede añadir a la biblioteca: usuario no autenticado")
      return
    }
    console.log(`Añadiendo ${game.id} a la biblioteca del usuario ${userId}`)
    addGameToLibrary(game.id, userId)
    console.log(`Añadir ${game.name} a la biblioteca`)
  }
  return (
    <div className="game-card p-4">

      <Link to={`/game/${game.id}`} state={{game}}>
        <motion.img
        src={game.background_image ?? "https://placehold.co/600x400"}
        alt={game.name}
        className="w-50 h-48 object-cover rounded-lg"
        onError={(event) => {
          const target = event.currentTarget as HTMLImageElement
          target.src = "https://placehold.co/600x400"
        }}
      />
      <h3 className='font-orbitron text-xl tracking-wide'>
        {game.name}
      </h3>
      </Link>
      <p>
        Géneros: {game.genres?.length ? game.genres.map((g) => g.name).join(", ") : "N/A"}
      </p>
      <p>
        Plataformas: {game.platforms?.length ? game.platforms.map((p) => p.platform.name).join(", ") : "N/A"}
      </p>
      <p>
        Metacritic: {game.metacritic ?? "N/A"}
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={handleAddToLibrary}>
        AÑADIR
      </button>
    </div>
  )
}