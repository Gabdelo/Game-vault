import {Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearch } from "../hooks/useSearch";
import { GameSearch } from "@/components/ui/Search";
import { FiUser, FiMenu, FiX, FiDatabase, FiLogIn, FiPlus, FiHexagon } from "react-icons/fi";
import { useToast } from "@/components/ui/CyberToast";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile } from "@/services/profileService";


interface NavbarProps {
    onSetQuery?: (query: string) => void
    onSetSubmitted?: (submitted: boolean) => void
}

export const Navbar = ({ onSetQuery, onSetSubmitted }: NavbarProps) => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    const { toast } = useToast()
    const [query, setQuery] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)
    const { games } = useSearch(query)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const [profile, setProfile] = useState<any>(null)
    const hasInitializedRef = useRef(false)
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (hasInitializedRef.current) return
        if (!user?.id) return
        
        hasInitializedRef.current = true
        
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(user.id)
                setProfile(data)
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        
        fetchProfile()
    }, [user?.id])
    
    const avatarUrl = useMemo(() => {
        if (!profile?.avatar) return null
        const DIRECTUS_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL || "https://directus-latest-i2px.onrender.com"
        return `${DIRECTUS_URL}/assets/${profile.avatar}`
    }, [profile?.avatar])
    
    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
        toast({
            variant: 'success',
            title: 'Sesión cerrada',
            message: 'Tu sesión ha sido cerrada correctamente',
            duration: 3500
        })
        navigate("/")
    }

    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            setSubmitted(true)
            onSetSubmitted?.(true)
            navigate(`/explore?q=${encodeURIComponent(query)}`)
        }
    }
    
    const handleInputChange = (value: string) => {
        setQuery(value)
        setSubmitted(false)
        onSetSubmitted?.(false)
        onSetQuery?.(value)
    }

    return (
  <div className="w-full z-50 bg-black/10 backdrop-blur-xl py-3 border-b-[1px] border-cy">
    <nav className="max-w-full mx-auto px-4 md:px-6 py-3 flex items-center justify-between md:justify-center gap-3 md:gap-8 lg:gap-32">
      
      {/* LEFT — LOGO */}
      <Link to="/home" className="flex hover:opacity-80 transition-all flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-0 ">
          <div><img src="/logotrue.png" alt="TheZone" className="h-8 w-auto " style={{scale: 1.5}} /></div>
          <div className="hidden md:block"><img src="/letra.png" alt="TheZone" className="h-8 w-auto " style={{scale: 2}} /></div>
        </div>
      </Link>

      {/* CENTER — SEARCH (PROTAGONISTA) */}
      <div className="relative z-50 w-48 md:w-96">
        <GameSearch
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          resultCount={query && !submitted ? games.length : undefined}
        />
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex items-center gap-6 ">
        <Link
          to="/explore"
          className="flex flex-col items-center hover:text-cyan-400 transition-all text-cy"
        >
          <FiHexagon size={18} />
          <span className="text-[10px] uppercase">Explora</span>
        </Link>

        {!isAuthenticated ? (
          <>
            <Link
              to="/welcome"
              state={{ isInLogin: true }}
              className="flex flex-col items-center hover:text-cyan-400 transition-all text-cy"
            >
              <FiLogIn size={18} />
              <span className="text-[10px] uppercase">Login</span>
            </Link>

            <Link
              to="/welcome"
              state={{ isInLogin: false }}
              className="flex flex-col items-center hover:text-cyan-400 transition-all text-cy"
            >
              <FiPlus size={18} />
              <span className="text-[10px] uppercase">Register</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/library"
              className="flex flex-col items-center hover:text-cyan-400 transition-all text-cy"
            >
              <FiDatabase size={18} />
              <span className="text-[10px] uppercase">Library</span>
            </Link>

            {/* PROFILE */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex flex-col items-center hover:opacity-80 transition-all"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-cy hover:border-cyan-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-cy flex items-center justify-center">
                    <FiUser size={14} className="text-cy" />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-black/95 border border-yellow-400/20 shadow-xl overflow-hidden"
                  >
                    <Link
                      to="/friends"
                      className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10"
                    >
                      Amigos
                    </Link>

                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10"
                    >
                      Perfil
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 border-t border-red-400/20"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* MOBILE */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden text-cy"
      >
        {showMobileMenu ? <FiX size={26} /> : <FiMenu size={26} />}
      </button>
    </nav>

    {/* MOBILE MENU */}
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-yellow-400/20 bg-black/80 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Buscador en móvil */}
           

            {/* Explora */}
            <Link
              to="/explore"
              className="px-4 py-2.5 text-white hover:bg-yellow-400/10 rounded transition-colors flex items-center gap-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <FiHexagon size={18} />
              <span>Explora</span>
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/welcome"
                  state={{ isInLogin: true }}
                  className="px-4 py-2.5 text-cy hover:bg-yellow-400/10 rounded transition-colors flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FiLogIn size={18} />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  to="/welcome"
                  state={{ isInLogin: false }}
                  className="px-4 py-2.5 text-cy hover:bg-yellow-400/10 rounded transition-colors flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FiPlus size={18} />
                  <span>Registrarse</span>
                </Link>
              </>
            ) : (
              <>
                {/* Biblioteca */}
                <Link
                  to="/library"
                  className="px-4 py-2.5 text-white hover:bg-cy/10 rounded transition-colors flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FiDatabase size={18} />
                  <span>Biblioteca</span>
                </Link>

                {/* Amigos */}
                <Link
                  to="/friends"
                  className="px-4 py-2.5 text-white hover:bg-cyan-500/10 rounded transition-colors flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FiUser size={18} />
                  <span>Amigos</span>
                </Link>

                {/* Perfil con Avatar */}
                <Link
                  to="/profile"
                  className="px-4 py-2.5 text-white hover:bg-blue-500/10 rounded transition-colors flex items-center gap-3"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="profile"
                      className="w-7 h-7 rounded-full object-cover border-2 border-cy hover:border-cyan-400"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-cy flex items-center justify-center">
                      <FiUser size={12} className="text-cy" />
                    </div>
                  )}
                  <span>Mi Perfil</span>
                </Link>

                {/* Cerrar sesión */}
                <button
                  onClick={() => {
                    handleLogout()
                    setShowMobileMenu(false)
                  }}
                  className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded transition-colors text-left border-t border-red-400/20 mt-2"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)
}
