import { motion, AnimatePresence } from 'framer-motion'

interface DescriptionModalProps {
    isOpen: boolean
    title?: string
    content: string
    onClose: () => void
}

export const DescriptionModal = ({
    isOpen,
    title = "Descripción completa",
    content,
    onClose,
}: DescriptionModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="z-50 w-full max-w-2xl"
                        >
                            <div className="bg-[#0a0a0f] border border-white/20  shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                    <h2 className="text-xl font-bold text-white">{title}</h2>
                                    <button
                                        onClick={onClose}
                                        className="text-white/60 hover:text-white transition-colors p-1"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Contenido */}
                                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                                    <div
                                        className="text-white/80 leading-relaxed prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                </div>

                                
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
