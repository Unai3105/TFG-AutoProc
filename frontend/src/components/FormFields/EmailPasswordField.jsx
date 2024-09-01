import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const EmailPasswordField = ({ formik }) => {

    const errorId = 'emailPassword-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
            </span>
            <InputText
                id="emailPassword"
                name="emailPassword"
                type="password"
                placeholder="Contraseña del email"
                value={formik.values.emailPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.emailPassword && formik.errors.emailPassword })}
            />
            {formik.touched.emailPassword && formik.errors.emailPassword && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.emailPassword}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Debe tener 16 caracteres. Esta contraseña es proporcionada por el proveedor del email generalmente."
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmailPasswordField;