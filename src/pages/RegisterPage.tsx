import {useNavigate} from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = ({onSwitch}: {onSwitch: () => void}) => {

    const navigate = useNavigate()
    const { authRegister } = useAuthStore()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mb-2 p-2 border border-gray-300 rounded" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border border-gray-300 rounded" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
                <p className="text-sm text-gray-500 mt-2">¿Ya tienes una cuenta? <span  className="text-blue-500 cursor-pointer" onClick={onSwitch}>Inicia sesión</span></p>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    )
}