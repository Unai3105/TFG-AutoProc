import { describe, it, expect } from 'vitest';
import ValidateDateService from '../../services/validation/ValidateDateService';

describe('ValidateDateService', () => {
  it('debe devolver true y formatear la fecha cuando el formato es dd/MM/yyyy', () => {
    const result = ValidateDateService('15/03/2021');
    expect(result).toEqual({ isValid: true, formattedDate: '15/03/2021' });
  });

  it('debe devolver true y formatear la fecha cuando el formato es dd-MM-yyyy', () => {
    const result = ValidateDateService('15-03-2021');
    expect(result).toEqual({ isValid: true, formattedDate: '15/03/2021' });
  });

  it('debe devolver true y formatear la fecha cuando el formato es yyyy-MM-dd', () => {
    const result = ValidateDateService('2021-03-15');
    expect(result).toEqual({ isValid: true, formattedDate: '15/03/2021' });
  });

  it('debe devolver true y formatear la fecha cuando el formato es yyyy/MM/dd', () => {
    const result = ValidateDateService('2021/03/15');
    expect(result).toEqual({ isValid: true, formattedDate: '15/03/2021' });
  });

  it('debe devolver false cuando el formato es incorrecto', () => {
    const result = ValidateDateService('15/Mar/2021');
    expect(result).toEqual({ isValid: false });
  });

  it('debe devolver false cuando la fecha es inválida', () => {
    const result = ValidateDateService('32/03/2021'); // Día no válido
    expect(result).toEqual({ isValid: false });
  });
});
