import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import GoogleLoginComponent from '../components/FormComponents/GoogleLoginComponent';
import LoginButton from '../components/FormComponents/LoginButton'
import NoAccountComponent from '../components/FormComponents/NoAccountComponent';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';
import { Divider } from 'primereact/divider';

const LoginPage = () => {
    
    const validationSchema = Yup.object({
        email: Yup.string().email('Direccion de email inválida').required('Campo requerido'),
        password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Campo requerido'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log(values);
        },
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
            <GoogleLoginComponent onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
            <Divider align="center">O</Divider>
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