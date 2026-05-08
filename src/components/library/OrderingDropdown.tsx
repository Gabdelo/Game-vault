import { STATUS_OPTIONS } from "@/constants/gameStatus"

interface OrderingDropdownProps {
    isOpen: boolean
    onToggle: () => void
    currentOrder: string | null
    onOrderChange: (order: string | null) => void
    size?: 'sm' | 'md'
}

export const OrderingDropdown = ({
    isOpen,
    onToggle,
    currentOrder,
    onOrderChange,
    size = 'md'
}: OrderingDropdownProps) => {
    const isSm = size === 'sm'
    const buttonClass = isSm
        ? "px-3 py-2 text-xs"
        : "px-4 py-2 text-sm"

    return (
        <div className="relative" data-dropdown="true" >
            <button
                onClick={onToggle}
                className={`${buttonClass} bg-yellow-200/10 text-cy border border-yellow-200/20  hover:bg-yellow-200/20 transition-colors font-medium flex items-center gap-2 whitespace-nowrap   min-h-[38px]`}
            >
                ORDENAR
                <svg className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} width={isSm ? 12 : 16} height={isSm ? 12 : 16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>
            {isOpen && (
                <div className={`absolute right-0 mt-2 bg-gray-900 border border-yellow-400/20 rounded-lg shadow-lg z-50 ${isSm ? 'w-44' : 'w-48'}`} data-dropdown="true" >
                    {STATUS_OPTIONS.map((order) => (
                        <button
                            key={String(order.value)}
                            onClick={() => {
                                onOrderChange(order.value as string | null)
                                onToggle()
                            }}
                            className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${isSm ? 'text-xs' : 'text-sm'} ${
                                currentOrder === order.value
                                    ? "bg-yellow-400/40 text-yellow-300 font-semibold"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-yellow-300"
                            }`}
                        >
                            {order.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
