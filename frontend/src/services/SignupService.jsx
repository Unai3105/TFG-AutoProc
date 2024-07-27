import axios from 'axios';

// Configuración base de axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/users',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para registrar un nuevo usuario
const registerUser = async (userData) => {
    const response = await api.post('/', userData);
    return response.data;
};

export default registerUser;