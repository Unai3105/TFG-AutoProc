import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
    // Obtener el estado de autenticación desde el contexto
    const { auth } = useContext(AuthContext);

    // Si el usuario está autenticado, renderiza los componentes hijos (Outlet); de lo contrario, redirige a /login
    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
