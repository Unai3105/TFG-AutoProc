import React from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const PasswordField = ({ formik, showStrengthIndicator = true }) => {

    const errorId = 'password-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
            </span>
            <Password
                id="password"
                name="password"
                placeholder="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                feedback={showStrengthIndicator} // Indicador de fortaleza de contraseña
                className={classNames({ 'p-invalid': formik.touched.password && formik.errors.password })}
            />
            {formik.touched.password && formik.errors.password && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.password}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número."
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default PasswordField;