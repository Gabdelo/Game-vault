import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Game } from '@/types/game'
import GameCard from './ui/GameCard'
import GameCardSkeleton from './ui/GameCardSkeleton'

interface HorizontalCarouselProps {
    title: string
    games: Game[]
    loading: boolean
    userId?: string
    libraryGameIds: Set<number>
    onAddToLibrary: (gameId: number) => void
}

export const HorizontalCarousel = ({
    title,
    games,
    loading,
    userId,
    libraryGameIds,
    onAddToLibrary
}: HorizontalCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return
        const scrollAmount = 300
        const newScroll = direction === 'left'
            ? scrollContainerRef.current.scrollLeft - scrollAmount
            : scrollContainerRef.current.scrollLeft + scrollAmount
        
        scrollContainerRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
        updateScrollButtons()
    }

    const updateScrollButtons = () => {
        if (!scrollContainerRef.current) return
        setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0)
        setCanScrollRight(
            scrollContainerRef.current.scrollLeft <
            scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
        )
    }

    const handleScroll = () => updateScrollButtons()

    return (
        <div className="mb-12">
            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-4 px-4">{title}</h2>

            {/* Carrusel horizontal */}
            <div className="relative group">
                {/* Botón izquierda */}
                {canScrollLeft && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-r-lg backdrop-blur-sm transition-all"
                        onClick={() => scroll('left')}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                )}

                {/* Contenedor scrolleable */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="overflow-x-auto scrollbar-hide"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex gap-44 pb-4 w-max">
                        {loading ? (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <div key={`skeleton-${i}`} className="flex-shrink-0 w-48">
                                        <GameCardSkeleton />
                                    </div>
                                ))}
                            </>
                        ) : (
                            games.map(game => (
                                <motion.div
                                    key={game.id}
                                    className="flex-shrink-0 w-48"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GameCard
                                        game={game}
                                        userId={userId}
                                        isInLibrary={libraryGameIds.has(game.id)}
                                        onAddToLibrary={() => onAddToLibrary(game.id)}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Botón derecha */}
                {canScrollRight && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-l-lg backdrop-blur-sm transition-all"
                        onClick={() => scroll('right')}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                )}
            </div>
        </div>
    )
}
