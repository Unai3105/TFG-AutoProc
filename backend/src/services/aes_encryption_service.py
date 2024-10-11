from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

class AESEncryptionService:
    def __init__(self):
        # Cargar las variables de entorno desde el archivo .env
        load_dotenv()

        # Recuperar la clave de cifrado desde las variables de entorno
        encryption_key = os.getenv('AES_ENCRYPTION_KEY')

        # Crear la instancia de Fernet
        self.cipher_suite = Fernet(encryption_key.encode('utf-8'))

    # Función para cifrar datos
    def encrypt_data(self, data):
        return self.cipher_suite.encrypt(data.encode('utf-8')).decode('utf-8')

    # Función para descifrar datos
    def decrypt_data(self, encrypted_data):
        return self.cipher_suite.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')

# Instanciar el servicio de cifrado
encryption_service = AESEncryptionService()