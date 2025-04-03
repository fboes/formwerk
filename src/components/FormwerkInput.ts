import { _html, FormwerkElement, FormwerkOption, FormwerkTypeToggle } from "./FormwerkElement.js";

// -----------------------------------------------------------------------------
/**
 * Creates an enhanced `<input>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */

export class FormwerkInput extends FormwerkElement {
  output: HTMLOutputElement | null = null;

  connectedCallback() {
    this._addHtml();
    this.input = this.querySelector("input, select, textarea") as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    this.output = this.querySelector("output");

    if (this.hasAttributes()) {
      for (const attribute of this.attributes) {
        switch (attribute.name) {
          case "id":
          case "label":
          case "output":
          case "helptext":
          case "unit":
          case "autogrow":
          case "toggletype":
          case "options":
          case "values":
          case "class":
            break;
          case "autofocus":
            this.input.focus();
            break;
          case "value":
            this.input.value = attribute.value;
            break;
          default:
            this.input.setAttribute(attribute.name, attribute.value);
        }
      }
    }

    this.classList.add("formwerk");
    this.input.classList.add("form-control");
    if (this._options || this._values) {
      this.drawOptions();
    }
    if (this.output) {
      this._syncOutput();
    }
    this._addToggleButton();
    this._syncValidity();
    this.input.addEventListener("input", () => {
      if (this.output) {
        this._syncOutput();
      }
      this._syncValidity();
    });
  }

  protected _addToggleButton() {
    const toggletypeAttribute = this.getAttribute("toggletype");
    if (toggletypeAttribute) {
      const toggletype: FormwerkTypeToggle = JSON.parse(toggletypeAttribute);
      const toggleButton = this.querySelector("button.toggle-type") as HTMLButtonElement | null;
      toggleButton?.addEventListener("click", () => {
        toggleButton.innerText = this.input.type === toggletype.type ? toggletype.labelOff : toggletype.labelOn;
        this.input.setAttribute(
          "type",
          this.input.type === toggletype.type ? (this.getAttribute("type") ?? "text") : toggletype.type,
        );
      });
    }
  }

  protected _addHtml() {
    const label = this.getAttribute("label");
    const unit = this.getAttribute("unit");
    const helptext = this.getAttribute("helptext");
    const datalist = this.getAttribute("options");
    const toggletypeAttribute = this.getAttribute("toggletype");
    const toggletype: FormwerkTypeToggle | null = toggletypeAttribute ? JSON.parse(toggletypeAttribute) : null;
    const id = this.id;

    this.innerHTML =
      `<div class="formwerk--outer">` +
      this._getHtmlLabel() +
      `<div class="formwerk--input"><input id="${_html(id)}--input" type="text"${
        (helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
        (datalist ? ` list="${_html(id)}--datalist"` : "") +
        (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")
      } />` +
      this._getHtmlOutput() +
      (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
      (toggletype
        ? `<button type="button" class="toggle-type" title="${_html(toggletype.title ?? "")}">${_html(toggletype.labelOff)}</button>`
        : "") +
      (datalist ? `<datalist id="${_html(id)}--datalist"></datalist>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
  }

  protected _syncOutput() {
    if (this.output) {
      this.output.value = this.input.value ?? "";
    }
  }

  protected _syncValidity() {
    this.classList.toggle("is-invalid", this.input.value !== "" && !this.input.checkValidity());
    this.classList.toggle("is-invalid-empty", !this.input.checkValidity());
  }

  drawOptions() {
    const datalist = this.querySelector("datalist");
    if (!datalist) {
      return;
    }
    datalist.innerHTML = this._options
      .map((option: FormwerkOption) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }
        return `<option value="${_html(option.value)}">${_html(option.label)}</option>`;
      })
      .join("");
  }
}
