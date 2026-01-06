const USEPACKAGE_RE = /\\usepackage(?:\[[^\]]*\])?\{([^}]*)\}/g;

export const inferRequiredPackages = (latexBody) => {
  const body = String(latexBody || '');
  const required = new Set();
  if (/\\includegraphics\b/.test(body)) required.add('graphicx');
  if (/\\begin\{justify\}|\\justifying\b|\\justify\{/.test(body)) required.add('ragged2e');
  if (/\\href\{|\\url\{|\\hyperref\[/.test(body)) required.add('hyperref');
  if (/\\begin\{minted\}|\\mintinline\b|\\begin\{lstlisting\}|\\lstinline\b/.test(body)) required.add('listings');
  return Array.from(required);
};

export const ensureUsePackagesInPreamble = (preambleWithBeginDoc, packageNames) => {
  const preamble = String(preambleWithBeginDoc || '');
  const wanted = (packageNames || []).map((p) => String(p || '').trim()).filter(Boolean);
  if (!wanted.length) return preamble;

  const existing = new Set();
  let m;
  while ((m = USEPACKAGE_RE.exec(preamble))) {
    const inside = (m[1] || '').split(',').map((s) => s.trim()).filter(Boolean);
    for (const p of inside) existing.add(p);
  }

  const missing = wanted.filter((p) => !existing.has(p));
  if (!missing.length) return preamble;

  const insertPoint = preamble.indexOf('\\begin{document}');
  const insertBlock = missing.map((p) => `\\usepackage{${p}}`).join('\n') + '\n';
  if (insertPoint === -1) {
    return `${preamble.trimEnd()}\n${insertBlock}`;
  }
  return preamble.slice(0, insertPoint) + insertBlock + preamble.slice(insertPoint);
};

export const ensureJustifyWrapperInPreamble = (preambleWithBeginDoc) => {
  // Deprecated: the editor now emits `\\begin{justify}...\\end{justify}` (ragged2e) instead of a custom `\\justify{...}` wrapper.
  return String(preambleWithBeginDoc || '');
};
