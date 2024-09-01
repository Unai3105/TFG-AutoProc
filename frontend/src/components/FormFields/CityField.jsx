import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const CityField = ({ formik }) => {

    const errorId = 'city-info';

    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-globe"></i>
            </span>
            <InputText
                id="city"
                name="city"
                type="text"
                placeholder="Ciudad"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.city && formik.errors.city })}
            />
            {formik.touched.city && formik.errors.city && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.city}
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

export default CityField;
