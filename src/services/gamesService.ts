import { apiFetch } from "../api/rawg";
import type { Game, GamesResponse } from "../types/game";
import directus from "../api/directus";
import { createItem, deleteItem, updateItem, readItems } from "@directus/sdk";
import { GENRES_MAP } from "./genresMap";
import { useLibraryStore } from "@/store/libraryStore";

export const deleteGameFromLibrary = async (gameId: number, userId: string) => {
    const directusGameId = await getDirectusGameId(gameId)
    if (!directusGameId) return

    const items = await directus.request(readItems("library", {
        filter: {
            user_id: { _eq: userId },
            game_id: { _eq: directusGameId }
        },
        limit: 1
    }))

    if (items.length > 0) {
        await directus.request(deleteItem("library", items[0].id))
        useLibraryStore.getState().removeFromLibrary(gameId)
    }
}


export const getGamesByIds = async (ids: number[]): Promise<GamesResponse> => {
    const query = ids.map(id => `${id}`).join(',')
    const response = await apiFetch(`/games?ids=${query}&page_size=100`)
 
    return response
}

export const searchGames = async (query: string, page: number = 1, signal?: AbortSignal): Promise<GamesResponse> => {
    return apiFetch(`/games?search=${query}&page=${page}&page_size=400`, signal);
}
export const isGameInLibrary = async (rawgId: number, userId: string): Promise<boolean> => {
    
    // Primero buscar el id interno del juego en Directus
    const games = await directus.request(readItems("games", {
        filter: { game_id: { _eq: rawgId } },
        limit: 1,
        fields: ['id']
    }))

    if (games.length === 0) return false

    const directusGameId = games[0].id

    const items = await directus.request(readItems("library", {
        filter: {
            user_id: { _eq: userId },
            game_id: { _eq: directusGameId }
        },
        limit: 1
    }))

    return items.length > 0
}
export const addGameToLibrary = async (game: Game, userId: string) => {
    try {
        if (!userId || userId.trim() === '') {
            throw new Error("Usuario no autenticado")
        }

        // Verificar si el juego existe en la tabla games
        const existingGames = await directus.request(readItems("games", {
            filter: { game_id: { _eq: game.id } },
            limit: 1
        }))

        let directusGameId: number

        if (existingGames.length === 0) {
            const completeGame = await getGameComplete(game.id)

            const directusGenreIds = completeGame.genres
              .map(g => GENRES_MAP.get(g.id))
              .filter((id): id is number => id !== undefined)

            const newGame = await directus.request(createItem("games", {
                game_id: completeGame.id,
                title: completeGame.name,
                slug: completeGame.slug,
                cover_image: completeGame.background_image,
                description: completeGame.description,
                metacritic_score: completeGame.metacritic,
                rating_rawg: completeGame.rating,
                released: completeGame.released,
                added: completeGame.added,
                esrb_rating: completeGame.esrb_rating?.name ?? null,
                platforms: completeGame.platforms.map(p => ({
                  id: p.platform.id,
                  name: p.platform.name,
                  released_at: p.released_at ?? null,
                  requirements: p.requirements ? {
                    minimum: p.requirements.minimum ?? null,
                    recommended: p.requirements.recommended ?? null
                  } : null
                })),
                website: completeGame.website,
                rating: completeGame.rating,
                reddit_url: completeGame.reddit_url,
                ratings: completeGame.ratings || [],
                tags: completeGame.tags || [],
                playtime: completeGame?.playtime,
                developers: completeGame.developers || [],
                genres: {
                  create: directusGenreIds.map(id => ({ genres_id: id }))
                },
                stores: completeGame.stores?.map(s => s.store.id) ?? [],
                screenshots: completeGame.short_screenshots?.map(s => s.image)
            }))

            directusGameId = newGame.id

        } else {
            directusGameId = existingGames[0].id
        }

        // Verificar si el juego ya está en la biblioteca usando el id interno
        const isInLibrary = await isGameInLibrary(game.id, userId)

        if (isInLibrary) {
            throw new Error("El juego ya está en tu biblioteca")
        }

        await directus.request(createItem("library", {
            game_id: directusGameId,
            user_id: userId,
            added_at: new Date().toISOString()
        }))
       
        useLibraryStore.getState().addToLibrary({
            ...game,
            status: null,
            rating: null,
            note: null,
            added_at: new Date().toISOString(),
        })

    } catch (error: any) {
        console.error("Error agregando juego a biblioteca:", error?.message || error)
        console.error("UserId recibido:", userId)
    }
}
export const getGameComplete = async (gameId: number): Promise<Game> => {
    // Obtener detalles completos del juego (incluye descripción y ratings)
    const gameDetail = await apiFetch(`/games/${gameId}`)
    
    // Obtener screenshots
    const screenshotsResponse = await apiFetch(`/games/${gameId}/screenshots`)
    const short_screenshots = screenshotsResponse.results || []
    
    const gameWithScreenshots = {
        ...gameDetail,
        short_screenshots,
      
    }
    
    
    return gameWithScreenshots
}
export const getUserLibrary = async (userId: string): Promise<Game[]> => {
    
    const libraryItems = await directus.request(readItems("library", {
        filter: {
            user_id: { _eq: userId }
        },
        fields: ['*', 'game_id.*', 'game_id.genres.genres_id.*']
    }))

    if (libraryItems.length === 0) return []

    return libraryItems.map((entry: any) => {
        const g = entry.game_id

        return {
            id: g.game_id,
            name: g.title,
            background_image: g.cover_image,
            metacritic: g.metacritic_score,
            released: g.released,
            slug: g.slug,
            playtime: g.playtime,
            website: g.website,
            reddit_url: g.reddit_url,
            description: g.description,
            added: g.added,
            tags: g.ratings || [],
            rating_rawg: g.rating_rawg,
            esrb_rating: g.esrb_rating ? {
                id: 0,
                name: g.esrb_rating,
                slug: g.esrb_rating.toLowerCase(),
                name_en: g.esrb_rating,
                name_ru: g.esrb_rating
            } : null,
            platforms: Array.isArray(g.platforms) ? g.platforms.map((p: any, idx: number) => {
                if (typeof p === 'string') {
                    return {
                        platform: { id: idx, name: p, slug: p.toLowerCase() }
                    }
                }
                return {
                    platform: { id: p.id ?? idx, name: p.name || 'Unknown', slug: p.slug ?? (p.name || 'Unknown').toLowerCase() },
                    released_at: p.released_at ?? null,
                    requirements: p.requirements ? {
                        minimum: p.requirements.minimum ?? null,
                        recommended: p.requirements.recommended ?? null
                    } : null
                }
            }) : [],
            genres: g.genres?.map((entry: any) => ({
                id: entry.genres_id?.id ?? entry.id,
                name: entry.genres_id?.name ?? `Genre-${entry.genres_id?.id ?? entry.id}`,
                slug: entry.genres_id?.slug ?? ''
            })) ?? [],
            short_screenshots: g.screenshots?.map((image: string, index: number) => ({
                id: index,
                image
            })) ?? [],
            stores: Array.isArray(g.stores) ? g.stores.map((s: any, idx: number) => ({
                id: idx,
                store: { id: idx, name: typeof s === 'string' ? s : s.name || 'Unknown', slug: (typeof s === 'string' ? s : s.name || 'Unknown').toLowerCase(), domain: '', games_count: 0, image_background: '' }
            })) : [],
            ratings: g.ratings || [],

            // datos personales del usuario
            status: entry.status ?? null,
            rating: entry.rating ?? null,
            note: entry.note ?? null,
            added_at: entry.added_at ?? null,
        }
    })
}

