import { createRoot } from 'react-dom/client'
import './index.css'
import ProjectRoutes from './routes/Routes'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <BrowserRouter>
            <ProjectRoutes />
        </BrowserRouter>
    </AuthProvider>
)
