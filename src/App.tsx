import {SearchPage} from './pages/SearchPage'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LibraryPage } from './pages/LibraryPage'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { GameDetailPage } from './pages/GameDetailPage'
import { FormPage } from './pages/FormPage'
import AnimatedRoutes from './AnimatedRoutes'

function App() {
  
 
  return (

    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
