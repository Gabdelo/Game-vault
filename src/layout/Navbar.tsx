import {Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState, useRef, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import { GameSearch } from "@/components/Search";
import { FiBook, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { navbarStyles } from "@/styles/navbarStyle";
import { useToast } from "@/components/ui/CyberToast";
import '../styles/styles.css'
import { CyberpunkButton } from "@/components/ui/Button";
import CyberButton from "@/components/ui/CyberButton";

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
    const { games, loading } = useSearch(query)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    
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

    const handleLogoClick = () => {
        window.location.href = "/"
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            setSubmitted(true)
            onSetSubmitted?.(true)
            navigate("/search", { state: { query, submitted: true } })
        }
    }
    
    const handleInputChange = (value: string) => {
        setQuery(value)
        setSubmitted(false)
        onSetSubmitted?.(false)
        onSetQuery?.(value)
    }

    return (
        <>
            <style>{navbarStyles}</style>
          
        
            <nav className="nav-cyber text-white p-3 sm:p-4 relative z-10 rounded-br-[1rem] rounded-bl-[1rem]">
                <div className="flex justify-between items-center gap-2 sm:gap-4 px-2 sm:px-0" style={{ position: 'relative', zIndex: 1 }}>

                    {/* Logo */}
                    <button onClick={handleLogoClick} className="flex-shrink-0 bg-none border-none cursor-pointer p-0">
                        <img
                            src="/logo4.webp"
                            alt="GameVault"
                            className="h-8 sm:h-10 w-auto nav-logo-img"
                        />
                    </button>

                    {/* Buscador - escondido en móviles */}
                    <div className="hidden md:flex flex-1 max-w-md nav-search-wrapper">
                        <GameSearch
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            resultCount={query && !submitted ? games.length : undefined}
                        />

                        {/* Modal Popup */}
                        {query && !submitted && (
                            <div className="nav-results-dropdown absolute top-full left-[30%] right-0 mt-1 w-[25%] z-50 max-h-80 overflow-y-auto">
                                {loading && (
                                    <div className="p-4 nav-empty-text">Cargando...</div>
                                )}
                                {!loading && games.length === 0 && (
                                    <div className="p-4 nav-empty-text">Sin resultados</div>
                                )}
                                {!loading && games.length > 0 && (
                                    <ul className="divide-y divide-gray-900">
                                        {games.map(game => (
                                            <Link key={game.id} to={`/game/${game.id}`} state={{ game }}>
                                                <li className="nav-results-item p-3 cursor-pointer transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {game.background_image && (
                                                            <img
                                                                src={game.background_image}
                                                                alt={game.name}
                                                                className="w-10 h-10 object-cover"
                                                                style={{ borderRadius: '3px', border: '1px solid rgba(168,50,255,0.2)' }}
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm">{game.name}</p>
                                                            <p className="text-xs">{game.released}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Auth Section - Desktop */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-4">
                        {!isAuthenticated && (
                            <>
                                <Link to="/welcome" state={{ isInLogin: true }} className="nav-auth-link">
                                    Iniciar Sesión
                                </Link>
                                <div className="nav-sep" />
                                <Link to="/welcome" state={{ isInLogin: false }} className="nav-auth-link">
                                    Registrarse
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                {/* Biblioteca */}
                                <CyberButton variant="secondary" accentColor="#FBFF00" className="px-3 py-1 rounded-md">
                                <Link to="/library" className=" flex items-center gap-2 transition-colors">
                                    <FiBook size={16} />
                                    <span>Biblioteca</span>
                                </Link>
                                </CyberButton>

                                <div className="nav-sep" />

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileMenuRef}>
                                    <CyberButton onClick={() => setShowProfileMenu(!showProfileMenu)} variant="secondary" accentColor="#00FFFF">
                                  
                                        <FiUser size={16} />
                                        <span>{user?.email?.split('@')[0]}</span>
                                        <span style={{ opacity: 0.4, fontSize: '8px' }}>▼</span>
                                    
                                    </CyberButton>
                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="nav-profile-dropdown absolute right-0 mt-2 w-48 z-50 py-1">
                                            <CyberpunkButton variant="danger" onClick={handleLogout} >
                                                <FiLogOut size={14} />
                                                Cerrar Sesión
                                            </CyberpunkButton>
                                            
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Spacer - pushes mobile menu to the right */}
                    <div className="flex-1 md:hidden" />

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden flex-shrink-0 text-white p-2 hover:text-yellow-400 transition-colors"
                    >
                        {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/10">
                        {!isAuthenticated && (
                            <>
                                <Link to="/welcome" state={{ isInLogin: true }} className="block py-2 px-4 hover:bg-white/10 transition-colors">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/welcome" state={{ isInLogin: false }} className="block py-2 px-4 hover:bg-white/10 transition-colors">
                                    Registrarse
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link to="/library" className="flex items-center gap-2 py-2 px-4 hover:bg-white/10 transition-colors">
                                    <FiBook size={16} />
                                    Biblioteca
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 w-full py-2 px-4 hover:bg-red-500/20 transition-colors text-left">
                                    <FiLogOut size={16} />
                                    Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>
           
        </>
    )
}
