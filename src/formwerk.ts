type FormwerkTypeToggle = {
  type: string;
  labelOff: string;
  labelOn: string;
  title?: string;
};

type FormwerkOption = string | { value: string; label: string };

type FormwerkValue = string;

const _html = (html: string): string => {
  return html.replace(/[<>&"]/, (match: string): string => {
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

export class FormwerkElement extends HTMLElement {
  protected _values: FormwerkValue[] = [];
  protected _options: FormwerkOption[] = [];

  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = document.createElement("input");

  constructor() {
    super();
    const options = this.getAttribute("options");
    const values = this.getAttribute("values");
    if (options || values) {
      this.options = JSON.parse(options ?? "[]");
      this.values = JSON.parse(values ?? "[]");
    }
  }

  set options(options: FormwerkOption[]) {
    this._options = options;
  }

  get options(): FormwerkOption[] {
    return this._options;
  }

  set values(values: FormwerkValue[]) {
    this._values = values || [this.input.value];
    this.input.value = values[0] ?? "";
  }

  get values(): FormwerkValue[] {
    const checked = this.querySelectorAll(":checked") as NodeListOf<HTMLOptionElement>;
    return checked.length
      ? [...checked].map((o: HTMLOptionElement) => {
          return o.value;
        })
      : this.input.value !== ""
        ? [this.input.value]
        : [];
  }
}

// -----------------------------------------------------------------------------

export class FormwerkInput extends FormwerkElement {
  output: HTMLOutputElement | null;

  constructor() {
    super();
    this._addHtml();
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
          case "autogrow":
          case "toggletype":
          case "options":
          case "values":
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
    this._syncAttributes();

    this.input.addEventListener("input", () => {
      if (this.output) {
        this._syncOutput();
      }
      this._syncValidity();
    });
  }

  protected _addToggleButton() {
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
      (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
      `<div class="formwerk--input"><input id="${_html(id)}--input" type="text"${
        (helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
        (datalist ? ` list="${_html(id)}--datalist"` : "") +
        (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")
      } />` +
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

  drawOptions() {
    const datalist = this.querySelector("datalist");
    if (!datalist) {
      return;
    }
    datalist.innerHTML = this._options
      .map((option: FormwerkOption) => {
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

export class FormwerkSelect extends FormwerkInput {
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
      (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
      `<div class="formwerk--input"><select id="${_html(id)}--input"${
        (helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
        (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")
      }></select>` +
      (output ? `<output id="${_html(id)}--input"></output>` : "") +
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

customElements.define("formwerk-select", FormwerkSelect);

// -----------------------------------------------------------------------------

export class FormwerkCheckboxes extends FormwerkElement {
  formGroup: HTMLDivElement;

  constructor() {
    super();
    this._addHtml();
    this.formGroup = this.querySelector('[role="group"]') as HTMLDivElement;

    if (this.hasAttributes()) {
      for (const attribute of this.attributes) {
        switch (attribute.name) {
          case "label":
          case "helptext":
          case "options":
          case "required":
          case "values":
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
      (label ? `<div id="${_html(id)}--label" class="form-label">${_html(label)}</div>` : "") +
      `<div class="form-check-group" role="group" id="${_html(id)}--input" aria-labelledby="${_html(id)}--label"${
        helptext ? ` aria-describedby="${_html(id)}--helptext"` : ""
      }></div>` +
      `</div>` +
      (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
  }

  protected _syncAttributes() {
    this.classList.toggle("is-required", this.input.hasAttribute("required"));
  }

  drawOptions() {
    this.formGroup.innerHTML = this._options
      .map((option: FormwerkOption, index: number) => {
        if (typeof option === "string") {
          option = {
            value: option,
            label: option,
          };
        }

        const input = this.input.cloneNode(true) as HTMLInputElement;
        const id = input.id + `--${index}`;
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
      (label ? `<label for="${_html(id)}--input" class="form-label">${_html(label)}</label>` : "") +
      `<div class="formwerk--input"><textarea id="${_html(id)}--input" ${
        (helptext ? ` aria-describedby="${_html(id)}--helptext"` : "") +
        (unit ? ` aria-label="${_html(label ?? "")} (${_html(unit)})"` : "")
      }></textarea>` +
      (output ? `<output id="${_html(id)}--input"></output>` : "") +
      (unit ? `<span aria-hidden="true">${_html(unit)}</span>` : "") +
      `</div>` +
      `</div>` +
      (helptext ? `<small id="${_html(id)}--helptext" class="form-text">${_html(helptext)}</small>` : "");
  }
}

customElements.define("formwerk-textarea", FormwerkTextarea);
