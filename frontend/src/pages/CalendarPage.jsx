import React from 'react';
import CustomCalendarComponent from '../components/CalendarComponents/CustomCalendarComponent';
import Navbar from '../components/NavBar/NavBar';

const CalendarPage = () => {
    return (
        <div>
            <Navbar />
            <div style={{
                position: 'absolute', // Ocupa todo el ancho
                top: 90, // Deja espacio al comienzo
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
                width: '1260px', // Asegura que el contenedor ocupe todo el ancho disponible
            }}>
                <CustomCalendarComponent />
            </div>
        </div>
    );
};

export default CalendarPage;
