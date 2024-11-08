import React, { useState, useEffect, useRef } from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';

import GetUserService from '../../services/authentication/GetUserService';
import CheckDataService from '../../services/item_management/CheckDataService';

const AnimatedTimeLineComponent = () => {
    const [completedSteps, setCompletedSteps] = useState([]);
    const [visible, setVisible] = useState(Array(5).fill(false));
    const cardRefs = useRef([]);

    const events = [
        {
            status: 'Paso 1',
            date: 'Configurar datos generales del perfil',
            content: 'Debe completar la información general de su perfil, incluyendo la dirección, código postal, ciudad y número de teléfono. Éstos serán los datos de contacto que aparecerán en la plantilla del correo electrónico.'
        },
        {
            status: 'Paso 2',
            date: 'Establecer contraseña del email',
            content: 'Es imprescindible la configuración de la contraseña de su cuenta de correo electrónico. Si su proveedor de correo requiere una contraseña específica (como ocurre con Gmail y Outlook entre otros), deberá establecerla según las indicaciones proporcionadas.'
        },
        {
            status: 'Paso 3',
            date: 'Configurar directorio local de trabajo',
            content: 'Es importante definir un directorio local en su equipo donde se almacenarán las notificaciones recibidas y enviadas. Esto facilita el acceso y la organización de sus documentos.'
        },
        {
            status: 'Paso 4',
            date: 'Cargar base de datos de abogados',
            content: 'Cargue la base de datos de abogados en formato .json o .xlsx. Asegúrese de que la estructura de la base de datos incluye los siguientes atributos: email, name, phone.'
        },
        {
            status: 'Paso 5',
            date: 'Cargar base de datos de casos',
            content: 'Cargue la base de datos de casos en formato .json o .xlsx. La base de datos debe incluir los siguientes atributos: cliente, expediente, letrado, dado en fecha, pago, nig.'
        },
    ];


    // UseEffect para construir el array de pasos completados
    useEffect(() => {
        const checkCompletedSteps = async () => {
            let steps = [];

            // Verificar los pasos 1, 2 y 3 (datos del perfil)
            const userResponse = await GetUserService();

            if (userResponse.success) {
                const userData = userResponse.data;
                
                // Paso 1: Verificar que los campos phone, address, postalCode y city tengan algún valor
                if (userData.phone && userData.address && userData.postalCode && userData.city) {
                    steps.push(0);
                }

                // Paso 2: Verificar que el campo emailPassword tenga algún valor
                if (userData.emailPassword) {
                    steps.push(1);
                }

                // Paso 3: Verificar que el campo localPath tenga algún valor
                if (userData.localPath) {
                    steps.push(2);
                }
            }

            // Verificar el paso 4 (base de datos de abogados)
            const abogadosResponse = await CheckDataService('lawyers');
            if (abogadosResponse.success && abogadosResponse.hasData) {
                steps.push(3);
            }

            // Verificar el paso 5 (base de datos de casos)
            const casosResponse = await CheckDataService('cases');
            if (casosResponse.success && casosResponse.hasData) {
                steps.push(4);
            }

            // Actualizar el estado con los pasos completados
            setCompletedSteps(steps);

            console.log(completedSteps)
        };

        checkCompletedSteps();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = cardRefs.current.indexOf(entry.target);
                    if (entry.isIntersecting) {
                        setVisible((prevVisible) => {
                            const newVisible = [...prevVisible];
                            newVisible[index] = true;
                            return newVisible;
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            cardRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    const customizedMarker = (item, index) => {

        const isActive = completedSteps.includes(index);

        return (
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: isActive ? '#00a65a' : '#bbb',
                    borderRadius: '50%',
                    transition: 'background-color 0.5s ease-in-out, transform 0.5s ease-in-out',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    zIndex: 2,
                }}
            >
                <i
                    className="pi pi-check"
                    style={{
                        color: 'white',
                        fontSize: '1.2rem',
                    }}
                ></i>
            </span>
        );
    };

    const customizedContent = (item, index) => {
        const isLeft = index % 2 === 0;
        return (
            <Card
                ref={(el) => (cardRefs.current[index] = el)}
                title={item.status}
                subTitle={item.date}
                style={{
                    marginBottom: '1rem',
                    opacity: visible[index] ? 1 : 0,
                    transform: visible[index]
                        ? 'translateX(0)'
                        : `translateX(${isLeft ? '100%' : '-100%'})`,
                    transition: 'transform 0.8s ease, opacity 0.8s ease',
                }}
            >
                <p>{item.content}</p>
            </Card>
        );
    };

    return (
        <div style={{ opacity: 0, animation: 'fade-in 1s forwards' }}>
            <Timeline
                value={events}
                align="alternate"
                marker={customizedMarker}
                content={(item, index) => customizedContent(item, index)}
                className="custom-timeline"
            />
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .custom-timeline .p-timeline-connector {
                    background-color: #bbb;
                    width: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    animation: fade-in 1s forwards;
                }

                .p-timeline-event-active .p-timeline-connector {
                    background-color: #00a65a;
                }

                .custom-timeline .p-timeline-event-content::before,
                .custom-timeline .p-timeline-event-opposite::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 2px;
                    background-color: #bbb;
                    z-index: 1;
                }

                .custom-timeline .p-timeline-event-active .p-timeline-event-content::before,
                .custom-timeline .p-timeline-event-active .p-timeline-event-opposite::before {
                    background-color: #00a65a;
                }
            `}</style>
        </div>
    );
};

export default AnimatedTimeLineComponent;
