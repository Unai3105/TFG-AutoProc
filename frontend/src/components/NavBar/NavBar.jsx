import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import LogoutService from '../../services/authentication/LogoutService';
import GetUserService from '../../services/authentication/GetUserService';
import GetFileListFromLocalService from '../../services/file_management/GetFileListFromLocalService';

const Navbar = ({ localPath }) => {

    // Hook para navegar
    const navigate = useNavigate();

    // Hook para contar notificaciones
    const [notificationCount, setNotificationCount] = useState(null);

    useEffect(() => {
        const countNotifications = async () => {
            try {
                // Obtener el localPath del usuario
                const userData = await GetUserService();
                const localPath = userData.data.localPath;

                if (localPath) {
                    // Construir la ruta completa de la carpeta de notificaciones recibidas
                    const folderPath = `${localPath}\\Notificaciones recibidas`;

                    // Obtener la lista de archivos de la carpeta
                    const result = await GetFileListFromLocalService(folderPath);

                    if (result.success) {
                        // Contar el número de archivos PDF en la carpeta
                        const pdfCount = result.data.files.filter(file => file.endsWith('.pdf')).length;
                        setNotificationCount(pdfCount);
                    } else {
                        console.error('Error al obtener la lista de archivos:', result.error);
                    }
                }
            } catch (error) {
                console.error('Error al contar las notificaciones:', error);
            }
        };

        countNotifications();

        // Se vuelve a ejecutar countNotifications cada 5 segundos para actualizar el Badge (nº de notificaciones)
        const intervalId = setInterval(countNotifications, 5000);

        return () => clearInterval(intervalId);

    }, [localPath]);

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => navigate('/home')
        },
        {
            label: 'Base de Datos',
            icon: 'pi pi-database',
            items: [
                {
                    label: 'Cargar',
                    icon: 'pi pi-upload',
                    command: () => navigate('/databaseUpload')
                },
                {
                    label: 'Ver y Modificar',
                    icon: 'pi pi-table',
                    command: () => navigate('/databaseManage')
                }
            ]
        },
        {
            label: (
                <div style={{ position: 'relative', display: 'inline-block', paddingRight: '16px' }}>
                    Notificaciones
                    {notificationCount !== null && notificationCount > 0 && (
                        <Badge value={notificationCount} severity="danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }} />
                    )}
                </div>
            ),
            icon: 'pi pi-bell',
            command: () => navigate('/notifications')
        },
        {
            label: 'Información',
            icon: 'pi pi-info-circle',
            command: () => navigate('/info')
        },
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Configuración',
                    icon: 'pi pi-cog',
                    command: () => navigate('/profileSettings')
                },
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-sign-out',
                    command: async () => {
                        try {
                            const response = await LogoutService();
                            console.log(response.message)
                            navigate('/login');
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        }
    ];

    return (
        <Menubar model={items} />
    );
}

export default Navbar;
