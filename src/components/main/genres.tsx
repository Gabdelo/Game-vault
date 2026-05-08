import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import type { GenreDirectus } from '@/types/game'


interface HorizontalCarouselProps {
    title: string
    genres: GenreDirectus[]
    loading: boolean
}
export const CarrusellGenres = ({
    title,
    genres,
    loading,

}: HorizontalCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return
        const isMobile = window.innerWidth < 640
        const scrollAmount = isMobile ? 200 : 300
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
        <div className="mb-8 sm:mb-12 ml-6">
            {/* Título */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 px-4">{title}</h2>

            {/* Carrusel horizontal */}
            <div className="relative ">
                {/* Botón izquierda */}
                {canScrollLeft && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50  p-1.5 sm:p-2.5  backdrop-blur-sm transition-all "
                        onClick={() => scroll('left')}
                    >
                        <svg className="w-4 sm:w-6 h-4 sm:h-6 text-cy  transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                )}

                {/* Contenedor scrolleable */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="overflow-x-auto scrollbar-hide py-4 sm:py-6 px-4"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex gap-3 sm:gap-4 md:gap-8 pb-4 w-max">
                        {loading ? (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <div key={`skeleton-${i}`} className="flex-shrink-0 w-40 sm:w-48">
                                        <GameCardSkeleton />
                                    </div>
                                ))}
                            </>
                        ) : (
                            genres.map(genre => (
                                <Link
                                    key={genre.id}
                                    to={`/explore?genres=${genre.id}`}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div 
                                            className="flex-shrink-0 w-[180px] h-[350px] sm:w-[220px] sm:h-[380px] md:w-[300px] md:h-[500px]  overflow-hidden cursor-pointer relative group shadow-lg hover:shadow-xl transition-shadow"
                                            style={{
                                                backgroundImage: `url(${genre.image_background})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                        {/* Overlay gradiente */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/90 transition-all duration-300" />
                                        
                                        {/* Border glow en hover */}
                                        <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-cy  transition-all duration-300" />
                                        
                                        {/* Contenido centrado */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white text-center px-2 sm:px-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                {genre.name}
                                            </h3>
                                            
                                        </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Botón derecha */}
                {canScrollRight && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50  p-1.5 sm:p-2.5  backdrop-blur-sm transition-all"
                        onClick={() => scroll('right')}
                    >
                        <svg className="w-4 sm:w-6 h-4 sm:h-6 text-cy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                )}
            </div>
        </div>
    )
}