export const getGamesInLibrary = async (userId: string) => {
    const libraryItems = await directus.request(readItems("library", {
        filter: {
            user_id: {
                _eq: userId
            }
        }
    }))
   

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
            date_created: libraryData?.date_created ?? game.added ?? null,
            status: libraryData?.status ?? null
        }
    })

 

    return {
        count: gamesResponse.count,
        results: gamesWithLibraryData
    }
    
}
export const updateGameStatus = async (gameId: number, userId: string, status: 'playing' | 'completed' | 'dropped' | 'wishlist' | null) => {

    const directusGameId = await getDirectusGameId(gameId)

    if (!directusGameId) {
        console.warn("No directusGameId found")
        return
    }

    const items = await directus.request(readItems("library", {
        filter: { user_id: { _eq: userId }, game_id: { _eq: directusGameId } },
        limit: 1
    }))
    console.log("Found items in library:", items)

    if (items.length > 0) {
       
        await directus.request(updateItem("library", items[0].id, { status }))

        useLibraryStore.getState().updateInLibrary(gameId, { status })
      
    } else {
        console.warn("No library items found for this game")
    }
}

export const updateGameNote = async (gameId: number, userId: string, note: string | null) => {
    const directusGameId = await getDirectusGameId(gameId)
    if (!directusGameId) return

    const items = await directus.request(readItems("library", {
        filter: { user_id: { _eq: userId }, game_id: { _eq: directusGameId } },
        limit: 1
    }))

    if (items.length > 0) {
        await directus.request(updateItem("library", items[0].id, { note }))
        useLibraryStore.getState().updateInLibrary(gameId, { note })
    }
}

