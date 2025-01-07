// cn-tick.ts
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("cn-tick")
export class CnTick extends LitElement {
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) value = "";
  @property({ type: Number, reflect: true }) size = 1;

  static styles = css`
    /* @TODO: remove this, if we wont end up using it */
  `;

  render() {
    // We have a slot here for icons, text, etc.
    return html`<slot></slot>`;
  }
}
