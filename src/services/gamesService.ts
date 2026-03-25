import { apiFetch } from "../api/rawg";
import type { Game, GamesResponse } from "../types/game";
import directus from "../api/directus";
import { createItem, deleteItem, updateItem, readItem, readItems } from "@directus/sdk";   
import { useState } from "react";


export const getGamesByIds = async (ids: number[]): Promise<GamesResponse> => {
    const query = ids.map(id => `${id}`).join(',')
    const response = await apiFetch(`/games?ids=${query}`)
    console.log("Fetched games by IDs", ids, response)
    return response
}

export const searchGames = async (query: string, signal?: AbortSignal): Promise<GamesResponse> => {
    return apiFetch(`/games?search=${query}`, signal);
};

export const addGameToLibrary = async (gameId: string | number, userId: string) => {
    return directus.request(createItem("library", {
        game_id: Number(gameId),
        user_id: userId
    }))
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
        return {  count: 0, results: []  }
    }

    const games = await getGamesByIds(ids)

    return games
}
