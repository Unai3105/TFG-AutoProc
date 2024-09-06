import React, { useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';

const SessionExpiredService = ({ children, sessionExpired }) => {

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionExpired) {
            // Mostrar el toast
            showToast({
                severity: 'warn',
                summary: 'Sesión expirada',
                detail: 'Será redirigido al inicio de sesión. Por favor, inicie sesión de nuevo.',
                life: 5000,
            });

            // Redirigir después de 5 segundos
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        }
    }, [sessionExpired, navigate]);

    return (
        <>
            {sessionExpired ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    zIndex: 9999
                }}>
                    <ProgressSpinner />
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default SessionExpiredService;
