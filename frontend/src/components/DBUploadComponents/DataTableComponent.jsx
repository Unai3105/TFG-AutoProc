// src/components/DataTableComponent.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DataTableComponent = ({ data }) => {
    return (
        <div>
            <DataTable value={data} stripedRows paginator rows={10} responsiveLayout="scroll">
                {data && data.length > 0 && Object.keys(data[0]).map((col, index) => (
                    <Column key={index} field={col} header={col} sortable />
                ))}
            </DataTable>
        </div>
    );
};

export default DataTableComponent;
