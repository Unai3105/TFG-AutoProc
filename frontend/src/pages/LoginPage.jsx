import React from 'react';
import { Divider } from 'primereact/divider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import GoogleLoginComponent from '../components/FormComponents/GoogleLoginComponent';
import LoginButton from '../components/FormComponents/LoginButton'
import NoAccountComponent from '../components/FormComponents/NoAccountComponent';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';


const LoginPage = () => {

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
        onSubmit: async values => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/users/login', values);
                console.log('Login Success:', response.data);
                // Redirigir al usuario a la página de inicio o dashboard
                // Por ejemplo: navigate('/dashboard');
            } catch (error) {
                if (error.response && error.response.data.error) {
                    if (error.response.data.error === 'Este correo no está reistrado') {
                        formik.setErrors({ email: 'Este correo no está reistrado' });
                    } else if (error.response.data.error === 'Contraseña incorrecta') {
                        formik.setErrors({ password: 'Contraseña incorrecta' });
                    }
                } else {
                    console.error('Login Error:', error);
                }
            }
        }
    });

    const handleGoogleLoginSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Aquí puedes manejar la respuesta de Google y enviar los datos al servidor
    };

    const handleGoogleLoginFailure = (error) => {
        console.log('Google Login Failure:', error);
    };

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            {/* <GoogleLoginComponent onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
            <Divider align="center">O</Divider> */}
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <EmailField formik={formik} />
                <PasswordField formik={formik} />
                <LoginButton />
                <NoAccountComponent />
            </form>
        </div>
    );
};

export default LoginPage;