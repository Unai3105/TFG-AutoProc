import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const NameField = ({ formik }) => {
    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
            </span>
            <InputText
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': formik.errors.name })}
            />
            {formik.errors.name ? <Message severity="error" text={formik.errors.name} /> : null}
        </div>
    );
};

export default NameField;
