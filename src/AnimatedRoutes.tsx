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
import { StartPage } from "./pages/StartPage"
import { ProfilePage } from "./pages/ProfilePage"
import { Main } from "./pages/Main"
import { FriendsPage } from "./pages/FriendsPage"
import { UsersProfile } from "./pages/UsersProfile"



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
        <Route path="/" element={<StartPage />} />
        
        
        
        {/* Rutas con navbar/sidebar */}
        <Route element={<Layout />}>
          <Route path="/explore" element={<SearchPage />} />
          <Route path="/home" element={<Main />} />
          <Route path="/game/:id" element={
            <PageWrapper>
              <GameDetailPage />
            </PageWrapper>
          } />
          
          
          {/* Rutas protegidas */}
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <UsersProfile />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <FriendsPage />
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