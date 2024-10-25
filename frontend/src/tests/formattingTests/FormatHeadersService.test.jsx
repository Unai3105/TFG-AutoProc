// src/tests/formattingTests/FormatHeadersService.test.jsx
import { describe, it, expect } from 'vitest';
import FormatHeadersService from '../../services/formatting/FormatHeadersService';

describe('FormatHeadersService', () => {

  const normalizedHeadersLawyers = ["email", "name", "phone"];
  const normalizedHeadersCases = ["cliente", "expediente", "letrado", "dado en fecha", "pago", "nig"];

  it('debe normalizar y asignar correctamente los valores de los abogados', () => {
    const item = {
      "EMAIL": "miklorres@gmail.com",
      "name": "Jorge Pérez",
      "phone": "+34 6 214 72818"
    };

    const result = FormatHeadersService(item, normalizedHeadersLawyers);
    const expected = {
      "email": "miklorres@gmail.com",
      "name": "Jorge Pérez",
      "phone": "+34 6 214 72818"
    };

    expect(result).toEqual(expected);
  });

  it('debe omitir las claves que no coincidan con los encabezados esperados', () => {
    const item = {
      "EMAIL": "miklorres@gmail.com",
      "name": "Lara Martínez",
      "PhONE": "732 671 823",
      "Edad": 45
    };

    const result = FormatHeadersService(item, normalizedHeadersLawyers);
    const expected = {
      "email": "miklorres@gmail.com",
      "name": "Lara Martínez",
      "phone": "732 671 823"
    };

    expect(result).toEqual(expected);
  });

  it('debe normalizar y asignar correctamente los valores de los casos judiciales', () => {
    const item = {
      "cliente": "Ana Rodríguez",
      "ExPedientE": "CIVIL 4527/19",
      "letrado": "LaRa MARtínez",
      "dado en fecha": "15/03/2021",
      "pago": "completado",
      "NIG": "2006943220220006153"
    };

    const result = FormatHeadersService(item, normalizedHeadersCases);
    const expected = {
      "cliente": "Ana Rodríguez",
      "expediente": "CIVIL 4527/19",
      "letrado": "LaRa MARtínez",
      "dado en fecha": "15/03/2021",
      "pago": "completado",
      "nig": "2006943220220006153"
    };

    expect(result).toEqual(expected);
  });
});
