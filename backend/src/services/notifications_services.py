from flask import jsonify, send_file
import os

# Decorador para tratar excepciones
def handle_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_response = jsonify({'error': str(e)})
            print(error_response.get_json())
            return error_response, 500
    return wrapper

# Obtener un archivo dado su nombre
@handle_error
def getFileService(directory_path, fileName):
    # Verificar que los parámetros no sean None
    if not directory_path or not fileName:
        return jsonify({'error': 'directory_path y fileName son requeridos'}), 400

    # Construir la ruta completa al archivo
    file_path = os.path.join(directory_path, fileName)

    # Verifica si el archivo existe
    if not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    # Envía el archivo al cliente
    return send_file(file_path, as_attachment=True)

# Obtener la lista de archivos dada la ruta de su directorio
@handle_error
def getFileListService(directory_path):
    if not os.path.exists(directory_path):
        return jsonify({'error': 'El directorio no existe'}), 404

    if not os.path.isdir(directory_path):
        return jsonify({'error': 'La ruta especificada no es un directorio'}), 400

    file_list = os.listdir(directory_path)

    if not file_list:
        return jsonify({'error': 'El directorio no contiene archivos'}), 404

    return jsonify({'message': 'Lista de archivos obtenida con éxito', 'files': file_list}), 200
    
# Eliminar un archivo dado su nombre
@handle_error
def deleteFileService(fileName):
    # Verifica si el archivo existe
    if not os.path.exists(fileName):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    # Elimina el archivo
    os.remove(fileName)
    return jsonify({'message': f'Archivo {fileName} eliminado con éxito'}), 200
    
# Servicio para crear las 3 carpetas
@handle_error
def createFoldersService(directory_path):
    # Verificar que el parámetro no sea None
    if not directory_path:
        return jsonify({'error': 'directory_path es requerido'}), 400

    # Definir los nombres de las carpetas a crear
    folders = ['Notificaciones recibidas', 'Notificaciones enviadas', 'Notificaciones sin enviar']

    # Crear cada carpeta dentro del directorio especificado
    for folder_name in folders:
        folder_path = os.path.join(directory_path, folder_name)
        os.makedirs(folder_path, exist_ok=True)  # Crea la carpeta si no existe

    return jsonify({'message': 'Carpetas creadas con éxito', 'folders': folders}), 201
