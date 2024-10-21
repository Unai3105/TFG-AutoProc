import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const NameField = ({ formik }) => {

    const errorId = 'name-info';

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
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.name && formik.errors.name })}
            />
            {formik.touched.name && formik.errors.name && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.name}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Solo puede contener letras, espacios, guiones o apóstrofes."
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default NameField;
