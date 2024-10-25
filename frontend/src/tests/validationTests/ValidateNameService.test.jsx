// src/tests/validationTests/ValidateNameService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateNameService from '../../services/validation/ValidateNameService';

describe('ValidateNameService', () => {
  it('debe devolver true para nombres válidos', () => {
    expect(ValidateNameService('Juan Pérez')).toBe(true); // Nombre simple con espacio y tilde
    expect(ValidateNameService('Ana María López-García')).toBe(true); // Nombres compuestos y apellido compuesto con guión
    expect(ValidateNameService("O'Connor")).toBe(true); // Apóstrofe en nombre
    expect(ValidateNameService('José Luis')).toBe(true); // Nombre compuesto con tilde
  });

  it('debe devolver false para nombres inválidos', () => {
    expect(ValidateNameService('1234')).toBe(false); // Solo números
    expect(ValidateNameService('Juan_Pérez')).toBe(false); // Guión bajo no permitido
    expect(ValidateNameService('Juan@Pérez')).toBe(false); // Símbolo no permitido
    expect(ValidateNameService('')).toBe(false); // Cadena vacía
    expect(ValidateNameService('  ')).toBe(false); // Solo espacios
    expect(ValidateNameService('Juan Pérez!!')).toBe(false); // Caracteres especiales no permitidos
  });
});
