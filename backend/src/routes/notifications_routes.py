from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.notifications_services import (
    getFileService,
    getFileListService,
    getNigFromFileService,
    deleteFileService,
    createFoldersService,
    sendEmailService,
    moveFileService,
)

# Crear un Blueprint para manejar las rutas de notificaciones
notifications = Blueprint('notifications', __name__)

# Definir la ruta para obtener un archivo dado su nombre
@notifications.route('/file', methods=['POST'])
@jwt_required()
def getFile():
    data = request.json
    directory_path = data.get('directory_path')
    fileName = data.get('fileName')
    return getFileService(directory_path, fileName)

# Definir la ruta para listar archivos en un directorio dado
@notifications.route('/list', methods=['POST'])
@jwt_required()
def listFiles():
    data = request.json
    directory_path = data.get('directory_path')
    return getFileListService(directory_path)

@notifications.route('/nig', methods=['POST'])
@jwt_required()
def getNigFromFile():
    data = request.json
    file_path = data.get('file_path')
    return getNigFromFileService(file_path)

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
def createFolders():
    data = request.json
    directory_path = data.get('directory_path')
    return createFoldersService(directory_path)

@notifications.route('/send_email', methods=['POST'])
@jwt_required()
def send_email():
    data = request.json
    sender = data.get('sender')
    password = data.get('password')
    recipient = data.get('recipient')
    subject = data.get('subject')
    html_body = data.get('htmlBody')
    file_path = data.get('filePath')
    return sendEmailService(sender, password, recipient, subject, html_body, file_path)

# Definir la ruta para mover un archivo a una carpeta dada
@notifications.route('/move_file', methods=['POST'])
@jwt_required()
def moveFile():
    data = request.json
    file_path = data.get('file_path')
    target_directory = data.get('target_directory')
    return moveFileService(file_path, target_directory)
