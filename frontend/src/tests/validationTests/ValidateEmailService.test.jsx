import { describe, it, expect } from 'vitest';
import ValidateEmailService from '../../services/validation/ValidateEmailService';

describe('ValidateEmailService', () => {
    it('debe devolver true para formatos de correo electrónico válidos', () => {
      expect(ValidateEmailService('nombre@dominio.com')).toBe(true);
      expect(ValidateEmailService('nombre.apellido@dominio.com')).toBe(true);
      expect(ValidateEmailService('nombre-apellido@dominio.com')).toBe(true);
    });
  
    it('debe devolver false para formatos de correo electrónico incorrectos', () => {
      expect(ValidateEmailService('nombre@dominio')).toBe(false); // No termina en . algo
      expect(ValidateEmailService('nombre@.com')).toBe(false);  // Entre el @ y el . no hay nada
      expect(ValidateEmailService('nombre@@dominio.com')).toBe(false);  // Tiene dos @
    });
  });