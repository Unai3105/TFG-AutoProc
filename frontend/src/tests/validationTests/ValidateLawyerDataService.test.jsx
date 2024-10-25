// src/tests/validationTests/ValidateLawyerDataService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateLawyerDataService from '../../services/validation/ValidateLawyerDataService';

describe('ValidateLawyerDataService', () => {
  it('debe validar correctamente un abogado con todos los campos válidos', () => {
    const lawyerItem = {
      name: 'Ana López',
      email: 'ana.lopez@correo.com',
      phone: '+34 612 345 678'
    };
    const result = ValidateLawyerDataService(lawyerItem);

    expect(result).toEqual({
      success: true,
      validData: {
        name: 'Ana López',
        email: 'ana.lopez@correo.com',
        phone: '612345678'
      }
    });
  });
  
  it('debe devolver error cuando el nombre tiene un formato incorrecto', () => {
    const lawyerItem = {
      name: '123 Ana',
      email: 'ana.lopez@correo.com',
      phone: '+34 612 345 678'
    };
    const result = ValidateLawyerDataService(lawyerItem);

    expect(result).toEqual({
      success: false,
      errors: {
        lawyer: lawyerItem,
        errorDetails: ['El nombre "123 Ana" no es válido.']
      }
    });
  });

  it('debe devolver error cuando el email tiene un formato incorrecto', () => {
    const lawyerItem = {
      name: 'Ana López',
      email: 'ana.lopez@correo',
      phone: '+34 612 345 678'
    };
    const result = ValidateLawyerDataService(lawyerItem);

    expect(result).toEqual({
      success: false,
      errors: {
        lawyer: lawyerItem,
        errorDetails: ['El email "ana.lopez@correo" no es válido.']
      }
    });
  });

  it('debe devolver error cuando el número de teléfono tiene un formato incorrecto', () => {
    const lawyerItem = {
      name: 'Ana López',
      email: 'ana.lopez@correo.com',
      phone: '123456'
    };
    const result = ValidateLawyerDataService(lawyerItem);

    expect(result).toEqual({
      success: false,
      errors: {
        lawyer: lawyerItem,
        errorDetails: ['El número de teléfono "123456" no es válido.']
      }
    });
  });

  it('debe devolver dos errores cuando dos campos son incorrectos', () => {
    const lawyerItem = {
      name: '123 Ana',
      email: 'ana.lopez@correo',
      phone: '+34 612 345 678'
    };
    const result = ValidateLawyerDataService(lawyerItem);

    expect(result).toEqual({
      success: false,
      errors: {
        lawyer: lawyerItem,
        errorDetails: [
          'El nombre "123 Ana" no es válido.',
          'El email "ana.lopez@correo" no es válido.'
        ]
      }
    });
  });
});
