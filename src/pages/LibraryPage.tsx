import { useEffect } from "react"

import { useAuthStore } from "../store/authStore"
import { useState } from "react"
import { useLibrary } from "../hooks/useLibrary"

export const LibraryPage = () => {
    const user = useAuthStore(state => state.user)
    const id = user?.id || ""
    const { games, loading } = useLibrary(id)

    return (
        <div>
            <h2 className="text-3xl">TU BIBLIOTECA</h2>
            <p>Aquí podrás ver los juegos que has agregado a tu biblioteca.</p>
            {loading && <p>Cargando tu biblioteca...</p>}
            <div className="flex flex-wrap justify-center">
                {games.map(game => (
                    <div key={game.id} className="bg-gray-200 p-4 m-2 rounded">
                        <h3 className="text-xl">{game.name}</h3>

                    </div>
                ))}
            </div>
        </div>
    )
}