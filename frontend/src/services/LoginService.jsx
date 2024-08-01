import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

// Configuración base de axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/users',
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
    }
});

// Función para iniciar sesión
const LoginService = async (userData) => {
    try {
        const response = await api.post('/login', userData);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export default LoginService;
