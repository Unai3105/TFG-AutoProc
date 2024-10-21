import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import GetUserService from '../../services/authentication/GetUserService';
import NameField from '../AutenticationComponents/FormFields/NameField';
import LastNamesField from '../AutenticationComponents/FormFields/LastNamesField';
import EmailField from '../AutenticationComponents/FormFields/EmailField';
import EmailPasswordField from '../AutenticationComponents/FormFields/EmailPasswordField';
import LocalPathField from '../AutenticationComponents/FormFields/LocalPathField';
import PhoneField from '../AutenticationComponents/FormFields/PhoneField';
import AddressField from '../AutenticationComponents/FormFields/AddressField';
import PostalCodeField from '../AutenticationComponents/FormFields/PostalCodeField';
import CityField from '../AutenticationComponents/FormFields/CityField';
import EmailPasswordSetupDialog from './EmailPasswordSetupDialog';
import FormatNameService from '../../services/formatting/FormatNameService';
import FormatPhoneService from '../../services/formatting/FormatPhoneService';
import UpdateUserService from '../../services/authentication/UpdateUserService';
import CreateFoldersService from '../../services/file_management/CreateFoldersService';
import SessionExpiredService from '../../services/authentication/SesionExpiredService';
import { useToast } from '../../context/ToastProvider';

