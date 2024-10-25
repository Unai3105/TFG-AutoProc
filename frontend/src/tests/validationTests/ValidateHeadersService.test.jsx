// src/tests/validationTests/ValidateHeadersService.test.jsx
import { describe, it, expect } from 'vitest';
import ValidateHeadersService from '../../services/validation/ValidateHeadersService';

describe('ValidateHeadersService', () => {

  const expectedLawyersHeaders = ["name", "email", "phone"];
  const expectedCasesHeaders = ["cliente", "expediente", "letrado", "dado en fecha", "pago", "nig"];

  it('debe devolver éxito cuando todos los encabezados de abogados están presentes', () => {
    const headers = ["NAME", "EMAIL", "PHONE"];
    const result = ValidateHeadersService(headers, expectedLawyersHeaders, expectedCasesHeaders, 'lawyers');
    
    expect(result).toEqual({
      success: true,
      normalizedHeaders: ["name", "email", "phone"]
    });
  });

  it('debe devolver éxito cuando todos los encabezados de casos están presentes', () => {
    const headers = ["Cliente", "ExPedientE", "Letrado", "Dado en Fecha", "Pago", "NIG"];
    const result = ValidateHeadersService(headers, expectedLawyersHeaders, expectedCasesHeaders, 'cases');

    expect(result).toEqual({
      success: true,
      normalizedHeaders: ["cliente", "expediente", "letrado", "dado en fecha", "pago", "nig"]
    });
  });

  it('debe devolver error cuando faltan encabezados críticos de abogados', () => {
    const headers = ["name", "phone"];
    const result = ValidateHeadersService(headers, expectedLawyersHeaders, expectedCasesHeaders, 'lawyers');

    expect(result).toEqual({
      success: false,
      error: {
        message: 'Falta algún campo crítico en el documento.',
        missingHeaders: ["email"]
      }
    });
  });

  it('debe devolver error cuando faltan encabezados críticos de casos', () => {
    const headers = ["Cliente", "ExPedientE", "NIG"];
    const result = ValidateHeadersService(headers, expectedLawyersHeaders, expectedCasesHeaders, 'cases');

    expect(result).toEqual({
      success: false,
      error: {
        message: 'Falta algún campo crítico en el documento.',
        missingHeaders: ["letrado", "dado en fecha", "pago"]
      }
    });
  });
});
