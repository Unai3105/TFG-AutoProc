const ValidateNameService = (name) => {
    const nameRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*(?:\s[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+(?:[-'][A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)*)*$/;
    return nameRegex.test(name);
}

export default ValidateNameService