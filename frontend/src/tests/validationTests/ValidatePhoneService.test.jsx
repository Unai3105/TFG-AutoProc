// src/tests/validationTests/ValidatePhoneService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidatePhoneService from '../../services/validation/ValidatePhoneService';

describe('ValidatePhoneService', () => {
  it('debe devolver true para números de teléfono válidos', () => {
    expect(ValidatePhoneService('612345678')).toBe(true); // Sin prefijo +34
    expect(ValidatePhoneService('+34 612345678')).toBe(true); // Con prefijo +34
    expect(ValidatePhoneService('712 345 678')).toBe(true); // Formato con espacios
  });

  it('debe devolver false para números de teléfono incorrectos', () => {
    expect(ValidatePhoneService('123456789')).toBe(false); // No empieza con 6, 7, 8 o 9
    expect(ValidatePhoneService('61234567')).toBe(false); // Menos de 9 dígitos
    expect(ValidatePhoneService('+34612345678A')).toBe(false); // Contiene una letra al final
    expect(ValidatePhoneService('6123 456 789 0')).toBe(false); // Más de 9 dígitos
    expect(ValidatePhoneService('2612345678')).toBe(false); // Empieza por 2
  });
});
