/**
 * A simple value for any `<input>`, `<select>` or `<textarea>`
 */
type FormwerkValue = string;
/**
 * Depending on the type of the input field, it may yield a differently typed output
 */
type FormwerkOutputValue = string | number | Date | string[] | null;
/**
 * A single option for a `<datalist>`, `<option>`, `<input type="checkbox">` or `<input type="radio">
 */
type FormwerkOption = string | {
    value: string;
    label: string;
};
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
}
/**
 * Creates an enhanced `<input>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
export declare class FormwerkInput extends FormwerkElement {
    output: HTMLOutputElement | null;
    connectedCallback(): void;
    protected _addToggleButton(): void;
    protected _addHtml(): void;
    protected _syncOutput(): void;
    protected _syncValidity(): void;
    drawOptions(): void;
}
/**
 * Creates an enhanced `<select>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
export declare class FormwerkSelect extends FormwerkInput {
    protected _addHtml(): void;
    drawOptions(): void;
}
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
/**
 * Creates an enhanced `<textarea>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
 */
export declare class FormwerkTextarea extends FormwerkInput {
    connectedCallback(): void;
    protected _autogrow(): void;
    protected _addHtml(): void;
}
export {};
//# sourceMappingURL=formwerk.d.ts.map