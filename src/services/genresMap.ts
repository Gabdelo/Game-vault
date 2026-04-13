// Mapeo de géneros: RAWG ID -> Directus ID
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

export const getDirectusGenreId = (rawgGenreId: number): number | undefined => {
  return GENRES_MAP.get(rawgGenreId);
};
