type FormwerkOption = string | {
    value: string;
    label: string;
};
type FormwerkValue = string;
export declare class FormwerkElement extends HTMLElement {
    protected _values: FormwerkValue[];
    protected _options: FormwerkOption[];
    input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    connectedCallback(): void;
    set options(options: FormwerkOption[]);
    get options(): FormwerkOption[];
    set values(values: FormwerkValue[]);
    get values(): FormwerkValue[];
}
export declare class FormwerkInput extends FormwerkElement {
    output: HTMLOutputElement | null;
    connectedCallback(): void;
    protected _addToggleButton(): void;
    protected _addHtml(): void;
    protected _syncOutput(): void;
    protected _syncAttributes(): void;
    protected _syncValidity(): void;
    drawOptions(): void;
}
export declare class FormwerkSelect extends FormwerkInput {
    protected _addHtml(): void;
    drawOptions(): void;
}
export declare class FormwerkCheckboxes extends FormwerkElement {
    formGroup: HTMLDivElement | null;
    connectedCallback(): void;
    protected _addHtml(): void;
    protected _syncAttributes(): void;
    drawOptions(): void;
}
export declare class FormwerkTextarea extends FormwerkInput {
    connectedCallback(): void;
    protected _autogrow(): void;
    protected _addHtml(): void;
}
export {};
//# sourceMappingURL=formwerk.d.ts.map