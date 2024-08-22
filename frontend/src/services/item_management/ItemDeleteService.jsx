import axios from 'axios';

const ItemDeleteService = async (uploadPath, id) => {
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
            url: `http://127.0.0.1:5000/${uploadPath}/${id}`,
            method: "DELETE",
            headers: headersList,
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar éxito y los datos recibidos en la respuesta
        return { success: true, data: response.data };

    } catch (error) {
        console.log(error)
        // Manejar cualquier error que ocurra en todo el bloque try
        return { success: false, error: error.response?.data?.msg || error.response?.data?.error || error.response.data };
    }
};

export default ItemDeleteService;
