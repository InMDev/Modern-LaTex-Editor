import { describe, it, expect } from 'vitest';
import { ENABLE_VISUAL_TOPBAR, FEATURE_FLAGS, FUTURE_FEATURE_FLAGS } from '../../src/constants/flags';

describe('constants/flags', () => {
  it('ENABLE_VISUAL_TOPBAR is a boolean', () => {
    expect(typeof ENABLE_VISUAL_TOPBAR).toBe('boolean');
  });

  it('FEATURE_FLAGS exposes expected keys', () => {
    expect(FEATURE_FLAGS).toHaveProperty('showBold');
    expect(FEATURE_FLAGS).toHaveProperty('showInlineMath');
    expect(FEATURE_FLAGS).toHaveProperty('showDisplayMath');
  });

  it('FUTURE_FEATURE_FLAGS is an object of booleans', () => {
    const allBooleans = Object.values(FUTURE_FEATURE_FLAGS).every(v => typeof v === 'boolean');
    expect(allBooleans).toBe(true);
  });
});
