import ValidateEmailService from "./ValidateEmailService"
import ValidateNameService from "./ValidateNameService";
import ValidatePhoneService from "./ValidatePhoneService";

import FormatNameService from "../formatting/FormatNameService";
import FormatPhoneService from "../formatting/FormatPhoneService";

const ValidateLawyerDataService = (lawyerItem) => {

    const expectedLawyersHeaders = [
        'name', 'email', 'phone'
    ];

    // Asume que el objeto es válido inicialmente
    let isValid = true;

    // Inicializa un array para almacenar los errores encontrados en este abogado
    const errorDetails = [];

    // Itera sobre cada objeto del JSON proporcionado
    for (const field of expectedLawyersHeaders) {

        // Comprobar que cada campo existe y no está vacío
        if (!lawyerItem.hasOwnProperty(field) || !lawyerItem[field]) {
            errorDetails.push(`El campo "${field}" es obligatorio y no puede estar vacío.`);
            isValid = false;
        }

        // Validación del formato del nombre (cliente y letrado)
        if (field === 'name') {
            if (!ValidateNameService(lawyerItem[field])) {
                errorDetails.push(`El nombre "${lawyerItem[field]}" no es válido.`);
                isValid = false;
            } else {
                // Formatear el nombre si es válido
                lawyerItem[field] = FormatNameService(lawyerItem[field]);
            }
        }

        // Validación del formato de correo electrónico
        if (field === 'email' && !ValidateEmailService(lawyerItem[field])) {
            errorDetails.push(`El email "${lawyerItem[field]}" no es válido.`);
            isValid = false;
        }

        // Validación del formato del número de teléfono
        if (field === 'phone') {
            if (!ValidatePhoneService(lawyerItem[field])) {
                errorDetails.push(`El número de teléfono "${lawyerItem[field]}" no es válido.`);
                isValid = false;
            } else {
                // Formatear el número de teléfono si es válido
                lawyerItem[field] = FormatPhoneService(lawyerItem[field]);
            }
        }

    }

    // Retornar el resultado de la validación
    if (isValid) {
        return { success: true, validData: lawyerItem };
    } else {
        return { success: false, errors: { lawyer: lawyerItem, errorDetails: errorDetails } };
    }
}

export default ValidateLawyerDataService;