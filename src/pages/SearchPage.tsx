import { useState, useEffect } from "react";
import { searchGames } from "../services/gamesService";
import type { Game } from "../types/game";
import { useSearch } from "../hooks/useSearch";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";
import { Navbar } from "../layout/Navbar";
import { useAuthStore } from "../store/authStore";
import { Sidebar } from "../layout/Sidebar";


export const SearchPage = () => {
    const user = useAuthStore(state => state.user)
    const [query, setQuery] = useState("")
    const { games, loading } = useSearch(query)
    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">BUSCA UN JUEGO</h2>
                <input className="bg-gray-800 text-white placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Escribe el nombre del juego" />
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