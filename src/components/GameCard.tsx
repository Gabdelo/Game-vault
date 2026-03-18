import '../styles/styles.css'
import type { Game } from '../types/game'
type Props = {
    game: Game
}


export default function GameCard({ game }: Props) {
  return (
    <div className="game-card p-4">

      <h3 className='font-orbitron text-xl tracking-wide'>
        {game.name}
      </h3>
      
      <img
        src={game.background_image ?? "https://via.placeholder.com/640x480?text=No+Image"}
        alt={game.name}
        className="w-50 h-48 object-cover rounded-lg"
      />

      <p>
        Géneros: {game.genres.map(g => g.name).join(", ")}
      </p>

      <p>
        Plataformas: {game.platforms
          .map(p => p.platform.name)
          .join(", ")}
      </p>

      <p>
        Metacritic: {game.metacritic ?? "N/A"}
      </p>

    </div>
  )
}