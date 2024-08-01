from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os
import certifi
from flask_jwt_extended import JWTManager
from datetime import timedelta

from config.mongo import mongo
from routes.users_routes import users

# Cargar variables de entorno
load_dotenv()

# Crear aplicación Flask
app = Flask(__name__)

# Configurar conexión con MongoDB
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo.init_app(app, tlsCAFile=certifi.where())

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Configurar CORS para permitir peticiones desde cualquier origen
CORS(app)

# Registrar rutas de usuarios
app.register_blueprint(users, url_prefix='/users')

# Iniciar aplicación
if __name__ == '__main__':
  app.run(debug=True)