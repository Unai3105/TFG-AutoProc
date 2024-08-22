const LogoutService = async () => {
    try {        
        // Eliminar el token de autenticación del almacenamiento
        sessionStorage.removeItem('jwt');
        return { success: true, message: 'Sesión cerrada correctamente.' };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
};

export default LogoutService;