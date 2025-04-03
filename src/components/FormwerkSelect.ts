import { _html, FormwerkOption } from "./FormwerkElement.js";
import { FormwerkInput } from "./FormwerkInput.js";

// -----------------------------------------------------------------------------
/**
 * Creates an enhanced `<select>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */

export class FormwerkSelect extends FormwerkInput {
  protected _addHtml() {
    const label = this.getAttribute("label");
    const unit = this.getAttribute("unit");
    const helptext = this.getAttribute("helptext");
    const id = this.id;

    this.innerHTML =
      `<div class="formwerk--outer">` +
      this._getHtmlLabel() +
      `<div class="formwerk--input"><select id="${_html(id)}--input"${
        (helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
        (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")
      }></select>` +
      this._getHtmlOutput() +
      (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
  }

  drawOptions() {
    this.input.innerHTML = this._options
      .map((option: FormwerkOption) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }
        const selected = this._values.indexOf(option.value) !== -1 || this.input.value === option.value;
        return `<option value="${_html(option.value)}"${selected ? ' selected="selected"' : ""}>${_html(
          option.label,
        )}</option>`;
      })
      .join("");
  }
}
