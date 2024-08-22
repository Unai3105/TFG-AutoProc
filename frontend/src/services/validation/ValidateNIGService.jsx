const ValidateNIGService = (nig) => {
    const nigRegex = /^\d{19}$/;
    return nigRegex.test(nig);
}

export default ValidateNIGService