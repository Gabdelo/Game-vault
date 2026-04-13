import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const Layout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            
            
            <div className="flex-1 flex flex-col relative">
                {/* Fixed Navbar */}
                <div className="fixed top-0 right-0 left-0 z-40">
                    <Navbar />
                </div>
                
                {/* Content with top padding for navbar */}
                <div className="flex-1 overflow-auto ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
