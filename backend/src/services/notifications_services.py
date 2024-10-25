from flask import jsonify, send_file
from flask_mail import Mail, Message
from flask import current_app
import pdfplumber
import smtplib
import re
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

    # Verificar si el directorio existe
    if not os.path.exists(directory_path):
        return {"error": f"El directorio {directory_path} no existe."}

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
        return jsonify({'message': 'El directorio no contiene archivos'}), 200

    return jsonify({'message': 'Lista de archivos obtenida con éxito', 'files': file_list}), 200
    
# Obtener el NIG de un PDF
def getNigFromFileService(file_path):
    nig_pattern = r"NIG:\s*(\d{19})"
    nig = None

    # Verifica si el archivo existe
    if not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    try:
        # Abrir el archivo PDF y procesar cada página
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    # Buscar el patrón del NIG en el texto extraído
                    match = re.search(nig_pattern, text)
                    if match:
                        nig = match.group(1)  # Capturar solo los 19 dígitos
                        break
        if nig:
            return jsonify({'message': f'NIG {nig} encontrado con éxito', 'nig': nig}), 200
        else:
            return {"error": "NIG no encontrado en el archivo."}
    except Exception as e:
        return {"error": str(e)}


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
    folders = ['Notificaciones recibidas', 'Notificaciones enviadas']


    try:
        # Crear cada carpeta dentro del directorio especificado
        for folder_name in folders:
            folder_path = os.path.join(directory_path, folder_name)
            os.makedirs(folder_path, exist_ok=True)  # Crea la carpeta si no existe

        return jsonify({'message': 'Carpetas creadas con éxito', 'folders': folders}), 201
    
    except Exception as e:
        return jsonify({'error': f'Error al crear carpetas: {str(e)}'}), 500

# Servicio para enviar un correo electrónico
@handle_error
def sendEmailService(sender, password, recipient, subject, htmlBody, filePath):

    # Lista de campos requeridos y su correspondiente valor
    required_fields = {
        'sender': sender,
        'password': password,
        'recipient': recipient,
        'subject': subject,
        'htmlBody': htmlBody
    }

    # Identificar los campos que faltan
    missing_fields = [field for field, value in required_fields.items() if not value]

    # Si faltan campos, devolver un mensaje de error específico
    if missing_fields:
        return jsonify({'error': f'Faltan los siguientes campos: {", ".join(missing_fields)}'}), 400

    # Obtener el dominio del correo electrónico del remitente
    sender_domain = sender.split('@')[-1].lower()

    # Mapeo de dominios conocidos a sus servidores SMTP
    smtp_servers = {
        'outlook.com': 'smtp.office365.com',
        'hotmail.com': 'smtp.office365.com',
        'yahoo.com': 'smtp.mail.yahoo.com',
        'yahoo.es': 'smtp.mail.yahoo.com',
        'icloud.com': 'smtp.mail.me.com',
        'me.com': 'smtp.mail.me.com',
        'mac.com': 'smtp.mail.me.com',
        'gmx.net': 'smtp.gmx.com',
    }

    # Obtener el servidor SMTP basado en el dominio
    server = smtp_servers.get(sender_domain)

    # Si no se encuentra el dominio en los comunes, aplicar la lógica genérica
    if not server:
        server = f'smtp.{sender_domain}'

    # Configuración de Flask-Mail con los parámetros recibidos
    mail_settings = {
        "MAIL_SERVER": server,
        "MAIL_PORT": 587,
        "MAIL_USE_TLS": True,
        "MAIL_USERNAME": sender,
        "MAIL_PASSWORD": password,
        "MAIL_DEFAULT_SENDER": sender
    }

    # Inicializar Mail con la configuración específica
    app = current_app._get_current_object()
    app.config.update(mail_settings)
    mail = Mail(app)

    try:
        msg = Message(subject, recipients=[recipient])
        msg.html = htmlBody  # El cuerpo del correo en formato HTML

        # Manejar el archivo adjunto si se proporciona una ruta
        if filePath:
            if os.path.exists(filePath) and os.path.getsize(filePath) <= 25 * 1024 * 1024:  # Límite de 25 MB
                with open(filePath, 'rb') as f:
                    msg.attach(os.path.basename(filePath), 'application/octet-stream', f.read())
            else:
                return jsonify({'error': 'Archivo no encontrado o demasiado grande'}), 400

        mail.send(msg)
        return jsonify({'message': 'Correo enviado con éxito'}), 200
    except smtplib.SMTPException as e:
        print(e)
        return jsonify({'error': f'Error al enviar correo: {str(e)}'}), 500
    
