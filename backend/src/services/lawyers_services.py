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

# Comprobar si un email ya existe en la base de datos de abogados
def email_exists(email):
    return g.db.lawyers.find_one({'email': email}) is not None

# Obtener todos los abogados
@handle_error
def getAllLawyersService():
    lawyers = []
    for doc in g.db.lawyers.find():
        lawyers.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'phone': doc['phone']
        })
    if lawyers:
        return jsonify(lawyers)
    else:
        return jsonify({'error': 'Ningún abogado encontrado'}), 404

# Obtener un abogado dado su id
@handle_error
def getLawyerService(id):
    lawyer = g.db.lawyers.find_one({'_id': ObjectId(id)})
    if lawyer:
        return jsonify({
            '_id': str(lawyer['_id']),
            'name': lawyer['name'],
            'email': lawyer['email'],
            'phone': lawyer['phone']
        })
    else:
        return jsonify({'error': f'Abogado {id} no encontrado'}), 404

# Crear nuevo abogado
@handle_error
def createLawyerService():
    data = request.json
    # Verificar que todos los campos requeridos estén presentes
    if 'name' not in data or 'email' not in data or 'phone' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    # Verificar que el correo electrónico no esté registrado
    if email_exists(data['email']):
        return jsonify({'error': 'El correo electrónico ya existe'}), 400

    # Insertar el nuevo abogado en la base de datos
    id = g.db.lawyers.insert_one(data).inserted_id
    
    return jsonify({
        'message': f'Abogado {id} creado correctamente'
        }), 201

# Cargar una lista de abogados
@handle_error
def uploadLawyersService():
    data = request.json
    if not isinstance(data, list):
        return jsonify({'error': 'Los datos deben ser una lista de abogados'}), 400

    created_ids = []
    errors = []
    warnings = []
    required_fields = ['name', 'email', 'phone']

    for lawyer in data:
        # Verificar que todos los campos requeridos estén presentes
        if not all(field in lawyer for field in required_fields):
            errors.append({'lawyer': lawyer, 'error': 'Faltan campos requeridos'})
            continue
        
        # Verificar que el correo electrónico no esté registrado
        if email_exists(lawyer['email']):
            warnings.append({'lawyer': lawyer, 'error': 'El correo electrónico ya existe'})
            continue

        # Insertar el nuevo abogado en la base de datos
        id = g.db.lawyers.insert_one(lawyer).inserted_id
        created_ids.append(str(id))
        
    if len(errors) == 0 and len(warnings) == 0:
        # Todos los abogados se cargaron correctamente
        return jsonify({
            'message': 'Todos los abogados cargados correctamente',
            'created_ids': created_ids
        }), 201
    elif len(errors) == 0 and len(warnings) > 0:
        # Algunos abogados ya existían, pero no hubo errores
        return jsonify({
            'message': 'Algunos abogados ya estaban registrados',
            'created_ids': created_ids,
            'warnings': warnings
        }), 200
    elif len(errors) > 0 and len(created_ids) > 0:
        # Algunos abogados se cargaron, pero otros fallaron
        return jsonify({
            'message': 'Proceso completado parcialmente',
            'created_ids': created_ids,
            'errors': errors,
            'warnings': warnings
        }), 207  # 207 Multi-Status
    else:
        # Ningún abogado se cargó debido a errores
        return jsonify({
            'message': 'Ningún abogado fue cargado',
            'errors': errors
        }), 400


# Actualizar información de un abogado dado su id
@handle_error
def updateLawyerService(id):
    data = request.json
    if 'name' not in data or 'email' not in data or 'phone' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    result = g.db.lawyers.update_one({'_id': ObjectId(id)}, {"$set": data})
    
    if result.modified_count:
        return jsonify({'message': f'Abogado {id} actualizado'})
    else:
        return jsonify({'error': f'Abogado {id} no encontrado'}), 404

# Eliminar un abogado dado su id
@handle_error
def deleteLawyerService(id):
    result = g.db.lawyers.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': f'Abogado {id} eliminado'})
    else:
        return jsonify({'error': f'Abogado {id} no encontrado'}), 404