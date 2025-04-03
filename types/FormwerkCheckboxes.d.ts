import { FormwerkElement } from "./FormwerkElement.js";
/**
 * Creates an enhanced `<input type="checkbox">` or `<input type="radio">`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
export declare class FormwerkCheckboxes extends FormwerkElement {
  formGroup: HTMLDivElement | null;
  connectedCallback(): void;
  protected _addHtml(): void;
  drawOptions(): void;
}
//# sourceMappingURL=FormwerkCheckboxes.d.ts.map
