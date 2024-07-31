import React, { useRef } from 'react';
import { Divider } from 'primereact/divider';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';
import axios from 'axios';

import GoogleLoginComponent from '../components/FormComponents/GoogleLoginComponent';
import LoginButton from '../components/FormComponents/LoginButton'
import GoToAuthComponent from '../components/FormComponents/GoToAuthComponent';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';


const LoginPage = () => {

    // Hook para navegar
    const navigate = useNavigate();
        
    // Referencia para el Toast
    const toast = useRef(null);

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
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/users/login', values);
                console.log('Inicio de sesión exitoso:', response.data);
                
                // Mostrar Toast de éxito
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Éxito', 
                    detail: 'Inicio de sesión exitoso', 
                    life: 1500 
                });

                // Redirigir a /home después de 1.5 segundos tras el inicio de sesión exitoso
                setTimeout(() => {
                    navigate('/home');
                }, 1500);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMsg = error.response.data.error;
                    setErrors({ general: errorMsg });

                    // Mostrar Toast de error
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMsg,
                        life: 3000
                    });

                    // Mostrar error por consola
                    console.error('Error en el inicio de sesión:', errorMsg);
                }else{
                    // Mostrar error por consola
                    console.error('Error en el inicio de sesión:', error);

                    // Mostrar Toast de error
                    toast.current.show({
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

    const handleGoogleLoginSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Manejar la respuesta de Google y enviar los datos al servidor
    };

    const handleGoogleLoginFailure = (error) => {
        console.log('Google Login Failure:', error);
    };

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            {/* <GoogleLoginComponent onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
            <Divider align="center">O</Divider> */}
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <Toast ref={toast} />
                <EmailField formik={formik} />
                <PasswordField formik={formik} />
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