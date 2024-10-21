import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const LastNamesField = ({ formik }) => {

    const errorId = 'lastNames-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
            </span>
            <InputText
                id="lastNames"
                name="lastNames"
                type="text"
                placeholder="Apellidos"
                value={formik.values.lastNames}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.lastNames && formik.errors.lastNames })}
            />
            {formik.touched.lastNames && formik.errors.lastNames && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.lastNames}
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

export default LastNamesField;