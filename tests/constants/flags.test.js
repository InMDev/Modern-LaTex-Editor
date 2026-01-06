import { describe, it, expect } from 'vitest';
import { ENABLE_VISUAL_TOPBAR, FEATURE_FLAGS, FUTURE_FEATURE_FLAGS } from '../../src/constants/flags';

describe('constants/flags', () => {
  it('ENABLE_VISUAL_TOPBAR is a boolean', () => {
    expect(typeof ENABLE_VISUAL_TOPBAR).toBe('boolean');
  });

  it('FEATURE_FLAGS is frozen and contains only boolean values', () => {
    expect(Object.isFrozen(FEATURE_FLAGS)).toBe(true);
    for (const [key, value] of Object.entries(FEATURE_FLAGS)) {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('boolean');
    }
  });

  it('FEATURE_FLAGS exposes the expected toolbar keys', () => {
    const expectedKeys = [
      'showUndo',
      'showRedo',
      'showHeading1',
      'showHeading2',
      'showHeading3',
      'showHeading4',
      'showTitle',
      'showBold',
      'showItalic',
      'showUnderline',
      'showAlignLeft',
      'showAlignCenter',
      'showAlignRight',
      'showAlignJustify',
      'showInlineCode',
      'showCodeBlock',
      'showInlineMath',
      'showDisplayMath',
      'showHSpace',
      'showVSpace',
      'showNewPage',
      'showUnorderedList',
      'showOrderedList',
      'showIndent',
      'showOutdent',
      'showLink',
      'showImage',
    ];

    expect(Object.keys(FEATURE_FLAGS).sort()).toEqual(expectedKeys.sort());
  });

  it('FEATURE_FLAGS cannot be mutated at runtime', () => {
    expect(() => {
      // @ts-expect-error - intentional mutation attempt
      FEATURE_FLAGS.showBold = false;
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error - intentional mutation attempt
      FEATURE_FLAGS.newFlag = true;
    }).toThrow(TypeError);
  });

  it('FUTURE_FEATURE_FLAGS is frozen and contains only disabled booleans by default', () => {
    expect(Object.isFrozen(FUTURE_FEATURE_FLAGS)).toBe(true);
    for (const value of Object.values(FUTURE_FEATURE_FLAGS)) {
      expect(typeof value).toBe('boolean');
      expect(value).toBe(false);
    }
  });
});
