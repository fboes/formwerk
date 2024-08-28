type FormwerkTypeToggle = {
  type: string;
  labelOff: string;
  labelOn: string;
  title?: string;
};

type FormwerkOption = string | { value: string; label: string };

type FormwerkValue = string;

export class FormwerkInput extends HTMLElement {
  _values: FormwerkValue[];
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  output: HTMLOutputElement | null;

  constructor() {
    super();
    this._addHtml();
    this._values = [];
    this.input = this.querySelector("input, select, textarea") as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    this.output = this.querySelector("output");

    if (this.hasAttributes()) {
      for (const attribute of this.attributes) {
        switch (attribute.name) {
          case "id":
          case "label":
          case "output":
          case "helptext":
          case "unit":
          case "options":
          case "autogrow":
          case "toggletype":
            break;
          case "values":
            this._values = JSON.parse(attribute.value ?? "[]");
            break;
          case "value":
            this.input.value = attribute.value;
            break;
          default:
            this.input.setAttribute(attribute.name, attribute.value);
        }
      }
    }

    const type = this.getAttribute("type");
    if (type !== "checkbox" && type !== "radio") {
      this.input.classList.add("form-control");
    }

    const toggletypeAttribute = this.getAttribute("toggletype");
    if (toggletypeAttribute) {
      const toggletype: FormwerkTypeToggle = JSON.parse(toggletypeAttribute);
      const toggleButton = this.querySelector("button.toggle-type") as HTMLButtonElement | null;
      toggleButton?.addEventListener("click", () => {
        toggleButton.innerText = this.input.type === toggletype.type ? toggletype.labelOff : toggletype.labelOn;
        this.input.setAttribute(
          "type",
          this.input.type === toggletype.type ? (this.getAttribute("type") ?? "text") : toggletype.type,
        );
      });
    }

    this.classList.add("formwerk");
    this.options = JSON.parse(this.getAttribute("options") ?? "[]");

    if (this.output) {
      this._syncOutput();
    }
    this._syncValidity();
    this._syncAttributes();

    this.input.addEventListener("input", () => {
      if (this.output) {
        this._syncOutput();
      }
      this._syncValidity();
    });
  }

  protected _addHtml() {
    const label = this.getAttribute("label");
    const output = this.getAttribute("output");
    const unit = this.getAttribute("unit");
    const helptext = this.getAttribute("helptext");
    const datalist = this.getAttribute("options");
    const toggletypeAttribute = this.getAttribute("toggletype");
    const toggletype: FormwerkTypeToggle | null = toggletypeAttribute ? JSON.parse(toggletypeAttribute) : null;

    const id = this.getAttribute("id") ?? this.getAttribute("name");
    if (!id) {
      throw new Error("Missing name or id property");
    }

    this.innerHTML =
      `<div class="formwerk--outer">` +
      (label ? `<label for="${id}--input" class="form-label">${label}</label>` : "") +
      `<div class="formwerk--input"><input id="${id}--input" type="text"${
        (helptext ? ` aria-describedby="${id}--helptext"` : "") +
        (datalist ? ` list="${id}--datalist"` : "") +
        (unit ? ` aria-label="${label ?? ""} (${unit})"` : "")
      } />` +
      (output ? `<output id="${id}--input"></output>` : "") +
      (unit ? `<span aria-hidden="true">${unit}</span>` : "") +
      (toggletype
        ? `<button type="button" class="toggle-type" title="${toggletype.title}">${toggletype.labelOff}</button>`
        : "") +
      (datalist ? `<datalist id="${id}--datalist"></datalist>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${id}--helptext" class="form-text">${helptext}</small>` : "");
  }

  protected _syncOutput() {
    if (this.output) {
      this.output.value = this.input.value ?? "";
    }
  }

  protected _syncAttributes() {
    this.classList.toggle("is-required", this.input.hasAttribute("required"));
  }

  protected _syncValidity() {
    this.classList.toggle("is-invalid", this.input.value !== "" && !this.input.checkValidity());
    this.classList.toggle("is-invalid-empty", !this.input.checkValidity());
  }

  set options(options: FormwerkOption[]) {
    const datalist = this.querySelector("datalist");
    if (!datalist) {
      return;
    }
    datalist.innerHTML = options
      .map((option: FormwerkOption) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }
        return `<option value="${option.value}">${option.label}</option>`;
      })
      .join();
  }
}

customElements.define("formwerk-input", FormwerkInput);

// -----------------------------------------------------------------------------

export class FormwerkSelect extends FormwerkInput {
  constructor() {
    super();

    this.input.addEventListener("change", () => {
      if (!(this.input instanceof HTMLSelectElement)) {
        return;
      }
      this._values = Array.from(this.input.selectedOptions).map((option) => {
        return option.getAttribute("value") || option.innerText;
      });
    });
  }