const ProfileSettingsComponent = ({ onLocalPathChange }) => {

    // Estado para manejar la sesión expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    // Estado para almacenar los datos del usuario
    const [userData, setUserData] = useState({
        name: '',
        lastNames: '',
        email: '',
        emailPassword: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        localPath: ''
    });

    // Estado para controlar el modo de edición
    const [isEditing, setIsEditing] = useState(false);

    // Estado para controlar la visibilidad del Dialog
    const [showDialog, setShowDialog] = useState(false);

    // URL de la imagen del avatar
    const avatarUrl = 'favicon.png';

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast } = useToast();

    // Obtener los datos del usuario al cargar el componente
    useEffect(() => {
        const getUserData = async () => {
            const result = await GetUserService();

            // Sesión expirada
            if (result.tokenExpired) {
                setSessionExpired(true);
                return;
            }

            if (result.success) {

                const { name, lastNames, email, emailPassword, phone, address, postalCode, city, localPath } = result.data;

                setUserData({ name, lastNames, email, emailPassword, phone, address, postalCode, city, localPath });

            } else {
                console.error('Error al obtener datos del usuario:', result.data.error);
            }
        };
        getUserData();
    }, []);

    // Expresiones regulares para la validación
    const nameRegex = /^\s*[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*(?:\s+[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*)*\s*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailPasswordRegex = /^[A-Za-z0-9]{4}(?:\s?[A-Za-z0-9]{4}){3}$/;
    const localPathRegex = /^[a-zA-Z]:[\\/](?:[^\\/:*?"<>|\r\n]+[\\/])*[^\\/:*?"<>|\r\n]*$/;
    const phoneRegex = /^(?:\+34\s?)?((?:[89]\s?[1-8]\s?(\d\s?){7})|(?:[67]\s?(\d\s?){8}))$/;
    const addressRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9\s.,'-/]+$/;
    const postalCodeRegex = /^\d{5}$/;

    // Validación del esquema mediante Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(nameRegex, 'Campo inválido')
            .required('Campo requerido'),
        lastNames: Yup.string()
            .matches(nameRegex, 'Campo inválido')
            .required('Campo requerido'),
        email: Yup.string()
            .matches(emailRegex, 'Campo inválido')
            .required('Campo requerido'),
        emailPassword: Yup.string()
            .matches(emailPasswordRegex, 'Campo inválido')
            .required('Campo requerido'),
        phone: Yup.string()
            .matches(phoneRegex, 'Campo inválido')
            .required('Campo requerido'),
        address: Yup.string()
            .matches(addressRegex, 'Campo inválido')
            .required('Campo requerido'),
        postalCode: Yup.string()
            .matches(postalCodeRegex, 'Campo inválido')
            .required('Campo requerido'),
        city: Yup.string()
            .matches(nameRegex, 'Campo inválido')
            .required('Campo requerido'),
        localPath: Yup.string()
            .matches(localPathRegex, 'Campo inválido')
            .required('Campo requerido'),
    });

    const onEditClick = () => {
        setIsEditing(true); // Entrar en modo de edición

        // Mostrar el Dialog si no se ha establecido la contraseña del email
        if (!userData['emailPassword']) {
            setTimeout(() => {
                setShowDialog(true);
            }, 500);
        }
    };

    const onSaveClick = async (values) => {

        // Formatear los campos antes de enviarlos
        const formattedValues = {
            ...values,
            name: FormatNameService(values.name),
            lastNames: FormatNameService(values.lastNames),
            phone: FormatPhoneService(values.phone)
        };

        const result = await UpdateUserService(formattedValues);

        // Sesión expirada
        if (result.tokenExpired) {
            setSessionExpired(true);
            return;
        }

        if (result.success) {
            // Actualizar los datos en el estado local solo si la solicitud fue exitosa
            setUserData(formattedValues);

            // Notifica a ProfileSettingsPage el campo de localPath
            onLocalPathChange(formattedValues.localPath);

            // Salir del modo de edición después de guardar
            setIsEditing(false);

            showToast({
                severity: 'success',
                summary: 'Éxito',
                detail: `Perfil actualizado correctamente.`,
                life: 3000
            });

            if (formattedValues.localPath !== userData.localPath) {
                const result2 = await CreateFoldersService(formattedValues.localPath);

                // Sesión expirada
                if (result2.tokenExpired) {
                    setSessionExpired(true);
                    return;
                }

                if (result2.success) {
                    setTimeout(() => {
                        showToast({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Carpetas creadas correctamente.`,
                            life: 3000
                        });
                    }, 300);
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: `No se pudieron crear las carpetas. ${result2.error}`,
                        life: 3000
                    });
                }
            }
        } else {
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: `No se pudo actualizar el perfil. ${result.error}`,
                life: 3000
            });
        }
    };

    // Salir del modo de edición sin guardar
    const onCancelClick = () => {
        setIsEditing(false)
    };

    return (
        <SessionExpiredService sessionExpired={sessionExpired}>
            <div style={{
                position: 'fixed', // Fija el contenedor
                top: 75, // Deja espacio debajo del NavBar
                left: '50%', // Mueve el contenedor al centro de la pantalla
                transform: 'translateX(-50%)', // Centra el contenedor horizontalmente
            }}>
                <Card style={{ width: '30rem', maxHeight: '515px' }}>
                    <div
                        style={{
                            position: isEditing ? 'absolute' : 'relative',
                            top: isEditing ? '0px' : 'unset',
                            left: isEditing ? '10px' : 'unset',
                            transform: isEditing ? 'scale(0.6)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Avatar
                            style={{
                                backgroundImage: `url(${avatarUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100px',
                                height: '100px'
                            }}
                            size="xlarge"
                            shape="circle"
                        />
                    </div>

                    <EmailPasswordSetupDialog
                        email={userData.email}
                        visible={showDialog}
                        onHide={() => setShowDialog(false)}
                    />

                    {isEditing ? (
                        <div style={{ marginTop: '60px', textAlign: 'center', position: 'relative' }}>
                            <h3 style={{ position: 'absolute', top: '-75px', left: '115px' }}>
                                Editar Perfil
                            </h3>
                            <Formik
                                initialValues={userData}
                                validationSchema={validationSchema}
                                onSubmit={onSaveClick}
                            >
                                {(formik) => (
                                    <Form>
                                        <div className="p-mb-2">
                                            <NameField formik={formik} />
                                            <LastNamesField formik={formik} />
                                            <EmailField formik={formik} />
                                            <EmailPasswordField formik={formik} />
                                            <PhoneField formik={formik} />
                                            <AddressField formik={formik} />
                                            <PostalCodeField formik={formik} />
                                            <CityField formik={formik} />
                                            <LocalPathField formik={formik} />
                                        </div>
                                        <div style={{ position: 'absolute', top: '-72px', right: '0px' }}>
                                            <Button
                                                icon="pi pi-check"
                                                className="p-button-rounded p-button-text p-button-success"
                                                aria-label="Guardar"
                                                type="submit"
                                                style={{ marginRight: '0.5rem' }}
                                            />
                                            <Button
                                                icon="pi pi-times"
                                                className="p-button-rounded p-button-text p-button-danger"
                                                aria-label="Cancelar"
                                                type="button"
                                                onClick={onCancelClick}
                                            />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    ) : (
                        <>
                            {userData.name && userData.lastNames && (
                                <h2 className="p-text-center">{userData.name} {userData.lastNames}</h2>
                            )}
                            {userData.address && userData.postalCode && userData.city && (
                                <p className="p-text-center">
                                    <i className="pi pi-home" style={{ marginRight: '0.5rem' }}></i>
                                    {`${userData.address}, ${userData.postalCode}, ${userData.city}`}
                                </p>
                            )}
                            {userData.email && (
                                <p className="p-text-center">
                                    <i className="pi pi-envelope" style={{ marginRight: '0.5rem' }}></i>
                                    {userData.email}
                                </p>
                            )}

                            {userData.phone && (
                                <p className="p-text-center">
                                    <i className="pi pi-phone" style={{ marginRight: '0.5rem' }}></i>
                                    {userData.phone}
                                </p>
                            )}
                            
                            <Divider />

                            {userData.localPath ? (
                                <div className="p-text-center">
                                    <i className="pi pi-folder" style={{ marginRight: '0.5rem' }}></i>
                                    {userData.localPath}
                                </div>
                            ) : (
                                <div className="p-text-center">
                                    <i className="pi pi-exclamation-triangle" style={{ marginRight: '0.5rem', color: 'orange' }}></i>
                                    Directorio de trabajo local no especificado
                                </div>
                            )}

                            <Button
                                icon="pi pi-pencil"
                                label="Editar"
                                className="p-button-rounded p-button-text p-button-plain"
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px'
                                }}
                                aria-label="Editar"
                                onClick={onEditClick}
                            />
                        </>
                    )}
                </Card>
            </div>
        </SessionExpiredService>
    );
};

export default ProfileSettingsComponent;
