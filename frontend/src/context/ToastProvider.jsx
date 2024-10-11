import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

// Hook personalizado para acceder al contexto
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    // Función para mostrar toasts
    const showToast = ({ severity, summary, detail, life = 3000, style = {} }) => {
        toast.current.show({
            severity,
            summary,
            detail,
            life,
            style,
        });
    };

    // Función para mostrar toasts con componente interactivo
    const showInteractiveToast = ({ severity, summary, message, onClick, linkText, life = 3000, style = {} }) => {
        toast.current.show({
            severity,
            summary,
            detail: (
                <div>
                    <span>{message}</span>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onClick();
                        }}
                        style={{ textDecoration: 'none', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <i className="pi pi-pen-to-square" style={{ marginRight: '7px' }}></i> {linkText}
                    </a>
                </div>
            ),
            life,
            style,
        });
    };

    return (
        <ToastContext.Provider value={{ showToast, showInteractiveToast }}>
            {children}
            <Toast ref={toast}></Toast>
        </ToastContext.Provider>
    );
};