import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const PostalCodeField = ({ formik }) => {

    const errorId = 'postalCode-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-map-marker"></i>
            </span>
            <InputText
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="Código Postal"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.postalCode && formik.errors.postalCode })}
            />
            {formik.touched.postalCode && formik.errors.postalCode && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.postalCode}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Número de 5 dígitos. Ej. 28001"
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostalCodeField;
