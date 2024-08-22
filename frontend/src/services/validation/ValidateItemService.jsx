import ValidateCaseDataService from "./ValidateCaseDataService";
import ValidateLawyerDataService from "./ValidateLawyerDataService";

const ValidateItemService = (dataItem, path) => {
    // Determina si el path es 'lawyers' o 'cases' y llama a la función de validación correspondiente

    if (path === 'lawyers') {
        return ValidateLawyerDataService(dataItem);
    } else if (path === 'cases') {
        return ValidateCaseDataService(dataItem);
    } else {
        return { success: false, errors: { message: `El path "${path}" no es válido.` } };
    }
}

export default ValidateItemService;