/**
 * Properly quote HTML
 * @param html probably HTML
 * @returns definitly not HTML
 */
const _html = (html) => {
    return html.replace(/[<>&"]/, (match) => {
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
// -----------------------------------------------------------------------------
/**
 * Base class for all Formwerk Web Components.
 */
export class FormwerkElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this._values = [];
        this._options = [];
        this.input = document.createElement("input");
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case "disabled":
                this.disabled = Boolean(newValue);
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
    set options(options) {
        this._options = options;
    }
    get options() {
        return this._options;
    }
    set values(values) {
        this._values = values || [this.input.value];
        this.input.value = values[0] ?? "";
    }
    get values() {
        const checked = this.querySelectorAll(":checked");
        return checked.length
            ? [...checked].map((o) => {
                return o.value;
            })
            : this.input.value !== ""
                ? [this.input.value]
                : [];
    }
    set required(required) {
        this.input.toggleAttribute("required", required);
        this.classList.toggle("is-required", required);
    }
    set disabled(disabled) {
        this.input.toggleAttribute("disabled", disabled);
        this.classList.toggle("is-disabled", disabled);
    }
}
FormwerkElement.observedAttributes = ["disabled", "required", "options", "values"];
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
        const output = this.getAttribute("output");
        const unit = this.getAttribute("unit");
        const helptext = this.getAttribute("helptext");
        const datalist = this.getAttribute("options");
        const toggletypeAttribute = this.getAttribute("toggletype");
        const toggletype = toggletypeAttribute ? JSON.parse(toggletypeAttribute) : null;
        const id = this.getAttribute("id") ?? this.getAttribute("name");
        if (!id) {
            throw new Error("Missing name or id property");
        }
        this.innerHTML =
            `<div class="formwerk--outer">` +
                (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
                `<div class="formwerk--input"><input id="${_html(id)}--input" type="text"${(helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
                    (datalist ? ` list="${_html(id)}--datalist"` : "") +
                    (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")} />` +
                (output ? `<output id="${_html(id)}--input"></output>` : "") +
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
customElements.define("formwerk-input", FormwerkInput);
// -----------------------------------------------------------------------------
/**
 * Creates an enhanced `<select>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
export class FormwerkSelect extends FormwerkInput {
    _addHtml() {
        const label = this.getAttribute("label");
        const output = this.getAttribute("output");
        const unit = this.getAttribute("unit");
        const helptext = this.getAttribute("helptext");
        const id = this.getAttribute("id") ?? this.getAttribute("name");
        if (!id) {
            throw new Error("Missing name or id property");
        }
        this.innerHTML =
            `<div class="formwerk--outer">` +
                (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
                `<div class="formwerk--input"><select id="${_html(id)}--input"${(helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
                    (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")}></select>` +
                (output ? `<output id="${_html(id)}--input"></output>` : "") +
                (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
                `</div>` +
                `</div>` +
                (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
    }
    drawOptions() {
        this.input.innerHTML = this._options
            .map((option) => {
            if (typeof option === "string") {
                option = {
                    value: option,
                    label: option,
                };
            }
            const selected = this._values.indexOf(option.value) !== -1 || this.input.value === option.value;
            return `<option value="${_html(option.value)}"${selected ? ' selected="selected"' : ""}>${_html(option.label)}</option>`;
        })
            .join("");
    }
}
customElements.define("formwerk-select", FormwerkSelect);
// -----------------------------------------------------------------------------
/**
 * Creates an enhanced `<input type="checkbox">` or `<input type="radio">`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
export class FormwerkCheckboxes extends FormwerkElement {
    constructor() {
        super(...arguments);
        this.formGroup = null;
    }
    connectedCallback() {
        this._addHtml();
        this.formGroup = this.querySelector('[role="group"]');
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
    _addHtml() {
        const label = this.getAttribute("label");
        const helptext = this.getAttribute("helptext");
        const id = this.getAttribute("id") ?? this.getAttribute("name");
        if (!id) {
            throw new Error("Missing name or id property");
        }
        this.input.id = id;
        this.innerHTML =
            `<div class="formwerk--outer">` +
                (label ? `<div id="${_html(id)}--label" class="form-label">${_html(label)}</div>` : "") +
                `<div class="form-check-group" role="group" id="${_html(id)}--input" aria-labelledby="${_html(id)}--label"${helptext ? ` aria-describedby="${_html(id)}--helptext"` : ""}></div>` +
                `</div>` +
                (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
    }
    drawOptions() {
        if (!this.formGroup) {
            return;
        }
        this.formGroup.innerHTML = this._options
            .map((option, index) => {
            if (typeof option === "string") {
                option = {
                    value: option,
                    label: option,
                };
            }
            const input = this.input.cloneNode(true);
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
customElements.define("formwerk-checkboxes", FormwerkCheckboxes);
// -----------------------------------------------------------------------------
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
        const output = this.getAttribute("output");
        const unit = this.getAttribute("unit");
        const helptext = this.getAttribute("helptext");
        const id = this.getAttribute("id") ?? this.getAttribute("name");
        if (!id) {
            throw new Error("Missing name or id property");
        }
        this.innerHTML =
            `<div class="formwerk--outer">` +
                (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
                `<div class="formwerk--input"><textarea id="${_html(id)}--input" ${(helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
                    (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")}></textarea>` +
                (output ? `<output id="${_html(id)}--input"></output>` : "") +
                (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
                `</div>` +
                `</div>` +
                (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
    }
}
customElements.define("formwerk-textarea", FormwerkTextarea);
