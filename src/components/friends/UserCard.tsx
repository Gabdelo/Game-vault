import { Link } from "react-router-dom"
import { FiUserPlus, FiCheck, FiX, FiUserMinus } from "react-icons/fi"
import { useState } from "react"
import { ConfirmDialog } from "../ui/ConfirmDialog"

interface UserCardProps {
  username: string
  userId: string
  status?: "friend" | "pending_received" | "pending_sent" | "none"
  avatar?: string
  friendshipId?: string
  onAddFriend?: () => void
  onAcceptRequest?: () => void
  onRejectRequest?: () => void
  onRemoveFriend?: () => void
  isLoading?: boolean
}

export default function UserCard({
  username,
  userId,
  status = "none",
  avatar,
  onAddFriend,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
  isLoading = false,
}: UserCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  
  // Construir URL del avatar si es solo el ID
  const DIRECTUS_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL || "https://directus-latest-i2px.onrender.com"
  const url = avatar ? `${DIRECTUS_URL}/assets/${avatar}` : "/controller.png"
  const getButtonConfig = () => {
    switch (status) {
      case "friend":
        return {
          primary: { text: "", icon: FiUserMinus, onClick: onRemoveFriend, color: "bg-cy", disabled: false },
          secondary: null,
        }
      case "pending_received":
        return {
          primary: { text: "", icon: FiCheck, onClick: onAcceptRequest, color: "bg-cy", disabled: false },
          secondary: { text: "", icon: FiX, onClick: onRejectRequest, color: "bg-black", disabled: false },
        }
      case "pending_sent":
        return {
          primary: { text: "", icon: FiX, onClick: onRejectRequest, color: "bg-cy", disabled: false },
          secondary: null,
        }
      case "none":
      default:
        return {
          primary: { text: "", icon: FiUserPlus, onClick: onAddFriend, color: "bg-cyan-400 hover:bg-cyan-700", disabled: false },
          secondary: null,
        }
    }
  }

  const buttons = getButtonConfig()
  const primaryBtn = buttons.primary
  const secondaryBtn = buttons.secondary

  return (
    <div className="border border-gray-700/80  p-4 bg-gradient-to-br from-gray-900/60 to-gray-900/40 hover:border-cy/60 hover:from-gray-900/80 hover:to-gray-900/60 transition-all duration-300">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-5">
        <img 
          src={url} 
          alt={username} 
          className="w-16 h-16 object-cover ring-2 ring-gray-700 flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {username}
          </h3>
          {status !== "none" && (
            <span
              className={`inline-flex text-xs font-semibold px-3 py-1 mt-2 ${
                status === "friend"
                  ? "bg-blue-600/25 text-blue-300 border border-blue-500/30"
                  : status === "pending_received"
                  ? "bg-green-600/25 text-green-300 border border-green-500/30"
                  : "bg-yellow-600/25 text-cy border border-yellow-500/30"
              }`}
            >
              {status === "friend"
                ? " Amigos"
                : status === "pending_received"
                ? " Solicitud recibida"
                : " Solicitud enviada"}
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className={`grid gap-2 ${
        secondaryBtn 
          ? "grid-cols-[63%_16%_16%] sm:grid-cols-[63%_16%_16%] " 
          : "grid-cols-[80%_17%] "
      }`}>
        {/* Ver Perfil */}
        <Link to={`/profile/${userId}`} className="col-span-1">
          <button
            className="w-full py-2.5 font-semibold text-sm flex items-center justify-center transition-all duration-200 text-white bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 hover:shadow-lg hover:-translate-y-0.5 border border-gray-600/50 hover:border-gray-500 active:translate-y-0"
          >
            Ver Perfil
          </button>
        </Link>

        {/* Primary Button */}
        {primaryBtn && (
          <button
            onClick={() => {
              if (status === "friend") {
                setShowConfirmDialog(true)
              } else {
                primaryBtn.onClick?.()
              }
            }}
            disabled={primaryBtn.disabled || isLoading}
            className={`px-4 py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 text-black  ${
              primaryBtn.disabled
                ? "cursor-not-allowed opacity-40 bg-gray-700/30 border-gray-700/30"
                : `${primaryBtn.color.replace('hover:', 'hover:').split(' ')[0]} hover:shadow-lg hover:-translate-y-0.5 border-opacity-50 border-current active:translate-y-0`
            }`}
          >
            <primaryBtn.icon size={18} />
            {isLoading ? "..." : primaryBtn.text}
          </button>
        )}

        {/* Secondary Button */}
        {secondaryBtn && (
          <button
            onClick={secondaryBtn.onClick}
            disabled={isLoading}
            className={` font-semibold text-sm flex items-center justify-center  transition-all duration-200 text-cy ${secondaryBtn.color} hover:shadow-lg hover:-translate-y-0.5 border border-current border-opacity-30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <secondaryBtn.icon size={18} />
            {isLoading ? "..." : secondaryBtn.text}
          </button>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Eliminar amigo"
        message={`¿Estás seguro de que deseas eliminar a ${username} de tu lista de amigos?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous
        isLoading={isLoading}
        onConfirm={() => {
          onRemoveFriend?.()
          setShowConfirmDialog(false)
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  )
}
