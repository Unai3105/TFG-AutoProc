import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const PhoneField = ({ formik }) => {

    const errorId = 'name-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-phone"></i>
            </span>
            <InputText
                id="phone"
                name="phone"
                type="text"
                placeholder="Teléfono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.phone && formik.errors.phone })}
            />
            {formik.touched.phone && formik.errors.phone && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.phone}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Número de 9 dígitos que comience por 6/7/8/9. Opcionalmente con prefijo +34. Ej. +34 723456789"
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default PhoneField;