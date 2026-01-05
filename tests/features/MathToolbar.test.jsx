import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import MathToolbar from '../../src/features/Math/MathToolbar.jsx';

describe('MathToolbar', () => {
  it('invokes onInsert for structure symbol', () => {
    const onInsert = vi.fn();
    render(<MathToolbar onInsert={onInsert} katexLoaded={false} />);
    const btn = screen.getByText('x^a');
    fireEvent.mouseDown(btn); // component listens onMouseDown
    expect(onInsert).toHaveBeenCalledWith('^{}');
  });

  it('switches groups and inserts greek symbol', () => {
    const onInsert = vi.fn();
    render(<MathToolbar onInsert={onInsert} katexLoaded={false} />);
    const greekTab = screen.getByRole('button', { name: 'Greek' });
    fireEvent.click(greekTab);
    const alphaBtn = screen.getByText('α');
    fireEvent.mouseDown(alphaBtn);
    expect(onInsert).toHaveBeenCalledWith('\\alpha');
  });
});
