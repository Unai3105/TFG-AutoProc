import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import FileInfoComponent from './FileInfoComponent';
import FileProcessingService from '../../services/file_management/FileProcessingService';
import FileUploadService from '../../services/file_management/FileUploadService';
import SessionExpiredService from '../../services/authentication/SesionExpiredService';
import { useToast } from '../../context/ToastProvider';

const FileUploadComponent = ({ onFileLoad, uploadPath }) => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast, showInteractiveToast } = useToast();

    const fileUploadRef = useRef(null);

    const [fileData, setFileData] = useState(null);

    const [visible, setVisible] = useState(false);

    const [messageData, setMessageData] = useState([]);

    const onFileSelect = async (event) => {
        if (event.files && event.files.length > 0) {

            const file = event.files[0];

            const result = await FileProcessingService(file, uploadPath);

            // Sesión expirada
            if (result.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (result.success) {
                setFileData({
                    file: result.data,
                    name: file.name,
                    size: file.size,
                    severity: 'warning',
                    statusText: 'Pendiente'
                });
                onFileLoad(result.data);
                console.log('Archivo procesado y datos cargados:', result.data);
            } else {
                setFileData({
                    file: result.data,
                    name: file.name,
                    size: file.size,
                    severity: 'danger',
                    statusText: 'Error'
                });
                setMessageData(result);
                const errorMsg = 'Error al procesar el archivo.'
                showInteractiveToast({
                    severity: 'error',
                    summary: 'Error',
                    message: errorMsg,
                    onClick: () => setVisible(true),
                    linkText: 'Ver más detalles',
                    life: 5000
                });
                console.error(errorMsg, result);
            }
        }
    }

    const onFileUpload = () => {
        showToast({
            severity: 'success',
            summary: 'Éxito',
            detail: 'File Uploaded',
            life: 3000
        });
        console.log("File Uploaded");

    }

    const uploadHandler = async () => {
        if (!fileData || !fileData.file) {
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'No hay archivos seleccionados para subir.',
                life: 3000
            });
            console.error("No hay archivos seleccionados para subir.");
            return;
        }
        try {
            const result = await FileUploadService(fileData.file, uploadPath);

            // Sesión expirada
            if (result.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (result && result.success) {
                setFileData({
                    // copia las propiedades existentes
                    ...fileData,
                    severity: 'success',
                    statusText: 'Completado'
                });
                // Casos creados
                if (result.data.created_ids.length > 0) {
                    showToast({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Archivo subido exitosamente',
                        life: 3000
                    });
                    console.log('Archivo subido y datos guardados:', result.data);
                }
                // Casos previamente registrados
                if (result.data.warnings && result.data.warnings.length > 0) {
                    setMessageData(result.data.warnings);
                    const warningMsg = 'Algunos casos ya estaban registrados.'
                    showInteractiveToast({
                        severity: 'warn',
                        summary: 'Advertencia',
                        message: warningMsg,
                        onClick: () => setVisible(true),
                        linkText: 'Ver más detalles',
                        life: 5000
                    });
                    console.info(warningMsg, result.data.warnings);
                }
            } else {
                setFileData({
                    ...fileData,
                    severity: 'danger',
                    statusText: 'Error'
                });
                setMessageData(result.error);
                const errorMsg = 'Error al subir el archivo.'
                showInteractiveToast({
                    severity: 'error',
                    summary: 'Error',
                    message: errorMsg,
                    onClick: () => setVisible(true),
                    linkText: 'Ver más detalles',
                    life: 5000
                });
                console.error(errorMsg, result.error);
            }
        } catch (error) {
            setFileData({
                ...fileData,
                severity: 'danger',
                statusText: 'Error'
            });
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: `Error inesperado: ${error.message}`,
                life: 3000
            });
            console.error('Error inesperado al subir el archivo:', error);
        }
    };



    const onFileRemove = () => {
        fileUploadRef.current.clear();
    }

    const onFileClear = () => {
        setFileData(null);
        onFileLoad(null);
    }

    const onFileError = () => {
        showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'File Uploaded',
            life: 3000
        });
        console.log("Error");
    }

    const customItemTemplate = () => {
        return <FileInfoComponent fileData={fileData} onRemove={onFileRemove} />;
    }

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
            <Dialog header="Detalles de los datos cargados" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <pre>{JSON.stringify(messageData, null, 2)}</pre>
            </Dialog>
            <FileUpload
                ref={fileUploadRef}
                name="file"
                accept=".json, .xlsx"
                // maxFileSize={1000000}

                chooseLabel="Seleccionar archivo"
                onSelect={onFileSelect}

                uploadLabel="Subir archivo"
                onUpload={onFileUpload}

                cancelLabel="Cancel"
                onClear={onFileClear}

                onRemove={onFileRemove}
                onError={onFileError}

                itemTemplate={customItemTemplate}

                customUpload
                uploadHandler={uploadHandler}

                emptyTemplate={<p className="m-0">Pulse en seleccionar archivo o arrastre y sueltelo aquí para cargarlo.</p>}
            />

        </SessionExpiredService>
    );
}

export default FileUploadComponent;
