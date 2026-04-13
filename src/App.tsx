import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AnimatedRoutes from './AnimatedRoutes'
import { CyberToastProvider } from './components/ui/CyberToast'
import './styles/styles.css'

function App() {
  
 
  return (
    <CyberToastProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CyberToastProvider>
  )
}

export default App
