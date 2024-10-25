import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AddTrialToUserService = async (trialDetails) => {
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
      url: `http://127.0.0.1:5000/users/${userId}/add_trial`,
      method: 'POST',
      headers: headersList,
      data: trialDetails,
    };

    // Realizar la solicitud HTTP utilizando axios
    const response = await axios.request(reqOptions);

    // Verificar la respuesta del servidor
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.data.error };
    }

  } catch (error) {
    // Manejar errores y expiración del token JWT
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('jwt');
      return { success: false, tokenExpired: true, error: 'Sesión expirada. Por favor, inicie sesión de nuevo.' };
    }

    // Manejar cualquier otro error
    return { success: false, error: error.response?.data?.error || 'Error en la solicitud al backend' };
  }
};

export default AddTrialToUserService;
