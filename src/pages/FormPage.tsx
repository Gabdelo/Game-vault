
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

import loginImage from '../assets/loginImage.png'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeScene from '../components/Head3D'


export const FormPage = ({isInLoginn}: {isInLoginn: boolean}) => {
    const location = useLocation()
    const initialState = location.state?.isInLogin ?? isInLoginn ?? true
    const [isInLogin, setInIsLogin] = useState(initialState)

    return (
        <div className="flex flex-row items-center justify-center min-h-screen bg-white overflow-hidden">
            {/*  <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/videobg.mp4"
                autoPlay
                loop
                muted
                playsInline
            /> */}
            <motion.div 
                className='w-1/2 h-screen' 
                initial={{ x: isInLogin ? "100%" : "0%" }}
                animate={{ x: isInLogin ? "100%" : "0%" }} 
                transition={{duration: 0.6}}
            >
                <ThreeScene isInLogin={isInLogin} />
            </motion.div>
            <motion.div 
                className='w-1/2 h-screen flex items-center justify-center' 
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