import axios from 'axios';

const GetFileFromLocalService = async (directoryPath, fileName) => {
    try {
        // Obtener el token JWT desde sessionStorage
        const token = sessionStorage.getItem('jwt');

        // Crear las cabeceras de la solicitud HTTP
        const headersList = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Crear el cuerpo de la solicitud
        const bodyContent = {
            directory_path: directoryPath,
            fileName: fileName,
        };

        // Opciones de la solicitud HTTP
        const reqOptions = {
            url: `http://127.0.0.1:5000/notifications/file`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
            responseType: 'blob'  // Importante para manejar archivos binarios
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar el archivo como blob
        return { success: true, data: response.data, fileName };

    } catch (error) {
                
        // Si el token ha expirado o es inválido (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('jwt');
            return { success: false, tokenExpired: true, error: 'Sesión expirada. Por favor, inicie sesión de nuevo.' };
        }
        
        // Manejar cualquier error que ocurra en todo el bloque try
        const blob = error.response.data;
        const errorText = await blob.text();
        const errorMsg = JSON.parse(errorText).error
        return { success: false, error: errorMsg || error };
    }
};

export default GetFileFromLocalService;
