// cn-tick.ts
import { LitElement, type PropertyValues, css, html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CnTick } from './cn-tick';
import './tokens.css';

@customElement('cn-story-clock')
export class CnStoryClock extends LitElement {
  @property({ type: String, reflect: true }) name = 'A Clock';
  @property({ type: Number, reflect: true }) value = 2;

  // These two fields are for form-interaction
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  // The element supports two modes, "view" and "control". By default, it is in "control" mode.
  // ---
  // View makes the element read-only, but does not disable it.
  @property({ type: Boolean, reflect: true }) view = false;

  // The tick list used a as a helper to render and interact with the ticks
  private _ticks = new Array<CnTick>();

  get ticks() {
    return this._ticks;
  }

  set ticks(value) {
    this._ticks = value;
    this.requestUpdate();
  }

  _onSlotchange() {
    console.log('cn-story-clock _onSlotchange called', this.name);
    const ticks = this.querySelectorAll<CnTick>('cn-tick');
    this.ticks = Array.from(ticks);
    this.requestUpdate();
  }

  static styles = css`
    :host {
      display: inline-block;
      user-select: none;
    }
    .clock {
      width: 100px; /* Adjust size as needed */
      height: 100px;
      position: relative;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .slice {
      fill: var(--cn-story-clock-slice-color, lightgray);
      stroke: var(--cn-story-clock-border-color, darkgray);
      stroke-width: var(--cn-story-clock-slice-border-width, 2px); 
    }
    .slice.ticked {
      fill: var(--cn-story-clock-tick-color, gray);
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    console.log('cn-story-clock connectedCallback called'); // Add this line

    const ticks = this.querySelectorAll<CnTick>('cn-tick');
    this.ticks = Array.from(ticks);

    // Add event listeners to the host element (this)
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);

    // Set static ARIA attributes
    this.setAttribute('role', 'slider');
    this.setAttribute('aria-label', this.name);
    this.setAttribute('aria-valuemin', '2');
    this.setAttribute('tabindex', '0');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Remove event listeners in disconnectedCallback
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  getSlicePath(index: number) {
    const ticks = this.ticks.reduce((sum, tick) => sum + tick.size, 0);
    const totalSize = ticks < 2 ? 2 : ticks;
    let startAngle = 0;

    for (let i = 0; i < index; i++) {
      startAngle += (this.ticks[i].size / totalSize) * 360;
    }

    const sliceAngle = (this.ticks[index].size / totalSize) * 360;
    const radius = 60;
    const borderRadius = 64;
    const offset = (borderRadius - radius) / 2;
    const endAngle = startAngle + sliceAngle;

    const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

    // Adjust the large-arc-flag calculation
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const classes = ['slice'];
    if (index < this.value) {
      classes.push('ticked');
    }

    return svg`<path 
      class="${classes.join(' ')}"
      d="${`M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z}`}"
      transform="translate(${offset}, ${offset})"
      key="${index}"></path>`;
  }

  renderClock() {
    return svg`<svg height="128px" widht="128px" viewBox="0 0 128 128">
      <g transform="rotate(-90 64 64)">
      ${this.ticks.map(
        (_tick, index) => html`
      ${this.getSlicePath(index)}"></path>
      `,
      )}
      </g>
    </svg>`;
  }

  render() {
    return html`
      <div
        class="clock">
        ${this.renderClock()}
        <slot @slotchange="${this._onSlotchange}"></slot>
      </div>
    `;
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    if (changedProperties.has('required')) {
      this.setAttribute('aria-required', this.required ? 'true' : 'false');
    }
    if (changedProperties.has('value')) {
      this.setAttribute('aria-valuenow', this.value.toString());
      this.setAttribute('aria-valuetext', this._ticks[this.value].label);
    }
    // Update aria-valuemax whenever ticks change
    if (changedProperties.has('ticks')) {
      const ticks = this.ticks.length;
      const max = ticks < 2 ? 2 : ticks;
      this.setAttribute('aria-valuemax', max.toString());
    }
  }

  private _handleClick(event: MouseEvent) {
    if (this.disabled || this.view) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target === this || target.closest('.clock')) {
      if (event.shiftKey) {
        // Check if Ctrl key is pressed
        this.value = this.value === 0 ? this.ticks.length - 1 : this.value - 1;
      } else {
        this.value = (this.value + 1) % (this.ticks.length + 1);
      }
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private _handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.disabled || this.view) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowUp') {
      this.value = (this.value + 1) % (this.ticks.length + 1);
      this.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (event.key === 'ArrowDown') {
      this.value = this.value === 0 ? this.ticks.length - 1 : this.value - 1;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
