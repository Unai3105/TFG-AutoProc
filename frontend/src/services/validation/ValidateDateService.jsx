import { parse, format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const ValidateDateService = (date) => {
    // Define los formatos de fecha que se van a aceptar
    const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', 'yyyy/MM/dd'];

    // Itera sobre cada formato definido en formats
    for (let formatStr of formats) {
        // Intenta analizar la fecha usando el formato actual
        const parsedDate = parse(date, formatStr, new Date(), { locale: es });

        // Si la fecha es válida devulve true y la fecha formateada
        if (isValid(parsedDate)) {
            return {
                isValid: true,
                formattedDate: format(parsedDate, 'dd/MM/yyyy')
            };
        }
    }

    // Si ningún formato es válido, devuelve false
    return { isValid: false };
}

export default ValidateDateService