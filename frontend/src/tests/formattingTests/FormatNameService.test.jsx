// src/tests/formattingTests/FormatNameService.test.jsx
import { describe, it, expect } from 'vitest';
import FormatNameService from '../../services/formatting/FormatNameService';

describe('FormatNameService', () => {
  it('debe formatear correctamente los nombres', () => {
    expect(FormatNameService('juan perez')).toBe('Juan Perez');
    expect(FormatNameService('MARIA GARCIA')).toBe('Maria Garcia');
    expect(FormatNameService('josé luis o\'connor')).toBe('José Luis O\'connor');
    expect(FormatNameService('   juan   perez  ')).toBe('Juan Perez');
    expect(FormatNameService('ana-maria')).toBe('Ana-maria');
  });
});
