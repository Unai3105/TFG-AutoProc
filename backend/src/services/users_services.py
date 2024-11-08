from flask import jsonify, request, g
from bson import ObjectId
from flask_jwt_extended import create_access_token

from config.mongo import mongo
from security.hash_encryption import HashEncryptionService
from security.aes_encryption import AESEncryptionService

# Instanciar el servicio de cifrado Hash
hashing_service = HashEncryptionService()

# Instanciar el servicio de cifrado AES
aes_encryption_service = AESEncryptionService()

# Decorador para tratar excepciones
def handle_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return wrapper

# Comprobar si un email ya existe en la base de datos
def email_exists(email):
    return g.db.users.find_one({'email': email}) is not None

# Códigos de estado HTTP
# 200: OK
# 201 - Created
# 400 - Bad Request
# 404 - Not Found
# 500 - Internal Server Error

# Obtener todos los usuarios
@handle_error
def getAllUsersService():
    users = []
    for user in g.db.users.find():
            
        # Descifrar los demás campos sensibles
        if 'emailPassword' in user and user['emailPassword']:
            user['emailPassword'] = aes_encryption_service.decrypt_data(user['emailPassword'])
        if 'phone' in user and user['phone']:
            user['phone'] = aes_encryption_service.decrypt_data(user['phone'])
        if 'address' in user and user['address']:
            user['address'] = aes_encryption_service.decrypt_data(user['address'])
        if 'postalCode' in user and user['postalCode']:
            user['postalCode'] = aes_encryption_service.decrypt_data(user['postalCode'])
        if 'city' in user and user['city']:
            user['city'] = aes_encryption_service.decrypt_data(user['city'])
        if 'localPath' in user and user['localPath']:
            user['localPath'] = aes_encryption_service.decrypt_data(user['localPath'])

        # Desencriptar cada juicio en la lista 'trials'
        if 'trials' in user and isinstance(user['trials'], list):
            for trial in user['trials']:
                if isinstance(trial, dict):
                    trial['date'] = aes_encryption_service.decrypt_data(trial['date'])
                    trial['time'] = aes_encryption_service.decrypt_data(trial['time'])
                    trial['place'] = aes_encryption_service.decrypt_data(trial['place'])


        users.append({
            '_id': str(ObjectId(user['_id'])),
            'name': user['name'],
            'lastNames': user['lastNames'],
            'email': user['email'],
            'password': user['password'],
            'emailPassword': user.get('emailPassword', ''),
            'phone': user.get('phone', ''),
            'address': user.get('address', ''),
            'postalCode': user.get('postalCode', ''),
            'city': user.get('city', ''),
            'localPath': user.get('localPath', ''),
            'trials': user.get('trials', [])
        })
    if users:
        return jsonify(users)
    else:
        return jsonify({'error': 'Ningún usuario encontrado'}), 404

# Obtener un usuario dado su id
@handle_error
def getUserService(id):
    user = g.db.users.find_one({'_id': ObjectId(id)})

    if user:

        # Descifrar los demás campos sensibles
        if 'emailPassword' in user and user['emailPassword']:
            user['emailPassword'] = aes_encryption_service.decrypt_data(user['emailPassword'])
        if 'phone' in user and user['phone']:
            user['phone'] = aes_encryption_service.decrypt_data(user['phone'])
        if 'address' in user and user['address']:
            user['address'] = aes_encryption_service.decrypt_data(user['address'])
        if 'postalCode' in user and user['postalCode']:
            user['postalCode'] = aes_encryption_service.decrypt_data(user['postalCode'])
        if 'city' in user and user['city']:
            user['city'] = aes_encryption_service.decrypt_data(user['city'])
        if 'localPath' in user and user['localPath']:
            user['localPath'] = aes_encryption_service.decrypt_data(user['localPath'])
            
        # Desencriptar cada juicio en la lista 'trials'
        if 'trials' in user and isinstance(user['trials'], list):
            for trial in user['trials']:
                if isinstance(trial, dict):
                    trial['date'] = aes_encryption_service.decrypt_data(trial['date'])
                    trial['time'] = aes_encryption_service.decrypt_data(trial['time'])
                    trial['place'] = aes_encryption_service.decrypt_data(trial['place'])

        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'lastNames': user['lastNames'],
            'email': user['email'],
            'password': user['password'],
            'emailPassword': user.get('emailPassword', ''),
            'phone': user.get('phone', ''),
            'address': user.get('address', ''),
            'postalCode': user.get('postalCode', ''),
            'city': user.get('city', ''),
            'localPath': user.get('localPath', ''),
            'trials': user.get('trials', [])
        })
    else:
        return jsonify({'error': f'Usuario {id} no encontrado'}), 404

