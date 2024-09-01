import axios from 'axios';

const CheckDataService = async (uploadPath) => {
    try {
        // Obtener el token JWT desde sessionStorage
        const token = sessionStorage.getItem('jwt');

        // Crear las cabeceras de la solicitud HTTP
        const headersList = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        // Opciones de la solicitud HTTP
        const reqOptions = {
            url: `http://127.0.0.1:5000/${uploadPath}/checkData`,
            method: "GET",
            headers: headersList,
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar si hay datos en la base de datos
        return { success: true, hasData: response.data.hasData };
    } catch (error) {
                
        // Si el token ha expirado o es inválido (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('jwt');
            return { success: false, tokenExpired: true, error: 'Sesión expirada. Por favor, inicie sesión de nuevo.' };
        }
        
        // Manejar cualquier error que ocurra en todo el bloque try
        return { success: false, error: error.response?.data?.error || error.response.data };
    }
};

export default CheckDataService;
