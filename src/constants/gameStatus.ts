export const STATUS_OPTIONS = [
    { value: null, label: "Predeterminado" },
    { value: "recent", label: "Más Recientes" },
    { value: "rating", label: "Mejor Puntuación" },
    { value: "name", label: "Nombre (A-Z)" }
] as const

export const STATUS_COLORS: Record<string, string> = {
    playing: 'bg-blue-500',
    completed: 'bg-green-500',
    wishlist: 'bg-yellow-500',
    dropped: 'bg-red-500',
    default: 'bg-gray-500'
}

export const STATUS_TOOLTIPS: Record<string, string> = {
    playing: 'Jugando',
    completed: 'Completado',
    wishlist: 'Deseado',
    dropped: 'Abandonado',
    default: 'Sin estado'
}

export const STATUS_MENU_OPTIONS = [
    { status: 'playing', label: 'Jugando', icon: '', bgClass: 'bg-blue-600' },
    { status: 'completed', label: 'Completado', icon: '', bgClass: 'bg-green-600' },
    { status: 'wishlist', label: 'Deseado', icon: '', bgClass: 'bg-yellow-600' },
    { status: 'dropped', label: 'Abandonado', icon: '', bgClass: 'bg-red-600' }
] as const

export const getStatusColor = (status: string | null): string => {
    if (!status) return STATUS_COLORS.default
    return STATUS_COLORS[status] || STATUS_COLORS.default
}

export const getStatusTooltip = (status: string | null): string => {
    if (!status) return STATUS_TOOLTIPS.default
    return STATUS_TOOLTIPS[status] || STATUS_TOOLTIPS.default
}
