import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getUserLibrary } from '../services/gamesService'
import type { Game } from '@/types/game'

export interface LibraryFilters {
    status: string | null
    genre: string | null
    ordering: string | null
}

interface LibraryStore {
    library: Game[]
    loading: boolean
    filters: LibraryFilters
    fetchLibrary: (userId: string) => Promise<void>
    isInLibrary: (rawgId: number) => boolean
    addToLibrary: (game: Game) => void
    removeFromLibrary: (rawgId: number) => void
    updateInLibrary: (rawgId: number, changes: Partial<Game>) => void
    setFilter: (key: keyof LibraryFilters, value: string | null) => void
    clearFilters: () => void
    getFilteredLibrary: () => Game[]
}

export const useLibraryStore = create<LibraryStore>()(
    persist(
        (set, get) => ({
            library: [],
            loading: false,
            filters: {
                status: null,
                genre: null,
                ordering: null
            },

            fetchLibrary: async (userId: string) => {
                set({ loading: true })
                const games = await getUserLibrary(userId)
                set({ library: games, loading: false })
            },

            isInLibrary: (rawgId: number) => {
                return get().library.some(game => game.id === rawgId)
            },

            addToLibrary: (game: Game) => {
                set({ library: [...get().library, game] })
            },

            removeFromLibrary: (rawgId: number) => {
                set({ library: get().library.filter(game => game.id !== rawgId) })
            },

            updateInLibrary: (rawgId: number, changes: Partial<Game>) => {
                set({
                    library: get().library.map(game =>
                        game.id === rawgId ? { ...game, ...changes } : game
                    )
                })
            },

            setFilter: (key, value) => {
                set(state => ({
                    filters: { ...state.filters, [key]: value }
                }))
            },

            clearFilters: () => {
                set({ filters: { status: null, genre: null, ordering: null } })
            },

            getFilteredLibrary: () => {
                const { library, filters } = get()
                let result = [...library]

                if (filters.status) {
                    result = result.filter(game => game.status === filters.status)
                }

                if (filters.genre) {
                    result = result.filter(game =>
                        game.genres?.some(g => (g.name || `Genre-${g.id}`) === filters.genre)
                    )
                }

                if (filters.ordering === 'recent') {
                    result = result.sort((a, b) =>
                        new Date(b.added_at ?? '').getTime() - new Date(a.added_at ?? '').getTime()
                    )
                }
                if (filters.ordering === 'rating') {
                    result = result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                }
                if (filters.ordering === 'name') {
                    result = result.sort((a, b) => a.name.localeCompare(b.name))
                }

                return result
            }
        }),
        {
            name: 'library-storage'
        }
    )
)