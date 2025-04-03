/**
 * A simple value for any `<input>`, `<select>` or `<textarea>`
 */
export type FormwerkValue = string;
/**
 * Depending on the type of the input field, it may yield a differently typed output
 */
export type FormwerkOutputValue = string | number | Date | string[] | null;
/**
 * A single option for a `<datalist>`, `<option>`, `<input type="checkbox">` or `<input type="radio">
 */
export type FormwerkOption =
  | string
  | {
      value: string;
      label: string;
    };
/**
 * Configuration object to create a type toggle, e.g. turning ´<input type="password">` into `<input type="text">`.
 */
export type FormwerkTypeToggle = {
  /**
   * Toggle between this type and the input elements original type
   */
  type: string;
  /**
   * Label innerText when button is in state `off`
   */
  labelOff: string;
  /**
   * Label innerText when button is in state `on`
   */
  labelOn: string;
  /**
   * Bubble help text on input button for accessibility purposes
   */
  title?: string;
};
/**
 * Properly quote HTML
 * @param html probably HTML
 * @returns definitly not HTML
 */
export declare const _html: (html: string) => string;
/**
 * Base class for all Formwerk Web Components.
 */
export declare class FormwerkElement extends HTMLElement {
  protected _values: FormwerkValue[];
  protected _options: FormwerkOption[];
  static observedAttributes: string[];
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void;
  set options(options: FormwerkOption[]);
  get options(): FormwerkOption[];
  set values(values: FormwerkValue[]);
  get values(): FormwerkValue[];
  set required(required: boolean);
  set disabled(disabled: boolean);
  set readonly(readonly: boolean);
  /**
   * @returns If there is no explicit ID, will use the `name` attribute to supply an ID
   */
  get id(): string;
  /**
   * @returns Depending on the type of the input field, it may yield a differently typed output
   */
  get value(): FormwerkOutputValue;
  toJSON(): {
    id: string;
    value: FormwerkOutputValue;
  };
  protected _getHtmlOutput(): string;
  protected _getHtmlLabel(): string;
}
//# sourceMappingURL=FormwerkElement.d.ts.map
