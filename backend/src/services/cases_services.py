from flask import jsonify, request, g
from bson import ObjectId

from security.aes_encryption import AESEncryptionService

# Instanciar el servicio de cifrado AES
aes_encryption_service = AESEncryptionService()

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
    for case in g.db.cases.find():

        # Descifrar los datos sensibles
        case['cliente'] = aes_encryption_service.decrypt_data(case['cliente'])
        case['expediente'] = aes_encryption_service.decrypt_data(case['expediente'])
        case['letrado'] = aes_encryption_service.decrypt_data(case['letrado'])
        case['dado en fecha'] = aes_encryption_service.decrypt_data(case['dado en fecha'])
        case['pago'] = aes_encryption_service.decrypt_data(case['pago'])

        cases.append({
            '_id': str(ObjectId(case['_id'])),
            'cliente': case['cliente'],
            'expediente': case['expediente'],
            'letrado': case['letrado'],
            'dado en fecha': case['dado en fecha'],
            'pago': case['pago'],
            'nig': case['nig']
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

        # Descifrar los datos sensibles
        case['cliente'] = aes_encryption_service.decrypt_data(case['cliente'])
        case['expediente'] = aes_encryption_service.decrypt_data(case['expediente'])
        case['letrado'] = aes_encryption_service.decrypt_data(case['letrado'])
        case['dado en fecha'] = aes_encryption_service.decrypt_data(case['dado en fecha'])
        case['pago'] = aes_encryption_service.decrypt_data(case['pago'])

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

# Obtener un caso dado su NIG
@handle_error
def getCaseByNIGService(nig):
    case = g.db.cases.find_one({'nig': nig})
    if case:

        # Descifrar los datos sensibles
        case['cliente'] = aes_encryption_service.decrypt_data(case['cliente'])
        case['expediente'] = aes_encryption_service.decrypt_data(case['expediente'])
        case['letrado'] = aes_encryption_service.decrypt_data(case['letrado'])
        case['dado en fecha'] = aes_encryption_service.decrypt_data(case['dado en fecha'])
        case['pago'] = aes_encryption_service.decrypt_data(case['pago'])

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
        return jsonify({'error': f'Caso con NIG {nig} no encontrado'}), 404

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

    # Cifrar los datos sensibles antes de subir el caso
    data['cliente'] = aes_encryption_service.encrypt_data(data['cliente'])
    data['expediente'] = aes_encryption_service.encrypt_data(data['expediente'])
    data['letrado'] = aes_encryption_service.encrypt_data(data['letrado'])
    data['dado en fecha'] = aes_encryption_service.encrypt_data(data['dado en fecha'])
    data['pago'] = aes_encryption_service.encrypt_data(data['pago'])

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

        # Cifrar los datos sensibles antes de subir el caso
        case['cliente'] = aes_encryption_service.encrypt_data(case['cliente'])
        case['expediente'] = aes_encryption_service.encrypt_data(case['expediente'])
        case['letrado'] = aes_encryption_service.encrypt_data(case['letrado'])
        case['dado en fecha'] = aes_encryption_service.encrypt_data(case['dado en fecha'])
        case['pago'] = aes_encryption_service.encrypt_data(case['pago'])

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

    # Cifrar los datos sensibles antes de subir el caso
    data['cliente'] = aes_encryption_service.encrypt_data(data['cliente'])
    data['expediente'] = aes_encryption_service.encrypt_data(data['expediente'])
    data['letrado'] = aes_encryption_service.encrypt_data(data['letrado'])
    data['dado en fecha'] = aes_encryption_service.encrypt_data(data['dado en fecha'])
    data['pago'] = aes_encryption_service.encrypt_data(data['pago'])

    result = g.db.cases.update_one({'_id': ObjectId(id)}, {"$set": data})
    
    # El caso no fue encontrado
    if result.matched_count == 0:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404
    
    # No se realizaron cambios en los datos
    elif result.modified_count == 0:
        return jsonify({'message': f'Caso {id} no actualizado. No se realizaron cambios.'}), 200
    
    # Los datos fueron actualizados con éxito
    else:
        return jsonify({'message': f'Caso {id} actualizado correctamente'}), 200

# Eliminar un caso dado su id
@handle_error
def deleteCaseService(id):
    result = g.db.cases.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': f'Caso {id} eliminado'})
    else:
        return jsonify({'error': f'Caso {id} no encontrado'}), 404
    
# Verificar si hay casos en la base de datos
@handle_error
def checkCasesDataService():
    # Utiliza count_documents({}) para comprobar si existe al menos un caso
    has_data = g.db.cases.count_documents({}) > 0
    return jsonify({'hasData': has_data}), 200
