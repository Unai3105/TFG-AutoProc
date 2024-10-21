import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoToAuthComponent = ({ questionText, linkText, route }) => {
    
    const navigate = useNavigate();

    return (
        <div className="p-mt-4">
            <p align="center" style={{ color: '#888', fontSize: '0.875rem' }}>
                {questionText}{' '}
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(route);
                    }}
                    style={{ color: '#007ad9', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {linkText}
                </a>
            </p>
        </div>
    );
};

export default GoToAuthComponent;
