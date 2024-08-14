from flask import jsonify, request, g
from bson import ObjectId

# Decorador para tratar excepciones
def handle_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return wrapper

# Comprobar si un caso ya existe en la base de datos de casos
def case_exists(case_id):
    return g.db.cases.find_one({'_id': ObjectId(case_id)}) is not None

# Obtener todos los casos
@handle_error
def getAllCasesService():
    cases = []
    for doc in g.db.cases.find():
        cases.append({
            '_id': str(ObjectId(doc['_id'])),
            'cliente': doc['cliente'],
            'expediente': doc['expediente'],
            'letrado': doc['letrado'],
            'provision': doc['provision'],
            'dado en fecha': doc['dado en fecha'],
            'pago': doc['pago'],
            'NIG': doc['NIG']
        })
    if cases:
        return jsonify(cases)
    else:
        return jsonify({'error': 'Ningún caso encontrado'}), 404

# Obtener un caso dado su id
@handle_error
def getCaseService(id):
    case = g.db.cases.find_one({'_id': ObjectId(id)})
    if case:
        return jsonify({
            '_id': str(case['_id']),
            'cliente': case['cliente'],
            'expediente': case['expediente'],
            'letrado': case['letrado'],
            'provision': case['provision'],
            'dado en fecha': case['dado en fecha'],
            'pago': case['pago'],
            'NIG': case['NIG']
        })
    else:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404

# Crear nuevo caso
@handle_error
def createCaseService():
    data = request.json
    required_fields = ['cliente', 'expediente', 'letrado', 'provision', 'dado en fecha', 'pago', 'NIG']
    
    # Verificar que todos los campos requeridos estén presentes
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    # Insertar el nuevo caso en la base de datos
    id = g.db.cases.insert_one(data).inserted_id
    
    return jsonify({
        'message': f'Caso {id} creado correctamente'
        }), 201

# Actualizar información de un caso dado su id
@handle_error
def updateCaseService(id):
    data = request.json
    required_fields = ['cliente', 'expediente', 'letrado', 'provision', 'dado en fecha', 'pago', 'NIG']
    
    # Verificar que todos los campos requeridos estén presentes
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    result = g.db.cases.update_one({'_id': ObjectId(id)}, {"$set": data})
    
    if result.modified_count:
        return jsonify({'message': f'Caso {id} actualizado'})
    else:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404

# Eliminar un caso dado su id
@handle_error
def deleteCaseService(id):
    result = g.db.cases.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': f'Caso {id} eliminado'})
    else:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404
