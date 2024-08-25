import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

import FileInfoComponent from './FileInfoComponent';
import FileProcessingService from '../services/file_management/FileProcessingService';
import FileUploadService from '../services/file_management/FileUploadService';
import CreateToastDialogComponent from '../components/CreateToastDialogComponent';

const FileUploadComponent = ({ onFileLoad, uploadPath }) => {

    const toast = useRef(null);

    const fileUploadRef = useRef(null);

    const [fileData, setFileData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [messageData, setMessageData] = useState([]);

    const onFileSelect = async (event) => {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            const result = await FileProcessingService(file, uploadPath);
            if (result.success) {
                setFileData({
                    file: result.data,
                    name: file.name,
                    size: file.size,
                    severity: 'warning',
                    statusText: 'Pending'
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
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: CreateToastDialogComponent(errorMsg, () => setVisible(true)),
                    life: 5000
                });
                console.error(errorMsg, result);
            }
        }
    }

    const onFileUpload = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'File Uploaded',
            life: 3000
        });
        console.log("File Uploaded");

    }

    const uploadHandler = async () => {
        if (!fileData || !fileData.file) {
            toast.current.show({
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

            if (result && result.success) {
                setFileData({
                    // copia las propiedades existentes
                    ...fileData,
                    severity: 'success',
                    statusText: 'Completed'
                });
                // Casos creados
                if (result.data.created_ids.length > 0) {
                    toast.current.show({
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
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: CreateToastDialogComponent(warningMsg, () => setVisible(true)),
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
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: CreateToastDialogComponent(errorMsg, () => setVisible(true)),
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
            toast.current.show({
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
        toast.current.show({
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
        <div>
            <Toast ref={toast} />
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

        </div >
    );
}

export default FileUploadComponent;
