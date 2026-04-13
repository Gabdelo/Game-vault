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
  date_created?: string | null
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
export interface PlatformWrapper {
  platform: Platform
  requierements_en?: string | null
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