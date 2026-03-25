import type { animate } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { Routes, Route, useLocation } from "react-router-dom"
import { SearchPage } from "./pages/SearchPage" 
import { useAuthStore } from "./store/authStore"
import { use, useEffect } from "react"
import { GameDetailPage } from "./pages/GameDetailPage"
import { FormPage } from "./pages/FormPage"
import { LibraryPage } from "./pages/LibraryPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import PageWrapper from "./components/PageWrapper"

function AnimatedRoutes() {
  const location = useLocation()
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
            
              <SearchPage />
            
            } />
        <Route path="/welcome" element={<FormPage isInLoginn={true} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/game/:id" element={
            <PageWrapper>
              <GameDetailPage />
            </PageWrapper>
            } />

        {/* Rutas protegidas */}
        <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes