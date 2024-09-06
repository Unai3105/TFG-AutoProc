import React, { useRef, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const InterestLinksComponent = () => {

    // Referencias a las Cards
    const cardRefs = [useRef(null), useRef(null), useRef(null)];

    // Estado para la visibilidad de las Cards
    const [isVisible, setIsVisible] = useState([false, false, false]);

    // Efecto para observar la visibilidad de las Cards
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prevState) => {
                            const newState = [...prevState];
                            newState[index] = true;
                            return newState;
                        });
                    }
                });
            },
            { threshold: 0.1 } // Se activa cuando el 10% de la tarjeta es visible
        );

        cardRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            cardRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [cardRefs]);

    // Estilo de las Cards con transición
    const getCardStyle = (index) => {
        const direction = index === 1 ? '-100px' : '100px';
        return {
            width: '300px',
            transform: isVisible[index] ? 'translateY(0)' : `translateY(${direction})`,
            opacity: isVisible[index] ? 1 : 0,
            transition: 'transform 0.5s ease, opacity 0.5s ease',
            marginTop: index === 1 ? '75px' : '0',
            marginBottom: index == 1 ? '30px' : '0',
        };
    };

    return (
        <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'flex-start',
        }}>
            {/* Primer Card */}
            <Card
                ref={cardRefs[0]}
                title={<div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>justizia</div>}
                style={getCardStyle(0)}
            >
                <img src="banner.jpg" style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    maxHeight: '200px',
                    marginBottom: '1rem',
                }} />
                <p>Accede al portal de Justicia del Gobierno Vasco para obtener información actualizada sobre procedimientos judiciales, legislación relevante y servicios electrónicos esenciales para los procuradores.</p>
                <Button
                    label="Ir al sitio"
                    icon="pi pi-external-link"
                    onClick={() => window.open("https://www.justizia.eus/inicio/", '_blank')}
                />
            </Card>

            {/* Segundo Card - Desplazado hacia abajo */}
            <Card
                ref={cardRefs[1]}
                title={<div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>procuradoresgipuzkoa</div>}
                style={getCardStyle(1)}
            >
                <img src="banner.jpg" style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    maxHeight: '200px',
                    marginBottom: '1rem',
                }} />
                <p>Visita el sitio oficial del Colegio de Procuradores de Gipuzkoa para acceder a recursos especializados, noticias del sector, y soporte profesional dirigido a procuradores.</p>
                <Button
                    label="Ir al sitio"
                    icon="pi pi-external-link"
                    onClick={() => window.open("https://www.procuradoresgipuzkoa.com/es/home", '_blank')}
                />
            </Card>

            {/* Tercer Card */}
            <Card
                ref={cardRefs[2]}
                title={<div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>icagi</div>}
                style={getCardStyle(2)}
            >
                <img src="banner.jpg" style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    maxHeight: '200px',
                    marginBottom: '1rem',
                }} />
                <p>Consulta el portal del Ilustre Colegio de Abogados de Gipuzkoa para colaborar con abogados, acceder a formación continua, y conocer las últimas novedades jurídicas que impactan tu trabajo como procurador.</p>
                <Button
                    label="Ir al sitio"
                    icon="pi pi-external-link"
                    onClick={() => window.open("https://www.icagi.net/es/", '_blank')}
                />
            </Card>
        </div>
    );
};

export default InterestLinksComponent;
