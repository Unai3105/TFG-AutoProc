from flask import jsonify, request
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
    return mongo.db.users.find_one({'email': email}) is not None

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
    for doc in mongo.db.users.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    if users:
        return jsonify(users)
    else:
        return jsonify({'error': 'Ningún usuario encontrado'}), 404

# Obtener un usuario dado su id
@handle_error
def getUserService(id):
    user = mongo.db.users.find_one({'_id': ObjectId(id)})
    if user:
        return jsonify({
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'password': user['password']
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

    # Cifrar la contraseña antes de guardar
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    data['password'] = hashed_password.decode('utf-8')

    # Insertar el nuevo usuario en la base de datos
    id = mongo.db.users.insert_one(data).inserted_id

    # Generar un token JWT para el nuevo usuario
    access_token = create_access_token(identity=str(id))
    
    return jsonify({
        'message': f'Usuario {id} creado correctamente',
        'access_token': access_token
        }), 201

# Actualizar información de un usuario dado su id
@handle_error
def updateUserService(id):
    data = request.json
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    else:
        # Cifrar la nueva contraseña si es que está siendo actualizada
        if 'password' in data:
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            data['password'] = hashed_password.decode('utf-8')

        result = mongo.db.users.update_one({'_id': ObjectId(id)}, {"$set": data})
        
        if result.modified_count:
            return jsonify({'message': f'Usuario {id} actualizado'})
        else:
            return jsonify({'error': f'Usuario {id} no encontrado'}), 404

# Eliminar un usuario dado su id
@handle_error
def deleteUserService(id):
    result = mongo.db.users.delete_one({'_id': ObjectId(id)})
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
    user = mongo.db.users.find_one({'email': data['email']})
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