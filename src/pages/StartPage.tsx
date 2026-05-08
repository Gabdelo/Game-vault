import { motion} from "framer-motion"
import { HackerText } from "@/components/ui/HackerText"
import { Link } from "react-router-dom"
import { Glitch } from "@/components/ui/Glitch"
import { useEffect } from "react"
import {CyberButton} from "@/components/ui/CyberButton"
import {Footer} from "@/layout/Footer"
import { FiChevronDown } from "react-icons/fi"
import { CyberpunkButton } from "@/components/ui/Button"
import { usePageTitle } from '@/hooks/usePageTitle'


export const StartPage = () => {
    usePageTitle("Bienvenido a The Zone")
    
    const handleScrollDown = () => {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div className="bg-black/90">
            <div className="z-0 relative flex flex-col items-center justify-between h-screen overflow-hidden ">
                <motion.img
                initial={{ scale: 2 , opacity: 0}}
                    animate={{ scale: 1 , opacity: 1 }}
                    transition={{ duration: 1}}
                    exit={{ opacity: 1 }}
                    src="/bgbuenooo.jpg"
                    alt="background blur"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                        zIndex: -2,
                        filter: ' brightness(0.9) contrast(1) saturate() blur(2px)',
                    }}
                />
                <motion.img
                    src="/man2.png"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                        backgroundPosition: 'top',
                        backgroundSize: '',
                        backgroundRepeat: 'no-repeat',
                        zIndex: -1,
                        opacity: 1

                    }}

                    initial={{ scale: 2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1}}

                />
                <motion.div

                className=" flex flex-col items-center justify-between min-h-screen relative"
             >
                <div className="flex flex-row w-full justify-end gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-8 md:mt-10 mr-2 sm:mr-8 md:mr-16">
                    <CyberButton className="cb-secondary text-xs sm:text-sm md:text-base" >
                        <Link to="/welcome" state={{ isInLogin: false }}>REGISTRARSE</Link>
                    </CyberButton>
                    <CyberButton className="cb-primary text-xs sm:text-sm md:text-base" >
                        <Link to="/welcome" state={{ isInLogin: true }}>INICIAR SESIÓN</Link>
                    </CyberButton>
                </div>

                <div className="flex flex-row items-center justify-center " style={{ zIndex: -2 }}>
                <HackerText text="BEST GAMES" speed={45} className="text-7xl sm:text-5xl md:text-8xl lg:text-[10rem] font-black text-center text-white text-stroke-cyan-300 px-2"></HackerText>

            </div>

            <motion.div
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: 0 , x: 0, scale: 1}}
                transition={{duration: 1, ease: "linear" }}
                className=" z-10 ">


                <Glitch trigger="loop" options={{ frames: 6, speed: 10, intensity: 10 }} >
                     <h1 className="text-7xl sm:text-3xl md:text-9xl lg:text-9xl font-bold tracking-wide text-cy uppercase text-center">
                        THE <br /> ZONE
                     </h1>

                </Glitch>
                </motion.div >
                <Link to="/home">
                    <CyberpunkButton >
                        COMENZAR
                    </CyberpunkButton>
                </Link>
                <motion.button
                    onClick={handleScrollDown}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-cy text-black hover:bg-yellow-300 transition-colors cursor-pointer my-8 "
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <FiChevronDown size={32} />
                </motion.button>
            </motion.div>

            </div>
            <div className=" flex flex-row justify-center py-8 text-white bg-cy">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-2 sm:gap-3 md:gap-6 px-2 sm:px-3 md:px-4">

                    {/* Sección 1: Imagen de fondo con texto superpuesto */}
                    <motion.div 
                        className="flex flex-col bg-black h-full border-black/10 border items-center justify-center gap-3 sm:gap-4 p-7 md:p-16"
                        style={{clipPath: 'polygon(20% 0%, 90% 0%, 100% 15%, 100% 80%, 100% 100%, 10% 100%, 0% 90%, 0 0)'}}
                        initial={{ opacity: 0, x: -50, y: 30 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div 
                            className="relative h-48 sm:h-56 md:h-[50%] w-full flex flex-col justify-end items-center pb-2 sm:pb-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.img
                                src="/63.jpg"
                                alt="background"
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                                viewport={{ once: true, margin: "-100px" }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                            <motion.div 
                                className="relative z-10 px-2 sm:px-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white z-10 relative">ENCUENTRA CUALQUIER VIDEOJUEGO</h2>
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="h-48 sm:h-56 md:h-[50%] w-full grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-2 sm:gap-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.div 
                                className="w-full h-full flex flex-col overflow-hidden px-2 sm:px-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-cyan-300">
                                    Controla y descubre nuevos videojuegos
                                </h1>
                                <p className="text-xs sm:text-sm line-clamp-4">
                                    Organiza todos tus juegos en un solo lugar, guarda tus favoritos y haz seguimiento de lo que has jugado. Puntúa cada título, escribe tus impresiones y descubre nuevas recomendaciones basadas en tus gustos. Comparte tu experiencia con otros jugadores y encuentra fácilmente tu próxima aventura.
                                </p>
                            </motion.div>
                            <motion.div 
                                className="relative h-full w-full hidden sm:block"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <motion.img
                                    src="/65.jpg"
                                    alt="background"
                                    initial={{ opacity: 0, x: -100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Sección 2: Imagen de fondo con texto superpuesto */}
                    <motion.div 
                        className="h-full flex flex-col gap-2 sm:gap-4 bg-black border border-black/10 px-8 py-4" 
                        style={{clipPath: 'polygon(20% 0%, 90% 0%, 100% 10%, 100% 80%, 100% 100%, 10% 100%, 0% 90%, 0 0)'}}
                        initial={{ opacity: 0, x: 50, y: 30 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.h1 
                            className="px-2 sm:px-5 text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            TENEMOS TODOS LOS JUEGOS QUE TE GUSTAN
                        </motion.h1>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 flex-1"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.div 
                                className="relative w-full bg-gray-500 h-48 sm:h-full"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.img
                                    src="/64.jpg"
                                    alt="background"
                                    className="w-full h-full object-cover pointer-events-none absolute inset-0"
                                    initial={{ opacity: 0, x: 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                />
                            </motion.div>
                            <motion.div 
                                className="w-full h-full flex flex-col overflow-hidden px-2 sm:px-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-cyan-300">
                                    Cada juego cuenta una historia
                                </h1>
                                <p className="text-xs sm:text-sm line-clamp-4 mb-7">
                                    Revive tus aventuras, recuerda los mundos que exploraste y los desafíos que superaste. Convierte cada partida en un recuerdo y construye una línea del tiempo con todo lo que has vivido dentro del universo gaming.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <div className=" text-white flex items-center justify-center sm:py-12 md:py-6 px-2 sm:px-4 bg-cy ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 w-full md:w-[80%]">

                {/* IZQUIERDA → TEXTO */}
                <motion.div 
                    className="flex flex-col justify-center gap-4 bg-black p-11 md:p-8" 
                    style={{clipPath: 'polygon(20% 0%, 100% 0, 100% 20%, 100% 80%, 100% 80%, 80% 100%, 0 100%, 0 23%)'}}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                    TU BIBLIOTECA DE JUEGOS
                    </motion.h1>

                    <motion.p 
                        className="text-sm sm:text-base md:text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                    Guarda tus juegos favoritos y organízalos en un solo lugar.
                    Califica los juegos y lleva el control de todo lo que juegas.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <motion.div 
                            className="bg-cy text-black px-3 sm:px-4 py-2 rounded text-xs sm:text-sm md:text-base font-bold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ scale: 1.05 }}
                        >
                        500,000+ juegos guardados
                        </motion.div>
                        <motion.div 
                            className="bg-cy text-black px-3 sm:px-4 py-2 rounded text-xs sm:text-sm md:text-base font-bold"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ scale: 1.05 }}
                        >
                        + 15 géneros disponibles
                        </motion.div>
                    </div>
                </motion.div>

                {/* DERECHA → VISUAL */}
                <motion.div 
                    className="relative w-full h-50 sm:h-54 md:h-full"
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                        <motion.img
                            src="/cabeza.png"
                            alt="game library"
                            className="w-full h-full object-contain pointer-events-none rounded-lg "
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>

            </div>
            </div>
            <Footer />
            
        </div>
    )
}