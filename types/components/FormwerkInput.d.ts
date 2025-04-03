import { FormwerkElement } from "./FormwerkElement.js";
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
//# sourceMappingURL=FormwerkInput.d.ts.map