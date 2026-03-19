import {Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LibraryPage } from "../pages/LibraryPage";

export const Navbar = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">Game Vault</div>
            </div>
            <div>
                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="text-blue-500 hover:underline">Iniciar sesión</Link>
                        <span className="mx-2">|</span>
                        <Link to="/register" className="text-blue-500 hover:underline">Registrarse</Link>
                    </>
                )}
                {isAuthenticated && (
                    <button onClick={logout} className="text-blue-500 hover:underline">Cerrar sesión</button>
                )}
            </div>
            <div>
                {isAuthenticated && user && (
                    <div>
                        <p className="text-sm text-gray-300">
                        Bienvenido, {user.first_name} {user.email}
                    </p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                    <Link to="/library">Mi Biblioteca</Link>
                    </button>

                    </div>
                )}
            </div>
        </nav>
    )
}