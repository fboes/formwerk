import { _html, FormwerkElement, FormwerkOption } from "./FormwerkElement.js";

/**
 * Creates an enhanced `<input type="checkbox">` or `<input type="radio">`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */

export class FormwerkCheckboxes extends FormwerkElement {
  formGroup: HTMLDivElement | null = null;

  connectedCallback() {
    this._addHtml();
    this.formGroup = this.querySelector('[role="group"]') as HTMLDivElement;

    if (this.hasAttributes()) {
      for (const attribute of this.attributes) {
        switch (attribute.name) {
          case "label":
          case "helptext":
          case "options":
          case "required":
          case "values":
          case "class":
          case "autofocus":
            break;
          case "value":
            this.input.value = attribute.value;
            break;
          default:
            this.input.setAttribute(attribute.name, attribute.value);
        }
      }
    }

    this.input.classList.add("form-check-input");
    this.drawOptions();

    this.classList.add("formwerk");
  }

  protected _addHtml() {
    const label = this.getAttribute("label");
    const helptext = this.getAttribute("helptext");
    const id = this.id;

    this.input.id = id;
    this.innerHTML =
      `<fieldset class="formwerk--outer">` +
      (label ? `<legend id="${_html(id)}--label" class="form-label">${_html(label)}</legend>` : "") +
      `<div class="form-check-group" role="group" id="${_html(id)}--input" aria-labelledby="${_html(id)}--label"${helptext ? ` aria-describedby="${_html(id)}--helptext"` : ""}></div>` +
      `</fieldset>` +
      (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
  }

  drawOptions() {
    if (!this.formGroup) {
      return;
    }
    this.formGroup.innerHTML = this._options
      .map((option: FormwerkOption, index: number) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }

        const input = this.input.cloneNode(true) as HTMLInputElement;
        const id = this.input.id + `--${index}`;
        const checked = this._values.indexOf(option.value) !== -1 || this.input.value === option.value;

        input.setAttribute("value", option.value);
        input.setAttribute("id", id);
        input.toggleAttribute("checked", checked);

        return `<div class="form-check">${input.outerHTML}<label class="form-check-label" for="${_html(id)}">${_html(option.label)}</label></div>`;
      })
      .join("");
  }
}
