// src/services/validation/ValidateCaseDataService.jsx
import ValidateDateService from "./ValidateDateService";
import ValidateExpedientService from "./ValidateExpedientService";
import ValidateNameService from "./ValidateNameService";
import ValidateNIGService from "./ValidateNIGService";
import ValidatePayService from "./ValidatePayService";

import FormatNameService from "../formatting/FormatNameService";

const ValidateCaseDataService = (caseItem) => {
    const expectedCasesHeaders = [
        "cliente",
        "expediente",
        "letrado",
        "dado en fecha",
        "pago",
        "nig",
    ];

    // Asume que el objeto es válido inicialmente
    let isValid = true;

    // Inicializa un array para almacenar los detalles de cualquier error encontrado en este objeto
    const errorDetails = [];

    // Itera sobre cada objeto del JSON proporcionado
    for (const field of expectedCasesHeaders) {
        // Comprobar que cada campo existe y no está vacío
        if (!caseItem.hasOwnProperty(field) || !caseItem[field]) {
            errorDetails.push(`El campo "${field}" es obligatorio y no puede estar vacío.`);
            isValid = false;
        } else {
            // Validación del formato del cliente y letrado
            if (field === "cliente" || field === "letrado") {
                if (!ValidateNameService(caseItem[field])) {
                    errorDetails.push(`El nombre "${caseItem[field]}" no es válido.`);
                    isValid = false;
                } else {
                    // Formatear el nombre si es válido y no está vacío
                    caseItem[field] = FormatNameService(caseItem[field]);
                }
            }

            // Validación del formato del expediente
            if (field === "expediente" && !ValidateExpedientService(caseItem[field])) {
                errorDetails.push(`El expediente "${caseItem[field]}" no es válido.`);
                isValid = false;
            }

            // Validación del formato de la fecha
            if (field === "dado en fecha") {
                const validDate = ValidateDateService(caseItem[field]);
                if (!validDate.isValid) {
                    errorDetails.push(`La fecha "${caseItem[field]}" no es válida.`);
                    isValid = false;
                } else {
                    // Formatear la fecha si es válida
                    caseItem[field] = validDate.formattedDate;
                }
            }

            // Validación del formato del pago
            if (field === "pago" && !ValidatePayService(caseItem[field])) {
                errorDetails.push(`El estado de pago "${caseItem[field]}" no es válido.`);
                isValid = false;
            }

            // Validación del formato del nig
            if (field === "nig" && !ValidateNIGService(caseItem[field])) {
                errorDetails.push(`El NIG "${caseItem[field]}" no es válido.`);
                isValid = false;
            }
        }
    }

    // Retornar el resultado de la validación
    if (isValid) {
        return { success: true, validData: caseItem };
    } else {
        return { success: false, errors: { case: caseItem, errorDetails: errorDetails } };
    }
};

export default ValidateCaseDataService;
