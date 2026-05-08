
import { InfoSection } from './InfoSection'
import { ESRB_IMAGES } from '@/services/esrbMap'
import type { Game } from '@/types/game'

interface GameSidebarProps {
    gameDetail: Game
    user: any
    isInLibrary: boolean
    setSelectedImageIndex: (index: number) => void
    setIsImageModalOpen: (open: boolean) => void
    onNavigate: (path: string) => void
}


export const GameSidebar = ({
    gameDetail,
    user,
    isInLibrary,
    
}: GameSidebarProps) => {
    return (
        
        <div className="flex flex-col gap-5">
            {/* Metacritic por plataforma */}
            {gameDetail.metacritic_platforms && gameDetail.metacritic_platforms.length > 0 && (
                <InfoSection label="Metacritic por plataforma">
                    <div className="flex flex-col gap-2">
                        {gameDetail.metacritic_platforms.map((mp, i) => (
                            <div key={`meta-${i}-${mp.platform.name}`} className="flex items-center justify-between">
                                <span className="text-xs text-white/50">{mp.platform.name}</span>
                                <span
                                    className={`text-sm font-bold ${
                                        mp.metascore >= 80
                                            ? "text-green-400"
                                            : mp.metascore >= 60
                                              ? "text-yellow-400"
                                              : "text-red-400"
                                    }`}
                                >
                                    {mp.metascore}
                                </span>
                            </div>
                        ))}
                    </div>
                </InfoSection>
            )}

            {/* Plataformas */}
            {gameDetail.platforms?.length > 0 && (
                <InfoSection label="Plataformas">
                    <div className="flex flex-col gap-2">
                        {gameDetail.platforms.map((p, idx) => (
                            <span key={`platform-${idx}`} className="text-sm text-white/70">
                                {p.platform.name}
                            </span>
                        ))}
                    </div>
                </InfoSection>
            )}

            {/* Developers */}
            {gameDetail.developers && gameDetail.developers.length > 0 && (
                <InfoSection label="Desarrollador">
                    <div className="flex flex-col gap-1">
                        {gameDetail.developers.map((d, idx) => (
                            <span key={`dev-${idx}`} className="text-sm text-white/70">
                                {d.name}
                            </span>
                        ))}
                    </div>
                </InfoSection>
            )}

            {/* Publishers */}
            {gameDetail.publishers && gameDetail.publishers.length > 0 && (
                <InfoSection label="Distribuidora">
                    <div className="flex flex-col gap-1">
                        {gameDetail.publishers.map((p, idx) => (
                            <span key={`pub-${idx}`} className="text-sm text-white/70">
                                {p.name}
                            </span>
                        ))}
                    </div>
                </InfoSection>
            )}

            {/* ESRB */}
            {gameDetail.esrb_rating && (
                <InfoSection label="Clasificación">
                    <div className=' h-60 flex  justify-start'>
                        <img
                        src={ESRB_IMAGES[gameDetail.esrb_rating.name] || ESRB_IMAGES['Everyone']}
                        alt={gameDetail.esrb_rating.name}
                        className="object-cover h-4/6"
                    />

                    </div>
                </InfoSection>
            )}

            {/* Fecha agregado */}
            {user?.id && isInLibrary && gameDetail.added_at && (
                <p className="text-xs text-white px-1">
                    Agregado el{" "}
                    {new Date(gameDetail.added_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            )}
        </div>
    )
}
