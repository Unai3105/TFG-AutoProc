import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const EmailField = ({ formik }) => {
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
                className={classNames({ 'p-invalid': formik.errors.email })}
            />
            {formik.errors.email ? <Message severity="error" text={formik.errors.email} /> : null}
        </div>
    );
};

export default EmailField;
