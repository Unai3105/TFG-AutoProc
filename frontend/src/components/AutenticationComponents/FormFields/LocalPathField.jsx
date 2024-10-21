import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';

const LocalPathField = ({ formik }) => {

    const errorId = 'localPath-info';

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
                onBlur={formik.handleBlur}
                className={classNames({ 'p-invalid': formik.touched.localPath && formik.errors.localPath })}
            />
            {formik.touched.localPath && formik.errors.localPath && (
                <div className="p-ml-2">
                    <Message
                        id={errorId}
                        severity="error"
                        text={formik.errors.localPath}
                    />
                    <Tooltip 
                        target={`#${errorId}`} 
                        content="Debe comenzar con una letra seguida de : y usar \ o / como separadores. Ej. C:\Users\user\Desktop\exampleFolder"
                        placeholder="Right"
                        style={{ textAlign: 'center' }}
                    />
                </div>
            )}
        </div>
    );
};

export default LocalPathField;
