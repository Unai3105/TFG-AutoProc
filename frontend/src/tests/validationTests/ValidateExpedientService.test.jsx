// src/tests/validationTests/ValidateExpedientService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateExpedientService from '../../services/validation/ValidateExpedientService';

describe('ValidateExpedientService', () => {
  it('debe devolver true para formatos de expediente válidos', () => {
    expect(ValidateExpedientService('PENAL 1024/15')).toBe(true); // Letras seguidas de números con barra
    expect(ValidateExpedientService('CIVIL 2048/20')).toBe(true); // Letras y números en otro tipo
    expect(ValidateExpedientService('MERCA 450/22')).toBe(true); // Ejemplo de expediente con otro nombre
    expect(ValidateExpedientService('LABOR 9084/18')).toBe(true); // Otro caso
  });

  it('debe devolver false para formatos de expediente incorrectos', () => {
    expect(ValidateExpedientService('1024/15')).toBe(false); // Sin categoría al inicio
    expect(ValidateExpedientService('PENAL 1024/')).toBe(false); // Barra al final sin número de año
    expect(ValidateExpedientService('PENAL /15')).toBe(false); // Sin número antes de la barra
    expect(ValidateExpedientService('penal 1024/15')).toBe(false); // Sin mayúsculas
    expect(ValidateExpedientService('PENAL 1024 15')).toBe(false); // Sin barra entre números
  });
});
