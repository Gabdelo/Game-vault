import {useNavigate} from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/ui/CyberToast";
import RegisterForm from "@/components/RegisterForm";

export const RegisterPage = ({onSwitch}: {onSwitch: () => void}) => {

    const navigate = useNavigate()
    const { authRegister } = useAuthStore()
    const { toast } = useToast()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authRegister(username, email, password)
            toast({
                variant: 'success',
                title: 'Registro exitoso',
                message: 'Tu cuenta ha sido creada correctamente',
                duration: 3500
            })
            onSwitch()
            navigate("/welcome")
        } catch (error) {
            setError("Error al registrar el usuario")
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo completar el registro',
                duration: 3500
            })
        }
    }

    return (
        <RegisterForm
            username={username}
            setUsername={setUsername}
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