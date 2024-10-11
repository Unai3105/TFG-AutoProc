import bcrypt

class HashEncryptionService:

    # Función para hashear datos (como contraseñas)
    def hash_data(self, data):

        # Hashea los datos con el salt generado
        hashed_data = bcrypt.hashpw(data.encode('utf-8'), bcrypt.gensalt())

        # Devuelve el data hasheado
        return hashed_data.decode('utf-8')

    # Función para verificar datos contra un hash (como verificar contraseñas)
    def verify_data(self, data, hashed_data):

        # Verifica si los datos proporcionados coinciden con el hash almacenado
        return bcrypt.checkpw(data.encode('utf-8'), hashed_data.encode('utf-8'))

# Instanciar el servicio de hashing
hashing_service = HashEncryptionService()
