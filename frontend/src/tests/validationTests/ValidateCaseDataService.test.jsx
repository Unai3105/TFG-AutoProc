// src/tests/validationTests/ValidateCaseDataService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateCaseDataService from '../../services/validation/ValidateCaseDataService';

describe('ValidateCaseDataService', () => {
  it('debe validar correctamente un caso con todos los campos válidos', () => {
    const caseItem = {
      cliente: 'Ana Rodríguez',
      expediente: 'CIVIL 4527/19',
      letrado: 'Lara Martínez',
      'dado en fecha': '15/03/2021',
      pago: 'completado',
      nig: '2006943220220006153',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: true,
      validData: {
        cliente: 'Ana Rodríguez',
        expediente: 'CIVIL 4527/19',
        letrado: 'Lara Martínez',
        'dado en fecha': '15/03/2021',
        pago: 'completado',
        nig: '2006943220220006153',
      },
    });
  });

  it('debe devolver error cuando falta un campo requerido', () => {
    const caseItem = {
      expediente: 'PENAL 1024/15',
      letrado: 'Jorge Pérez',
      'dado en fecha': '10/07/2020',
      pago: 'pendiente',
      nig: '2006943220210011185',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: false,
      errors: {
        case: caseItem,
        errorDetails: ['El campo "cliente" es obligatorio y no puede estar vacío.'],
      },
    });
  });

  it('debe devolver error cuando el nombre tiene un formato incorrecto', () => {
    const caseItem = {
      cliente: '123 Ana',
      expediente: 'CIVIL 4527/19',
      letrado: 'Lara Martínez',
      'dado en fecha': '15/03/2021',
      pago: 'completado',
      nig: '2006943220220006153',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: false,
      errors: {
        case: caseItem,
        errorDetails: ['El nombre "123 Ana" no es válido.'],
      },
    });
  });

  it('debe devolver error cuando el formato del expediente es incorrecto', () => {
    const caseItem = {
      cliente: 'Ana Rodríguez',
      expediente: '4527-CIVIL',
      letrado: 'Lara Martínez',
      'dado en fecha': '15/03/2021',
      pago: 'completado',
      nig: '2006943220220006153',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: false,
      errors: {
        case: caseItem,
        errorDetails: ['El expediente "4527-CIVIL" no es válido.'],
      },
    });
  });

  it('debe devolver error cuando la fecha tiene un formato incorrecto', () => {
    const caseItem = {
      cliente: 'Ana Rodríguez',
      expediente: 'CIVIL 4527/19',
      letrado: 'Lara Martínez',
      'dado en fecha': '20-20-20',
      pago: 'completado',
      nig: '2006943220220006153',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: false,
      errors: {
        case: caseItem,
        errorDetails: ['La fecha "20-20-20" no es válida.'],
      },
    });
  });

  it('debe devolver dos errores cuando el nombre y la fecha son incorrectos', () => {
    const caseItem = {
      cliente: '123 Ana',
      expediente: 'CIVIL 4527/19',
      letrado: 'Lara Martínez',
      'dado en fecha': '20/20/20',
      pago: 'completado',
      nig: '2006943220220006153',
    };

    const result = ValidateCaseDataService(caseItem);

    expect(result).toEqual({
      success: false,
      errors: {
        case: caseItem,
        errorDetails: [
          'El nombre "123 Ana" no es válido.',
          'La fecha "20/20/20" no es válida.',
        ],
      },
    });
  });
});
