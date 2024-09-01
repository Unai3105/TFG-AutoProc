from flask import Blueprint, jsonify, g, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from config.mongo import get_db
from services.lawyers_services import (
    getAllLawyersService,
    getLawyerService,
    getLawyerByNameService,
    createLawyerService,
    uploadLawyersService,
    updateLawyerService,
    deleteLawyerService,
    checkLawyersDataService,
)

# Crear un Blueprint para manejar las rutas de abogados
lawyers = Blueprint('lawyers', __name__)

# Configurar la base de datos antes de cada solicitud
@lawyers.before_request
@jwt_required() 
def set_database():
    # Excluir las solicitudes OPTIONS de la verificación JWT
    if request.method == 'OPTIONS':
        return

    try:
        # Obtener el user_id del token JWT
        user_id = get_jwt_identity()

        # Si el usuario no está autenticad, devuelve error
        if not user_id:
            print("Error: Usuario no autenticado")
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        # Nombre de la base de datos correspondiente al usuario
        user_db_name = f"user_{user_id}"
        print(f"Conectando a la base de datos: {user_db_name}")

        # Establecer la base de datos en g.db
        g.db = get_db(user_db_name)

    except Exception as e:
        print(f"Excepción capturada: {str(e)}")
        return jsonify({'error': str(e)}), 401

# Definir la ruta para obtener todos los abogados
@lawyers.route('/', methods=['GET'])
def getAllLawyers():
    return getAllLawyersService()

# Definir la ruta para obtener un abogado dado su id
@lawyers.route('/<id>', methods=['GET'])
def getLawyer(id):
    return getLawyerService(id)

# Definir la ruta para obtener un abogado dado su nombre
@lawyers.route('/name/<name>', methods=['GET'])
def getLawyerByName(name):
    return getLawyerByNameService(name)

# Definir la ruta para crear un nuevo abogado
@lawyers.route('/', methods=['POST'])
def createLawyer():
    return createLawyerService()

# Definir la ruta para cargar una lista de abogados
@lawyers.route('/upload', methods=['POST'])
def uploadLawyers():
    return uploadLawyersService()

# Definir la ruta para actualizar un abogado dado su id
@lawyers.route('/<id>', methods=['PUT'])
def updateLawyer(id):
    return updateLawyerService(id)

# Definir la ruta para eliminar un abogado dado su id
@lawyers.route('/<id>', methods=['DELETE'])
def deleteLawyer(id):
    return deleteLawyerService(id)

# Definir la ruta para verificar si hay abogados en la base de datos
@lawyers.route('/checkData', methods=['GET'])
def checkLawyersData():
    return checkLawyersDataService()