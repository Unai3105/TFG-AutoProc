import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema opcional
import 'primereact/resources/primereact.min.css';                  // Estilos principales de PrimeReact
import 'primeicons/primeicons.css';                                // Iconos de PrimeReact

import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './routes/App'

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div align="center" className="app-container">
      <AppRoutes />
    </div>
  </React.StrictMode>
)
