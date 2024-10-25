// src/tests/validationTests/ValidatePayService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidatePayService from '../../services/validation/ValidatePayService';

describe('ValidatePayService', () => {
  it('debe devolver true para estados de pago válidos', () => {
    expect(ValidatePayService('pagado')).toBe(true);
    expect(ValidatePayService('completado')).toBe(true);
    expect(ValidatePayService('pendiente')).toBe(true);
  });

  it('debe devolver false para estados de pago no válidos', () => {
    expect(ValidatePayService('cancelado')).toBe(false); // Estado no válido
    expect(ValidatePayService('')).toBe(false); // Cadena vacía
    expect(ValidatePayService('Pagado')).toBe(false); // Sensible a mayúsculas/minúsculas
    expect(ValidatePayService('PAGADO')).toBe(false); // Sensible a mayúsculas/minúsculas
    expect(ValidatePayService(null)).toBe(false); // Valor nulo
    expect(ValidatePayService(undefined)).toBe(false); // Valor indefinido
  });
});
