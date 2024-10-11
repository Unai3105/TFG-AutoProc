from cryptography.fernet import Fernet

# Generar una clave segura
key = Fernet.generate_key()

# Convertir la clave a una representación legible (si es necesario)
print(key.decode('utf-8'))