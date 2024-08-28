type FormwerkOption =
  | string
  | {
      value: string;
      label: string;
    };
type FormwerkValue = string;
export declare class FormwerkInput extends HTMLElement {
  _values: FormwerkValue[];
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  output: HTMLOutputElement | null;
  constructor();
  protected _addHtml(): void;
  protected _syncOutput(): void;
  protected _syncAttributes(): void;
  protected _syncValidity(): void;
  set options(options: FormwerkOption[]);
}
export declare class FormwerkSelect extends FormwerkInput {
  constructor();
  protected _addHtml(): void;
  set options(options: FormwerkOption[]);
}
export declare class FormwerkCheckboxes extends HTMLElement {
  _values: FormwerkValue[];
  input: HTMLInputElement;
  formGroup: HTMLDivElement;
  constructor();
  protected _addHtml(): void;
  protected _syncAttributes(): void;
  set options(options: FormwerkOption[]);
}
export declare class FormwerkTextarea extends FormwerkInput {
  constructor();
  protected _autogrow(): void;
  protected _addHtml(): void;
}
export {};
//# sourceMappingURL=formwerk.d.ts.map
