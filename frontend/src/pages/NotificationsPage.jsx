import React, { useState, useRef, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputSwitch';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import NavBar from '../components/NavBar/NavBar';
import LocalFolderViewerComponent from '../components/NotificationsComponents/LocalFolderViewerComponent';
import GetUserService from '../services/authentication/GetUserService';
import GetNIGFromFileService from '../services/file_management/GetNIGFromFileService';
import GetCaseByNIGService from '../services/item_management/GetCaseByNIGService';
import GetLawyerByNameService from '../services/item_management/GetLawyerByNameService';
import SendEmailService from '../services/email/SendEmailService';
import MoveFileService from '../services/email/MoveFileService';
import CheckDatabaseService from '../services/item_management/CheckDataService';
import SessionExpiredService from '../services/authentication/SesionExpiredService';
import { useToast } from '../context/ToastProvider';

const NotificationsPage = () => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Estado para el TabView
    const [activeIndex, setActiveIndex] = useState(0);

    // Estado para el InputSwitch
    const [isAutoSend, setIsAutoSend] = useState(true);

    // Estado para determinar si las bases de datos están cargadas
    const [DBsLoaded, setDBsLoaded] = useState(false);

    // Estado para mostrar la ProgressBar
    const [showProgressBar, setShowProgressBar] = useState(false);

    // Estado para mostrar el diálogo de previsualización de envío automático
    const [showAutoDialog, setShowAutoDialog] = useState(false);

    // Estado para mostrar el diálogo de envío manual
    const [showManualDialog, setShowManualDialog] = useState(false);

    // Estado para mostrar el segundo diálogo de "Ver email" o "Crear email"
    const [selectedEmail, setSelectedEmail] = useState([]);

    // Estado para los archivos seleccionados
    const [fileNames, setFileNames] = useState([]);

    // Estado para los checkboxes
    const [checkedFiles, setCheckedFiles] = useState({});

    // Estado para el checkbox de "Seleccionar todos"
    const [allFilesChecked, setAllFilesChecked] = useState({});

    // Estado para el mapa de datos de los emails
    const [emailDataMap, setEmailDataMap] = useState({});

    // Estado para deshabilitar el botón de envío
    const [isDisabledButton, setIsDisabledButton] = useState(false);

    // Estado para los detalles de error
    const [errorDetails, setErrorDetails] = useState([]);

    // Estado para mostrar el diálogo de errores
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    // Referencia para el componente LocalFolderViewer
    const localFolderViewerRef = useRef(null);

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast, showInteractiveToast } = useToast();

    // Efecto para comprobar si existe alguna base de datos cargada
    useEffect(() => {
        const checkDatabases = async () => {

            // Verificar la base de datos de abogados
            const lawyersResult = await CheckDatabaseService('lawyers');

            // Sesión expirada
            if (lawyersResult.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            // Verificar la base de datos de casos
            const casesResult = await CheckDatabaseService('cases');

            // Sesión expirada
            if (casesResult.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (lawyersResult.hasData && casesResult.hasData) {
                setDBsLoaded(true);
            } else {

                setDBsLoaded(false);
                
                showInteractiveToast({
                    severity: 'warn',
                    summary: 'Advertencia',
                    message: 'Por favor, cargue todas las bases de datos para acceder a esta función.',
                    onClick: () => window.location.href = '/databaseUpload',
                    linkText: 'Ir a Cargar bases de datos',
                    life: 4750
                });
            }
        };

        checkDatabases();
    }, []);

    // Este efecto se ejecuta cada vez que `checkedFiles` cambia
    useEffect(() => {

        // Verificamos si hay algún archivo seleccionado
        const hasSelectedFiles = Object.values(checkedFiles).some(value => value === true);

        // Actualizamos el estado de 'isDisabledButton'
        setIsDisabledButton(!hasSelectedFiles);

    }, [checkedFiles]);

    // Función que se ejecutará al hacer clic en el botón de envío automático o manual
    const onPreviewButton = () => {

        if (fileNames.length == 0) {
            showToast({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay archivos para enviar',
                life: 3000
            });
            return
        } else {
            if (isAutoSend) {
                // Objeto para reiniciar los checkboxes
                const resetCheckedFiles = {};

                // Poner todos los checkboxes en false
                fileNames.forEach(fileName => {
                    resetCheckedFiles[fileName] = false;
                });

                // Reiniciar 'checkedFiles'
                setCheckedFiles(resetCheckedFiles);

                // Reiniciar 'allFilesChecked'
                setAllFilesChecked(false);

                // Mostrar Dialog después de ocultar la ProgressBar
                setShowAutoDialog(true);
            } else {
                // Mostrar Dialog después de ocultar la ProgressBar
                setShowManualDialog(true);
            }
        }
    };

    // Función para contar los archivos seleccionados
    const countCheckedFileNames = () => {
        return Object.keys(checkedFiles).filter(key => checkedFiles[key]).length;
    }

    // Función para manejar el cambio de estado del checkbox "Seleccionar todos"
    const onCheckAllFiles = (event) => {

        const allChecked = countCheckedFileNames() === fileNames.length;

        // Si todos estaban seleccionados, los pone en false; si no, en true
        const newCheckedFiles = {};
        fileNames.forEach(async fileName => {
            newCheckedFiles[fileName] = !allChecked;
            await loadEmailData(fileName);
        });

        setCheckedFiles(newCheckedFiles);
        setAllFilesChecked(event.checked);
    }

    // Función para enviar los correos y mover los arvhicos a sus carpetas correspondientes
    const onSendAutoButton = async () => {

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Ocultar el diálogo de previsualización
        setShowAutoDialog(false)

        // Mostrar la barra de progreso
        setShowProgressBar(true);

        // Filtrar los archivos que están seleccionados
        const selectedFiles = Object.keys(checkedFiles).filter(fileName => checkedFiles[fileName]);

        try {
            // Para cada archivo seleccionado, enviar el correo
            for (const fileName of selectedFiles) {

                const emailData = emailDataMap[fileName];

                if (emailData) {

                    // Array para almacenar errores específicos de este archivo
                    const fileErrors = [];

                    const response = await SendEmailService(emailData.sender, emailData.emailPassword, emailData.receiver, emailData.subject, emailData.body, emailData.filePath);

                    // Sesión expirada
                    if (response.tokenExpired) {
                        setSessionExpired(true);
                        return;
                    }

                    if (response.success) {
                        console.log(response.data.message);
                        const response2 = await MoveFileService(emailData.filePath, emailData.targetDirectory);

                        // Sesión expirada
                        if (response2.tokenExpired) {
                            setSessionExpired(true);
                            return;
                        }

                        if (response2.success) {
                            successCount++;
                            console.log(response2.data.message);
                        } else {
                            errorCount++;
                            fileErrors.push(`Error al mover el archivo ${fileName}: ${response.data.error}`);
                            console.error(`Error al mover el archivo ${fileName}:`, response2.data.error);
                        }

                    } else {
                        errorCount++;
                        fileErrors.push(`${response.data.error}`);
                        console.error(`Error al enviar correo para ${fileName}:`, response.data.error);
                    }

                    // Si hay errores específicos para este archivo, añádelos al array principal de errores
                    if (fileErrors.length > 0) {
                        errors.push({ fileName, errors: fileErrors });
                    }
                } else {
                    errorCount++;
                    errors.push({
                        fileName,
                        errors: [`No se encontraron datos de correo para ${fileName}`]
                    });
                    console.log(errors)
                    console.error(`No se encontraron datos de correo para ${fileName}`);
                }
                // Recargar la lista de archivos después de enviar los correos
                if (localFolderViewerRef.current) {
                    localFolderViewerRef.current.refreshFolder();
                }
            }
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Error durante el envío de correos.',
                life: 5000
            });
            console.error('Error durante el envío de correos:', error);
        } finally {
            // Ocultar la barra de progreso
            setShowProgressBar(false);

            setErrorDetails(errors);

            if (errorCount === 0) {
                showToast({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Todos los correos fueron enviados con éxito',
                    life: 3000
                });
            } else if (successCount === 0) {
                showInteractiveToast({
                    severity: 'error',
                    summary: 'Error',
                    message: 'Todos los correos fallaron al enviarse.',
                    onClick: () => setShowErrorDialog(true),
                    linkText: 'Ver más detalles',
                    life: 3000
                });
            } else {
                setErrorDetails(errors);
                showInteractiveToast({
                    severity: 'warn',
                    summary: 'Advertencia',
                    message: 'Algunos correos fueron enviados con éxito, pero otros fallaron.',
                    onClick: () => setShowErrorDialog(true),
                    linkText: 'Ver más detalles',
                    life: 5000
                });
            }
        }
    };

    // Maneja la carga de datos de email
    const loadEmailData = async (fileName) => {
        try {
            const userData = await GetUserService();

            // Sesión expirada
            if (userData.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (!userData.success) {
                throw new Error(userData.error || 'Error al obtener los datos del usuario');
            }

            const filePath = `${userData.data.localPath}\\Notificaciones recibidas\\${fileName}`;

            const fileNIG = await GetNIGFromFileService(filePath);

            // Sesión expirada
            if (fileNIG.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (!fileNIG.success) {
                throw new Error(fileNIG.error || 'Error al obtener el NIG del archivo');
            }

            const caseData = await GetCaseByNIGService(fileNIG.data.nig);

            // Sesión expirada
            if (caseData.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (!caseData.success) {
                throw new Error(caseData.error || 'Error al obtener los datos del caso');
            }

            const lawyerData = await GetLawyerByNameService(caseData.data.letrado);

            // Sesión expirada
            if (lawyerData.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (!lawyerData.success) {
                throw new Error(lawyerData.error || 'Error al obtener los datos del abogado');
            }

            const subject = `${caseData.data.cliente} - NIG ${fileNIG.data.nig}`;

            const emailData = {
                sender: userData.data.email,
                emailPassword: userData.data.emailPassword,
                receiver: lawyerData.data.email,
                subject: subject,
                body: getEmailBody(
                    userData.data.name,
                    userData.data.lastNames,
                    userData.data.email,
                    userData.data.phone,
                    userData.data.address,
                    userData.data.postalCode,
                    userData.data.city),
                filePath: filePath,
                targetDirectory: `${userData.data.localPath}\\Notificaciones enviadas`
            };

            setEmailDataMap(prevMap => ({
                ...prevMap,
                [fileName]: emailData
            }));
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: error?.data?.message || error?.message || error || String(error),
                life: 5000
            });
        }
    };

    // Genera el cuerpo del email
    const getEmailBody = (name, lastNames, email, phone, address, postalCode, city) => {
        return `
            <html>
                <body>
                    <p style="font-size: 14pt;">Estimado/a compañero/a:</p>
                    <p style="font-size: 12pt;">Adjunto resolución dictada por el juzgado, en el asunto de referencia.</p>
                    <p style="font-size: 12pt;">Saludos cordiales,</p>
                    <br>
                    <p style="font-size: 12pt; font-weight: bold; color: green;">${name} ${lastNames}</p>
                    <p style="font-size: 12pt; font-weight: bold;">Procuradora de los Tribunales</p>
                    <p style="font-size: 10pt;">
                        ${address}<br>
                        ${postalCode} ${city}<br>
                        Tfno y fax: ${phone}<br>
                        email: ${email}
                    </p>
                    <hr>
                    <p style="font-size: 8pt; color: gray;">
                        CONFIDENCIALIDAD. El contenido de esta comunicación, así como el de toda la documentación anexa, es confidencial y va dirigido únicamente al destinatario de la misma. En el supuesto de que usted no fuera el destinatario, le solicitamos que nos lo indique y no comunique su contenido a terceros, procediendo a su destrucción.<br>
                    </p>
                </body>
            </html>`;
    };

    // Estructura de cada fila en el DataView
    const itemTemplateAuto = (fileName) => {

        // Función para abrir el diálogo de "Ver email"
        const openEmailDialog = async () => {
            setSelectedEmail(fileName);
            if (!emailDataMap[fileName]) {
                await loadEmailData(fileName)
            }
        };

        // Función para manejar el cambio de estado del checkbox
        const onCheckFile = async (event) => {
            setCheckedFiles({
                ...checkedFiles,
                [fileName]: event.checked
            });

            // Si se hace click en el checkbox y los datos no han sido previamente cargados, se cargan
            if (event.checked && !emailDataMap[fileName]) {
                await loadEmailData(fileName)
            }
        };

        return (
            <React.Fragment key={fileName}>
                <div className="p-dataview-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={checkedFiles[fileName] || false}
                            onChange={onCheckFile}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', marginLeft: '1rem', marginRight: '0.5rem', color: '#d32f2f' }}></i>
                        <span style={{ fontSize: '1rem', marginRight: '4rem', wordWrap: 'break-word', flex: '1 1 auto' }}>{fileName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={openEmailDialog}>
                        <span style={{ fontSize: '1rem', marginRight: '1rem' }}>Ver email</span>
                        <i className="pi pi-envelope" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                </div>
                <Divider style={{ marginTop: '-0.5rem', marginBottom: '0.25rem' }} />
            </React.Fragment>
        );
    };

    const itemTemplateManual = (fileName) => {

        // Función para abrir el diálogo de "Ver email"
        const createEmailDialog = async () => {
            setSelectedEmail(fileName);
            if (!emailDataMap[fileName]) {
                await loadEmailData(fileName)
            }
        };

        return (
            <React.Fragment key={fileName}>
                <div className="p-dataview-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', marginLeft: '1rem', marginRight: '0.5rem', color: '#d32f2f' }}></i>
                        <span style={{ fontSize: '1rem', marginRight: '4rem', wordWrap: 'break-word', flex: '1 1 auto' }}>{fileName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={createEmailDialog}>
                        <span style={{ fontSize: '1rem', marginRight: '1rem' }}>Crear email</span>
                        <i className="pi pi-envelope" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                </div>
                <Divider style={{ marginTop: '-0.5rem', marginBottom: '0.25rem' }} />
            </React.Fragment>
        );
    }

    const onEmailDataChange = (field, value) => {
        setEmailDataMap(prevMap => ({
            ...prevMap,
            [selectedEmail]: {
                ...prevMap[selectedEmail],
                [field]: value
            }
        }));
    };

    const onSendManualButton = async () => {

        // Limpiar el email seleccionado
        setSelectedEmail([])

        // Ocultar el diálogo de previsualización
        setShowManualDialog(false)

        // Mostrar la barra de progreso
        setShowProgressBar(true);

        try {
            const emailData = emailDataMap[selectedEmail];

            if (emailData) {

                const response = await SendEmailService(emailData.sender, emailData.emailPassword, emailData.receiver, emailData.subject, emailData.body, emailData.filePath);

                // Sesión expirada
                if (response.tokenExpired) {
                    setSessionExpired(true);
                    return;
                }

                if (response.success) {
                    console.log(response.data.message);
                    const response2 = await MoveFileService(emailData.filePath, emailData.targetDirectory);

                    // Sesión expirada
                    if (response2.tokenExpired) {
                        setSessionExpired(true);
                        return;
                    }

                    if (response2.success) {
                        console.log(response2.data.message);
                        showToast({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'El correo fue enviado y el archivo fue movido correctamente.',
                            life: 3000
                        });
                    } else {
                        console.error(`Error al mover el archivo ${emailData.fileName}:`, response2.error);
                        showToast({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Error al mover el archivo ${emailData.fileName}.`,
                            life: 3000
                        });
                    }
                } else {
                    console.error(`Error al enviar correo para ${emailData.fileName}:`, response.data.error);
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al enviar correo para ${emailData.fileName}:`,
                        life: 3000
                    });
                }
            } else {
                console.error(`No se encontraron datos de correo para ${emailData.fileName}`);
                showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se encontraron datos de correo para ${emailData.fileName}`,
                    life: 3000
                });
            }
            // Recargar la lista de archivos después de enviar los correos
            if (localFolderViewerRef.current) {
                localFolderViewerRef.current.refreshFolder();
            }
        } catch (error) {
            console.error('Error durante el envío de correos:', error);
        } finally {
            // Ocultar la barra de progreso
            setShowProgressBar(false);
        }
    };

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
            <NavBar />
            <div style={{
                position: 'fixed', // Fija el contenedor
                top: 75, // Deja espacio debajo del NavBar
            }}>
                <TabView activeIndex={activeIndex} onTabChange={(event) => setActiveIndex(event.index)}>
                    <TabPanel
                        header="Notificaciones recibidas"
                        leftIcon={<i className="pi pi-file-import" style={{ marginRight: '0.5rem' }} />}
                    >
                        <LocalFolderViewerComponent
                            ref={localFolderViewerRef}
                            subFolder="Notificaciones recibidas"
                            onFilesUpdate={setFileNames}
                        />
                    </TabPanel>

                    <TabPanel
                        header="Notificaciones enviadas"
                        leftIcon={<i className="pi pi-file-check" style={{ marginRight: '0.5rem' }} />}
                    >
                        <LocalFolderViewerComponent
                            subFolder="Notificaciones enviadas"
                        />
                    </TabPanel>
                </TabView>

                {activeIndex === 0 && (
                    <>
                        {showProgressBar && (
                            <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                        )}
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                            <InputSwitch
                                checked={isAutoSend}
                                onChange={(e) => {
                                    setIsAutoSend(e.value)
                                    setSelectedEmail([]);
                                }}
                                style={{ marginRight: '1rem' }}
                            />
                            <Button
                                label={isAutoSend ? "Envío Automático" : "Envío Manual"}
                                icon={isAutoSend ? "pi pi-bolt" : "pi pi-pencil"}
                                className="p-button-primary"
                                onClick={onPreviewButton}
                                disabled={!DBsLoaded}
                            />
                        </div>
                        <Dialog header="Seleccione los emails que desee enviar"
                            visible={showAutoDialog}
                            onHide={() => { if (!showAutoDialog) return; setShowAutoDialog(false); }}
                            style={{ width: '45rem' }}>

                            <DataView value={fileNames} itemTemplate={itemTemplateAuto} />

                            {/* Fila adicional para "Seleccionar todos" */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Checkbox
                                        checked={countCheckedFileNames() === fileNames.length || allFilesChecked}
                                        onChange={onCheckAllFiles}
                                    />
                                    <span style={{ marginLeft: '1.1rem' }}>Seleccionar todos</span>
                                </div>
                                <Button
                                    label="Enviar"
                                    icon="pi pi-send"
                                    className="p-button-primary"
                                    onClick={onSendAutoButton}
                                    disabled={isDisabledButton}
                                />
                            </div>
                        </Dialog>

                        <Dialog header="Seleccione el email que desee crear"
                            visible={showManualDialog}
                            onHide={() => { if (!showManualDialog) return; setShowManualDialog(false); }}
                            style={{ width: '45rem' }}>

                            <DataView value={fileNames} itemTemplate={itemTemplateManual} />
                        </Dialog>

                        {isAutoSend && selectedEmail && emailDataMap[selectedEmail] && (
                            <Dialog header={`Previsualización del email`} visible={true} onHide={() => setSelectedEmail([])} style={{ width: '40rem', height: '475px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>De:</strong> {emailDataMap[selectedEmail].sender}
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>Para:</strong> {emailDataMap[selectedEmail].receiver}
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>Asunto:</strong> {emailDataMap[selectedEmail].subject}
                                </div>
                                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                    <div dangerouslySetInnerHTML={{ __html: emailDataMap[selectedEmail].body }} />
                                    <Divider />
                                    <strong>1 archivo adjunto</strong>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                                        <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: '#d32f2f', marginRight: '0.5rem' }}></i>
                                        <span>{selectedEmail}</span>
                                    </div>
                                </div>
                            </Dialog>
                        )}

                        {!isAutoSend && selectedEmail && emailDataMap[selectedEmail] && (
                            <Dialog header={`Previsualización del email`} visible={true} onHide={() => setSelectedEmail([])} style={{ width: '40rem', height: '475px' }}>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <strong style={{ marginRight: '0.5rem' }}>De:</strong>
                                    <InputText
                                        value={emailDataMap[selectedEmail].sender}
                                        onChange={(e) => onEmailDataChange('sender', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <strong style={{ marginRight: '0.5rem' }}>Para:</strong>
                                    <InputText
                                        value={emailDataMap[selectedEmail].receiver}
                                        onChange={(e) => onEmailDataChange('receiver', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <strong style={{ marginRight: '0.5rem' }}>Asunto:</strong>
                                    <InputText
                                        value={emailDataMap[selectedEmail].subject}
                                        onChange={(e) => onEmailDataChange('subject', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                    <Editor
                                        value={emailDataMap[selectedEmail].body}
                                        onTextChange={(e) => onEmailDataChange('body', e.htmlValue)}
                                    />
                                    <Divider />
                                    <strong>1 archivo adjunto</strong>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                                        <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: '#d32f2f', marginRight: '0.5rem' }}></i>
                                        <span>{selectedEmail}</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                    <Button label="Enviar" icon="pi pi-send" className="p-button-primary" onClick={onSendManualButton} />
                                </div>
                            </Dialog>
                        )}
                        <Dialog header="Detalles de los envíos fallidos" visible={showErrorDialog} style={{ width: '70vw' }} onHide={() => setShowErrorDialog(false)}>
                            <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
                        </Dialog>
                    </>
                )}
            </div>
        </SessionExpiredService>
    );
};

export default NotificationsPage;