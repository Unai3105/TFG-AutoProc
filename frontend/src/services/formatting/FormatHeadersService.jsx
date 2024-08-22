import FormatStringService from "../formatting/FormatStringService";

const FormatHeadersService = (item, normalizedHeaders) => {
    // Crear un objeto vacío donde se guardarán las claves y valores normalizados
    const normalizedItem = {};

    // Iterar sobre cada clave original del objeto
    Object.keys(item).forEach(key => {
        // Normalizar la clave actual del objeto
        const normalizedKey = FormatStringService(key);

        // Encontrar la posición de la clave normalizada en el array de headers normalizados
        const headerIndex = normalizedHeaders.indexOf(normalizedKey);

        // Si la clave normalizada existe en los headers normalizados
        if (headerIndex !== -1) {
            // Asignar el valor original del objeto a la clave normalizada en el nuevo objeto
            normalizedItem[normalizedHeaders[headerIndex]] = item[key];
        }
    });

    // Devolver el objeto con las claves normalizadas
    return normalizedItem;
}

export default FormatHeadersService