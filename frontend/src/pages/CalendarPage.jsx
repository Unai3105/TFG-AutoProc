import React, { useState, useEffect } from 'react';
import CustomCalendarComponent from '../components/CalendarComponents/CustomCalendarComponent';
import Navbar from '../components/NavBar/NavBar';

import GetUserService from '../services/authentication/GetUserService';
import SessionExpiredService from '../services/authentication/SesionExpiredService';
import { useToast } from '../context/ToastProvider';

const CalendarPage = () => {

    const [eventDates, setEventDates] = useState([]);
    const [trials, setTrials] = useState([]);

    // Obtener la función para mostrar toasts
    const { showToast } = useToast();

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Llamada a GetUserService para obtener las fechas de los juicios del usuario actual
    useEffect(() => {
        const getUserTrials = async () => {
            try {
                const response = await GetUserService();

                // Verificar si la sesión ha expirado
                if (response.tokenExpired) {
                    setSessionExpired(true);
                    return;
                }

                if (response.success) {
                    // Obtener los juicios del usuario y extraer las fechas
                    const trials = response.data.trials || [];
                    const dates = trials.map(trial => new Date(trial.date.split('/').reverse().join('-')));
                    setEventDates(dates);
                    setTrials(trials);
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.error,
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Error al obtener las fechas de juicios:', error);
                showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron obtener las fechas de juicios.',
                    life: 3000
                });
            }
        };

        getUserTrials();
    }, [showToast]);

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
            <Navbar />
            <div style={{
                position: 'absolute', // Ocupa todo el ancho
                top: 90, // Deja espacio al comienzo
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
                width: '1260px', // Asegura que el contenedor ocupe todo el ancho disponible
            }}>
                <CustomCalendarComponent eventDates={eventDates} trials={trials}/>
            </div>
        </SessionExpiredService>
    );
};

export default CalendarPage;
