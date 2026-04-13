import { AnimatePresence } from "framer-motion"
import { Routes, Route, useLocation } from "react-router-dom"
import { SearchPage } from "./pages/SearchPage" 
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import { GameDetailPage } from "./pages/GameDetailPage"
import { FormPage } from "./pages/FormPage"
import { LibraryPage } from "./pages/LibraryPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import PageWrapper from "./components/PageWrapper"
import { Layout } from "./layout/Layout"
import { StatsPage } from "./pages/StatsPage"

function AnimatedRoutes() {
  const location = useLocation()
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas sin navbar/sidebar (login/register) */}
        <Route path="/welcome" element={<FormPage isInLoginn={true} />} />
        
        {/* Rutas con navbar/sidebar */}
        <Route element={<Layout />}>
          <Route path="/" element={<SearchPage />} />
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
          <Route path="/stats" element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } />
        </Route>
       
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes