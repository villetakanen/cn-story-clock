import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("cn-story-clock")
export class CnStoryClock extends LitElement {
  render() {
    return html`
      <p>This is a rudimentary story clock.</p>
    `;
  }
}
