import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';
import InterestLinksComponent from '../components/InfoComponents/InterestLinksComponent';
import AnimatedTimeLineComponent from '../components/InfoComponents/AnimatedTimeLineComponent'
import CourtsMapComponent from '../components/InfoComponents/CourtsMapComponent';

const InfoPage = () => {
    const location = useLocation();
    const linksRef = useRef(null);
    const instructionsRef = useRef(null);
    const courtsRef = useRef(null);

    const scrollToSection = (ref) => {

        const yPosition = ref.current.getBoundingClientRect().top + window.pageYOffset - 75;

        window.scrollTo({
            top: yPosition,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get('section');
        if (section === 'instrucciones') {
            scrollToSection(instructionsRef);
        } else if (section === 'links') {
            scrollToSection(linksRef);
        } else if (section === 'juzgados') {
            scrollToSection(courtsRef);
        }
    }, [location]);

    return (
        <div>
            <NavBar />
            <div style={{
                position: 'absolute', // Ocupa todo el ancho
                top: 55, // Deja espacio al comienzo
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
            }}>
                <div style={{
                    width: '1200px',
                }}>
                    <h2 ref={instructionsRef} style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '35px' }}>
                        Instrucciones
                    </h2>

                    <div style={{ marginBottom: '55px' }}>
                        <AnimatedTimeLineComponent></AnimatedTimeLineComponent>
                    </div>

                    <h2 ref={linksRef} style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '35px' }}>
                        Links de interés
                    </h2>

                    <div style={{ marginBottom: '30px' }}>
                        <InterestLinksComponent />
                    </div>

                    <h2 ref={courtsRef} style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '35px' }}>
                        Juzgados del País Vasco
                    </h2>

                    <div style={{ marginBottom: '30px' }}>
                        <CourtsMapComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;