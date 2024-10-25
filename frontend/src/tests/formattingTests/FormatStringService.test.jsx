// src/tests/formattingTests/FormatStringService.test.jsx
import { describe, it, expect } from 'vitest';
import FormatStringService from '../../services/formatting/FormatStringService';

describe('FormatStringService', () => {
  it('debe eliminar acentos y convertir a minúsculas', () => {
    expect(FormatStringService('Árbol')).toBe('arbol');
    expect(FormatStringService('MÚSICA')).toBe('musica');
    expect(FormatStringService('PÍNGÜINO')).toBe('pinguino');
  });
});
