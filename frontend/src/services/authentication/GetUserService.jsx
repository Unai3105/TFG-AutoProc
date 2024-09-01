import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const GetUserService = async () => {
    try {
        // Obtener el API_KEY desde el archivo .env
        const API_KEY = import.meta.env.VITE_API_KEY;

        // Obtener el token JWT desde sessionStorage
        const token = sessionStorage.getItem('jwt');

        // Decodificar el token para extraer el ID del usuario
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // Crear las cabeceras de la solicitud HTTP
        const headersList = {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        };

        // Opciones de la solicitud HTTP
        const reqOptions = {
            url: `http://127.0.0.1:5000/users/${userId}`,
            method: "GET",
            headers: headersList,
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

export default GetUserService;
