import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card } from 'primereact/card';
import GetFileListFromLocalService from '../services/file_management/GetFileListFromLocalService';
import GetUserService from '../services/authentication/GetUserService';
import SessionExpiredService from '../services/authentication/SesionExpiredService';
import { useToast } from '../context/ToastProvider';

const LocalFolderViewerComponent = forwardRef(({ subFolder, onFilesUpdate }, ref) => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Estado para el contenido de la carpeta
    const [folderContent, setFolderContent] = useState([]);

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast, showInteractiveToast } = useToast();

    // Estado para controlar si el toast de configuración ya fue mostrado
    const hasShownToast = useRef(false);

    useEffect(() => {
        loadUserDataAndFolder();

        const interval = setInterval(loadUserDataAndFolder, 5000);
        return () => clearInterval(interval);
    }, [subFolder, onFilesUpdate]);

    useImperativeHandle(ref, () => ({
        refreshFolder: loadUserDataAndFolder
    }));

    const loadUserDataAndFolder = async () => {

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
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: result.error,
                        life: 3000
                    });
                }
            }
        } else {
            if (!hasShownToast.current) {
                setTimeout(() => {
                    showInteractiveToast({
                        severity: 'warn',
                        summary: 'Advertencia',
                        message: 'Debes configurar el directorio local de trabajo.',
                        onClick: () => window.location.href = '/profileSettings',
                        linkText: 'Ir a Configuración',
                        life: 4750,
                        style: { maxWidth: '350px' }
                    });
                }, 200);

                hasShownToast.current = true;
            }
        }
    };

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
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
                                        WebkitLineClamp: 2, // Limita el texto a 2 líneas
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
