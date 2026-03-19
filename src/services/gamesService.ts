import { apiFetch } from "../api/rawg";
import type { Game, GamesResponse } from "../types/game";
import directus from "../api/directus";
import { createItem, deleteItem, updateItem, readItem } from "@directus/sdk";   

export const searchGames = async (query: string, signal?: AbortSignal): Promise<GamesResponse> => {
    return apiFetch(`/games?search=${query}`, signal);
};

export const addGameToLibrary = async (gameId: string | number, userId: string) => {
    return directus.request(createItem("library", {
        game_id: Number(gameId),
        user_id: userId
    }))

}

