import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const AddressField = ({ formik }) => {

    const errorId = 'address-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-home"></i>
            </span>
            <InputText
                id="address"
                name="address"
                type="text"
                placeholder="Dirección"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.address && formik.errors.address })}
            />
            {formik.touched.address && formik.errors.address && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.address}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Solo puede contener letras, números, espacios y los caracteres . , ' - /."
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default AddressField;
