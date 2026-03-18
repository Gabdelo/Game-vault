export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  metacritic: number | null;
  genres: Genre[];
  platforms: PlatformWrapper[];
}
export interface Genre{
    id: number
    name: string
}
export interface Platform {
  id: number
  name: string
}
export interface PlatformWrapper {
  platform: Platform
}
export interface GamesResponse {
  count: number
  results: Game[]
}