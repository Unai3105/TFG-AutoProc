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

// Función para registrar un nuevo usuario
const SignupService = async (userData) => {
    try{
        const response = await api.post('/', userData);
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default SignupService;