export const updateGameRating = async (gameId: number, userId: string, rating: number | null) => {
    const directusGameId = await getDirectusGameId(gameId)
    if (!directusGameId) return

    const items = await directus.request(readItems("library", {
        filter: { user_id: { _eq: userId }, game_id: { _eq: directusGameId } },
        limit: 1
    }))

    if (items.length > 0) {
        await directus.request(updateItem("library", items[0].id, { rating }))
        useLibraryStore.getState().updateInLibrary(gameId, { rating })
    }
}

export const getGameDirectus = async (gameId: number): Promise<Game> => {
    const games = await directus.request(readItems("games", {
        filter: { game_id: { _eq: gameId } },
        limit: 1,
        fields: ['*', 'genres.genres_id.*']
    }))

    if (games.length === 0) {
        throw new Error("Juego no encontrado")
    }

    const g = games[0]

    return {
        id: g.game_id,
        name: g.title,
        background_image: g.cover_image,
        metacritic: g.metacritic_score,
        released: g.released,
        slug: g.slug,
        playtime: g.playtime,
        website: g.website,
        
        reddit_url: g.reddit_url,
        esrb_rating: g.esrb_rating ? { 
            id: 0, 
            name: g.esrb_rating, 
            slug: g.esrb_rating.toLowerCase(),
            name_en: g.esrb_rating,
            name_ru: g.esrb_rating
        } : null,
        description: g.description,
        rating: g.rating_rawg,
        ratings: g.ratings || [],
        tags: g.tags || [],
        developers: (g.developers || []).map((d: any) => 
            typeof d === 'string' 
                ? { id: 0, name: d, slug: d.toLowerCase(), image_background: '', games_count: 0 }
                : d
        ),
        platforms: g.platforms.map((p: any) => {
            // Si es un string, convertir a objeto básico
            if (typeof p === 'string') {
                return {
                    platform: { id: 0, name: p, slug: p.toLowerCase() }
                }
            }
            // Si es un objeto con estructura completa
            return {
                platform: { 
                    id: p.id ?? 0, 
                    name: p.name, 
                    slug: p.slug ?? p.name.toLowerCase() 
                },
                released_at: p.released_at ?? null,
                requirements: p.requirements ? {
                    minimum: p.requirements.minimum ?? null,
                    recommended: p.requirements.recommended ?? null
                } : null
            }
        }),
        genres: g.genres.map((entry: any) => entry.genres_id),
        short_screenshots: g.screenshots?.map((image: string) => ({
            id: 0,
            image
        })) ?? [],
        stores: Array.isArray(g.stores) ? g.stores.map((store: any, idx: number) => ({
            store: { 
                id: typeof store === 'object' ? store.id : store, 
                name: typeof store === 'object' ? store.name : `Store ${idx}`, 
                slug: (typeof store === 'object' ? store.name : `store-${idx}`).toLowerCase(), 
                domain: '', 
                games_count: 0, 
                image_background: '' 
            }
        })) : [],
    }
}
   

export const getGameRawg = async (gameId: number): Promise<Game> => {
    // Obtener detalles completos del juego (incluye descripción y ratings)
    const gameDetail = await apiFetch(`/games/${gameId}`)
    
    // Obtener screenshots
    const screenshotsResponse = await apiFetch(`/games/${gameId}/screenshots`)
    const short_screenshots = screenshotsResponse.results || []
    
    const gameWithScreenshots = {
        ...gameDetail,
        short_screenshots,
     
    }
    
    return gameWithScreenshots
}
// 3. Función principal que usas en los componentes — maneja los 3 escenarios
export const getGameDetailFull = async (gameId: number, userId: string | null): Promise<Game> => {


    const games = await directus.request(readItems("games", {
        filter: { game_id: { _eq: gameId } },
        limit: 1,
        fields: ['id']  // solo necesitas el id interno aquí
    }))
    // Escenario 1 — no está en Directus
    if (games.length === 0) {
        return getGameRawg(gameId)
    }
    const directusGameId = games[0].id

    const game = await getGameDirectus(gameId)

    // Sin sesión — escenario 2 simplificado
    if (!userId) {
        return game
    }

    const libraryItems = await directus.request(readItems("library", {
        filter: {
            user_id: { _eq: userId },
            game_id: { _eq: directusGameId }
        },
        limit: 1
    }))

    // Escenario 2 — en Directus pero no en su biblioteca
    if (libraryItems.length === 0) {
        return game
    }
    // Escenario 3 — en Directus y en su biblioteca

    const libraryEntry = libraryItems[0]

    const result = {
        ...game,
        status: libraryEntry.status ?? null,
        rating: libraryEntry.rating ?? null,
        note: libraryEntry.note ?? null,
        date_created: libraryEntry.added_at ?? game.added ?? null,
        isInLibrary: true
    }

    return result
}



