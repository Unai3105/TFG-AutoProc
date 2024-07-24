import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SignupButton from '../components/FormComponents/SignupButton';
import UsernameField from '../components/FormFields/UsernameField';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';

const RegisterPage = () => {
    const validationSchema = Yup.object({
        username: Yup.string().required('Campo requerido'),
        email: Yup.string().email('Dirección de email inválida').required('Campo requerido'),
        password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('Campo requerido'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log('Formulario enviado:', values);
        },
    });

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <UsernameField formik={formik} />
                <EmailField formik={formik} />
                <PasswordField formik={formik} />
                <SignupButton />
            </form>
        </div>
    );
};

export default RegisterPage;
