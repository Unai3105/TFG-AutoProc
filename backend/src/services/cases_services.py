from flask import jsonify, request, g
from bson import ObjectId

# Decorador para tratar excepciones
def handle_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_response = jsonify({'error': str(e)})
            print(error_response.get_json())
            return error_response, 500
    return wrapper

# Comprobar si un caso ya existe en la base de datos de casos
def case_exists(case_nig):
    return g.db.cases.find_one({'nig': case_nig}) is not None

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
            'dado en fecha': doc['dado en fecha'],
            'pago': doc['pago'],
            'nig': doc['nig']
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
            'dado en fecha': case['dado en fecha'],
            'pago': case['pago'],
            'nig': case['nig']
        })
    else:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404

# Crear nuevo caso
@handle_error
def createCaseService():
    data = request.json
    required_fields = ['cliente', 'expediente', 'letrado', 'dado en fecha', 'pago', 'nig']
    
    # Verificar que todos los campos requeridos estén presentes
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    # Verificar que el correo electrónico no esté registrado
    if case_exists(data['nig']):
        return jsonify({'error': 'El caso ya existe'}), 400

    # Insertar el nuevo caso en la base de datos
    id = g.db.cases.insert_one(data).inserted_id
    
    return jsonify({'message': f'Caso {id} creado correctamente'}), 201

# Cargar una lista de casos
@handle_error
def uploadCasesService():
    data = request.json
    if not isinstance(data, list):
        return jsonify({'error': 'Los datos deben ser una lista de casos'}), 400

    created_ids = []
    errors = []
    warnings = []
    required_fields = ['cliente', 'expediente', 'letrado', 'dado en fecha', 'pago', 'nig']

    for case in data:
        # Verificar que todos los campos requeridos estén presentes
        if not all(field in case for field in required_fields):
            errors.append({'case': case, 'error': 'Faltan campos requeridos'})
            continue

        # Verificar que el caso no esté registrado
        if case_exists(case['nig']):
            warnings.append({'case': case, 'message': 'El caso ya existe'})
            continue

        # Insertar el nuevo caso en la base de datos
        id = g.db.cases.insert_one(case).inserted_id
        created_ids.append(str(id))

    if len(errors) == 0 and len(warnings) == 0:
        # Todos los casos se cargaron correctamente
        return jsonify({
            'message': 'Todos los casos cargados correctamente',
            'created_ids': created_ids
        }), 201
    elif len(errors) == 0 and len(warnings) > 0:
        # Algunos casos ya existían, pero no hubo errores
        return jsonify({
            'message': 'Algunos casos ya estaban registrados',
            'created_ids': created_ids,
            'warnings': warnings
        }), 200
    elif len(errors) > 0 and len(created_ids) > 0:
        # Algunos casos se cargaron, pero otros fallaron
        return jsonify({
            'message': 'Proceso completado parcialmente',
            'created_ids': created_ids,
            'errors': errors,
            'warnings': warnings
        }), 207  # 207 Multi-Status
    else:
        # Ningún caso se cargó debido a errores
        return jsonify({
            'message': 'Ningún caso fue cargado',
            'errors': errors
        }), 400

# Actualizar información de un caso dado su id
@handle_error
def updateCaseService(id):
    data = request.json
    required_fields = ['cliente', 'expediente', 'letrado', 'dado en fecha', 'pago', 'nig']
    
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
