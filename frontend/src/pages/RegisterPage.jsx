import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SignupButton from '../components/FormComponents/SignupButton';
import NameField from '../components/FormFields/NameField';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';
import SignupService from '../services/SignupService';

const RegisterPage = () => {

    // Expresión regular para validar el nombre
    const nameRegex = /^[a-zA-Z\s]*$/;

    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validación del esquema mediante Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .matches(nameRegex, 'El nombre solo puede contener letras')
            .required('Campo requerido'),
        email: Yup.string()
            .matches(emailRegex, 'Dirección de email inválida')
            .required('Campo requerido'),
        password: Yup.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .required('Campo requerido'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            try {
                const userData = {
                    name: values.name,
                    email: values.email,
                    password: values.password
                };
                const response = await SignupService(userData);
                console.log('Usuario registrado exitosamente:', response);
            } catch (error) {
                if (error.response && error.response.data === 'Email already exists') {
                    setErrors({ email: 'Este correo ya está registrado' });
                } else {
                    console.error('Error en el registro:', error.message);
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <NameField formik={formik} />
                <EmailField formik={formik} />
                <PasswordField formik={formik} />
                <SignupButton />
            </form>
        </div>
    );
};

export default RegisterPage;
