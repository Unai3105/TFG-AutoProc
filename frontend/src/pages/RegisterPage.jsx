import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';

import GoToAuthComponent from '../components/FormComponents/GoToAuthComponent';
import SignupButton from '../components/FormComponents/SignupButton';
import NameField from '../components/FormFields/NameField';
import EmailField from '../components/FormFields/EmailField';
import PasswordField from '../components/FormFields/PasswordField';
import SignupService from '../services/SignupService';

const RegisterPage = () => {

    // Hook para navegar
    const navigate = useNavigate();
    
    // Referencia para el Toast
    const toast = useRef(null);

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

                // Mostrar Toast de éxito
                toast.current.show({ 
                    severity: 'success', // Tipo de mensaje
                    summary: 'Éxito', // Título del mensaje
                    detail: 'Te has registrado correctamente', // Detalles del mensaje
                    life: 1500 // Duración en milisegundos
                });

                // Redirigir a /home después de 1.5 segundos tras el registro exitoso
                setTimeout(() => {
                    navigate('/home');
                }, 1500);

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMsg = error.response.data.error
                    setErrors({ general: errorMsg });
                    
                    // Mostrar Toast de error
                    toast.current.show({
                        severity: 'error', // Tipo de mensaje
                        summary: 'Error', // Título del mensaje
                        detail: errorMsg, // Detalles del mensaje
                        life: 3000 // Duración en milisegundos
                    });

                    // Mostrar error por consola
                    console.error('Error en el registro:', errorMsg);
                }else{
                    // Mostrar error por consola
                    console.error('Error en el registro:', error);
                    
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

    return (
        <div className="p-d-flex p-flex-column p-align-center">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <Toast ref={toast} />
                <NameField formik={formik} />
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
