import { Link } from "react-router-dom"
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa"
import { useState } from "react"

export const Footer = () => {
    const [formData, setFormData] = useState({ nombre: "", mensaje: "" })

    const handleChange = (e:any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e:any) => {
        e.preventDefault()
        console.log("Formulario enviado", formData)
        setFormData({ nombre: "", mensaje: "" })
    }

    return (
        <footer className="text-gray-400 pb-8 px-4 w-full bg-black/90">
            <div className="w-full h-[1px] bg-cyan-400 shadow-[0_0_10px_#22d3ee,0_0_20px_#22d3ee,0_0_40px_#22d3ee]"></div>

            <div className="container mx-auto mt-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* Column 1 */}
                    <div>
                        <h3 className="text-cyan-300 font-bold mb-4 text-sm uppercase tracking-wider">THE ZONE</h3>
                        <p className="text-xs leading-relaxed text-gray-300">
                            THE ZONE es tu plataforma definitiva para gestionar, descubrir y comparar videojuegos.
                            Accede a información detallada, críticas y disponibilidad en múltiples tiendas.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-cyan-300 font-bold mb-4 text-sm uppercase tracking-wider">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/home" className="text-gray-300 hover:text-yellow-300 transition-colors">Inicio</Link></li>
                            <li><Link to="/explore" className="text-gray-300 hover:text-yellow-300 transition-colors">Explorar Juegos</Link></li>
                            <li><Link to="/library" className="text-gray-300 hover:text-yellow-300 transition-colors">Mi Biblioteca</Link></li>
                            <li><Link to="/stats" className="text-gray-300 hover:text-yellow-300 transition-colors">Estadísticas</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: FORMULARIO */}
                    <div>
                        <h3 className="text-cyan-300 font-bold mb-4 text-sm uppercase tracking-wider">Contacto</h3>

                        <p className="text-xs text-gray-300 mb-3">
                            ¿Dudas o sugerencias? Escríbenos:
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                            <input
                                type="text"
                                name="nombre"
                                placeholder="Tu nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="px-3 py-2 text-xs bg-black border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                            />

                            <textarea
                                name="mensaje"
                                placeholder="Escribe tu mensaje..."
                                rows={3}
                                value={formData.mensaje}
                                onChange={handleChange}
                                className="px-3 py-2 text-xs bg-black border border-gray-600 text-white resize-none focus:outline-none focus:border-cyan-400"
                            />

                            <button
                                type="submit"
                                className="bg-cyan-400 text-black text-xs py-2 hover:bg-cyan-300 transition font-semibold"
                            >
                                Enviar
                            </button>
                        </form>

                        {/* Redes */}
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-400 pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-xs text-gray-300">
                            &copy; {new Date().getFullYear()} Game Vault. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-300 mt-4 sm:mt-0">
                            Diseñado y desarrollado por <span style={{ color: '#F2FF00' }}>Gabs</span>
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    )
}