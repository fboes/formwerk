/**
 * Properly quote HTML
 * @param html probably HTML
 * @returns definitly not HTML
 */
export const _html = (html) => {
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
    set readonly(readonly) {
        this.input.toggleAttribute("readonly", readonly);
        this.classList.toggle("is-readonly", readonly);
    }
    /**
     * @returns If there is no explicit ID, will use the `name` attribute to supply an ID
     */
    get id() {
        const id = this.getAttribute("id") ?? this.getAttribute("name");
        if (!id) {
            throw new Error("No name or id given");
        }
        return id.replace(/[^A-Za-z0-9_-]/g, "");
    }
    /**
     * @returns Depending on the type of the input field, it may yield a differently typed output
     */
    get value() {
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
    toJSON() {
        return {
            id: this.id,
            value: this.value,
        };
    }
    _getHtmlOutput() {
        if (!this.getAttribute("output")) {
            return "";
        }
        const id = this.id;
        const form = this.getAttribute("form");
        const name = this.getAttribute("name");
        return `<output id="${_html(id)}--output"${name ? ` name="${_html(name)}--output"` : ""} for="${_html(id)}--input"${form ? ` form="${_html(form)}"` : ""}></output>`;
    }
    _getHtmlLabel() {
        const label = this.getAttribute("label");
        if (!label) {
            return "";
        }
        const id = this.id;
        return `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>`;
    }
}
FormwerkElement.observedAttributes = ["disabled", "readonly", "required", "options", "values"];
