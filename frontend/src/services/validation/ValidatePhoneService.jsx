const ValidatePhoneService = (phone) => {
    const phoneRegex = /^(?:\+34\s?)?((?:[89]\s?[1-8]\s?(\d\s?){7})|(?:[67]\s?(\d\s?){8}))$/;
    return phoneRegex.test(phone);
}

export default ValidatePhoneService;