import React, { useRef, useContext, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import GoogleLoginComponent from '../components/FormComponents/GoogleLoginComponent';
import LoginButton from '../components/FormComponents/LoginButton'
import GoToAuthComponent from '../components/FormComponents/GoToAuthComponent';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';
import LoginService from '../services/authentication/LoginService';
import { AuthContext } from '../context/AuthProvider';
import { useToast } from '../context/ToastProvider';

const LoginPage = () => {

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

    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validationSchema = Yup.object({
        email: Yup.string()
            .matches(emailRegex, 'Dirección de email inválida')
            .required('Campo requerido'),
        password: Yup.string()
            .required('Campo requerido')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await LoginService(values);
                const { access_token, message } = response;

                // Guardar el token en sessionStorage
                sessionStorage.setItem('jwt', access_token);

                // Establecer el estado de autenticación
                setAuth({ token: access_token, isAuthenticated: true });

                // Mensaje de éxito
                const successMsg = 'Inicio de sesión exitoso';

                // Mostrar Toast de éxito
                showToast({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: successMsg,
                    life: 1500
                });

                // Mostrar el inicio de sesión exitoso por consola
                console.log(successMsg + ":", message);

                // Redirigir a /home después de 1.5 segundos tras el inicio de sesión exitoso
                setTimeout(() => {
                    navigate('/info');
                }, 1500);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {

                    // Mensaje de error
                    const errorMsg = error.response.data.error;

                    // Mostrar Toast de error
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMsg,
                        life: 3000
                    });

                    // Mostrar error por consola
                    console.error('Error en el inicio de sesión:', errorMsg);
                } else {
                    // Mensaje de error desconocido
                    const unknowErrorMsg = 'Error desconocido, por favor intente de nuevo más tarde'

                    // Mostrar Toast de error
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: unknowErrorMsg,
                        life: 3000
                    });

                    // Mostrar error por consola
                    console.error(unknowErrorMsg + ":", error);
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleGoogleLoginSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Manejar la respuesta de Google y enviar los datos al servidor
    };

    const handleGoogleLoginFailure = (error) => {
        console.log('Google Login Failure:', error);
    };

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

            {/* <GoogleLoginComponent onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
            <Divider align="center">O</Divider> */}

            {/* Formulario de inicio de sesión */}
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <EmailField formik={formik} />
                <PasswordField formik={formik} showStrengthIndicator={false} />
                <LoginButton />
                <GoToAuthComponent
                    questionText="¿No tienes una cuenta?"
                    linkText="Regístrate aquí"
                    route="/register"
                />
            </form>
        </div>
    );
};

export default LoginPage;