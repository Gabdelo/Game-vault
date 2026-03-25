import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import loginImage from "../assets/loginImage.png";
import { Button } from "../components/Buttons";

export const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
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
        <div className="flex flex-row items-center justify-center min-h-screen">
            <div className="w-full flex flex-col items-center min-h-screen justify-center">
                <h1 className="text-4xl font-bold mb-4">Game Vault</h1>
                <h2 className="text-3xl mb-4 ">INICIA SESIÓN</h2>
                <form onSubmit={handleSubmit} className="items-center flex flex-col">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border border-gray-300 rounded-full" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 border border-gray-300 rounded-full" />
                    <Button type="submit">Iniciar Sesión</Button>
                    <p className="text-sm text-gray-500 mt-2">¿No tienes una cuenta? <span  className="text-blue-500 cursor-pointer" onClick={onSwitch}>Regístrate</span></p>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    )
}