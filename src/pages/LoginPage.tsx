import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/ui/CyberToast";
import LoginForm from "@/components/LoginForm";

export const LoginPage = ({ onSwitch }: { onSwitch: () => void }) => {
    const { authLogin } = useAuthStore()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authLogin(email, password)
            toast({
                variant: 'success',
                title: 'Bienvenido',
                message: 'Sesión iniciada correctamente',
                duration: 3500
            })
            navigate("/")
        } catch (error) {
            setError("Error al iniciar sesión")
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo iniciar sesión',
                duration: 3500
            })
        }
    }
    return (
        <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            onSwitch={onSwitch}
            error={error}
        />
    )
}