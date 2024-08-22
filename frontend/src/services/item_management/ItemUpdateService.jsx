import axios from 'axios';

const ItemUpdadateService = async (uploadPath, newDataRow) => {
    try {
        // Obtener el ID de los datos actualizados y el resto de los datos
        const { _id, ...dataRow } = newDataRow;

        // Obtener el token JWT desde sessionStorage
        const token = sessionStorage.getItem('jwt');

        // Crear las cabeceras de la solicitud HTTP
        const headersList = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        // Convertir los datos actualizados en una cadena JSON
        const bodyContent = JSON.stringify(dataRow);

        // Opciones de la solicitud HTTP
        const reqOptions = {
            url: `http://127.0.0.1:5000/${uploadPath}/${_id}`,
            method: "PUT",
            headers: headersList,
            data: bodyContent,
        };

        // Realizar la solicitud HTTP utilizando axios
        const response = await axios.request(reqOptions);

        // Retornar éxito y los datos recibidos en la respuesta
        return { success: true, data: response.data };

    } catch (error) {
        // Manejar cualquier error que ocurra en todo el bloque try
        return { success: false, error: error.response?.data?.msg || error.response?.data?.error || error.response.data };
    }
};

export default ItemUpdadateService;
