import ExcelJS from 'exceljs';
import ValidateHeadersService from '../validation/ValidateHeadersService';
import ValidateItemService from '../validation/ValidateItemService';
import FormatHeadersService from '../formatting/FormatHeadersService';

// Servicio que procesa y valida un archivo
const FileProcessingService = async (file, uploadPath) => {

    const expectedLawyersHeaders = [
        'name', 'email', 'phone'
    ];

    const expectedCasesHeaders = [
        'cliente', 'expediente', 'letrado', 'dado en fecha', 'pago', 'nig'
    ];

    try {
        // Convertir el archivo en un array buffer
        const data = await file.arrayBuffer();

        // Definir variable donde se guardarán los headers
        let headers = [];

        // Definir variable donde se guardará el json resultante
        let jsonData = [];

        // Definir la variable donde se almacenarán los errores ocurridos
        let allErrors = [];

        // Verificar si el archivo es de tipo JSON
        if (file.type === 'application/json') {
            // Decodificar y parsear el contenido JSON
            jsonData = JSON.parse(new TextDecoder().decode(data));

            // Obtener headers desde el primer objeto del JSON
            if (jsonData.length > 0) {
                headers = Object.keys(jsonData[0]);
            }
        }
        // Verificar si el archivo es un Excel
        else if (file.type.includes('spreadsheetml') || file.name.endsWith('.xlsx')) {
            // Crear un nuevo libro de trabajo Excel
            const workbook = new ExcelJS.Workbook();
            // Cargar el array buffer en el libro de trabajo Excel
            await workbook.xlsx.load(data);
            // Obtener la primera hoja del libro de trabajo
            const worksheet = workbook.getWorksheet(1);

            // Obtener los títulos de las columnas desde la primera fila
            headers = worksheet.getRow(1).values.slice(1);

            // Iterar sobre cada fila de la primera hoja a partir de la segunda fila
            worksheet.eachRow((row, rowNumber) => {
                // Ignorar la primera fila (títulos de columnas)
                if (rowNumber > 1) {
                    // Inicializar un objeto para almacenar los datos de la fila
                    const rowData = {};

                    // Iterar sobre cada celda de la fila
                    row.eachCell((cell, colNumber) => {
                        // Declarar variable para almacenar el valor de cada celda
                        let cellValue;

                        // Si es una fecha, formatearla usando toLocaleDateString
                        if (cell.type == ExcelJS.ValueType.Date) {
                            cellValue = cell.value.toLocaleDateString() || "";
                        } else {
                            // Para otros tipos de celdas, usar el texto
                            cellValue = cell.text || "";
                        }
                        // Almacenar el valor de la celda en el objeto de la fila usando el título de la columna
                        rowData[headers[colNumber - 1]] = cellValue;
                    });
                    // Añadir el objeto de la fila al array de datos de Excel
                    jsonData.push(rowData);
                }
            });
        } else {
            // Devuelve un error si el tipo de archivo no es válido
            return ({ success: false, error: 'Tipo de archivo no válido.' })
        }

        // Validar los headers después de extraer los datos
        const validation = ValidateHeadersService(headers, expectedLawyersHeaders, expectedCasesHeaders, uploadPath);
        if (!validation.success) {
            return validation;
        }

        const normalizedHeaders = validation.normalizedHeaders;

        // Normalizar las claves de cada objeto en jsonData para que coincidan con los headers normalizados
        jsonData = jsonData.map(item => FormatHeadersService(item, normalizedHeaders));

        // Validar los datos del JSON
        for (let item of jsonData) {
            const validationResult = ValidateItemService(item, uploadPath);
            if (!validationResult.success) {
                allErrors.push(validationResult.errors);
                // return { ...validationResult, error: 'El archivo contiene datos inválidos.' };
            }
        }
        
        if (allErrors.length > 0) {
            return {
                success: false,
                error: 'El archivo contiene datos inválidos.',
                allErrors: allErrors
            };
        }

        console.log('Archivo validado correctamente.')
        // Retornar el JSON validado
        return { success: true, data: jsonData };
    }
    catch (error) {
        // Retornar error junto con el mensaje asociado
        return { success: false, error: error.message };
    }
};

export default FileProcessingService;
