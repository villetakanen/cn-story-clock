import { describe, expect, it } from 'vitest';

import './cn-tick';

describe('cn-tick', () => {
  it('should be visually hidden', async () => {
    document.body.innerHTML = '<cn-tick></cn-tick>';
    const el = document.body.querySelector('cn-tick');
    await customElements.whenDefined('cn-tick');
    expect(el).not.toBeNull();
    if (el) {
      const style = getComputedStyle(el);
      expect(style.display).toBe('none');
    }
  });
});
