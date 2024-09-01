from flask import Blueprint, jsonify, g, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from config.mongo import get_db
from services.cases_services import (
    getAllCasesService,
    getCaseService,
    getCaseByNIGService,
    createCaseService,
    updateCaseService,
    deleteCaseService,
    uploadCasesService,
    checkCasesDataService
)

# Crear un Blueprint para manejar las rutas de casos
cases = Blueprint('cases', __name__)

# Configurar la base de datos antes de cada solicitud
@cases.before_request
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

# Definir la ruta para obtener todos los casos
@cases.route('/', methods=['GET'])
def getAllCases():
    return getAllCasesService()

# Definir la ruta para obtener un caso dado su id
@cases.route('/<id>', methods=['GET'])
def getCase(id):
    return getCaseService(id)

# Definir la ruta para obtener un caso dado su NIG
@cases.route('/nig/<nig>', methods=['GET'])
def getCaseByNIG(nig):
    return getCaseByNIGService(nig)

# Definir la ruta para crear un nuevo caso
@cases.route('/', methods=['POST'])
def createCase():
    return createCaseService()

# Definir la ruta para cargar una lista de casos
@cases.route('/upload', methods=['POST'])
def uploadCases():
    return uploadCasesService()

# Definir la ruta para actualizar un caso dado su id
@cases.route('/<id>', methods=['PUT'])
def updateCase(id):
    return updateCaseService(id)

# Definir la ruta para eliminar un caso dado su id
@cases.route('/<id>', methods=['DELETE'])
def deleteCase(id):
    return deleteCaseService(id)

# Definir la ruta para verificar si hay abogados en la base de datos
@cases.route('/checkData', methods=['GET'])
def checkCasesData():
    return checkCasesDataService()