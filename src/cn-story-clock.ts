// cn-tick.ts
import { LitElement, css, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { CnTick } from "./cn-tick";

@customElement("cn-story-clock")
export class CnStoryClock extends LitElement {
  @property({ type: String, reflect: true }) name = "";
  @property({ type: Number, reflect: true }) value = 0;

  // These two fields are for form-interaction
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  // The tick list used a as a helper to render and interact with the ticks
  private _ticks = new Array<CnTick>();

  get ticks() {
    return this._ticks;
  }

  set ticks(value) {
    this._ticks = value;
    this.requestUpdate();
  }

  static styles = css`
    :host {
      display: inline-block;
    }
    .clock {
      width: 100px; /* Adjust size as needed */
      height: 100px;
      position: relative;
      background-color: var(--cn-story-clock-background, white);
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .slice {
      fill: var(--cn-story-clock-slice-background, lightgray);
      stroke: var(--cn-story-clock-slice-border, black);
      stroke-width: var(--cn-story-clock-slice-border-width, 2px); 
    }
    .slice.ticked {
      fill: var(--cn-story-clock-slice-background-ticked, gray);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    console.log("cn-story-clock connectedCallback called"); // Add this line

    const ticks = this.querySelectorAll<CnTick>("cn-tick");
    this.ticks = Array.from(ticks);
  }

  getSlicePath(index: number, ticks: number) {
    const sliceAngle = 360 / ticks;
    const radius = 60;
    const borderRadius = 64;
    const offset = (borderRadius - radius) / 2;

    const startAngle = sliceAngle * index;
    const endAngle = startAngle + sliceAngle;

    const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

    // Adjust the large-arc-flag calculation
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const classes = ["slice"];
    if (index < this.value) {
      classes.push("ticked");
    }

    return svg`<path 
      class="${classes.join(" ")}"
      d="${`M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z}`}"
      transform="translate(${offset}, ${offset})"
      key="${index}"></path>`;
  }

  renderClock() {
    return svg`<svg height="128px" widht="128px" viewBox="0 0 128 128">
      <g transform="rotate(-90 64 64)">
      ${this.ticks.map(
        (_tick, index) => html`
      ${this.getSlicePath(index, this.ticks.length)}"></path>
      `,
      )}
      </g>
    </svg>`;
  }

  render() {
    return html`
      <div
        class="clock"
        @click="${this._handleClick}" 
        @keydown="${this._handleKeydown}" 
        tabindex="0" 
        role="button"
        aria-label="${this.name}">
        ${this.renderClock()}
        <slot></slot>
      </div>
      <p>${this.name}: ${this.value}</p>

    <!--p>Ticks:</p>
    <ul>
      ${this.ticks.map((tick, index) => html`<li>${tick.label}: ${this.getSlicePath(index, this.ticks.length)}</li>`)}
    </ul-->
    `;
  }

  private _handleClick() {
    if (this.disabled) {
      return;
    }
    this.value = this.value >= this.ticks.length ? 0 : this.value + 1;
    this.dispatchEvent(new Event("change"));
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      // Check for 'Enter' or space
      this._handleClick();
    }
  }
}
