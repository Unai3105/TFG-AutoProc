import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const EmailField = ({ formik }) => {

    const errorId = 'email-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
            </span>
            <InputText
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.email && formik.errors.email })}
            />
            {formik.touched.email && formik.errors.email && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.email}
                        style={{ cursor: 'pointer' }} // Para indicar que hay información adicional
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Ej. usuario@dominio.com"
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmailField;
