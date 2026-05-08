// Mapeo de géneros: RAWG ID (genre_id) -> Directus ID (id)
// Esto es estático y no cambia, así evitamos requests innecesarias a Directus

export const GENRES_MAP = new Map([
  [4, 1],      // Action
  [51, 2],     // Indie
  [3, 3],      // Adventure
  [5, 4],      // RPG
  [10, 5],     // Strategy
  [2, 6],      // Shooter
  [40, 7],     // Casual
  [14, 8],     // Simulation
  [7, 9],      // Puzzle
  [11, 10],    // Arcade
  [83, 11],    // Platformer
  [59, 12],    // Massively Multiplayer
  [1, 13],     // Racing
  [15, 14],    // Sports
  [6, 15],     // Fighting
  [19, 16],    // Family
  [28, 17],    // Board Games
  [17, 18],    // Card
  [34, 19],    // Educational
]);

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export const GENRES: Genre[] = [
  { id: 4, name: "Action", slug: "action" },
  { id: 51, name: "Indie", slug: "indie" },
  { id: 3, name: "Adventure", slug: "adventure" },
  { id: 5, name: "RPG", slug: "role-playing-games-rpg" },
  { id: 10, name: "Strategy", slug: "strategy" },
  { id: 2, name: "Shooter", slug: "shooter" },
  { id: 40, name: "Casual", slug: "casual" },
  { id: 14, name: "Simulation", slug: "simulation" },
  { id: 7, name: "Puzzle", slug: "puzzle" },
  { id: 11, name: "Arcade", slug: "arcade" },
  { id: 83, name: "Platformer", slug: "platformer" },
  { id: 59, name: "Massively Multiplayer", slug: "massively-multiplayer" },
  { id: 1, name: "Racing", slug: "racing" },
  { id: 15, name: "Sports", slug: "sports" },
  { id: 6, name: "Fighting", slug: "fighting" },
  { id: 19, name: "Family", slug: "family" },
  { id: 28, name: "Board Games", slug: "board-games" },
  { id: 17, name: "Card", slug: "card" },
  { id: 34, name: "Educational", slug: "educational" },
];

export const getDirectusGenreId = (rawgGenreId: number): number | undefined => {
  return GENRES_MAP.get(rawgGenreId);
};
