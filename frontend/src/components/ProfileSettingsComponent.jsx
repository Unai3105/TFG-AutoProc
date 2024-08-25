import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import GetUserService from '../services/authentication/GetUserService';
import NameField from '../components/FormFields/NameField';
import EmailField from '../components/FormFields/EmailField';
import LocalPathField from '../components/FormFields/LocalPathField';
import UpdateUserService from '../services/authentication/UpdateUserService'
import CreateFoldersService from '../services/file_management/CreateFoldersService'

const ProfileSettingsComponent = ({ avatarUrl, onLocalPathChange  }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        localPath: '',
    });

    const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo de edición

    const toast = useRef(null);  // Crear una referencia para el Toast

    useEffect(() => {
        const getUserData = async () => {
            const result = await GetUserService();

            if (result.success) {
                const { name, email, localPath } = result.data;
                setUserData({ name, email, localPath });
            } else {
                console.error('Error al obtener datos del usuario:', result.error);
            }
        };
        getUserData();
    }, []);

    // Expresiones regulares para la validación
    const nameRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*(?:\s[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*)*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const directoryRegex = /^[a-zA-Z]:[\\/](?:[^\\/:*?"<>|\r\n]+[\\/])*[^\\/:*?"<>|\r\n]*$/;

    // Validación del esquema mediante Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(nameRegex, 'El nombre solo puede contener letras')
            .required('Campo requerido'),
        email: Yup.string()
            .matches(emailRegex, 'Dirección de email inválida')
            .required('Campo requerido'),
        localPath: Yup.string()
            .matches(directoryRegex, 'Directorio de trabajo local inválido')
            .required('El directorio de trabajo es requerido'),
    });

    const onEditClick = () => {
        setIsEditing(true); // Entrar en modo de edición
    };

    const onSaveClick = async (values) => {

        const result = await UpdateUserService(values);

        if (result.success) {
            // Actualizar los datos en el estado local solo si la solicitud fue exitosa
            setUserData(values);

            // Notifica a ProfileSettingsPage el campo de localPath
            onLocalPathChange(values.localPath);

            // Salir del modo de edición después de guardar
            setIsEditing(false);

            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Perfil actualizado correctamente.`,
                life: 3000
            });

            if (values.localPath !== userData.localPath) {
                const result2 = await CreateFoldersService(values.localPath);

                if (result2.success) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Carpetas creadas correctamente.`,
                        life: 3000
                    });
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `No se pudieron crear las carpetas. ${result2.error}`,
                        life: 3000
                    });
                }
            }
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `No se pudo actualizar el perfil. ${result.error}`,
                life: 3000
            });
        }
    };

    const onCancelClick = () => {
        setIsEditing(false); // Salir del modo de edición sin guardar
    };

    return (
        <div className="p-d-flex p-jc-center p-mt-5">
            <Card className="p-shadow-5" style={{ width: '25rem', position: 'relative' }}>
                <Toast ref={toast} />
                <div
                    className={`p-mb-4 ${isEditing ? 'p-d-flex p-ai-start' : 'p-d-flex p-jc-center'}`}
                    style={{
                        position: isEditing ? 'absolute' : 'relative',
                        top: isEditing ? '0px' : 'unset',
                        left: isEditing ? '10px' : 'unset',
                        transform: isEditing ? 'scale(0.6)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Avatar image={avatarUrl} size="xlarge" shape="circle" />
                </div>

                {isEditing ? (
                    <div style={{ marginTop: '30px', textAlign: 'center', position: 'relative' }}>
                        <h3 style={{ position: 'absolute', top: '-65px', left: '105px' }}>Editar Perfil</h3> {/* Texto de título */}
                        <Formik
                            initialValues={userData}
                            validationSchema={validationSchema}
                            onSubmit={onSaveClick}
                        >
                            {(formik) => (
                                <Form>
                                    <div className="p-mb-2">
                                        <NameField formik={formik} />
                                        <EmailField formik={formik} />
                                        <LocalPathField formik={formik} />
                                    </div>
                                    <div style={{ position: 'absolute', top: '-60px', right: '0px' }}>
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
                        <h2 className="p-text-center">{userData.name}</h2>
                        <p className="p-text-center">{userData.email}</p>
                        <Divider />
                        <p className="p-text-center">
                            {userData.localPath ? (
                                userData.localPath
                            ) : (
                                <>
                                    <i className="pi pi-exclamation-triangle" style={{ marginRight: '0.5rem', color: 'orange' }}></i>
                                    Directorio de trabajo local no especificado
                                </>
                            )}
                        </p>
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
    );
};

export default ProfileSettingsComponent;
