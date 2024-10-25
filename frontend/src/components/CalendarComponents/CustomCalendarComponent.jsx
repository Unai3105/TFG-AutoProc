import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext'; // Importamos InputText
import { addLocale } from 'primereact/api';

const CustomCalendarComponent = ({ eventDates, trials }) => {
    const [formattedEventDates, setFormattedEventDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventMessage, setEventMessage] = useState('');

    useEffect(() => {
        // Convertir las fechas recibidas como prop a objetos Date
        if (eventDates && Array.isArray(eventDates)) {
            const dates = eventDates.map(dateStr => new Date(dateStr));
            setFormattedEventDates(dates);
        }
    }, [eventDates]);

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

    const todayStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        border: '3px solid #accbe1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    };

    const eventDayStyle = (isHovered) => ({
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        border: isHovered ? '4px solid #ffb56c' : '3px solid #ffb56c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    });

    const dateTemplate = (date) => {
        const currentDate = new Date(date.year, date.month, date.day);
        const today = new Date();

        const isEventDate = formattedEventDates.some(eventDate =>
            eventDate.getDate() === currentDate.getDate() &&
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
        );

        const isToday =
            currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

        if (isEventDate) {
            const isHovered = false;
            return (
                <div style={eventDayStyle(isHovered)}>
                    {date.day}
                </div>
            );
        }

        if (isToday) {
            return (
                <div style={todayStyle}>
                    {date.day}
                </div>
            );
        }
        return date.day;
    };

    // Función para obtener el evento según una fecha dada
    const getEventByDate = (date) => {
        if (!date) return null;

        // Formateamos la fecha seleccionada a "DD/MM/YYYY"
        const selectedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Busca un evento que coincida con la fecha proporcionada en el formato "DD/MM/YYYY"
        const event = trials.find(trial => {
            // Convertimos la fecha del trial a "DD/MM/YYYY" para la comparación
            const trialDate = new Date(trial.date.split('/').reverse().join('-')).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            return trialDate === selectedDate;
        });

        return event || null; // Devuelve el evento encontrado o null si no hay coincidencias
    };

    const handleDateSelect = (e) => {
        setSelectedDate(e.value); // Actualiza la fecha seleccionada

        // Llamamos a la función getEventByDate con la fecha seleccionada
        const selectedEvent = getEventByDate(e.value);

        if (selectedEvent) {
            const { date, time, place } = selectedEvent;
            const formattedDate = new Date(date.split('/').reverse().join('-')).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            setEventMessage(`Juicio en fecha ${formattedDate}, a las ${time}, en ${place}.`);
        } else {
            const noEventDate = e.value.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            setEventMessage(`No tiene juicios el día ${noEventDate}`);
        }
    };

    return (
        <div>
            <Calendar
                inline
                locale="es"
                dateTemplate={dateTemplate}
                onSelect={handleDateSelect}
            />
            <div style={{ marginTop: '8px', width: '600px' }}>
                <label
                    htmlFor="selectedDateInput"
                />
                <InputText
                    id="selectedDateInput"
                    value={eventMessage}
                    readOnly
                    placeholder="Seleccione una fecha para ver evento"
                    style={{ width: '100%', textAlign: 'center' }}
                />
            </div>
        </div>
    );
};

export default CustomCalendarComponent;
