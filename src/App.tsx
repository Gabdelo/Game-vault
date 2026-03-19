import {SearchPage} from './pages/SearchPage'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LibraryPage } from './pages/LibraryPage'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'

function App() {
  
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [])

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
