import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import GetFileFromDBService from '../services/file_management/GetFileFromDBService'
import ItemDeleteService from '../services/item_management/ItemDeleteService';
import ItemUpdateService from '../services/item_management/ItemUpdateService';
import ValidateItemService from '../services/validation/ValidateItemService';
import CreateToastDialogComponent from './CreateToastDialogComponent';

const EditableDataTableComponent = ({ path }) => {

    // Estado para datos de la tabla
    const [data, setData] = useState([]);

    // Estado para filas en edición
    const [editingRows, setEditingRows] = useState({});

    // Estado para el mensaje de los diálogos
    const [messageData, setMessageData] = useState([]);

    // Estado para manejar la visibilidad de los diálogos
    const [visible, setVisible] = useState(false);

    // Referencia para notificaciones
    const toast = useRef(null);

    // Clave única de las filas
    const dataKey = '_id';

    // Carga datos
    useEffect(() => {
        const loadData = async () => {
            // Obtiene los datos desde el servicio
            const result = await GetFileFromDBService(path);
            // Guarda datos si la llamada es exitosa
            if (result.success) {
                setData(result.data);
            } else {
                if (result.error == 'Ningún abogado encontrado') {
                    // Muestra advertencia si la llamada falla
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: `${result.error}. Por favor, cargue una base de datos.`,
                        life: 5000
                    });
                } else {
                    // Muestra error si la llamada falla
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: result.error,
                        life: 3000
                    });
                }
            }
        };

        // Ejecuta la carga de datos
        loadData();
    }, [path]);// Se ejecuta cuando 'path' cambia

    // Editor de texto para las celdas
    const textEditor = (options) => {

        // Obtén el valor actual de la celda
        const currentText = options.value;

        // Calcula el ancho en función del número de caracteres
        const charWidth = 8;
        const textWidth = currentText.length * charWidth;

        return (
            <InputText
                type="text" // Define el tipo de input como texto
                value={options.value} // Asigna el valor de la celda
                onChange={(e) => options.editorCallback(e.target.value)} // Actualiza el valor en tiempo real
                style={{ width: `${textWidth + 40}px` }} // Aplica el ancho calculado
            />
        );
    };

    // Inicia edición de fila
    const onRowEditInit = (event) => {
        // Crea una copia de las filas en edición
        const _editingRows = { ...editingRows };

        // Marca la fila como en edición
        _editingRows[event.data[dataKey]] = true;

        // Actualiza el estado con las filas en edición
        setEditingRows(_editingRows);
    };

    // Completa edición de fila
    const onRowEditComplete = (event) => {

        // Obtiene los datos nuevos y originales e índice de la fila editada
        const dataRow = event.data;
        const newDataRow = event.newData;
        const index = event.index;

        // Crea una copia del estado de datos
        let _data = [...data];

        // Actualiza la fila específica con los nuevos datos
        _data[index] = { ...newDataRow };

        // Guarda los datos actualizados en el estado
        setData(_data);

        // Crea una copia del estado de edición de filas
        const _editingRows = { ...editingRows };

        // Elimina la marca de edición de la fila
        delete _editingRows[newDataRow[dataKey]];

        // Actualiza el estado de las filas en edición
        setEditingRows(_editingRows);

        // Muestra el diálogo de confirmación para la edición
        showConfirmDialog(dataRow, newDataRow, index, 'edit');
    };


    // Cancela edición de fila
    const onRowEditCancel = (event) => {

        // Crea una copia del estado de edición de filas
        const _editingRows = { ...editingRows };

        // Elimina la marca de edición de la fila
        delete _editingRows[event.data[dataKey]];

        // Actualiza el estado de las filas en edición
        setEditingRows(_editingRows);
    };

    // Botón para eliminar fila
    const deleteRowButton = (dataRow, rowIndex) => {
        return (
            <Button
                icon="pi pi-trash"
                text
                rounded
                plain
                severity="danger"
                onClick={() => showConfirmDialog(dataRow, dataRow, rowIndex, 'delete')}
            // tooltip="Eliminar fila"
            />
        );
    }

    // Muestra diálogo de confirmación
    const showConfirmDialog = (dataRow, newDataRow, rowIndex, action) => {

        // Determina el mensaje de confirmación según la acción
        const detailMsg = action === 'delete' ? 'eliminar' : 'actualizar';

        // Configura y muestra el diálogo de confirmación
        confirmDialog({
            message: `¿Está seguro que desea ${detailMsg} esta fila?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí',
            accept: () => {
                // Actualiza la fila si la acción es editar
                if (action === 'edit') onRowUpdate(dataRow, newDataRow, rowIndex);

                // Elimina la fila si la acción es eliminar
                if (action === 'delete') onRowDelete(rowIndex);
            },
            reject: () => {
                // Crea una copia del estado de datos
                let _data = [...data];

                // Actualiza la fila específica con los nuevos datos
                _data[rowIndex] = dataRow;

                // Guarda los datos actualizados en el estado
                setData(_data);
            }
        });
    };

    // Actualiza fila específica
    const onRowUpdate = async (dataRow, newDataRow, rowIndex) => {
        try {
            // Crear una copia del objeto excluyendo el campo _id
            const { _id, ...dataToValidate } = newDataRow;

            // Validar los datos antes de proceder con la actualización
            const validationResponse = ValidateItemService(dataToValidate, path);

            console.log(validationResponse.success)
            // Si la validación falla, muestra un mensaje de error y reestablece los valores
            if (!validationResponse.success) {
                let _data = [...data];
                _data[rowIndex] = dataRow;
                setData(_data);

                setMessageData(validationResponse.errors);
                const errorMsg = 'Alguno de los datos no es válido.'
                toast.current.show({
                    severity: 'error',
                    summary: 'Error de Validación',
                    detail: CreateToastDialogComponent(errorMsg, () => setVisible(true)),
                    life: 5000
                });
                console.error(errorMsg, validationResponse.errors);
                return;
            }

            // Llamar al servicio para actualizar la entidad
            const response = await ItemUpdateService(path, newDataRow);

            if (response.success) {
                // Si la actualización fue exitosa, actualizar la fila en el estado
                let _data = [...data];
                _data[rowIndex] = newDataRow;
                setData(_data);

                const entityType = path === 'lawyers' ? 'Abogado' : path === 'cases' ? 'Caso' : 'Elemento';

                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `${entityType} actualizado correctamente`,
                    life: 3000
                });
            } else {
                // Manejar el caso en que la actualización falle
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo actualizar el ${path === 'lawyers' ? 'Abogado' : 'Caso'}. ${response.error}`,
                    life: 3000
                });
                console.error(`Error al actualizar el ${path === 'lawyers' ? 'Abogado' : 'Caso'}:`, response.error);
            }
        } catch (error) {
            // Manejar cualquier error inesperado
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error inesperado: ${error.message}`,
                life: 3000
            });
            console.error('Error inesperado al actualizar la fila:', error);
        }
    };


    const onRowDelete = async (rowIndex) => {
        try {
            // Obtener el ID de la entidad que se va a eliminar
            const entityId = data[rowIndex]._id;

            // Llamar al servicio para eliminar la entidad
            const response = await ItemDeleteService(path, entityId);

            if (response.success) {
                // Si la eliminación fue exitosa, eliminar la fila del estado
                let _data = [...data];
                _data.splice(rowIndex, 1);
                setData(_data);

                const entityType = path === 'lawyers' ? 'Abogado' : path === 'cases' ? 'Caso' : 'Elemento';
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `${entityType} eliminado correctamente`,
                    life: 3000
                });
            } else {
                // Manejar el caso en que la eliminación falle
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el ${path === 'lawyers' ? 'Abogado' : 'Caso'}. ${response.error}`,
                    life: 3000
                });
                console.error(`Error al eliminar el ${path === 'lawyers' ? 'Abogado' : 'Caso'}:`, response.error);
            }
        } catch (error) {
            // Manejar cualquier error inesperado
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error inesperado: ${error.message}`,
                life: 3000
            });
            console.error('Error inesperado al eliminar la fila:', error);
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <Dialog header="Detalles de los datos cargados" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <pre>{JSON.stringify(messageData, null, 2)}</pre>
            </Dialog>
            <ConfirmDialog />
            {data && data.length > 0 ? (
                <DataTable
                    value={data}                            // Asigna los datos de la tabla
                    stripedRows                             // Estilo de filas rayadas
                    paginator                               // Habilita el paginador
                    rows={10}                               // Número de filas por página
                    responsiveLayout="scroll"               // Configura el layout responsivo
                    editMode="row"                          // Modo de edición por fila
                    dataKey={dataKey}                       // Clave única de las filas
                    editingRows={editingRows}               // Actual fila en edicion
                    onRowEditInit={onRowEditInit}           // Evento al iniciar la edición de una fila
                    onRowEditCancel={onRowEditCancel}       // Evento al cancelar la edición de una fila
                    onRowEditComplete={onRowEditComplete}   // Evento al completar la edición de una fila
                >
                    {/* Columna para botón de eliminar */}
                    <Column
                        body={(rowData, options) => deleteRowButton(rowData, options.rowIndex)}
                        headerStyle={{ width: '10%' }}
                        bodyStyle={{ textAlign: 'center', padding: '0', margin: '0' }}
                    />

                    {/* Columna para botón de edición */}
                    <Column
                        rowEditor
                        headerStyle={{ width: '10%', minWidth: '7rem' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />

                    {/* Renderiza columnas dinámicamente */}
                    {data && data.length > 0 && Object.keys(data[0])
                        .filter(col => col !== '_id')
                        .map((col) => (
                            <Column
                                key={col}
                                field={col}
                                header={col}
                                editor={(options) => textEditor(options)}
                                sortable
                            />
                        ))
                    }
                </DataTable>
            ) : (
                // Muestra un mensaje si no hay datos
                <p>No hay datos disponibles.</p>
            )}
        </div>
    );
};

export default EditableDataTableComponent;