  protected _addHtml() {
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
      (label ? `<label for="${id}--input" class="form-label">${label}</label>` : "") +
      `<div class="formwerk--input"><select id="${id}--input"${
        (helptext ? ` aria-describedby="${id}--helptext"` : "") + (unit ? ` aria-label="${label ?? ""} (${unit})"` : "")
      }></select>` +
      (output ? `<output id="${id}--input"></output>` : "") +
      (unit ? `<span aria-hidden="true">${unit}</span>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${id}--helptext" class="form-text">${helptext}</small>` : "");
  }

  set options(options: FormwerkOption[]) {
    const values = this._values.length ? this._values : [this.input.value || this.getAttribute("value")];

    this.input.innerHTML = options
      .map((option: FormwerkOption) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }
        return `<option value="${option.value}"${values.indexOf(option.value) !== -1 ? ' selected="selected"' : ""}>${
          option.label
        }</option>`;
      })
      .join("");
  }
}

customElements.define("formwerk-select", FormwerkSelect);

// -----------------------------------------------------------------------------

export class FormwerkCheckboxes extends HTMLElement {
  _values: FormwerkValue[];
  input: HTMLInputElement;
  formGroup: HTMLDivElement;

  constructor() {
    super();
    this._addHtml();
    this._values = [];
    this.input = document.createElement("input");
    this.formGroup = this.querySelector('[role="group"]') as HTMLDivElement;

    if (this.hasAttributes()) {
      for (const attribute of this.attributes) {
        switch (attribute.name) {
          case "label":
          case "helptext":
          case "options":
          case "required":
            break;
          case "values":
            this._values = JSON.parse(attribute.value ?? "[]");
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

    this.classList.add("formwerk");
    this.options = JSON.parse(this.getAttribute("options") ?? "[]");

    this.formGroup.addEventListener("change", () => {
      this._values = (Array.from(this.formGroup.querySelectorAll("input:checked")) as HTMLInputElement[]).map(
        (option): FormwerkValue => {
          return option.getAttribute("value") || option.innerText;
        },
      );
    });

    this._syncAttributes();
  }

  protected _addHtml() {
    const label = this.getAttribute("label");
    const helptext = this.getAttribute("helptext");
    const id = this.getAttribute("id") ?? this.getAttribute("name");
    if (!id) {
      throw new Error("Missing name or id property");
    }

    this.innerHTML =
      `<div class="formwerk--outer">` +
      (label ? `<div id="${id}--label" class="form-label">${label}</div>` : "") +
      `<div class="form-check-group" role="group" id="${id}--input" aria-labelledby="${id}--label"${
        helptext ? ` aria-describedby="${id}--helptext"` : ""
      }></div>` +
      `</div>` +
      (helptext ? `<small id="${id}--helptext" class="form-text">${helptext}</small>` : "");
  }

  protected _syncAttributes() {
    this.classList.toggle("is-required", this.input.hasAttribute("required"));
  }

  set options(options: FormwerkOption[]) {
    const values = this._values.length ? this._values : [this.input.value || this.getAttribute("value")];

    this.formGroup.innerHTML = options
      .map((option: FormwerkOption, index: number) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }

        const input = this.input.cloneNode(true) as HTMLInputElement;
        const id = input.id + `--${index}`;
        input.setAttribute("value", option.value);
        input.setAttribute("id", id);
        input.toggleAttribute("checked", values.indexOf(option.value) !== -1);

        return `<div class="form-check">${input.outerHTML}<label class="form-check-label" for="${id}">${option.label}</label></div>`;
      })
      .join("");
  }
}

customElements.define("formwerk-checkboxes", FormwerkCheckboxes);

// -----------------------------------------------------------------------------

export class FormwerkTextarea extends FormwerkInput {
  constructor() {
    super();

    if (this.getAttribute("autogrow")) {
      this.input.style.overflow = "hidden";
      this._autogrow();
      this.input.addEventListener("keyup", () => {
        this._autogrow();
      });
    }
  }

  protected _autogrow() {
    if (this.input.scrollHeight > this.input.clientHeight) {
      this.input.style.height = `${this.input.scrollHeight}px`;
    }
  }

  protected _addHtml() {
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
      (label ? `<label for="${id}--input" class="form-label">${label}</label>` : "") +
      `<div class="formwerk--input"><textarea id="${id}--input" ${
        (helptext ? ` aria-describedby="${id}--helptext"` : "") + (unit ? ` aria-label="${label ?? ""} (${unit})"` : "")
      }></textarea>` +
      (output ? `<output id="${id}--input"></output>` : "") +
      (unit ? `<span aria-hidden="true">${unit}</span>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${id}--helptext" class="form-text">${helptext}</small>` : "");
  }
}

customElements.define("formwerk-textarea", FormwerkTextarea);
