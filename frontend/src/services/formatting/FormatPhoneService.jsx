const FormatPhoneService = (phone) => {
    return phone.replace(/^\+34\s?/, '').replace(/\s+/g, '');
}

export default FormatPhoneService