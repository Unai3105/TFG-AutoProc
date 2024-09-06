import React from 'react';
import { Button } from 'primereact/button';

const FloatingWindow = () => {

    return (
        <div>
            {/* Transición */}
            <style>
                {`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);  // Comienza fuera de la pantalla a la derecha
                    }
                    to {
                        transform: translateX(0);  // Termina en la posición deseada
                    }
                }
                `}
            </style>
            
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Fondo blanco con 50% de opacidad
                border: '1px solid #555',
                padding: '15px 20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                color: '#343a40',
                textAlign: 'center',
                maxWidth: '300px',
                transform: 'translateX(100%)',  // Inicialmente fuera de la vista
                animation: 'slide-in 1s ease-out forwards',  // Animación para deslizarse hacia adentro
            }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.1em' }}>¿Listo para empezar?</p>
                <Button
                    label="Acceso Gratis"
                    icon="pi pi-user-plus"
                    className="p-button-rounded p-button-raised"
                    style={{ width: '100%', backgroundColor: '#ffc107', borderColor: '#F1C40F', color: '#343a40' }} // Botón amarillo con texto gris oscuro
                    onClick={() => window.location.href = '/login'}
                />
            </div>
        </div>
    )
};

export default FloatingWindow;
