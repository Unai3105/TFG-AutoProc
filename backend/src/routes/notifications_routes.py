from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.notifications_services import (
    getFileService,
    getFileListService,
    deleteFileService,
    createFoldersService,
)

# Crear un Blueprint para manejar las rutas de notificaciones
notifications = Blueprint('notifications', __name__)

# Definir la ruta para obtener un archivo dado su nombre
@notifications.route('/file', methods=['GET'])
@jwt_required()
def getFile():
    directory_path = request.args.get('directory_path')
    fileName = request.args.get('fileName')
    return getFileService(directory_path, fileName)

# Definir la ruta para listar archivos en un directorio dado
@notifications.route('/list', methods=['GET'])
@jwt_required()
def listFiles():
    directory_path = request.args.get('directory_path')
    return getFileListService(directory_path)

# Definir la ruta para eliminar un archivo dado su nombre
@notifications.route('/file', methods=['DELETE'])
@jwt_required()
def deleteFile():
    fileName = request.args.get('fileName')
    directory_path = request.args.get('directory_path')
    return deleteFileService(directory_path, fileName)

# Definir la ruta para crear las 3 carpetas
@notifications.route('/create_folders', methods=['POST'])
@jwt_required()
def create_folders():
    data = request.json
    directory_path = data.get('directory_path')
    return createFoldersService(directory_path)
