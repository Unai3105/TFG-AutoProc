import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../context/AuthProvider';
import { useToast } from '../context/ToastProvider';
import GoToAuthComponent from '../components/AutenticationComponents/FormComponents/GoToAuthComponent';
import SignupButton from '../components/AutenticationComponents/FormComponents/SignupButton';
import NameField from '../components/AutenticationComponents/FormFields/NameField';
import LastNamesField from '../components/AutenticationComponents/FormFields/LastNamesField';
import EmailField from '../components/AutenticationComponents/FormFields/EmailField';
import PasswordField from '../components/AutenticationComponents/FormFields/PasswordField';
import SignupService from '../services/authentication/SignupService';
import FormatNameService from '../services/formatting/FormatNameService';

const RegisterPage = () => {

    // Hook para navegar
    const navigate = useNavigate();

    // Obtener la función para mostrar toasts desde el ToastProvider
    const { showToast } = useToast();

    // Hook de autenticación
    const { setAuth } = useContext(AuthContext);
    
    // Borrar el token JWT de sessionStorage cuando se monta el componente
    useEffect(() => {
        sessionStorage.removeItem('jwt');
        // Actualizar el estado de autenticación
        setAuth({ token: null, isAuthenticated: false });
    }, [setAuth]);

    // Expresión regular para validar el nombre
    const nameRegex = /^\s*[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*(?:\s+[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*)*\s*$/;

    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Validación del esquema mediante Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .matches(nameRegex, 'Campo inválido')
            .required('Campo requerido'),
        lastNames: Yup.string()
            .matches(nameRegex, 'Campo inválido')
            .required('Campo requerido'),
        email: Yup.string()
            .matches(emailRegex, 'Campo inválido')
            .required('Campo requerido'),
        password: Yup.string()
            .matches(passwordRegex, 'Campo inválido')
            .required('Campo requerido'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastNames: '',
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            try {
                const userData = {
                    name: FormatNameService(values.name),
                    email: values.email,
                    lastNames: FormatNameService(values.lastNames),
                    password: values.password
                };
                const response = await SignupService(userData);
                const { access_token, message } = response;

                // Guardar el token en sessionStorage
                sessionStorage.setItem('jwt', access_token);
                // Establecer el estado de autenticación
                setAuth({ token: access_token, isAuthenticated: true });

                // Mostrar Toast de éxito
                showToast({
                    severity: 'success', // Tipo de mensaje
                    summary: 'Éxito', // Título del mensaje
                    detail: 'Te has registrado correctamente', // Detalles del mensaje
                    life: 1500 // Duración en milisegundos
                });

                // Mostrar el registro de usuario exitoso por consola
                console.log('Usuario registrado correctamente:', message);

                // Redirigir a /home después de 1.5 segundos tras el registro exitoso
                setTimeout(() => {
                    navigate('/info');
                }, 1500);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMsg = error.response.data.error
                    setErrors({ general: errorMsg });

                    // Mostrar Toast de error
                    showToast({
                        severity: 'error', // Tipo de mensaje
                        summary: 'Error', // Título del mensaje
                        detail: errorMsg, // Detalles del mensaje
                        life: 3000 // Duración en milisegundos
                    });

                    // Mostrar error por consola
                    console.error('Error en el registro:', errorMsg);
                } else {
                    // Mostrar error por consola
                    console.error('Error desconocido, por favor intente de nuevo más tarde.', error);

                    // Mostrar Toast de error
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error desconocido, por favor intente de nuevo más tarde.',
                        life: 3000
                    });
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            {/* Logo */}
            <img
                src="favicon.png"
                alt="Logo"
                style={{ width: '64px', height: '64px', marginBottom: '-30px' }}
            />
            {/* Texto de bienvenida */}
            <h1 style={{ marginBottom: '20px', fontWeight: 'var(--font-weight-bold)', fontSize: '2.3rem', }}>
                ¡Bienvenido!
            </h1>

            {/* Formulario de registro */}
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <NameField formik={formik} />
                <LastNamesField formik={formik} />
                <EmailField formik={formik} />
                <PasswordField formik={formik} />
                <SignupButton />
                <GoToAuthComponent
                    questionText="¿Ya tienes una cuenta?"
                    linkText="Inicia sesión aquí"
                    route="/login"
                />
            </form>
        </div>
    );
};

export default RegisterPage;
