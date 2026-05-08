import { useEffect } from "react"
import { FiX, FiAlertCircle } from "react-icons/fi"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  isDangerous?: boolean
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: ConfirmDialogProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Dialog */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Icon */}
        <div className={`flex justify-center mb-4 ${isDangerous ? "text-red-500" : "text-yellow-500"}`}>
          <FiAlertCircle size={32} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center text-sm mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 border border-current border-opacity-30 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0 ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {isLoading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
