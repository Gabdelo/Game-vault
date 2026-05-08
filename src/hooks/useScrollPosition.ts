import { useEffect, useState } from "react"

export const useScrollPosition = (threshold: number = 300) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [threshold])

    return isVisible
}
