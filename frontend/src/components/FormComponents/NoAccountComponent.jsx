import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const NoAccountComponent = () => {

    const navigate = useNavigate();

    return (
        <div className="p-mt-4">
            <p align="center" style={{ color: '#888', fontSize: '0.875rem' }}>
                No tienes una cuenta?{' '}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                    }}
                    style={{ color: '#007ad9', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    Registrate aquí
                </a>
            </p>
        </div>
    )
}

export default NoAccountComponent