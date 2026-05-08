import { useState, useEffect } from "react"
import { FiX, FiSave, FiUpload } from "react-icons/fi"
import { updateUsername, updateBio, updateIsPublic, updateAvatar } from "@/services/profileService"
import { useToast } from "@/components/ui/CyberToast"

interface EditorProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentProfile: {
    username: string
    bio: string
    is_public?: boolean
    avatar?: string
  }
  onProfileUpdated: () => void
}

export const ProfileEditor = ({
  isOpen,
  onClose,
  userId,
  currentProfile,
  onProfileUpdated,
}: EditorProps) => {
  const [username, setUsername] = useState(currentProfile.username)
  const [bio, setBio] = useState(currentProfile.bio || "")
  const [isPublic, setIsPublic] = useState(currentProfile.is_public || false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(currentProfile.avatar || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Actualizar todos los campos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setUsername(currentProfile.username)
      setBio(currentProfile.bio || "")
      setIsPublic(currentProfile.is_public || false)
      setAvatar(null)
      if (currentProfile.avatar) {
        const DIRECTUS_URL = import.meta.env.VITE_RAWG_DIRECTUS_URL || "https://directus-latest-i2px.onrender.com"
        const avatarUrl = `${DIRECTUS_URL}/assets/${currentProfile.avatar}`
        setAvatarPreview(avatarUrl)
      } else {
        setAvatarPreview("")
      }
    }
  }, [isOpen, currentProfile.username, currentProfile.bio, currentProfile.avatar, currentProfile.is_public])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      const preview = URL.createObjectURL(file)
      setAvatarPreview(preview)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      if (username.trim() !== currentProfile.username) {
        await updateUsername(userId, username.trim())
      }

      if (bio.trim() !== (currentProfile.bio || "")) {
        await updateBio(userId, bio.trim())
      }

      if (isPublic !== currentProfile.is_public) {
        await updateIsPublic(userId, isPublic)
      }

      if (avatar) {
        await updateAvatar(userId, avatar)
      }

      toast({
        variant: "success",
        title: "Perfil actualizado",
        message: "Los cambios se han guardado correctamente",
        duration: 3000,
      })

      onProfileUpdated()
      onClose()
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      toast({
        variant: "error",
        title: "Error",
        message: "No se pudieron guardar los cambios",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-yellow-200/20 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cy">Editar Perfil</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-gray-800 transition-colors"
          >
            <FiX size={20} className="text-gray-400 hover:text-yellow-300" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-16 h-16 object-cover border-2 border-cy"
              />
            )}
            <label className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold cursor-pointer transition-colors disabled:opacity-50 text-sm">
              <FiUpload size={16} />
              Cambiar Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cy focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-50"
              placeholder="Tu nombre de usuario"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-300 mb-2">
              Biografía
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
              maxLength={200}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cy focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-50 resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {bio.length}/200 caracteres
            </p>
          </div>

          {/* Is Public */}
          <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700">
            <span className="text-sm font-semibold text-gray-300">
              Perfil Público
            </span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              disabled={loading}
              className={`relative w-12 h-6 transition-colors ${
                isPublic ? "bg-cyan-600" : "bg-gray-700"
              } disabled:opacity-50`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white transition-transform ${
                  isPublic ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-cy text-black font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSave size={18} />
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}