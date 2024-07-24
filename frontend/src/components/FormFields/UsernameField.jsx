import React from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const UsernameField = ({ formik }) => {
    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
            </span>
            <Password
                id="username"
                name="username"
                placeholder="Nombre de usuario"
                value={formik.values.password}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': formik.errors.password })}
            />
            {formik.errors.password ? <Message severity="error" text={formik.errors.password} /> : null}
        </div>
    );
};

export default UsernameField;
