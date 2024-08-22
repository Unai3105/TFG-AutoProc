import React from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const FileInfoComponent = ({ fileData, onRemove }) => {

    if (!fileData) {
        return null;
    }

    // Desestructuramos los datos de fileData
    const { name, size, severity, statusText } = fileData;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '-15px', marginBottom: '-20px' }}>
            {/* Columna Izquierda */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '50px'}}>
                {/* Fila 1: Nombre del archivo */}
                <div>
                    <span>{name}</span>
                </div>
                {/* Fila 2: Tamaño y etiqueta */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <span style={{ marginRight: '10px' }}>{(size / 1024).toFixed(2)} KB</span>
                    <Tag severity={severity} value={statusText} />
                </div>
            </div>

            {/* Columna Derecha */}
            <div style={{ marginRight: '40px' }}>
                <Button
                    icon="pi pi-times"
                    rounded
                    text
                    severity="danger"
                    aria-label="Cancel"
                    onClick={onRemove}
                />
            </div>
        </div>
    );
}

export default FileInfoComponent;
