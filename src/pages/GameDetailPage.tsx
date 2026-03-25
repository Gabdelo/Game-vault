import { useLocation } from 'react-router-dom'
import {motion} from 'framer-motion'

export const GameDetailPage = () => {
    const { game } = useLocation().state

    return (
        <div className="justify-center items-center mx-auto text-center">
            <div className="relative w-full bg-gray-800 rounded mb-4">
                {game.background_image && (
                <motion.img 
                    src={game.background_image} 
                    alt={game.name} 
                    className="w-full h-[30rem] object-cover object-[0_-7rem]" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                />
            )}
            <h1 className="absolute bottom-4 left-4 text-4xl font-bold mb-4  bg-black bg-opacity-50 text-white p-4">
                {game.name}
            </h1>
            </div>
            <p className="mb-2"><strong>Géneros:</strong> {game.genres?.length ? game.genres.map((g) => g.name).join(", ") : "N/A"}</p>
            <p className="mb-2"><strong>Plataformas:</strong> {game.platforms?.length ? game.platforms.map((p) => p.platform.name).join(", ") : "N/A"}</p>
            <p className="mb-2"><strong>Metacritic:</strong> {game.metacritic ?? "N/A"}</p>
            <p className="mb-2"><strong>Fecha de lanzamiento:</strong> {game.release ?? "N/A"}</p>
        </div>
    )
}