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
export type FormwerkOption = string | { value: string; label: string };

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
export const _html = (html: string): string => {
  return html.replace(/[<>&"]/, (match: string): string => {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
    }
    return match;
  });
};

/**
 * Base class for all Formwerk Web Components.
 */

export class FormwerkElement extends HTMLElement {
  protected _values: FormwerkValue[] = [];
  protected _options: FormwerkOption[] = [];

  static observedAttributes = ["disabled", "readonly", "required", "options", "values"];

  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = document.createElement("input");

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    switch (attrName) {
      case "disabled":
        this.disabled = Boolean(newValue);
        break;
      case "readonly":
        this.readonly = Boolean(newValue);
        break;
      case "required":
        this.required = Boolean(newValue);
        break;
      case "options":
        this.options = JSON.parse(newValue ?? "[]");
        break;
      case "values":
        this.values = JSON.parse(newValue ?? "[]");
        break;
    }
  }

  set options(options: FormwerkOption[]) {
    this._options = options;
  }

  get options(): FormwerkOption[] {
    return this._options;
  }

  set values(values: FormwerkValue[]) {
    this._values = values || [this.input.value];
    this.input.value = values[0] ?? "";
  }

  get values(): FormwerkValue[] {
    const checked = this.querySelectorAll(":checked") as NodeListOf<HTMLOptionElement>;
    return checked.length
      ? [...checked].map((o: HTMLOptionElement) => {
          return o.value;
        })
      : this.input.value !== ""
        ? [this.input.value]
        : [];
  }

  set required(required: boolean) {
    this.input.toggleAttribute("required", required);
    this.classList.toggle("is-required", required);
  }

  set disabled(disabled: boolean) {
    this.input.toggleAttribute("disabled", disabled);
    this.classList.toggle("is-disabled", disabled);
  }

  set readonly(readonly: boolean) {
    this.input.toggleAttribute("readonly", readonly);
    this.classList.toggle("is-readonly", readonly);
  }

  /**
   * @returns If there is no explicit ID, will use the `name` attribute to supply an ID
   */
  get id(): string {
    const id = this.getAttribute("id") ?? this.getAttribute("name");
    if (!id) {
      throw new Error("No name or id given");
    }
    return id.replace(/[^A-Za-z0-9_-]/g, "");
  }

  /**
   * @returns Depending on the type of the input field, it may yield a differently typed output
   */
  get value(): FormwerkOutputValue {
    if (!(this.input instanceof HTMLInputElement)) {
      return this.hasAttribute("multiple") ? this.values : this.input.value;
    }
    switch (this.getAttribute("type")) {
      case "number":
      case "range":
        return this.input.valueAsNumber;
      case "date":
      case "datetime-local":
        return this.input.valueAsDate;
      case "checkbox":
        return this.values;
      default:
        return this.input.value;
    }
  }

  toJSON(): {
    id: string;
    value: FormwerkOutputValue;
  } {
    return {
      id: this.id,
      value: this.value,
    };
  }

  protected _getHtmlOutput(): string {
    if (!this.getAttribute("output")) {
      return "";
    }

    const id = this.id;
    const form = this.getAttribute("form");
    const name = this.getAttribute("name");

    return `<output id="${_html(id)}--output"${name ? ` name="${_html(name)}--output"` : ""} for="${_html(id)}--input"${form ? ` form="${_html(form)}"` : ""}></output>`;
  }

  protected _getHtmlLabel(): string {
    const label = this.getAttribute("label");
    if (!label) {
      return "";
    }

    const id = this.id;

    return `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>`;
  }
}