export const getAndSaveGamesByFilter = async (filter: string, page: number = 1, pageSize: number = 15): Promise<GamesResponse> => {
    try {
        // 1. Obtener juegos desde RAWG usando el filtro
        const gamesResponse = await getGamesByFilter(filter, page, pageSize)
        
        if (!gamesResponse.results || gamesResponse.results.length === 0) {
            return gamesResponse
        }

        // 2. Para cada juego, obtener detalles completos y guardarlo en Directus
        const processedGames = await Promise.all(
            gamesResponse.results.map(async (game) => {
                try {
                    // Verificar si el juego ya existe en Directus
                    const existingGames = await directus.request(readItems("games", {
                        filter: { game_id: { _eq: game.id } },
                        limit: 1,
                        fields: ['id']
                    }))

                    // Si ya existe, retornar el juego tal cual
                    if (existingGames.length > 0) {
                        console.log(`Juego ${game.id} ya existe en Directus`)
                        return game
                    }

                    // 3. Si no existe, obtener detalles completos
                    const completeGame = await getGameRawg(game.id)
                    console.log('cover_image:', completeGame.background_image)
console.log('added:', completeGame.added)

                    const directusGenreIds = completeGame.genres
                      .map(g => GENRES_MAP.get(g.id))
                      .filter((id): id is number => id !== undefined)
                      

                    // 4. Guardar en Directus
                    await directus.request(createItem("games", {
                        game_id: completeGame.id,
                        title: completeGame.name,
                        slug: completeGame.slug,
                       cover_image: completeGame.background_image,
                        description: completeGame.description,
                       metacritic_score: completeGame.metacritic,
                        rating_rawg: completeGame.rating,
                       released: completeGame.released,
                       added: completeGame.added ?? null,
                        esrb_rating: completeGame.esrb_rating?.name ?? null,
                       ratings: completeGame.ratings || [],
                        platforms: completeGame.platforms.map(p => ({
                          id: p.platform.id,
                          name: p.platform.name,
                       
                          released_at: p.released_at ?? null,
                          requirements: p.requirements ? {
                            minimum: p.requirements.minimum ?? null,
                            recommended: p.requirements.recommended ?? null
                          } : null
                        })),
                        website: completeGame.website,
                       reddit_url: completeGame.reddit_url,
                        playtime: completeGame?.playtime,
                        tags: completeGame?.tags,
                        developers: completeGame.developers?.map(d => d.name),
                        genres: {
                          create: directusGenreIds.map(id => ({ genres_id: id }))
                        },
                        stores: completeGame.stores?.map(s => s.store.id) ?? [],
                        screenshots: completeGame.short_screenshots?.map(s => s.image)
                    }))

                    return completeGame

                } catch (error: any) {
                  
                    if (error?.status === 403 || error?.message?.includes("permission")) {
                        console.log(`Sin permisos para guardar juego ${game.id} en Directus, devolviendo datos de RAWG`)
                        return game
                    }
                    console.error(`Error procesando juego ${game.id}:`, error?.message || error)
                    return game
                }
            })
        )

        return {
            count: gamesResponse.count,
            results: processedGames
        }

    } catch (error: any) {
        // Si es un error 403 de permisos, retornar los juegos de RAWG sin intentar guardar
        if (error?.status === 403 || error?.message?.includes("permission")) {
            console.log("No hay permisos para guardar en Directus, devolviendo juegos de RAWG")
            try {
                const gamesResponse = await getGamesByFilter(filter, page, pageSize)
                return gamesResponse
            } catch (fallbackError) {
     
                throw fallbackError
            }
        }
        console.error("Error en getAndSaveGamesByFilter:", error?.message || error)
        throw error
    }
}

