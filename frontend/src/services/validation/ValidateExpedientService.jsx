const ValidateExpedientService = (expediente) => {
    const expedienteRegex = /^([A-Z]+\s*)+\d+\/\d+([A-Z]*\s*\d+\/\d+)*$/;
    return expedienteRegex.test(expediente);
}

export default ValidateExpedientService