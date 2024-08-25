import axios from 'axios';

const GetFileListFromLocalService = async (directoryPath) => {
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
            url: `http://127.0.0.1:5000/notifications/list?directory_path=${encodeURIComponent(directoryPath)}`,
            method: "GET",
            headers: headersList,
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar los datos obtenidos
        return { success: true, data: response.data };
    } catch (error) {
        // Manejar cualquier error que ocurra en todo el bloque try
        return { success: false, error: error.response?.data?.error || error.response.data };
    }
};

export default GetFileListFromLocalService;
