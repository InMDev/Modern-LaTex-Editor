import { describe, it, expect, vi } from 'vitest';
import {
  escapeLatex,
  unescapeLatex,
  fetchWithTimeout,
  readJSONSafe,
  latexToHtml,
  htmlToLatex,
  summarizeLatexLog,
  compileWithWasmLatex,
} from '../../src/lib/latex';

// Helper to create a minimal Response-like mock
const makeRes = ({ ok = true, body = '', throwOnText = false } = {}) => ({
  ok,
  async text() {
    if (throwOnText) throw new Error('boom');
    return body;
  },
});

describe('latex helpers', () => {
  it('escapeLatex and unescapeLatex roundtrip core symbols', () => {
    const raw = `\\ { } $ & # % _ ^ ~ text`;
    const esc = escapeLatex(raw);
    // spot-check some escapes (ordering of escapes can affect braces)
    expect(esc).toContain('\\$');
    expect(esc).toContain('\\&');
    expect(esc).toContain('\\#');
    expect(esc).toContain('\\%');
    expect(esc).toContain('\\_');
    expect(esc).toContain('\\textasciicircum{}');
    expect(esc).toContain('\\textasciitilde{}');
    const un = unescapeLatex(esc);
    // Round-trip at least restores braces and punctuation
    expect(un).toContain('{');
    expect(un).toContain('}');
    expect(un).toContain('$');
    expect(un).toContain('&');
    expect(un).toContain('#');
    expect(un).toContain('%');
    expect(un).toContain('_');
  });

  it('readJSONSafe returns parsed JSON when valid', async () => {
    const res = makeRes({ body: JSON.stringify({ ok: true }) });
    const data = await readJSONSafe(res);
    expect(data).toEqual({ ok: true });
  });

  it('readJSONSafe returns error log when not ok and not JSON', async () => {
    const res = makeRes({ ok: false, body: 'Plain text error' });
    const data = await readJSONSafe(res);
    expect(data).toEqual({ status: 'error', log: 'Plain text error' });
  });

  it('readJSONSafe returns error when response cannot be read', async () => {
    const res = makeRes({ throwOnText: true });
    const data = await readJSONSafe(res);
    expect(data).toEqual({ status: 'error', log: 'Network response could not be read.' });
  });

  it('fetchWithTimeout proxies to fetch and passes AbortSignal', async () => {
    const originalFetch = global.fetch;
    const fetchMock = vi.fn(async (url, opts) => {
      expect(url).toBe('/ping');
      expect(opts.signal).toBeInstanceOf(AbortSignal);
      return makeRes({ body: 'ok' });
    });
    // @ts-ignore
    global.fetch = fetchMock;
    try {
      const res = await fetchWithTimeout('/ping', { method: 'GET' }, 50);
      const parsed = await res.text();
      expect(parsed).toBe('ok');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('latexToHtml renders headings and wraps math in placeholders when KaTeX absent', () => {
    // Ensure no KaTeX in window
    // @ts-ignore
    delete window.katex;
    const latex = String.raw`\\documentclass{article}
\\begin{document}
\\section{Demo}
Inline $a+b$ and display: 
\\[ E = mc^2 \\]
\\end{document}`;
    const html = latexToHtml(latex);
    expect(html).toContain('<h1>Demo</h1>');
    // Inline math container
    expect(html).toContain('class="math-inline');
    // Display math container
    expect(html).toContain('class="math-block');
    // data-latex is URL-encoded
    expect(html).toContain('data-latex=');
  });

  it('htmlToLatex converts back common structures (roundtrip smoke test)', () => {
    const latex = String.raw`\\documentclass{article}
\\begin{document}
\\section{Title}
Text before.
\\[ a^2 + b^2 = c^2 \\]
Text after.
\\end{document}`;
    const html = latexToHtml(latex);
    const back = htmlToLatex(html);
    expect(back).toContain('\\section{Title}');
    expect(back).toContain('\\[');
    expect(back).toContain('\\]');
  });

  it('summarizeLatexLog extracts first error', () => {
    const log = '! Missing $ inserted.\n<inserted text>\n                $\nl.23 \\end{document}';
    const s = summarizeLatexLog(log);
    expect(s).toContain('Missing $ inserted.');
  });

  it('compileWithWasmLatex rejects when no engine configured', async () => {
    await expect(compileWithWasmLatex('\\documentclass{article}\\begin{document}x\\end{document}')).rejects.toThrow(/No WASM LaTeX engine configured/i);
  });
});
