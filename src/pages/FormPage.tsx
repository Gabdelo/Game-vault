
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeScene from '../components/form/Head3D'
import { usePageTitle } from '@/hooks/usePageTitle'



export const FormPage = ({isInLoginn}: {isInLoginn: boolean}) => {
    const location = useLocation()
    
    const initialState = location.state?.isInLogin ?? isInLoginn ?? true
    const [isInLogin, setInIsLogin] = useState(initialState)
    usePageTitle(isInLogin ? "Incio de Sesión" : "Registro")

    return (
       
        <div 
          className="relative flex flex-col md:flex-row items-center justify-center w-full h-screen bg-no-repeat bg-cover "
          style={{ backgroundImage: "url('/cyberpunk_original.png')" }}
        >
            
            
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
                className='md:hidden w-full h-full flex items-center justify-center relative z-10 px-4'
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
       
    )

}