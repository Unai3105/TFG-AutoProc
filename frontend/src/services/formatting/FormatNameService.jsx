const FormatNameService = (name) => {
    return name
    // Convierte todo el nombre a minúsculas
    .toLowerCase()
    // Elimina espacios en blanco al inicio y al final
    .trim()
    // Reemplaza múltiples espacios en uno solo
    .replace(/\s+/g, ' ')
    // Dividide el nombre en palabras
    .split(' ')
    // Pone en mayúscula la primera letra de cada palabra
    .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    // Vuelve a unir las palabras en una sola cadena
    .join(' ');
}

export default FormatNameService