export const getGamesByGenre = async (genre: string, page : number =1, pageSize: number = 15): Promise<GamesResponse> => {
    return apiFetch(`/games?genres=${genre}&page=${page}&page_size=${pageSize}`)
}
export const getGamesByFilter = async (filter: string, page : number =1, pageSize: number = 15): Promise<GamesResponse> => {
    return apiFetch(`/games?ordering=-${filter}&page=${page}&page_size=${pageSize}`)
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

export const getDirectusGameId = async (rawgId: number): Promise<number | null> => {
    const games = await directus.request(readItems("games", {
        filter: { game_id: { _eq: rawgId } },
        limit: 1,
        fields: ['id']
    }))
    return games.length > 0 ? games[0].id : null
}


export const getTopAddedGames = async (): Promise<Game[]> => {
    try {
        const games = await directus.request(readItems("games", {
            sort: ['-added'], // Ordenar por added descendente (más alto primero)
            limit: 10, // Solo los 10 primeros
            fields: ['game_id']  // Solo necesitamos el game_id
        }))

        if (games.length === 0) return []

        // Obtener detalles completos desde RAWG para cada juego
        const detailedGames = await Promise.all(
            games.map(g => getGameRawg(g.game_id))
        )

        return detailedGames
    } catch (error: any) {
        console.error("Error obteniendo juegos populares:", error?.message || error)
        return []
    }
}
export interface GameFilters {
    genres?: string
    ordering?: string
    page?: number
    pageSize?: number
    search?: string
    platforms?: string
    tags?: string
    rating?: string
    metacritic?: string
}

export const getGamesByFilters = async (filters: GameFilters): Promise<GamesResponse> => {
    const params = new URLSearchParams()

    if (filters.genres) params.append('genres', filters.genres)
    if (filters.ordering) params.append('ordering', filters.ordering)
    if (filters.search) params.append('search', filters.search)
    if (filters.platforms) params.append('platforms', filters.platforms)
    if (filters.tags) params.append('tags', filters.tags)
    if (filters.rating) params.append('rating', filters.rating)
    if (filters.metacritic) params.append('metacritic', filters.metacritic)
    
    params.append('page', String(filters.page ?? 1))
    params.append('page_size', String(filters.pageSize ?? 15))

    const url = `/games?${params.toString()}`
 
    
    return apiFetch(url)
}
export const getGenresDirectus = async () => {
    return directus.request(readItems("genres", {
        fields: ['id', 'name', 'slug', 'img_url']
    }))
}

export const mapDirectusToGame = (g: any, libraryEntry?: any): Game => ({
    id: g.game_id,
    name: g.title,
    background_image: g.cover_image,
    metacritic: g.metacritic_score,
    released: g.released,
    slug: g.slug,
    playtime: g.playtime,
    website: g.website,
    reddit_url: g.reddit_url,
    description: g.description,
    esrb_rating: g.esrb_rating ? {
        id: 0,
        name: g.esrb_rating,
        slug: g.esrb_rating.toLowerCase(),
        name_en: g.esrb_rating,
        name_ru: g.esrb_rating
    } : null,
    platforms: g.platforms?.map((p: any, index: number) => {
        // Si es un string, convertir a objeto básico
        if (typeof p === 'string') {
            return {
                platform: { id: index, name: p, slug: p.toLowerCase() }
            }
        }
        // Si es un objeto con estructura completa
        return {
            platform: { 
                id: p.id ?? index, 
                name: p.name, 
                slug: p.slug ?? p.name.toLowerCase() 
            },
            released_at: p.released_at ?? null,
            requirements: p.requirements ? {
                minimum: p.requirements.minimum ?? null,
                recommended: p.requirements.recommended ?? null
            } : null
        }
    }) ?? [],
    genres: g.genres?.map((entry: any) => ({
                id: entry.genres_id?.id ?? entry.id,
                name: entry.genres_id?.name ?? `Genre-${entry.genres_id?.id ?? entry.id}`,
                slug: entry.genres_id?.slug ?? ''
            })) ?? [],
    short_screenshots: g.screenshots?.map((image: string, index: number) => ({
        id: index, image
    })) ?? [],
    
    status: libraryEntry?.status ?? null,
    rating: libraryEntry?.rating ?? null,
    note: libraryEntry?.note ?? null,
    added_at: libraryEntry?.added_at ?? null,
})