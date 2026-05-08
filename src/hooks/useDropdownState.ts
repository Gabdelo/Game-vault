import { useState, useEffect } from "react"

type DropdownType = 'none' | 'status' | 'order' | 'menu' | 'sidebar'

interface UseDropdownStateProps {
    onClose?: () => void
}

export const useDropdownState = ({ onClose }: UseDropdownStateProps = {}) => {
    const [dropdown, setDropdown] = useState<{ type: DropdownType; id?: number | null }>({
        type: 'none'
    })

    // Cerrar dropdown cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            
            // No cerrar si el click fue dentro de un elemento marcado
            if (target.closest('[data-dropdown="true"]')) {
                return
            }
            
            setDropdown({ type: 'none' })
            onClose?.()
        }

        if (dropdown.type !== 'none') {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [dropdown, onClose])

    const openDropdown = (type: DropdownType, id?: number | null) => {
        setDropdown({ type, id })
    }

    const closeDropdown = () => {
        setDropdown({ type: 'none' })
    }

    const toggleDropdown = (type: DropdownType, id?: number | null) => {
        if (dropdown.type === type && dropdown.id === id) {
            closeDropdown()
        } else {
            openDropdown(type, id)
        }
    }

    const isOpen = (type: DropdownType, id?: number | null) => {
        return dropdown.type === type && (id === undefined || dropdown.id === id)
    }

    return {
        openDropdown,
        closeDropdown,
        toggleDropdown,
        isOpen
    }
}
