import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';

const SessionExpiredService = ({ children, sessionExpired }) => {
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionExpired) {
            // Mostrar el toast
            toast.current.show({
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
            {ReactDOM.createPortal(
                <Toast ref={toast} />,
                document.getElementById('toast-portal')
            )}
            {sessionExpired ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <ProgressSpinner />
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default SessionExpiredService;
