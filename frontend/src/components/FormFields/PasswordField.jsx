import React from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const PasswordField = ({ formik }) => {
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
                className={classNames({ 'p-invalid': formik.errors.password })}
            />
            {formik.errors.password ? <Message severity="error" text={formik.errors.password} /> : null}
        </div>
    );
};

export default PasswordField;
