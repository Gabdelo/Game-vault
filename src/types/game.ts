export interface Game {
  id: number
  name: string
  background_image: string | null
  metacritic: number | null
  genres: Genre[]
  platforms: PlatformWrapper[]
  released: string | null
  rating?: number | null //personales
  note?: string | null
  added_at?: string | null
  status?: 'playing' | 'completed' | 'dropped' | 'wishlist' | null

  // ── NUEVO ──
  slug?: string
  playtime?: number                  // horas promedio
  rating_top?: number                // escala máxima del rating (siempre 5)
  ratings_count?: number             // total de votos
  reviews_count?: number
  reviews_text_count?: number
  ratings?: Rating[]                 // desglose: exceptional, recommended, meh, skip
  tags?: Tag[]
  stores?: StoreWrapper[]
  esrb_rating?: EsrbRating | null
  short_screenshots?: Screenshot[]
  parent_platforms?: ParentPlatformWrapper[]
  description?: string           // disponible en el endpoint de detalle /games/{id}

    // ── NUEVOS DEL DETALLE RAWG ──
  background_image_additional?: string
  website?: string
  metacritic_platforms?: MetacriticPlatform[]
  added?: number
  added_by_status?: AddedByStatus
  developers?: Developer[]
  publishers?: Publisher[]
  reddit_url?: string
  reddit_name?: string
  reddit_description?: string
  reddit_logo?: string
  saturated_color?: string
  dominant_color?: string
  clip?: any
  alternative_names?: string[]
  tba?: boolean
  updated?: string
  isInLibrary?: boolean // campo adicional para saber si el juego está en la biblioteca del usuario
}

export interface Genre{
    id: number
    name: string
}

export interface Platform {
  id: number
  name: string
}

export interface GamesResponse {
  count: number
  results: Game[]
}

// ── INTERFACES NUEVAS ──

export interface Rating {
  id: number
  title: 'exceptional' | 'recommended' | 'meh' | 'skip'
  count: number
  percent: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  language: string
  games_count: number
  image_background: string
}

export interface Store {
  id: number
  name: string
  slug: string
}

export interface StoreWrapper {
  store: Store
}

export interface EsrbRating {
  id: number
  name: string
  slug: string
  name_en: string
  name_ru: string
}

export interface Screenshot {
  id: number
  image: string
}

export interface ParentPlatform {
  id: number
  name: string
  slug: string
}

export interface ParentPlatformWrapper {
  platform: ParentPlatform
}

export interface PlatformRequirements {
  minimum?: string | null
  recommended?: string | null
}

export interface PlatformWrapper {
  platform: Platform
  released_at?: string | null
  requirements?: PlatformRequirements | null
}

export interface MetacriticPlatform {
  metascore: number
  url: string
  platform: {
    platform: number
    name: string
    slug: string
  }
}

export interface AddedByStatus {
  yet: number
  owned: number
  beaten: number
  toplay: number
  dropped: number
  playing: number
}
export interface Developer {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
}
export interface Publisher {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
}

export interface GenreDirectus {
id: number;
name: string;
image_background: string;
}
export const genres: GenreDirectus[] = [
{ id: 4, name: "Action", image_background: "https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f140cc4825868e858cb.jpg" },
{ id: 51, name: "Indie", image_background: "https://media.rawg.io/media/games/dd5/dd50d4266915d56dd5b63ae1bf72606a.jpg" },
{ id: 3, name: "Adventure", image_background: "https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg" },
{ id: 5, name: "RPG", image_background: "https://media.rawg.io/media/games/e6d/e6de699bd788497f4b52e2f41f9698f2.jpg" },
{ id: 10, name: "Strategy", image_background: "https://media.rawg.io/media/games/08b/08b2eee52a9876a48b955e5149affe5b.jpg" },
{ id: 2, name: "Shooter", image_background: "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg" },
{ id: 40, name: "Casual", image_background: "https://media.rawg.io/media/games/5eb/5eb49eb2fa0738fdb5bacea557b1bc57.jpg" },
{ id: 14, name: "Simulation", image_background: "https://media.rawg.io/media/games/78d/78dfae12fb8c5b16cd78648553071e0a.jpg" },
{ id: 7, name: "Puzzle", image_background: "https://media.rawg.io/media/screenshots/42d/42d770eb49f2ba01cd4045e0d92af7a9.jpg" },
{ id: 11, name: "Arcade", image_background: "https://media.rawg.io/media/games/556/556157feed9ee1f55f2b12b2973e30a3.jpg" },
{ id: 83, name: "Platformer", image_background: "https://media.rawg.io/media/games/fd7/fd794a9f0ffe816038d981b3acc3eec9.jpg" },
{ id: 59, name: "Massively Multiplayer", image_background: "https://media.rawg.io/media/screenshots/6d3/6d367773c06886535620f2d7fb1cb866.jpg" },
{ id: 1, name: "Racing", image_background: "https://media.rawg.io/media/games/367/367463d43c2a1465f27e830b5b1334ee.jpg" },
{ id: 15, name: "Sports", image_background: "https://media.rawg.io/media/games/5eb/5eb49eb2fa0738fdb5bacea557b1bc57.jpg" },
{ id: 6, name: "Fighting", image_background: "https://media.rawg.io/media/games/ba3/ba3dbf9a5a71913582052d7e12775aea.jpg" },
{ id: 19, name: "Family", image_background: "https://media.rawg.io/media/screenshots/656/65654f69256420c0126eb506c1a72d7f.jpg" },
{ id: 28, name: "Board Games", image_background: "https://media.rawg.io/media/games/98b/98b1b87e86a815c23efe902fce598e54.jpg" },
{ id: 17, name: "Card", image_background: "https://media.rawg.io/media/screenshots/3f5/3f58a7b2a2b290994eb798eb72ca3fb2.jpg" },
{ id: 34, name: "Educational", image_background: "https://media.rawg.io/media/screenshots/f24/f24122a8e3d30ec3e99472e3e826d0cb.jpg" }
];