# Crear nuevo usuario
@handle_error
def createUserService():
    data = request.json

    # Campos obligatorios
    required_fields = ['name', 'lastNames', 'email', 'password']

    # Verificar que todos los campos requeridos estén presentes
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo requerido: {field}'}), 400

    if email_exists(data['email']):
        return jsonify({'error': 'El correo electrónico ya existe'}), 400

    try:
        # Cifrar la contraseña antes de guardar
        data['password'] = hashing_service.hash_data(data['password'])

        # Establecer el campo 'trials' como una lista vacía
        data['trials'] = []

        # Insertar el nuevo usuario en la base de datos
        user_id = g.db.users.insert_one(data).inserted_id
    except Exception as e:
        return jsonify({'error': 'Error al crear el usuario', 'details': str(e)}), 500

    try:
        # Nombre de la nueva base de datos para el usuario basado en su _id
        user_db_name = f"user_{user_id}"
        # Acceder al cliente MongoDB
        client = mongo.cx
        # Crear la nueva base de datos para el nuevo usuario
        user_db = client[user_db_name]

        # Inicializar colecciones en la nueva base de datos
        user_db.create_collection('lawyers')
        user_db.create_collection('cases')
    except Exception as e:

        # Eliminar el usuario creado si la base de datos no pudo ser creada
        g.db.users.delete_one({'_id': user_id})
        return jsonify({'error': 'Error al crear la base de datos del usuario', 'details': str(e)}), 500

    # Generar un token JWT para el nuevo usuario
    access_token = create_access_token(identity=str(user_id))
    
    return jsonify({
        'message': f'Usuario {user_id} creado correctamente',
        'access_token': access_token
        }), 201

# Actualizar información de un usuario dado su id
@handle_error
def updateUserService(id):

    data = request.json

    # Campos obligatorios
    required_fields = ['name', 'lastNames', 'email']

    # Verificar que los campos requeridos estén presentes
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo requerido: {field}'}), 400
        
    # Cifrar la nueva contraseña con hash si es que está siendo actualizada
    if 'password' in data:
        data['password'] = hashing_service.hash_data(data['password'])

    # Cifrar los demás campos sensibles con AES
    data['emailPassword'] = aes_encryption_service.encrypt_data(data.get('emailPassword'))
    data['phone'] = aes_encryption_service.encrypt_data(data.get('phone'))
    data['address'] = aes_encryption_service.encrypt_data(data.get('address'))
    data['postalCode'] = aes_encryption_service.encrypt_data(data.get('postalCode'))
    data['city'] = aes_encryption_service.encrypt_data(data.get('city'))
    data['localPath'] = aes_encryption_service.encrypt_data(data.get('localPath'))

    # Actualizar los datos del usuario
    result = g.db.users.update_one({'_id': ObjectId(id)}, {"$set": data})

    # El usuario no fue encontrado
    if result.matched_count == 0:
        return jsonify({'error': f'Usuario {id} no encontrado'}), 404
        
    # No se realizaron cambios en los datos
    elif result.modified_count == 0:
        return jsonify({'message': f'Usuario {id} no actualizado. No se realizaron cambios.'}), 200
        
    # Los datos fueron actualizados con éxito
    else:
        return jsonify({'message': f'Usuario {id} actualizado correctamente'}), 200
        
# Eliminar un usuario dado su id
@handle_error
def deleteUserService(id):
    result = g.db.users.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': f'Usuario {id} eliminado'})
    else:
        return jsonify({'error': f'Usuario {id} no encontrado'}), 404
    
# Iniciar sesión
@handle_error
def loginUserService():
    data = request.json
    if 'email' not in data or 'password' not in data:
        # Faltan campos requeridos
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    # Buscar el usuario por correo electrónico
    user = g.db.users.find_one({'email': data['email']})
    if not user:
        # El correo electrónico no está registrado
        print('El correo electrónico no está registrado')
        return jsonify({'error': 'El correo electrónico no está registrado'}), 400
    
    # Verificar la contraseña
    if hashing_service.verify_data(data['password'], user['password']):
        
        # Generar un token JWT
        access_token = create_access_token(identity=str(user['_id']))

        # La autenticación ha sido exitosa
        print('Inicio de sesion correcto')

        return jsonify({
            'message': f'El usuario {user["_id"]} inició sesión correctamente',
            'access_token': access_token
        }), 200
    else:
        # La contraseña es incorrecta
        print('contraseña incorrecta')
        return jsonify({'error': 'La contraseña es incorrecta'}), 400
    
# Añadir un juicio a un usuario dado su id
@handle_error
def addTrialToUserService(id):
    data = request.json
    
    # Verificar que los datos de juicio estén presentes
    required_fields = ['date', 'time', 'place']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo requerido: {field}'}), 400

    # Verificar que el usuario exista
    user = g.db.users.find_one({'_id': ObjectId(id)})
    if not user:
        return jsonify({'error': f'Usuario {id} no encontrado'}), 404

    # Cifrar cada campo de juicio
    new_trial = {
        "date": aes_encryption_service.encrypt_data(data['date']),
        "time": aes_encryption_service.encrypt_data(data['time']),
        "place": aes_encryption_service.encrypt_data(data['place'])
    }

    # Actualizar el usuario en la base de datos añadiendo el nuevo juicio a 'trials'
    result = g.db.users.update_one(
        {'_id': ObjectId(id)},
        {'$push': {'trials': new_trial}}
    )

    if result.modified_count == 1:
        return jsonify({'message': f'Juicio añadido correctamente al usuario {id}'}), 200
    else:
        return jsonify({'error': 'No se pudo añadir el juicio'}), 500