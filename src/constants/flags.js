// Global feature flags for the editor UI
// Toggle these to enable/disable functionality without changing component code.

// Master switch for the visual editor top bar.
// If false, all toolbar buttons are hidden.
export const ENABLE_VISUAL_TOPBAR = true;

// Per-button visibility flags for the visual editor toolbar
export const FEATURE_FLAGS = Object.freeze({
	// History
	showUndo: true,
	showRedo: true,

	// Headings
	showHeading1: true,
	showHeading2: true,
	showHeading3: true,
	showHeading4: true,
	showTitle: true,

	// Text styles
	showBold: true,
	showItalic: true,
	showUnderline: true,

	// Alignment
	showAlignLeft: true,
	showAlignCenter: true,
	showAlignRight: true,
	showAlignJustify: true,

	// Code / Math
	showInlineCode: true,
	showCodeBlock: true,
	showInlineMath: true,
	showDisplayMath: true,

	// Manual spacing
	showHSpace: true,
	showVSpace: true,
	showNewPage: true,

	// Lists
	showUnorderedList: true,
	showOrderedList: true,

	// Indentation
	showIndent: true,
	showOutdent: true,

	// Links / Media
	showLink: true,
	showImage: true,
});

// Placeholder flags for future features (default: disabled)
// Each flag corresponds to a planned capability; flip to true when implemented.
export const FUTURE_FEATURE_FLAGS = Object.freeze({
	// Formatting
	enableBasicTextStyling: false,         // \bf, \it, \tt, \em
	enableFontSizing: false,               // \tiny ... \Huge
	enableManualSpacing: false,            // \hspace, \vspace, \newpage
	enableAccents: false,                  // \", \^, \c, etc.

	// Packages / Setup
	enablePageLayoutSetup: false,          // \usepackage{geometry}
	enableImageSupport: false,             // \usepackage{graphicx} + \includegraphics
	enableMathPowerTrio: false,            // \usepackage{amsmath,amssymb,amsfonts}
	enableClickableLinks: false,           // \usepackage{hyperref}
	enableProTableStyling: false,          // \usepackage{booktabs}
	enableBiblioManagement: false,         // \usepackage{biblatex}
	enableCodeBlockPro: false,             // \usepackage{minted}
	enableScientificUnits: false,          // \usepackage{siunitx}
	enableSmartRefs: false,                // \usepackage{cleveref}

	// Export / Tools
	enableExportPDF: false,
	enableExportTexZip: false,
	enableLatexLinter: false,              // Cleanup / formatting assistance

	// Blocks / Lists
	enableBulletedList: false,             // itemize + \item
	enableNumberedList: false,             // enumerate + \item
	enableBasicTables: false,              // tabular + \hline
	enableQuoteBlock: false,               // quote / quotation env
	enableCalloutBox: false,               // \fbox, \framebox
	enableDividers: false,                 // \hrulefill
	enableDescriptionLists: false,         // description env
	enableCheckboxes: false,               // \Box symbol usage
	enableColumnLayouts: false,            // minipage
	enableLegacyPictures: false,           // picture env
	enableTabbingStops: false,             // tabbing env

	// Inline / Code
	enableInlineCode: false,               // inline \minted or \texttt proxy

	// Generators
	enableTableOfContents: false,          // \tableofcontents
});
