from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.mongo import init_mongo
from config.config import configure_app
from routes.users_routes import users
from routes.lawyers_routes import lawyers
from routes.cases_routes import cases
from routes.notifications_routes import notifications

# Crear aplicación Flask
app = Flask(__name__)

# Configurar la aplicación
configure_app(app)

# Inicializar MongoDB
init_mongo(app)

# Configurar JWT
jwt = JWTManager(app)

# Configurar CORS
CORS(app)

# Registrar rutas de usuarios
app.register_blueprint(users, url_prefix='/users')

# Registrar rutas de abogados
app.register_blueprint(lawyers, url_prefix='/lawyers')

# Registrar rutas de casos
app.register_blueprint(cases, url_prefix='/cases')

# Registrar rutas de notificaciones
app.register_blueprint(notifications, url_prefix='/notifications')

# Iniciar aplicación
if __name__ == '__main__':
    app.run(debug=True)
