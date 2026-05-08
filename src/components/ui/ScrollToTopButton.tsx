import { motion, AnimatePresence } from "framer-motion"
import { useScrollPosition } from "@/hooks/useScrollPosition"

export const ScrollToTopButton = () => {
    const isVisible = useScrollPosition(300)

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-8 z-40 w-12 h-12  flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                    style={{
                        background: "linear-gradient(135deg, #FBFF00, #F2FF00)",
                        cursor: "pointer", clipPath: 'polygon(0 13%, 13% 0, 100% 0, 100% 86%, 87% 100%, 0 100%)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Volver arriba"
                >
                    <svg
                        width={20}
                        height={20}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="text-black font-bold"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 14l-7-7m0 0l-7 7m7-7v12"
                        />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
