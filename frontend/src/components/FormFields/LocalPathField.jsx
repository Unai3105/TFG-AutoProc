import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

const LocalPathField = ({ formik }) => {
    return (
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-folder"></i>
            </span>
            <InputText
                id="localPath"
                name="localPath"
                type="text"
                placeholder="C:\Users\user\Desktop\exampleFolder"
                value={formik.values.localPath}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': formik.errors.localPath })}
            />
            {formik.errors.localPath ? <Message severity="error" text={formik.errors.localPath} /> : null}
        </div>
    );
};

export default LocalPathField;
