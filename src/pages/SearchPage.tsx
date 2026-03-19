import { useState, useEffect } from "react";
import { searchGames } from "../services/gamesService";
import type { Game } from "../types/game";
import { useSearch } from "../hooks/useSearch";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";
import { Navbar } from "../layout/Navbar";
import { useAuthStore } from "../store/authStore";

export const SearchPage = () => {
    const user = useAuthStore(state => state.user)
    const [query, setQuery] = useState("")
    const { games, loading } = useSearch(query)
    return (
        <div>
            <Navbar />
            <div>
            <h2 className="text-3xl">BUSCA UN JUEGO</h2>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Escribe el nombre del juego" />
        </div>
        {loading && <p>Cargando...</p>}
        <div className="flex flex-wrap justify-center">
            {games.map(game => (
                <GameCard key={game.id} game={game} userId={user?.id} />
            ))}
        </div>
        </div>
    )

}