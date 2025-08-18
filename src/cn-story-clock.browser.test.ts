import { describe, expect, it } from 'vitest';
import type { CnStoryClock } from './cn-story-clock';

import './cn-story-clock';
import './cn-tick';

describe('cn-story-clock', () => {
  it('should have correct slice colors', async () => {
    document.body.innerHTML = `
      <cn-story-clock value="1">
        <cn-tick label="tick 1" value="0"></cn-tick>
        <cn-tick label="tick 2" value="1"></cn-tick>
      </cn-story-clock>
    `;
    const el = document.body.querySelector<CnStoryClock>('cn-story-clock');
    await customElements.whenDefined('cn-story-clock');
    await el?.updateComplete;

    const slices = el?.shadowRoot?.querySelectorAll('.slice');
    const tickedSlice = slices?.[0];
    const untickedSlice = slices?.[1];

    if (tickedSlice && untickedSlice) {
      const tickedStyle = getComputedStyle(tickedSlice);
      const untickedStyle = getComputedStyle(untickedSlice);

      expect(tickedStyle.fill).toBe('rgb(128, 128, 128)'); // gray
      expect(untickedStyle.fill).toBe('rgb(211, 211, 211)'); // lightgray
    }
  });
});
