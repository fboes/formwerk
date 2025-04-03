import { _html } from "./FormwerkElement.js";
import { FormwerkInput } from "./FormwerkInput.js";
/**
 * Creates an enhanced `<textarea>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
 */
export class FormwerkTextarea extends FormwerkInput {
    connectedCallback() {
        super.connectedCallback();
        if (this.getAttribute("autogrow")) {
            this.input.style.overflow = "hidden";
            this._autogrow();
            this.input.addEventListener("keyup", () => {
                this._autogrow();
            });
        }
    }
    _autogrow() {
        if (this.input.scrollHeight > this.input.clientHeight) {
            this.input.style.height = `${this.input.scrollHeight}px`;
        }
    }
    _addHtml() {
        const label = this.getAttribute("label");
        const unit = this.getAttribute("unit");
        const helptext = this.getAttribute("helptext");
        const id = this.id;
        this.innerHTML =
            `<div class="formwerk--outer">` +
                this._getHtmlLabel() +
                `<div class="formwerk--input"><textarea id="${_html(id)}--input" ${(helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
                    (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")}></textarea>` +
                this._getHtmlOutput() +
                (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
                `</div>` +
                `</div>` +
                (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
    }
}
