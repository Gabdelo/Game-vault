import { motion } from 'framer-motion'
import { filterStyles } from '@/styles/filterStyle'

interface FilterSidebarProps {
    onGenreSelect?: (genre: string) => void
    onFilterSelect?: (filter: string) => void
    activeGenre?: string
    activeFilter?: string
}

export const FilterSidebar = ({ onGenreSelect, onFilterSelect, activeGenre, activeFilter }: FilterSidebarProps) => {

    const genres = [
        { slug: 'action', name: 'Action' },
        { slug: 'indie', name: 'Indie' },
        { slug: 'adventure', name: 'Adventure' },
        { slug: 'role-playing-games-rpg', name: 'RPG' },
        { slug: 'strategy', name: 'Strategy' },
        { slug: 'shooter', name: 'Shooter' },
        { slug: 'casual', name: 'Casual' },
        { slug: 'simulation', name: 'Simulation' },
        { slug: 'puzzle', name: 'Puzzle' },
        { slug: 'arcade', name: 'Arcade' },
        { slug: 'platformer', name: 'Platformer' },
        { slug: 'racing', name: 'Racing' },
        { slug: 'sports', name: 'Sports' },
        { slug: 'fighting', name: 'Fighting' },
        { slug: 'family', name: 'Family' },
        { slug: 'board-games', name: 'Board Games' },
        { slug: 'educational', name: 'Educational' },
        { slug: 'card', name: 'Card' },
    ]

    const filters = [
        { id: 'rating',     label: 'Más valorados', icon: '◈' },
        { id: 'added',      label: 'Populares',     icon: '◉' },
        { id: 'released',   label: 'Más recientes', icon: '◷' },
        { id: 'metacritic', label: 'Crítica',       icon: '◆' },
    ]

    return (
        <>
            <style>{filterStyles}</style>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2 sm:gap-3 md:gap-4 sticky top-0 pr-0 md:pr-2"
            >
                {/* Filtros rápidos */}
                <div className="sb-panel">
                    <h3 className="sb-heading text-xs sm:text-sm">Filtros</h3>
                    <div className="flex flex-col gap-1 sm:gap-2">
                        {filters.map((filter) => (
                            <motion.button
                                key={filter.id}
                                onClick={() => onFilterSelect?.(filter.id)}
                                whileHover={{ x: 3 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                className={`sb-filter-btn text-xs sm:text-sm py-1 sm:py-2 ${activeFilter === filter.id ? 'active' : ''}`}
                            >
                                <span className="sb-btn-icon">{filter.icon}</span>
                                {filter.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Géneros */}
                <div className="sb-panel">
                    <h3 className="sb-heading text-xs sm:text-sm">Géneros</h3>
                    <div className="sb-genre-list gap-1 sm:gap-2">
                        {genres.map((genre) => (
                            <motion.button
                                key={genre.slug}
                                onClick={() => onGenreSelect?.(genre.slug)}
                                whileHover={{ x: 3 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                className={`sb-genre-btn text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3 ${activeGenre === genre.slug ? 'active' : ''}`}
                            >
                                {genre.name}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Limpiar filtros */}
                {(activeGenre || activeFilter) && (
                    <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        onClick={() => {
                            onGenreSelect?.('')
                            onFilterSelect?.('')
                        }}
                        className="sb-clear-btn text-xs sm:text-sm"
                    >
                        <span style={{ fontSize: '10px' }}>✕</span>
                        Limpiar filtros
                    </motion.button>
                )}
            </motion.div>
        </>
    )
}
