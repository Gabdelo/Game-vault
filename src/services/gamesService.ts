import { apiFetch } from "../api/rawg";
import type { Game, GamesResponse } from "../types/game";

export const searchGames = async (query: string, signal?: AbortSignal): Promise<GamesResponse> => {
    return apiFetch(`/games?search=${query}`, signal);
};