# Servicio para mover un archivo a una carpeta dada
@handle_error
def moveFileService(file_path, target_directory):
    # Verificar que los parámetros no sean None
    if not file_path or not target_directory:
        return jsonify({'error': 'file_path y target_directory son requeridos'}), 400

    # Verificar si el archivo existe en la ruta dada
    if not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    # Verificar si el destino es un directorio válido
    if not os.path.exists(target_directory):
        return jsonify({'error': 'El directorio de destino no existe'}), 404
    if not os.path.isdir(target_directory):
        return jsonify({'error': 'La ruta de destino no es un directorio válido'}), 400

    # Construir la ruta de destino completa con el nombre del archivo
    destination_path = os.path.join(target_directory, os.path.basename(file_path))

    # Mover el archivo al directorio de destino
    try:
        os.rename(file_path, destination_path)
        return jsonify({'message': f'Archivo movido con éxito a {destination_path}'}), 200
    except Exception as e:
        return jsonify({'error': f'Error al mover el archivo: {str(e)}'}), 500

# Servicio para extraer fechas y detalles del PDF basado en estructura de contexto
@handle_error
def extractDateFromPDFService(file_path):
    if not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    # Patrón para encontrar la fecha
    date_pattern = r"día (\d{2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) del (\d{4})"
    # Patrón para encontrar la hora
    time_pattern = r"(\d{2}:\d{2}) horas"
    # Patrón para encontrar el lugar (entre "en" y ", para dar comienzo")
    place_pattern = r"horas, en (.*?), para dar comienzo"

    # Mapeo de meses en texto a números
    months_map = {
        "enero": "01", "febrero": "02", "marzo": "03", "abril": "04", "mayo": "05", "junio": "06",
        "julio": "07", "agosto": "08", "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
    }

    try:
        # Lista para almacenar detalles extraídos
        extracted_details = []

        # Abrir el archivo PDF y procesar cada página
        with pdfplumber.open(file_path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()

                # Limpiar texto
                text = re.sub(r'\s+', ' ', text)

                if text:
                    # print(f"Texto completo extraído de la página {page_number}:\n{text}\n")

                    # Buscar el párrafo que comienza con "1.-" y termina antes de "2.-"
                    paragraph_pattern = r"1\.\-.*?(?=2\.\-|$)"
                    paragraph_match = re.search(paragraph_pattern, text)
                    if paragraph_match:
                        paragraph_text = paragraph_match.group(0)
                        # print(f"Párrafo de interés encontrado en la página {page_number}:\n{paragraph_text}\n")

                        # Buscar la fecha
                        date_match = re.search(date_pattern, paragraph_text)
                        if date_match:
                            day = date_match.group(1)
                            month = months_map[date_match.group(2).lower()]
                            year = date_match.group(3)
                            date = f"{day}/{month}/{year}"
                        else:
                            date = "No especificada"

                        # Buscar la hora
                        time_match = re.search(time_pattern, paragraph_text)
                        if time_match:
                            time = time_match.group(1)
                        else:
                            time = "No especificada"

                        # Buscar el lugar
                        place_match = re.search(place_pattern, paragraph_text)
                        if place_match:
                            place = place_match.group(1).strip()
                        else:
                            place = "No especificado"

                        # print(f"Detalles extraídos: Fecha: {date}, Hora: {time}, Lugar: {place}")

                        # Almacenar detalles extraídos
                        extracted_details.append({
                            "date": date,
                            "time": time,
                            "place": place
                        })

        if not extracted_details:
            print("No se encontraron detalles completos en el archivo PDF.")
            return jsonify({'error': 'No se encontraron detalles en el archivo PDF'}), 200

        return jsonify({'message': 'Fechas y detalles extraídos con éxito', 'details': extracted_details}), 200

    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return jsonify({'error': f'Error al procesar el archivo: {str(e)}'}), 500