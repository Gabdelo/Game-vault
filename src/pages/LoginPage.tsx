import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () =>{
    const { authLogin } = useAuthStore()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authLogin(email, password)
            navigate("/")
        } catch (error) {
            setError("Error al iniciar sesión")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-3xl mb-4">INICIA SESIÓN</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border border-gray-300 rounded" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Iniciar Sesión</button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}