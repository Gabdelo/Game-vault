/// <reference types="vite/client" />
// este tipo de archivos typescript los lee  automáticamente
interface ImportMetaEnv {
  readonly VITE_RAWG_API_URL: string
  readonly VITE_RAWG_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}