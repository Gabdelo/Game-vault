import { useState, useEffect } from "react";
import { searchGames } from "../services/gamesService";
import type { Game } from "../types/game";
import { useSearch } from "../hooks/useSearch";
import GameCard from "../components/GameCard";


export default function SearchPage() {
    const [query, setQuery] = useState("")
    const { games, loading } = useSearch(query)
    return (
        <div>
            <div>
            <h2 className="text-3xl">BUSCA UN JUEGO</h2>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Escribe el nombre del juego" />
        </div>
        {loading && <p>Cargando...</p>}
        
        <div className="flex flex-wrap justify-center">
            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
        </div>
    )

}