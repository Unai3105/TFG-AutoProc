from flask_pymongo import PyMongo

# Instanciar PyMongo
mongo = PyMongo()

# Inicializa la conexión a MongoDB con la configuración de la app
def init_mongo(app):
    mongo.init_app(app)
    return mongo

# Función para obtener la conexión a una base de datos específica
def get_db(db_name):
    return mongo.cx[db_name]