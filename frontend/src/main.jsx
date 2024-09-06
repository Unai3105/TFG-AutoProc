import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema opcional
import 'primereact/resources/primereact.min.css';                  // Estilos principales de PrimeReact
import 'primeicons/primeicons.css';                                // Iconos de PrimeReact
import './styles/index.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './context/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <ToastProvider>
      <div align="center" className="app-container">
        <AppRoutes />
      </div>
    </ToastProvider>
  // </React.StrictMode>
)
