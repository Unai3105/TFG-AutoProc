const ValidatePayService = (pago) => {
    return pago === 'pagado' || pago === 'completado' || pago === 'pendiente';
}

export default ValidatePayService