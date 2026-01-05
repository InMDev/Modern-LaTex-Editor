// Math-related constants for the editor

export const MATH_GROUPS = {
  structures: {
    label: "Structures",
    symbols: [
      { label: "x^a",  desc: "Superscript", cmd: "^{}", preview: "x^{a}" },
      { label: "x_a",  desc: "Subscript",   cmd: "_{}", preview: "x_{a}" },
      { label: "a/b",  desc: "Fraction",    cmd: "\\frac{}{}", preview: "\\frac{a}{b}" },
      { label: "√",    desc: "Radical",     cmd: "\\sqrt{}", preview: "\\sqrt{a}" },
      { label: "∑",    desc: "Summation",   cmd: "\\sum_{}^{}", preview: "\\sum_{i=1}^{n}" },
      { label: "∫",    desc: "Integral",    cmd: "\\int_{}^{}", preview: "\\int_{a}^{b}" },
      { label: "lim",  desc: "Limit",       cmd: "\\lim_{ \\to }", preview: "\\lim_{x\\to 0}" },
      { label: "( )",  desc: "Parens",      cmd: "\\left(  \\right)", preview: "\\left( x \\right)" },
      { label: "[ ]",  desc: "Brackets",    cmd: "\\left[  \\right]", preview: "\\left[ x \\right]" },
    ]
  },
  multidim: {
    label: "Multi dimension",
    symbols: [
      { label: "vec",   desc: "Vector",          cmd: "\\vec{}", preview: "\\vec{x}" },
      { label: "[ : ]", desc: "Matrix [ ]",      cmd: "\\begin{bmatrix} {} & {} \\\\ {} & {} \\end{bmatrix}", preview: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}" },
      { label: "( : )", desc: "Matrix ( )",      cmd: "\\begin{pmatrix} {} & {} \\\\ {} & {} \\end{pmatrix}", preview: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
      { label: "cases", desc: "Piecewise Func",  cmd: "\\begin{cases} {} & {} \\\\ {} & {} \\end{cases}", preview: "\\begin{cases} a, & x>0 \\\\ b, & x\\le 0 \\end{cases}" },
      { label: "det",   desc: "Determinant",     cmd: "\\begin{vmatrix} {} & {} \\\\ {} & {} \\end{vmatrix}", preview: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}" },
    ]
  },
  greek: {
    label: "Greek",
    symbols: [
      { char: "α", cmd: "\\alpha" }, { char: "β", cmd: "\\beta" }, { char: "γ", cmd: "\\gamma" },
      { char: "δ", cmd: "\\delta" }, { char: "ε", cmd: "\\epsilon" }, { char: "θ", cmd: "\\theta" },
      { char: "λ", cmd: "\\lambda" }, { char: "μ", cmd: "\\mu" }, { char: "π", cmd: "\\pi" },
      { char: "σ", cmd: "\\sigma" }, { char: "τ", cmd: "\\tau" }, { char: "φ", cmd: "\\phi" },
      { char: "ω", cmd: "\\omega" }, { char: "Δ", cmd: "\\Delta" }, { char: "Ω", cmd: "\\Omega" }
    ]
  },
  operators: {
    label: "Operators",
    symbols: [
      { char: "+", cmd: "+" }, { char: "-", cmd: "-" }, { char: "×", cmd: "\\times" },
      { char: "÷", cmd: "\\div" }, { char: "±", cmd: "\\pm" }, { char: "∑", cmd: "\\sum" },
      { char: "∫", cmd: "\\int" }, { char: "∂", cmd: "\\partial" }, { char: "√", cmd: "\\sqrt{}" },
      { char: "∞", cmd: "\\infty" }, { char: "lim", cmd: "\\lim" }, { char: "·", cmd: "\\cdot" }
    ]
  },
  relations: {
    label: "Relations",
    symbols: [
      { char: "=", cmd: "=" }, { char: "≠", cmd: "\\neq" }, { char: "≈", cmd: "\\approx" },
      { char: "<", cmd: "<" }, { char: ">", cmd: ">" }, { char: "≤", cmd: "\\leq" },
      { char: "≥", cmd: "\\geq" }, { char: "∈", cmd: "\\in" }, { char: "⊂", cmd: "\\subset" }
    ]
  },
  arrows: {
    label: "Arrows",
    symbols: [
      { char: "→", cmd: "\\rightarrow" }, { char: "←", cmd: "\\leftarrow" },
      { char: "⇒", cmd: "\\Rightarrow" }, { char: "⇔", cmd: "\\Leftrightarrow" }
    ]
  }
};

export const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{hyperref}

\\begin{document}

\\section{Rich Text and Math Demo}

Welcome to \\textbf{Modern LaTex}. Click the equation below to edit it!

\\subsection{Math Equations}
Here is a display equation:

\\[ E = \\frac{1}{2}mv^2 \\]

And here is an inline equation: $ a^2 + b^2 = c^2 $.

\\end{document}`;
