import { useState, useEffect, useCallback } from 'react'
import type { Game } from '@/types/game'
import { updateGameNote, updateGameRating, updateGameStatus, addGameToLibrary, deleteGameFromLibrary } from '@/services/gamesService'
import { useToast } from '@/components/ui/CyberToast'

interface UseGameDetailHandlersProps {
    gameId: number
    userId?: string
    gameDetail: Game | null
    setGameDetail: (game: Game | null) => void
    onIsInLibraryChange: (isInLibrary: boolean) => void
}

export const useGameDetailHandlers = ({
    gameId,
    userId,
    gameDetail,
    setGameDetail,
    onIsInLibraryChange
}: UseGameDetailHandlersProps) => {
    const { toast } = useToast()

    const [editNote, setEditNote] = useState(false)
    const [editRating, setEditRating] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [noteValue, setNoteValue] = useState("")
    const [ratingValue, setRatingValue] = useState(0)
    const [statusValue, setStatusValue] = useState<'playing' | 'completed' | 'dropped' | 'wishlist' | null>(null)
    const [addingToLibrary, setAddingToLibrary] = useState(false)
    const [deletingFromLibrary, setDeletingFromLibrary] = useState(false)

    // Sincronizar valores cuando gameDetail cambia
    useEffect(() => {
        if (gameDetail) {
            setNoteValue(gameDetail.note || "")
            setRatingValue(gameDetail.rating || 0)
            setStatusValue(gameDetail.status || null)
        }
    }, [gameDetail?.id])

    const handleSaveNote = useCallback(async () => {
        if (!userId) return
        try {
            await updateGameNote(gameId, userId, noteValue || null)
            setGameDetail(gameDetail ? { ...gameDetail, note: noteValue || null } : null)
            setEditNote(false)
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }, [gameId, userId, noteValue, gameDetail])

    const handleSaveRating = useCallback(async () => {
        if (!userId) return
        try {
            await updateGameRating(gameId, userId, ratingValue || null)
            setGameDetail(gameDetail ? { ...gameDetail, rating: ratingValue || null } : null)
            setEditRating(false)
        } catch (error) {
            console.error("Error updating rating:", error)
        }
    }, [gameId, userId, ratingValue, gameDetail])

    const handleSaveStatus = useCallback(async (statusToSave?: 'playing' | 'completed' | 'dropped' | 'wishlist' | null) => {
        const finalStatus = statusToSave !== undefined ? statusToSave : statusValue
        if (!userId) {
            return
        }
        try {
            await updateGameStatus(gameId, userId, finalStatus)
            setGameDetail(gameDetail ? { ...gameDetail, status: finalStatus } : null)
            setEditStatus(false)
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }, [gameId, userId, statusValue, gameDetail])

    const handleAddToLibrary = useCallback(async () => {
        if (!userId || !gameDetail) return
        setAddingToLibrary(true)
        try {
            await addGameToLibrary(gameDetail, userId)
            setNoteValue("")
            setRatingValue(0)
            setStatusValue(null)
            setGameDetail(gameDetail ? {
                ...gameDetail,
                note: null,
                rating: null,
                status: null
            } : null)
            onIsInLibraryChange(true)
            toast({
                variant: 'success',
                title: 'Éxito',
                message: `${gameDetail.name} añadido a tu biblioteca`,
                duration: 3500
            })
        } catch (error) {
            console.error("Error adding game to library:", error)
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo añadir el juego',
                duration: 3500
            })
        } finally {
            setAddingToLibrary(false)
        }
    }, [userId, gameDetail, onIsInLibraryChange, toast])

    const handleDeleteFromLibrary = useCallback(async () => {
        if (!userId) return
        setDeletingFromLibrary(true)
        try {
            await deleteGameFromLibrary(gameId, userId)
            onIsInLibraryChange(false)
            setNoteValue("")
            setRatingValue(0)
            setStatusValue(null)
            toast({
                variant: 'success',
                title: 'Eliminado',
                message: `Juego eliminado de tu biblioteca`,
                duration: 3500
            })
        } catch (error) {
            console.error("Error deleting game from library:", error)
            toast({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo eliminar el juego',
                duration: 3500
            })
        } finally {
            setDeletingFromLibrary(false)
        }
    }, [gameId, userId, onIsInLibraryChange, toast])

    return {
        // Estado
        editNote,
        editRating,
        editStatus,
        noteValue,
        ratingValue,
        statusValue,
        addingToLibrary,
        deletingFromLibrary,
        // Setters de estado
        setEditNote,
        setEditRating,
        setEditStatus,
        setNoteValue,
        setRatingValue,
        setStatusValue,
        // Handlers
        handleSaveNote,
        handleSaveRating,
        handleSaveStatus,
        handleAddToLibrary,
        handleDeleteFromLibrary
    }
}
