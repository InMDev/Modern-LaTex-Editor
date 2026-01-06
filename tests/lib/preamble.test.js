import { describe, it, expect } from 'vitest';
import {
  inferRequiredPackages,
  ensureUsePackagesInPreamble,
  ensureJustifyWrapperInPreamble,
} from '../../src/lib/preamble';

describe('preamble helpers', () => {
  it('inferRequiredPackages returns an empty array when nothing is detected', () => {
    expect(inferRequiredPackages(null)).toEqual([]);
    expect(inferRequiredPackages('')).toEqual([]);
  });

  it('inferRequiredPackages detects packages implied by body content', () => {
    const body = String.raw`
\\includegraphics{a.png}
\\begin{justify}x\\end{justify}
\\href{https://example.com}{x}
\\begin{minted}{js}x\\end{minted}
`;
    expect(inferRequiredPackages(body).sort()).toEqual(['graphicx', 'hyperref', 'listings', 'ragged2e'].sort());
  });

  it('ensureUsePackagesInPreamble is a no-op when no packages are wanted', () => {
    expect(ensureUsePackagesInPreamble('\\begin{document}\n', [])).toBe('\\begin{document}\n');
    expect(ensureUsePackagesInPreamble('\\begin{document}\n', null)).toBe('\\begin{document}\n');
  });

  it('ensureUsePackagesInPreamble trims and filters invalid package names', () => {
    const preamble = '\\usepackage{}\n\\begin{document}\n';
    const out = ensureUsePackagesInPreamble(preamble, [null, '', '  ', 'listings']);
    expect(out).toContain('\\usepackage{listings}\n');
  });

  it('ensureUsePackagesInPreamble works with empty/null preambles', () => {
    const out = ensureUsePackagesInPreamble(null, ['listings']);
    expect(out).toContain('\\usepackage{listings}\n');
  });

  it('ensureUsePackagesInPreamble inserts missing packages before \\begin{document}', () => {
    const preamble = String.raw`\\documentclass{article}
\\usepackage{graphicx, hyperref}
\\begin{document}
X`;

    const out = ensureUsePackagesInPreamble(preamble, ['graphicx', 'listings', ' ragged2e ']);
    expect(out).toContain('\\usepackage{listings}');
    expect(out).toContain('\\usepackage{ragged2e}');
    expect(out.indexOf('\\usepackage{listings}')).toBeLessThan(out.indexOf('\\begin{document}'));
  });

  it('ensureUsePackagesInPreamble is a no-op when all requested packages already exist', () => {
    const preamble = String.raw`\\documentclass{article}
\\usepackage{graphicx, hyperref}
\\begin{document}
X`;
    const out = ensureUsePackagesInPreamble(preamble, ['graphicx', 'hyperref']);
    expect(out).toBe(preamble);
  });

  it('ensureUsePackagesInPreamble appends when \\begin{document} is absent', () => {
    const preamble = '\\documentclass{article}\n';
    const out = ensureUsePackagesInPreamble(preamble, ['listings']);
    expect(out).toContain('\\usepackage{listings}\n');
  });

  it('ensureJustifyWrapperInPreamble is a no-op (deprecated)', () => {
    const preamble = String.raw`\\documentclass{article}
\\begin{document}
X`;
    expect(ensureJustifyWrapperInPreamble(preamble)).toBe(preamble);
  });

  it('ensureJustifyWrapperInPreamble returns empty string for empty/null input', () => {
    expect(ensureJustifyWrapperInPreamble('')).toBe('');
    expect(ensureJustifyWrapperInPreamble(null)).toBe('');
  });
});
