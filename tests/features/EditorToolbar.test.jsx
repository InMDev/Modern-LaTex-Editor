import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import EditorToolbar from '../../src/features/Toolbar/EditorToolbar.jsx';

const baseFlags = {
  showUndo: false,
  showRedo: false,
  showHeading1: false,
  showHeading2: false,
  showHeading3: false,
  showHeading4: false,
  showTitle: false,
  showBold: false,
  showItalic: false,
  showUnderline: false,
  showAlignLeft: false,
  showAlignCenter: false,
  showAlignRight: false,
  showAlignJustify: false,
  showInlineCode: false,
  showCodeBlock: false,
  showInlineMath: false,
  showDisplayMath: false,
  showUnorderedList: false,
  showOrderedList: false,
  showIndent: false,
  showOutdent: false,
  showLink: false,
  showImage: false,
};

describe('EditorToolbar', () => {
  it('does not render when topbar disabled', () => {
    const { container } = render(
      <EditorToolbar ff={baseFlags} enableVisualTopbar={false} isMathActive={false} katexLoaded={false} actions={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('invokes execCmd for Bold', () => {
    const ff = { ...baseFlags, showBold: true };
    const execCmd = vi.fn();
    render(
      <EditorToolbar ff={ff} enableVisualTopbar={true} isMathActive={false} katexLoaded={false} actions={{ execCmd }} />
    );
    const btn = screen.getByTitle('Bold');
    fireEvent.mouseDown(btn);
    expect(execCmd).toHaveBeenCalledWith('bold');
  });

  it('invokes insertMathElement for inline math', () => {
    const ff = { ...baseFlags, showInlineMath: true };
    const insertMathElement = vi.fn();
    render(
      <EditorToolbar ff={ff} enableVisualTopbar={true} isMathActive={false} katexLoaded={false} actions={{ insertMathElement, execCmd: vi.fn() }} />
    );
    const btn = screen.getByTitle('Inline Math ($...$)');
    fireEvent.mouseDown(btn);
    expect(insertMathElement).toHaveBeenCalledWith(false);
  });
});
