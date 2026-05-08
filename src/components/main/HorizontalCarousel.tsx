import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Game } from '@/types/game'
import GameCard from '../ui/GameCard'
import GameCardSkeleton from '../ui/GameCardSkeleton'

const useResponsiveCarouselWidth = () => {
    const [width, setWidth] = useState<number>(0)

    useEffect(() => {
        setWidth(window.innerWidth)
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const getCardWidth = (): string => {
        if (width < 360) return 'calc(100vw - 30px)'
        if (width < 375) return 'calc(100vw - 45px)'
        if (width < 390) return 'calc(100vw - 55px)'
        if (width < 412) return 'calc(100vw - 70px)'
        if (width < 430) return 'calc(100vw - 95px)'
        if (width < 512) return 'calc(100vw - 105px)'
        return '16rem' // lg: w-64 (256px)
    }

    return getCardWidth()
}

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
    const cardWidth = useResponsiveCarouselWidth()

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
        <div className="ml-2">
            {/* Título */}
          <h2 className="text-2xl font-bold textcyblack-white px-4">{title}</h2>

            {/* Carrusel horizontal */}
            <div className="relative ">
                {/* Botón izquierda */}
                {canScrollLeft && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-cy bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all"
                        onClick={() => scroll('left')}
                    >
                        <svg className="w-6 h-6 text-cy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                )}

                {/* Contenedor scrolleable */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="overflow-x-auto scrollbar-hide py-6 px-8 snap-x snap-mandatory scroll-smooth"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex gap-32 md:gap-24 lg:gap-24 pb-4 w-max">
                        {loading ? (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <div key={`skeleton-${i}`} className="flex-shrink-0 snap-center snap-always md:w-64 lg:w-48" style={{ width: cardWidth }}>
                                        <GameCardSkeleton />
                                    </div>
                                ))}
                            </>
                        ) : (
                            games.map(game => (
                                <motion.div
                                    key={game.id}
                                    className="flex-shrink-0 snap-center snap-always md:w-64 lg:w-48"
                                    style={{ width: cardWidth }}
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
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full backdrop-blur-sm transition-all"
                        onClick={() => scroll('right')}
                    >
                        <svg className="w-6 h-6 text-cy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                )}
            </div>
        </div>
    )
}
