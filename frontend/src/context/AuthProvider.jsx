import React, { createContext, useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor de contexto de autenticación
export const AuthProvider = ({ children }) => {
    // Estado para almacenar el token y la autenticación
    const [auth, setAuth] = useState({ token: null, isAuthenticated: false, loading: true });

    useEffect(() => {
        // Cargar el token del almacenamiento local de la sesión
        const token = sessionStorage.getItem('jwt');

        if (token) {
            // Si hay un token, actualizar el estado de autenticación
            setAuth({ token, isAuthenticated: true, loading: false });
        } else {
            setAuth({ token: null, isAuthenticated: false, loading: false });
        }
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez,
            // de lo contrario se ejecutaría cada vez que el componente se renderice

    
    if (auth.loading) {
        return <ProgressSpinner />;
    }

    // Proveer el estado de autenticación y la función para actualizarlo a los componentes hijos
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;