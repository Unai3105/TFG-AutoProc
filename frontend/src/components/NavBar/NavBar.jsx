import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import LogoutService from '../../services/authentication/LogoutService';

const Navbar = () => {
        
    // Hook para navegar
    const navigate = useNavigate();

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
                    <Badge value={8} severity="danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }} />
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
