import React, { useEffect } from 'react';
import BenefitsComponent from '../components/HomeComponents/BenefitsComponent';
import FunctionalitiesImagesComponent from '../components/HomeComponents/FunctionalitiesImagesComponent';
import FloatingWindowComponent from '../components/HomeComponents/FloatingWindowComponent';

const HomePage = () => {

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => observer.observe(element));

        // Cleanup the observer on component unmount
        return () => observer.disconnect();
    }, []);

    return (
        <div>
            {/* Estilo para la animación de desvanecimiento */}
            <style>
                {`
                .fade-in {
                    opacity: 0;
                    transition: opacity 1s ease-out;
                }

                .fade-in.visible {
                    opacity: 1;
                }
                `}
            </style>

            <div style={{
                position: 'absolute', // Ocupa todo el ancho
                top: 5, // Deja espacio al comienzo
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
                width: '1260px', // Asegura que el contenedor ocupe todo el ancho disponible
            }}>
                {/* Breve texto informativo */}
                <h2 className="fade-in">¿Por qué usar AutoProc?</h2>
                <p className="fade-in" style={{ fontSize: '1.1em', lineHeight: '1.6em', color: '#555' }}>
                    Nuestra aplicación está diseñada para facilitar la gestión de tus notificaciones y bases de datos como procurador,
                    automatizando el envío de emails y mejorando la eficiencia de tu trabajo diario. A continuación, te presentamos
                    las principales ventajas de utilizar nuestra herramienta.
                </p>

                {/* Beneficios */}
                    <BenefitsComponent />

                {/* Imágenes de funcionalidades */}
                <div className="fade-in">
                    <FunctionalitiesImagesComponent />
                </div>

                {/* Texto de captación */}
                <div id="cta" className="fade-in" style={{ marginTop: '35px', textAlign: 'center', padding: '20px' }}>
                    <h2>Empieza hoy mismo de manera gratuita</h2>
                    <p style={{ fontSize: '1.1em', lineHeight: '1.6em', color: '#555' }}>
                        Descubre cómo nuestra herramienta puede transformar tu forma de trabajar. Sin compromiso y gratis!
                    </p>
                </div>
            </div>

            {/* Ventana Flotante Fija */}
            <FloatingWindowComponent />
        </div>
    );
};

export default HomePage;
