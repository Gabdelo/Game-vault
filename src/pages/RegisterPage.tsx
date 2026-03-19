import {useNavigate} from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {

    const navigate = useNavigate()
    const { authRegister, loading } = useAuthStore()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            await authRegister(username, email, password)
            navigate("/login")
        } catch (error) {
            setError("Error al registrar el usuario")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-3xl mb-4">REGISTRATE</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mb-2 p-2 border border-gray-300 rounded" disabled={loading} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border border-gray-300 rounded" disabled={loading} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded" disabled={loading} />
                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? "Cargando..." : "Registrar"}</button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}