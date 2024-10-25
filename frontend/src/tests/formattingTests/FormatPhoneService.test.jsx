// src/tests/formattingTests/FormatPhoneService.test.jsx
import { describe, it, expect } from 'vitest';
import FormatPhoneService from '../../services/formatting/FormatPhoneService';

describe('FormatPhoneService', () => {
  it('debe eliminar el prefijo +34 y los espacios', () => {
    expect(FormatPhoneService('+34 747 434 346')).toBe('747434346');
    expect(FormatPhoneService('+34  612345678')).toBe('612345678');
  });

  it('debe mantener el número si no tiene el prefijo +34', () => {
    expect(FormatPhoneService('747434346')).toBe('747434346');
    expect(FormatPhoneService('612 345 678')).toBe('612345678');
  });

  it('debe manejar números con diferentes formatos de espacios', () => {
    expect(FormatPhoneService('+34   747   434   346')).toBe('747434346');
    expect(FormatPhoneService('612  345   678')).toBe('612345678');
  });
});
