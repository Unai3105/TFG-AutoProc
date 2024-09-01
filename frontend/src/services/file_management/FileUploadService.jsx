import axios from 'axios';

const FileUploadService = async (dataRow, uploadPath) => {
    try {
        // Obtener el token JWT desde sessionStorage
        const token = sessionStorage.getItem('jwt');

        // Crear las cabeceras de la solicitud HTTP
        const headersList = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        // Convertir el archivo en una cadena JSON
        const bodyContent = JSON.stringify(dataRow);

        // Opciones de la solicitud HTTP
        const reqOptions = {
            url: `http://127.0.0.1:5000/${uploadPath}/upload`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar éxito y los datos recibidos en la respuesta
        return { success: true, data: response.data };

    } catch (error) {
                
        // Si el token ha expirado o es inválido (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('jwt');
            return { success: false, tokenExpired: true, error: 'Sesión expirada. Por favor, inicie sesión de nuevo.' };
        }
        
        // Manejar cualquier error que ocurra en todo el bloque try
        return { success: false, error: error.response?.data?.msg || error.response?.data?.error || error.response.data };
    }
};

export default FileUploadService;
