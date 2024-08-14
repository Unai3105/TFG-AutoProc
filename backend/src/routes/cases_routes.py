from flask import Blueprint, jsonify, g
from flask_jwt_extended import get_jwt_identity, jwt_required

from config.mongo import get_db
from services.cases_services import (
    getAllCasesService,
    getCaseService,
    createCaseService,
    updateCaseService,
    deleteCaseService,
)

# Crear un Blueprint para manejar las rutas de casos
cases = Blueprint('cases', __name__)

# Configurar la base de datos antes de cada solicitud
@cases.before_request
@jwt_required() 
def set_database():
    # Obtener el user_id del token JWT
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    # Nombre de la base de datos correspondiente al usuario
    user_db_name = f"user_{user_id}"
    
    # Establecer la base de datos en g.db
    g.db = get_db(user_db_name)

# Definir la ruta para obtener todos los casos
@cases.route('/', methods=['GET'])
@jwt_required() 
def getAllCases():
    return getAllCasesService()

# Definir la ruta para obtener un caso dado su id
@cases.route('/<id>', methods=['GET'])
@jwt_required() 
def getCase(id):
    return getCaseService(id)

# Definir la ruta para crear un nuevo caso
@cases.route('/', methods=['POST'])
@jwt_required() 
def createCase():
    return createCaseService()

# Definir la ruta para actualizar un caso dado su id
@cases.route('/<id>', methods=['PUT'])
@jwt_required() 
def updateCase(id):
    return updateCaseService(id)

# Definir la ruta para eliminar un caso dado su id
@cases.route('/<id>', methods=['DELETE'])
@jwt_required() 
def deleteCase(id):
    return deleteCaseService(id)
