import os
from dotenv import load_dotenv
from datetime import timedelta

# Configura la aplicación Flask con variables de entorno y otras configuraciones
def configure_app(app):
    
    # Cargar variables de entorno
    load_dotenv()

    # Configuración de la aplicación
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['CORS_HEADERS'] = 'Content-Type'
