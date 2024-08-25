from flask import jsonify, request, g
from bson import ObjectId
from flask_jwt_extended import create_access_token
import bcrypt

from config.mongo import mongo

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
        users.append({
            '_id': str(ObjectId(user['_id'])),
            'name': user['name'],
            'email': user['email'],
            'password': user['password'],
            'localPath': user.get('localPath', '')
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
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'password': user['password'],
            'localPath': user.get('localPath', '')
        })
    else:
        return jsonify({'error': f'Usuario {id} no encontrado'}), 404

# Crear nuevo usuario
@handle_error
def createUserService():
    data = request.json
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    if email_exists(data['email']):
        return jsonify({'error': 'El correo electrónico ya existe'}), 400

    try:
        # Cifrar la contraseña antes de guardar
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        data['password'] = hashed_password.decode('utf-8')

        # Si se proporciona localPath, incluirlo en los datos
        if 'localPath' in data:
            data['localPath'] = data['localPath']

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
        print('error')
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
    if 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    else:
        # Cifrar la nueva contraseña si es que está siendo actualizada
        if 'password' in data:
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            data['password'] = hashed_password.decode('utf-8')

        # Incluir el localPath si se proporciona
        if 'localPath' in data:
            data['localPath'] = data['localPath']

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
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
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