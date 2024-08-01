import os
from dotenv import load_dotenv
from functools import wraps
from flask import Blueprint, request, jsonify

from services.users_services import (
    getAllUsersService,
    getUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    loginUserService
)

# Cargar variables de entorno
load_dotenv()

# Obtener la API Key de las variables de entorno
API_KEY = os.getenv('API_KEY')

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-KEY')
        if api_key and api_key == API_KEY:
            return f(*args, **kwargs)
        else:
            return jsonify({'error': 'Acceso no autorizado'}), 401
    return decorated_function

# Crear un Blueprint para manejar las rutas de usuarios
users = Blueprint('users', __name__)

# Definir la ruta para obtener todos los usuarios
@users.route('/', methods=['GET'])
@require_api_key
def getAllUsers():
    return getAllUsersService()

# Definir la ruta para obtener un usuario dado su id
@users.route('/<id>', methods=['GET'])
@require_api_key
def getUser(id):
    return getUserService(id)

# Definir la ruta para crear un nuevo usuario
@users.route('/', methods=['POST'])
@require_api_key
def createUser():
    return createUserService()

# Definir la ruta para actualizar un usuario dado su id
@users.route('/<id>', methods=['PUT'])
@require_api_key
def updateUser(id):
    return updateUserService(id)

# Definir la ruta para eliminar un usuario dado su id
@users.route('/<id>', methods=['DELETE'])
@require_api_key
def deleteUser(id):
    return deleteUserService(id)

# Definir la ruta para el inicio de sesión
@users.route('/login', methods=['POST'])
@require_api_key
def loginUser():
    return loginUserService()