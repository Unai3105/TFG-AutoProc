import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import GetFileListFromLocalService from '../services/file_management/GetFileListFromLocalService';
import GetUserService from '../services/authentication/GetUserService';
import CreateToastDialogComponent from '../components/CreateToastDialogComponent'
import SessionExpiredService from '../services/authentication/SesionExpiredService';

const LocalFolderViewerComponent = forwardRef(({ subFolder, onFilesUpdate }, ref) => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Estado para el contenido de la carpeta
    const [folderContent, setFolderContent] = useState([]);

    // Referencia para notificaciones
    const toast = useRef(null);

    useEffect(() => {
        loadUserDataAndFolder();

        const interval = setInterval(loadUserDataAndFolder, 5000);
        return () => clearInterval(interval);
    }, [subFolder, onFilesUpdate]);

    useImperativeHandle(ref, () => ({
        refreshFolder: loadUserDataAndFolder
    }));

    const loadUserDataAndFolder = async () => {
        try {
            // Obtener datos del usuario
            const userData = await GetUserService();

            // Sesión expirada
            if (userData.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            // Obtener la ruta local de la carpeta
            const localPath = userData.data.localPath;

            if (localPath) {
                // Construir la ruta completa de la carpeta
                const completeFolderPath = `${localPath}\\${subFolder}`;

                // Cargar contenido de la carpeta
                const result = await GetFileListFromLocalService(completeFolderPath);

                // Sesión expirada
                if (result.tokenExpired) {
                    setSessionExpired(true);
                    return;
                }

                if (result.success) {

                    if (result.data.message != 'El directorio no contiene archivos') {
                        // Actualizamos el estado con el contenido de la carpeta
                        setFolderContent(result.data.files);

                        // Actualizamos el estado en el componente padre si se necesita
                        if (onFilesUpdate) {
                            onFilesUpdate(result.data.files);
                        }
                    } else {
                        setFolderContent([]);
                    }

                } else {
                    if (result.data.error !== 'El directorio no contiene archivos') {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: result.error,
                            life: 3000
                        });
                    }
                }
            } else {
                setTimeout(() => {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: CreateToastDialogComponent(
                            'Debes configurar el directorio local de trabajo.',
                            () => window.location.href = '/profileSettings',
                            "Ir a Configuración"
                        ),
                        life: 4750,
                        style: { maxWidth: '350px' }
                    });
                }, 200);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar el contenido de la carpeta.',
                life: 3000
            });
        }
    };

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
            {ReactDOM.createPortal(
                <Toast ref={toast} />,
                document.getElementById('toast-portal')
            )}
            <Card>
                <div style={{
                    maxHeight: '275px', // Altura máxima del contenedor antes de habilitar el scroll
                    overflow: 'auto' // Habilita la barra de desplazamiento cuando el contenido supera la altura máxima
                }}>
                    {folderContent.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem',
                            alignItems: 'center'
                        }}>
                            {folderContent.map((file, index) => (
                                <div key={index}>
                                    <i className="pi pi-file-pdf" style={{ fontSize: '3rem', color: 'red' }}></i>
                                    <div style={{
                                        marginTop: '0.5rem', // Margen superior
                                        width: '200px',     // Ancho del componente
                                        overflow: 'hidden', // Oculta el contenido que excede el contenedor
                                        display: '-webkit-box', // Caja flexible para el texto
                                        WebkitBoxOrient: 'vertical', // Orientación vertical
                                        WebkitLineClamp: 2, // Limita el texto a 3 líneas
                                        textOverflow: 'ellipsis', // Muestra "..." si el texto es demasiado largo
                                    }}>
                                        {file}
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ width: '865px' }}>
                            No hay archivos en esta carpeta.
                        </p>
                    )}
                </div>
            </Card>
        </SessionExpiredService>
    );
});

export default LocalFolderViewerComponent;
