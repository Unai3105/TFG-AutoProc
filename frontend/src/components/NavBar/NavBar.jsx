import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import LogoutService from '../../services/authentication/LogoutService';
import GetUserService from '../../services/authentication/GetUserService';
import GetFileListFromLocalService from '../../services/file_management/GetFileListFromLocalService';
import SessionExpiredService from '../../services/authentication/SesionExpiredService';

const Navbar = ({ localPath }) => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Hook para navegar
    const navigate = useNavigate();

    // Hook para contar notificaciones
    const [notificationCount, setNotificationCount] = useState(null);

    useEffect(() => {
        const countNotifications = async () => {
            try {
                // Obtener el localPath del usuario
                const userData = await GetUserService();

                if (userData.tokenExpired) {
                    navigate('/login');
                }

                const localPath = userData.data.localPath;

                if (localPath) {
                    // Construir la ruta completa de la carpeta de notificaciones recibidas
                    const folderPath = `${localPath}\\Notificaciones recibidas`;

                    // Obtener la lista de archivos de la carpeta
                    const result = await GetFileListFromLocalService(folderPath);

                    // Sesión expirada
                    if (result.tokenExpired) {
                        setSessionExpired(true);
                        return;
                    }

                    if (result.success) {
                        if (result.data.message !== 'El directorio no contiene archivos') {
                            // Contar el número de archivos PDF en la carpeta
                            const pdfCount = result.data.files.filter(file => file.endsWith('.pdf')).length;
                            setNotificationCount(pdfCount);
                        } else {
                            setNotificationCount(0);
                        }
                    } else {
                        console.error('Error al obtener la lista de archivos:', result.data.error);
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
            label: <div style={{ display: 'flex', alignItems: 'center', margin: '0 20px' }}>
                <i className="pi pi-database" style={{ marginRight: '8px' }}></i>
                Base de datos
            </div>,
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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '0 20px'
                }}>
                    <i className="pi pi-bell" style={{ marginRight: '8px' }}></i>
                    Notificaciones
                    {notificationCount !== null && notificationCount > 0 && (
                        <Badge
                            value={notificationCount}
                            severity="danger"
                            style={{ position: 'absolute', top: '-10px', right: '-33px' }}
                        />
                    )}
                </div>
            ),
            command: () => navigate('/notifications')
        },
        {
            label: <div style={{ display: 'flex', alignItems: 'center', margin: '0 20px' }}>
                <i className="pi pi-info-circle" style={{ marginRight: '8px' }}></i>
                Información
            </div>,
            items: [
                {
                    label: 'Instrucciones',
                    icon: 'pi pi-book',
                    command: () => navigate('/info?section=instrucciones')
                },
                {
                    label: 'Links de Interés',
                    icon: 'pi pi-link',
                    command: () => navigate('/info?section=links')
                },
                {
                    label: 'Juzgados',
                    icon: 'pi pi-map-marker',
                    command: () => navigate('/info?section=juzgados')
                }
            ]
        },
        {
            label: <div style={{ display: 'flex', alignItems: 'center', margin: '0 20px' }}>
                <i className="pi pi-user" style={{ marginRight: '8px' }}></i>
                Perfil
            </div>,
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
        <SessionExpiredService sessionExpired={sessionExpired}>
            <Menubar
                model={items}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    justifyContent: 'center',
                }}
            />
        </SessionExpiredService>
    );
}

export default Navbar;