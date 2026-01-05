import { describe, it, expect } from 'vitest';
import { MATH_GROUPS, DEFAULT_LATEX } from '../../src/constants/math';

describe('constants/math', () => {
  it('DEFAULT_LATEX contains a minimal document', () => {
    expect(DEFAULT_LATEX).toContain('\\begin{document}');
    expect(DEFAULT_LATEX).toContain('\\end{document}');
  });

  it('MATH_GROUPS exposes expected groups and sample symbols', () => {
    expect(MATH_GROUPS).toHaveProperty('structures');
    expect(MATH_GROUPS).toHaveProperty('multidim');
    expect(MATH_GROUPS.structures.symbols.find(s => s.cmd === '\\frac{}{}')).toBeTruthy();
    expect(MATH_GROUPS.greek.symbols.find(s => s.cmd === '\\alpha')).toBeTruthy();
  });
});
