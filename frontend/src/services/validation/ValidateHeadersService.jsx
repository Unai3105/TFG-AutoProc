import FormatStringService from "../formatting/FormatStringService";

const ValidateHeadersService = (headers, expectedLawyersHeaders, expectedCasesHeaders, uploadPath) => {

    // Determina qué conjunto de headers esperados usar según el valor de uploadPath
    const expectedHeaders = uploadPath === 'lawyers' ? expectedLawyersHeaders : expectedCasesHeaders;

    // Normaliza todos los headers proporcionados
    const normalizedHeaders = headers.map(header => FormatStringService(header));

    // Filtra los headers esperados que no están presentes en los headers normalizados
    const missingHeaders = expectedHeaders.filter(expectedHeader =>
        !normalizedHeaders.some(header => header.includes(expectedHeader))
    );

    // Si faltan headers críticos, retorna un objeto de error con los headers faltantes
    if (missingHeaders.length > 0) {
        console.log('Error al validar los headers')
        return {
            success: false,
            error: {
                message: 'Falta algún campo crítico en el documento.',
                missingHeaders: missingHeaders
            }
        };
    } else {
        console.log('Headers validados correctamente.')
        // Si no faltan headers, retorna un objeto indicando éxito y los headers normalizados
        return { success: true, normalizedHeaders };
    }
}

export default ValidateHeadersService;