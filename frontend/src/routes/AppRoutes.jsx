import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage'
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../context/AuthContext';

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta raíz que redirige a la página de inicio de sesión */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Rutas públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rutas protegidas por autenticación */}
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/suite" element={<suite />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;
