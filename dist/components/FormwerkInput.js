import { _html, FormwerkElement } from "./FormwerkElement.js";
// -----------------------------------------------------------------------------
/**
 * Creates an enhanced `<input>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
export class FormwerkInput extends FormwerkElement {
    constructor() {
        super(...arguments);
        this.output = null;
    }
    connectedCallback() {
        this._addHtml();
        this.input = this.querySelector("input, select, textarea");
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
    _addToggleButton() {
        const toggletypeAttribute = this.getAttribute("toggletype");
        if (toggletypeAttribute) {
            const toggletype = JSON.parse(toggletypeAttribute);
            const toggleButton = this.querySelector("button.toggle-type");
            toggleButton?.addEventListener("click", () => {
                toggleButton.innerText = this.input.type === toggletype.type ? toggletype.labelOff : toggletype.labelOn;
                this.input.setAttribute("type", this.input.type === toggletype.type ? (this.getAttribute("type") ?? "text") : toggletype.type);
            });
        }
    }
    _addHtml() {
        const label = this.getAttribute("label");
        const unit = this.getAttribute("unit");
        const helptext = this.getAttribute("helptext");
        const datalist = this.getAttribute("options");
        const toggletypeAttribute = this.getAttribute("toggletype");
        const toggletype = toggletypeAttribute ? JSON.parse(toggletypeAttribute) : null;
        const id = this.id;
        this.innerHTML =
            `<div class="formwerk--outer">` +
                this._getHtmlLabel() +
                `<div class="formwerk--input"><input id="${_html(id)}--input" type="text"${(helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
                    (datalist ? ` list="${_html(id)}--datalist"` : "") +
                    (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")} />` +
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
    _syncOutput() {
        if (this.output) {
            this.output.value = this.input.value ?? "";
        }
    }
    _syncValidity() {
        this.classList.toggle("is-invalid", this.input.value !== "" && !this.input.checkValidity());
        this.classList.toggle("is-invalid-empty", !this.input.checkValidity());
    }
    drawOptions() {
        const datalist = this.querySelector("datalist");
        if (!datalist) {
            return;
        }
        datalist.innerHTML = this._options
            .map((option) => {
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
