import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

const CustomCalendarComponent = () => {
    const [eventDates, setEventDates] = useState([]);

    useEffect(() => {
        // Simulación de llamada a una API para obtener las fechas
        const fetchEventDates = async () => {
            const data = [
                '2024-10-15', // Ejemplo de fecha 1 (15 octubre 2024)
                '2024-10-25'  // Ejemplo de fecha 2 (25 octubre 2024)
            ];

            // Convertir fechas a objetos Date
            const dates = data.map(dateStr => new Date(dateStr));
            setEventDates(dates);
        };

        fetchEventDates();
    }, []);

    // Configuración de idioma español
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    // Estilo para el día con evento
    const eventDayStyle = {
        backgroundColor: '#D1D5DB',
        borderRadius: '50%',
        border: '3px solid #D1D5DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    };

    // Función para personalizar las fechas del calendario
    const dateTemplate = (date) => {
        const currentDate = new Date(date.year, date.month, date.day);

        const isEventDate = eventDates.some(eventDate =>
            eventDate.getDate() === currentDate.getDate() &&
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
        );

        if (isEventDate) {
            return (
                <div style={eventDayStyle}>
                    {date.day}
                </div>
            );
        }

        return date.day;
    };

    return (
        <Calendar
            inline
            locale="es"
            dateTemplate={dateTemplate}
        />
    );
};

export default CustomCalendarComponent;
