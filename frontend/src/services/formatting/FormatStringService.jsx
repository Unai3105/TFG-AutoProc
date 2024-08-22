const FormatStringService = (str) => {
    return str
    // Descompone los caracteres acentuados en sus partes básicas
    .normalize('NFD')
    // Elimina los caracteres diacríticos (acentos, tildes, etc.)
    .replace(/[\u0300-\u036f]/g, '')
    // Convierte todo el string a minúsculas
    .toLowerCase();
}

export default FormatStringService