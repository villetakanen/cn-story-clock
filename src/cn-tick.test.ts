import { describe, expect, it } from 'vitest';
import type { CnTick } from './cn-tick';

import './cn-tick';

describe('cn-tick', () => {
  it('should render', () => {
    document.body.innerHTML = '<cn-tick></cn-tick>';
    const el = document.body.querySelector('cn-tick');
    expect(el).not.toBeNull();
  });

  it('should have default properties', async () => {
    document.body.innerHTML = '<cn-tick></cn-tick>';
    const el = document.body.querySelector<CnTick>('cn-tick');
    await customElements.whenDefined('cn-tick');
    expect(el?.label).toBe('');
    expect(el?.value).toBe('');
    expect(el?.size).toBe(1);
  });

  it('should reflect properties to attributes', async () => {
    document.body.innerHTML =
      '<cn-tick label="test label" value="test value" size="2"></cn-tick>';
    const el = document.body.querySelector<CnTick>('cn-tick');
    await customElements.whenDefined('cn-tick');
    expect(el?.getAttribute('label')).toBe('test label');
    expect(el?.getAttribute('value')).toBe('test value');
    expect(el?.getAttribute('size')).toBe('2');
  });
});
