from flask import jsonify, request
from bson import ObjectId
from pymongo import MongoClient
import bcrypt

from config.mongo import mongo

# # Establecer conexión con MongoDB
# client = MongoClient("localhost",  27017)

# # Seleccional la base de datos App_Web_Procuradores
# db = client.App_Web_Procuradores

# # Acceder a la colección users
# usersCollection = db.users

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
        return jsonify({'error': 'No users found'}), 404

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
        return jsonify({'error': f'User {id} not found'}), 404

# Crear nuevo usuario
@handle_error
def createUserService():
    data = request.json
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    if email_exists(data['email']):
        return jsonify({'error': 'Email already exists'}), 400

    # Cifrar la contraseña antes de guardar
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    data['password'] = hashed_password.decode('utf-8')

    id = mongo.db.users.insert_one(data).inserted_id
    return jsonify({'message': f'User {id} Created'}), 201

# Actualizar información de un usuario dado su id
@handle_error
def updateUserService(id):
    data = request.json
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    else:
        # Cifrar la nueva contraseña si es que está siendo actualizada
        if 'password' in data:
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            data['password'] = hashed_password.decode('utf-8')

        result = mongo.db.users.update_one({'_id': ObjectId(id)}, {"$set": data})
        
        if result.modified_count:
            return jsonify({'message': f'User {id} updated'})
        else:
            return jsonify({'error': f'User {id} not found'}), 404

# Eliminar un usuario dado su id
@handle_error
def deleteUserService(id):
    result = mongo.db.users.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({'message': f'User {id} deleted'})
    else:
        return jsonify({'error': f'User {id} not found'}), 404
    
@handle_error
def loginUserService():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    user = mongo.db.users.find_one({'email': data['email']})
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            'message': f'User {user["_id"]} logged in successfully'
        })
    else:
        return jsonify({'error': 'Invalid email or password'}), 400