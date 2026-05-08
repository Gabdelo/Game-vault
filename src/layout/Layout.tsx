import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton"

export const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <div className="w-full z-50 fixed" >
                <Navbar />
            </div>
            
            {/* Content area */}
            <div className="flex-1 overflow-x-hidden flex flex-col bg-black/90 pt-20">
                <Outlet />
                {/* Footer al final del contenido */}
                
            </div>
            <div className=" z-20">
                <Footer />
            </div>
            {/* Scroll to top button */}
            <div>
                <ScrollToTopButton />
            </div>
        </div>
    )
}
