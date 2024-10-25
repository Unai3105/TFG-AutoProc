// src/tests/validationTests/ValidateNIGService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateNIGService from '../../services/validation/ValidateNIGService';

describe('ValidateNIGService', () => {
  it('debe devolver true para un NIG de 19 dígitos', () => {
    expect(ValidateNIGService('1234567890123456789')).toBe(true);
    expect(ValidateNIGService('9876543210123456789')).toBe(true);
    expect(ValidateNIGService('2006943220220006153')).toBe(true);
  });

  it('debe devolver false para NIGs incorrectos', () => {
    expect(ValidateNIGService('123456789012378')).toBe(false); // Longitud menor a 19
    expect(ValidateNIGService('12345678901234562137890')).toBe(false); // Longitud mayor a 19
    expect(ValidateNIGService('hsgggdt273jshhdy167')).toBe(false); // Contiene letra
    expect(ValidateNIGService('12345678 0123456789')).toBe(false); // Contiene espacio
  });
});
