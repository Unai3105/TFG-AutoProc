import React from 'react';
import { Card } from 'primereact/card';

const BenefitsComponent = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', overflow: 'hidden' }}>
            
            <style>
                {`
                @keyframes slide-left-to-right {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slide-top-to-bottom {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slide-right-to-left {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slide-bottom-to-top {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                `}
            </style>

            {/* Ahorro de Tiempo */}
            <div style={{ margin: '10px', width: '400px', height: '200px', animation: 'slide-left-to-right 1s ease' }}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <i className="pi pi-clock" style={{ fontSize: '2em', color: '#ffc107' }}></i>
                    </div>
                    <h3 style={{ marginTop: '0' }}>Ahorro de Tiempo</h3>
                    <p style={{ marginTop: '1rem' }}>Optimiza tu flujo de trabajo automatizando tareas repetitivas y tediosas, permitiendo enfocarte en lo que realmente importa.</p>
                </Card>
            </div>

            {/* Seguridad */}
            <div style={{ margin: '10px', width: '400px', height: '200px', animation: 'slide-top-to-bottom 1s ease' }}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <i className="pi pi-lock" style={{ fontSize: '2em', color: '#ffc107' }}></i>
                    </div>
                    <h3 style={{ marginTop: '0' }}>Seguridad</h3>
                    <p style={{ marginTop: '1rem' }}>Protege tus datos y comunicaciones con cifrado AES de 256 bits, asegurando que tu información esté siempre segura.</p>
                </Card>
            </div>

            {/* Interfaz Intuitiva */}
            <div style={{ margin: '10px', width: '400px', height: '200px', animation: 'slide-right-to-left 1s ease' }}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <i className="pi pi-thumbs-up" style={{ fontSize: '2em', color: '#ffc107' }}></i>
                    </div>
                    <h3 style={{ marginTop: '0' }}>Interfaz Intuitiva</h3>
                    <p style={{ marginTop: '1rem' }}>Disfruta de una interfaz fácil de usar, diseñada para que cualquier usuario pueda manejarla sin complicaciones.</p>
                </Card>
            </div>

            {/* Automatización de Emails */}
            <div style={{ margin: '10px', width: '400px', height: '200px', animation: 'slide-bottom-to-top 1s ease' }}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <i className="pi pi-envelope" style={{ fontSize: '2em', color: '#ffc107' }}></i>
                    </div>
                    <h3 style={{ marginTop: '0' }}>Automatización de Emails</h3>
                    <p style={{ marginTop: '1rem' }}>Envía correos electrónicos de manera automática con solo un clic, agilizando tu comunicación y reduciendo errores.</p>
                </Card>
            </div>

            {/* Gestión de Bases de Datos */}
            <div style={{ margin: '10px', width: '400px', height: '200px', animation: 'slide-bottom-to-top 1s ease' }}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <i className="pi pi-database" style={{ fontSize: '2em', color: '#ffc107' }}></i>
                    </div>
                    <h3 style={{ marginTop: '0' }}>Gestión de Bases de Datos</h3>
                    <p style={{ marginTop: '1rem' }}>Carga, visualiza y organiza tus bases de datos de forma eficiente, centralizando toda tu información en un solo lugar.</p>
                </Card>
            </div>
        </div>
    );
};

export default BenefitsComponent;
