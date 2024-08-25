import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import GetFileListFromLocalService from '../services/file_management/GetFileListFromLocalService';
import GetUserService from '../services/authentication/GetUserService';

const LocalFolderViewerComponent = ({ subFolder }) => {

    // Estado para el contenido de la carpeta
    const [folderContent, setFolderContent] = useState([]);

    // Referencia para notificaciones
    const toast = useRef(null);

    useEffect(() => {
        const loadUserDataAndFolder = async () => {
            try {
                // Obtener datos del usuario
                const userData = await GetUserService();

                // Obtener la ruta local de la carpeta
                const localPath = userData.data.localPath;

                if (localPath) {
                    // Construir la ruta completa de la carpeta
                    const completeFolderPath = `${localPath}\\${subFolder}`;

                    // Cargar contenido de la carpeta
                    const result = await GetFileListFromLocalService(completeFolderPath);

                    if (result.success) {
                        setFolderContent(result.data.files);
                    } else {
                        if (result.error !== 'El directorio no contiene archivos') {
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
                            detail: (
                                <div>
                                    <p> Debes configurar el directorio local de trabajo. </p>
                                    <a href="/profileSettings" style={{ textDecoration: 'none' }}>
                                        <i className="pi pi-external-link" style={{ marginRight: '0.5rem' }}></i>
                                        Ir a Configuración
                                    </a>
                                </div>
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

        loadUserDataAndFolder();

        // Se vuelve a ejecutar loadUserDataAndFolder cada 5 segundos para actualizar los archivos de la carpeta
        const intervalId = setInterval(loadUserDataAndFolder, 5000);

        return () => clearInterval(intervalId);

    }, [subFolder]);

    return (
        <div>
            <Toast ref={toast} />
            <Card>
                {folderContent.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        {folderContent.map((file, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <i className="pi pi-file-pdf" style={{ fontSize: '3rem', color: 'red' }}></i>
                                <div style={{ marginTop: '0.5rem' }}>{file}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No hay archivos en esta carpeta.</p>
                )}
            </Card>
        </div>
    );

}

export default LocalFolderViewerComponent;
