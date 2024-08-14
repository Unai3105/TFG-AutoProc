from flask import Blueprint, jsonify, g
from flask_jwt_extended import get_jwt_identity, jwt_required

from config.mongo import get_db
from services.lawyers_services import (
    getAllLawyersService,
    getLawyerService,
    createLawyerService,
    updateLawyerService,
    deleteLawyerService,
)

# Crear un Blueprint para manejar las rutas de abogados
lawyers = Blueprint('lawyers', __name__)

# Configurar la base de datos antes de cada solicitud
@lawyers.before_request
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

# Definir la ruta para obtener todos los abogados
@lawyers.route('/', methods=['GET'])
@jwt_required() 
def getAllLawyers():
    return getAllLawyersService()

# Definir la ruta para obtener un abogado dado su id
@lawyers.route('/<id>', methods=['GET'])
@jwt_required() 
def getLawyer(id):
    return getLawyerService(id)

# Definir la ruta para crear un nuevo abogado
@lawyers.route('/', methods=['POST'])
@jwt_required() 
def createLawyer():
    return createLawyerService()

# Definir la ruta para actualizar un abogado dado su id
@lawyers.route('/<id>', methods=['PUT'])
@jwt_required() 
def updateLawyer(id):
    return updateLawyerService(id)

# Definir la ruta para eliminar un abogado dado su id
@lawyers.route('/<id>', methods=['DELETE'])
@jwt_required() 
def deleteLawyer(id):
    return deleteLawyerService(id)
