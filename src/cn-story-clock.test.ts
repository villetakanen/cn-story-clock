import { describe, expect, it } from 'vitest';
import type { CnStoryClock } from './cn-story-clock';

import './cn-story-clock';
import './cn-tick';

describe('cn-story-clock', () => {
  it('should render', () => {
    document.body.innerHTML = '<cn-story-clock></cn-story-clock>';
    const el = document.body.querySelector('cn-story-clock');
    expect(el).not.toBeNull();
  });

  it('should have default properties', async () => {
    document.body.innerHTML = '<cn-story-clock></cn-story-clock>';
    const el = document.body.querySelector<CnStoryClock>('cn-story-clock');
    await customElements.whenDefined('cn-story-clock');
    expect(el?.name).toBe('A Clock');
    expect(el?.value).toBe(2);
    expect(el?.disabled).toBe(false);
    expect(el?.required).toBe(false);
    expect(el?.view).toBe(false);
  });

  it('should render slices', async () => {
    document.body.innerHTML = `
      <cn-story-clock value="0">
        <cn-tick label="tick 1" value="0"></cn-tick>
        <cn-tick label="tick 2" value="1"></cn-tick>
      </cn-story-clock>
    `;
    const el = document.body.querySelector<CnStoryClock>('cn-story-clock');
    await customElements.whenDefined('cn-story-clock');
    await el?.updateComplete;
    const slices = el?.shadowRoot?.querySelectorAll('.slice');
    expect(slices?.length).toBe(2);
  });

  it('should handle click', async () => {
    document.body.innerHTML = `
      <cn-story-clock>
        <cn-tick label="tick 1" value="0"></cn-tick>
        <cn-tick label="tick 2" value="1"></cn-tick>
      </cn-story-clock>
    `;
    const el = document.body.querySelector<CnStoryClock>('cn-story-clock');
    await customElements.whenDefined('cn-story-clock');
    el.value = 0;
    await el?.updateComplete;

    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await el?.updateComplete;
    expect(el?.value).toBe(1);
  });

  it('should handle keydown', async () => {
    document.body.innerHTML = `
      <cn-story-clock>
        <cn-tick label="tick 1" value="0"></cn-tick>
        <cn-tick label="tick 2" value="1"></cn-tick>
      </cn-story-clock>
    `;
    const el = document.body.querySelector<CnStoryClock>('cn-story-clock');
    await customElements.whenDefined('cn-story-clock');
    el.value = 0;
    await el?.updateComplete;

    el?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await el?.updateComplete;
    expect(el?.value).toBe(1);
  });
});
