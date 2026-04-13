
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeScene from '../components/Head3D'
import { CyberBox } from '@/components/ui/CyberBox'


export const FormPage = ({isInLoginn}: {isInLoginn: boolean}) => {
    const location = useLocation()
    const initialState = location.state?.isInLogin ?? isInLoginn ?? true
    const [isInLogin, setInIsLogin] = useState(initialState)

    return (
        <CyberBox 
          className="w-full h-screen"
          cornerLines
          glow
          accentColor="#000000"
          bgColor="#000000"
          padding="0"
        >
        <div 
          className="relative flex flex-col md:flex-row items-center justify-center w-full h-full bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/cyberpunk_original.png')" }}
        >
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/"
                autoPlay
                loop
                muted
                playsInline
            />
            {/* ThreeScene - hidden en móviles */}
            <motion.div
                className='hidden md:flex w-full md:w-1/2 h-full items-center justify-center relative z-10'
                initial={{ x: isInLogin ? "100%" : "0%" }}
                animate={{ x: isInLogin ? "100%" : "0%" }}
                transition={{duration: 0.6}}
            >
                <ThreeScene isInLogin={isInLogin} />
            </motion.div>
            
            {/* Formulario Mobile - sin animación horizontal */}
            <div
                className='md:hidden w-full h-full flex items-center justify-center relative z-10'
            >
                <AnimatePresence mode="wait">
                    {isInLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <LoginPage onSwitch={() => setInIsLogin(false)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <RegisterPage onSwitch={() => setInIsLogin(true)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Formulario Desktop - con animación horizontal */}
            <motion.div
                className='hidden md:flex w-1/2 h-full items-center justify-center relative z-10'
                initial={{ x: isInLogin ? "-100%" : "0%" }}
                animate={{ x: isInLogin ? "-100%" : "0%" }}
                transition={{duration: 0.6}}
            >
                <AnimatePresence mode="wait">
                    {isInLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <LoginPage onSwitch={() => setInIsLogin(false)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <RegisterPage onSwitch={() => setInIsLogin(true)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
        </CyberBox>
    )

}