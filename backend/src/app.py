from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os
import certifi

from config.mongo import mongo
from routes.users_routes import users

# Cargar variables de entorno
load_dotenv()

# Crear aplicación Flask
app = Flask(__name__)

# Configurar conexión con MongoDB
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo.init_app(app, tlsCAFile=certifi.where())

# Configurar CORS para permitir peticiones desde cualquier origen
CORS(app)

# Registrar rutas de usuarios
app.register_blueprint(users, url_prefix='/users')

# Iniciar aplicación
if __name__ == '__main__':
  app.run(debug=True)