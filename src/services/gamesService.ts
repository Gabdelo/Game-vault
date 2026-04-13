import { apiFetch } from "../api/rawg";
import type { Game, GamesResponse } from "../types/game";
import directus from "../api/directus";
import { createItem, deleteItem, updateItem, readItems } from "@directus/sdk";
import { GENRES_MAP } from "./genresMap";

export const deleteGameFromLibrary = async (gameId: number, userId: string) => {
    // Primero obtenemos el item de la biblioteca para ese juego y usuario
    const item = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            },
            game_id: {
                _eq: Number(gameId)
            }
        },limit: 1
    }))
    if(item){
        return directus.request(deleteItem("library", item[0].id))
    }
}


export const getGamesByIds = async (ids: number[]): Promise<GamesResponse> => {
    const query = ids.map(id => `${id}`).join(',')
    const response = await apiFetch(`/games?ids=${query}`)
    console.log("Fetched games by IDs", ids, response)
    return response
}

export const searchGames = async (query: string, page: number = 1, signal?: AbortSignal): Promise<GamesResponse> => {
    return apiFetch(`/games?search=${query}&page=${page}&page_size=40`, signal);
}
export const isGameInLibrary = async (gameId: number, userId: string): Promise<boolean> => {

    const items = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            },
            game_id: {
                _eq: Number(gameId)
            }
        },limit: 1
    }))
    return items.length > 0
}
export const addGameToLibrary = async (game: Game, userId: string) => {
    // Agregar el juego a la librería
    const libraryItem = await directus.request(createItem("library", {
        game_id: game.id,
        user_id: userId
    }));
    
    console.log(`📚 Juego agregado a library con ID: ${libraryItem.id}`);
    
    // Agregar los géneros del juego a game_genres
    await addGameGenres(game);
}


export const getGamesInLibrary = async (userId: string) => {
    const libraryItems = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            }
        }
    }))
    console.log("Fetched library items for user", userId, libraryItems)

    return libraryItems
}
export const getFullLibraryGames = async (userId: string): Promise<GamesResponse> => {
    const libraryItems = await getGamesInLibrary(userId)
    const ids = libraryItems.map(item => item.game_id)
    if (ids.length === 0) {
        return { count: 0, results: [] }
    }

    const gamesResponse = await getGamesByIds(ids)

    // Mergear datos de la API con datos de Directus
    const gamesWithLibraryData = gamesResponse.results.map(game => {
        const libraryData = libraryItems.find(item => item.game_id === game.id)
        return {
            ...game, //spread de los datos del juego desde la API esto incluye id, name, genres, platforms, etc haciendo una copia del objeto juego
            rating: libraryData?.rating ?? null,
            note: libraryData?.note ?? null,
            date_created: libraryData?.date_created ?? null,
            status: libraryData?.status ?? null
        }
    })

    console.log("Fetched full library games for user", userId, gamesWithLibraryData)

    return {
        count: gamesResponse.count,
        results: gamesWithLibraryData
    }
    
}
export const updateGameStatus = async (gameId: number, userId: string, status: 'playing' | 'completed' | 'dropped' | 'wishlist' | null) => {
    const items = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            },
            game_id: {
                _eq: Number(gameId)
            }
        },
        limit: 1
    }))
    
    if (items.length > 0) {
        return directus.request(updateItem("library", items[0].id, {
            status: status
        }))
    }
}

export const updateGameNote = async (gameId: number, userId: string, note: string | null) => {
    const items = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            },
            game_id: {
                _eq: Number(gameId)
            }
        },
        limit: 1
    }))
    
    if (items.length > 0) {
        return directus.request(updateItem("library", items[0].id, {
            note: note
        }))
    }
}

export const updateGameRating = async (gameId: number, userId: string, rating: number | null) => {
    const items = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            },
            game_id: {
                _eq: Number(gameId)
            }
        },
        limit: 1
    }))
    
    if (items.length > 0) {
        return directus.request(updateItem("library", items[0].id, {
            rating: rating
        }))
    }
}

export const getGameDetail = async (gameId: number, userId?: string): Promise<Game & { _inLibrary?: boolean }> => {
    // Obtener detalles completos del juego (incluye descripción)
    const gameDetail = await apiFetch(`/games/${gameId}`)
    
    // Obtener screenshots
    const screenshotsResponse = await apiFetch(`/games/${gameId}/screenshots`)
    const short_screenshots = screenshotsResponse.results || []
    
    const gameWithScreenshots = {
        ...gameDetail,
        short_screenshots
    }
    
    if (userId) {
        const libraryItems = await getGamesInLibrary(userId)
        const libraryData = libraryItems.find(item => item.game_id === gameId)
        
        if (libraryData) {
            return {
                ...gameWithScreenshots,
                _inLibrary: true,
                rating: libraryData.rating ?? null,
                note: libraryData.note ?? null,
                date_created: libraryData.date_created ?? null,
                status: libraryData.status ?? null
            }
        }
    }
    
    return gameWithScreenshots
}

export const getGamesByFilter = async (filter: string, page : number =1, pageSize: number = 40): Promise<GamesResponse> => {
    return apiFetch(`/games?ordering=-${filter}&page=${page}&page_size=${pageSize}`)
}
export const getGamesByGenre = async (genre: string, page : number =1, pageSize: number = 40): Promise<GamesResponse> => {
    return apiFetch(`/games?genres=${genre}&page=${page}&page_size=${pageSize}`)
}

export const addGameGenres = async (game: Game) => {
    if (!game.genres || game.genres.length === 0) return;
    try {
        // Verificar si el true_game_id ya existe en la colección game_genres
        const existingGenres = await directus.request(readItems("game_genres", {
            filter: {
                true_game_id: {
                    _eq: game.id
                }
            },
            limit: 1
        }));
        // Si ya existe, no insertamos nada
        if (existingGenres.length > 0) {
            return;
        }
        // Insertar cada género del juego
        for (const genre of game.genres) {
            try {
                // Obtener ID de Directus desde el mapeo local
                const directusGenreId = GENRES_MAP.get(genre.id);
                
                if (!directusGenreId) {
                    continue;
                }
                await directus.request(createItem("game_genres", {
                    genre_id: directusGenreId,
                    true_game_id: game.id
                }));
            } catch (error: any) {
                console.error(`Error insertando género para juego ${game.id}:`, error?.message || error);
            }
        }
    } catch (error: any) {
        console.error("Error en addGameGenres:", error?.message || error);
    }
}