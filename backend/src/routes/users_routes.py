from flask import Blueprint

from services.users_services import (
    getAllUsersService,
    getUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    loginUserService
)

# Crear un Blueprint para manejar las rutas de usuarios
users = Blueprint('users', __name__)

# Definir la ruta para obtener todos los usuarios
@users.route('/', methods=['GET'])
def getAllUsers():
    return getAllUsersService()

# Definir la ruta para obtener un usuario dado su id
@users.route('/<id>', methods=['GET'])
def getUser(id):
    return getUserService(id)

# Definir la ruta para crear un nuevo usuario
@users.route('/', methods=['POST'])
def createUser():
    return createUserService()

# Definir la ruta para actualizar un usuario dado su id
@users.route('/<id>', methods=['PUT'])
def updateUser(id):
    return updateUserService(id)

# Definir la ruta para eliminar un usuario dado su id
@users.route('/<id>', methods=['DELETE'])
def deleteUser(id):
    return deleteUserService(id)

# Definir la ruta para el inicio de sesión
@users.route('/login', methods=['POST'])
def loginUser():
    return loginUserService()