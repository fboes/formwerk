# Formwerk

Web components for smarter HTML forms.

## Main idea

All components have in common that any attributes attached will be attached to the `<input>` and/or `<select>` field inside of it. There are some additional attributes:

| Attribute    | Type               | Description                                                       | `formwerk-input` | `formwerk-select` | `formwerk-checkbox` | `formwerk-textarea` |
| ------------ | ------------------ | ----------------------------------------------------------------- | :--------------: | :---------------: | :-----------------: | :-----------------: |
| `label`      | string             | Will spawn an extra `<label>` before the form element             |        ✅        |        ✅         |         ✅          |         ✅          |
| `helptext`   | string             | Will spawn an extra help text after the form element              |        ✅        |        ✅         |         ✅          |         ✅          |
| `output`     | boolean            | Will spawn an extra `<output>` after the form element             |        ✅        |        ✅         |                     |                     |
| `unit`       | string             | Will spawn an extra unit name (e.g. "°C") after the form element  |        ✅        |        ✅         |                     |                     |
| `options`    | string[]\|object[] | Will spawn `<datalist>`, `<options>` or checkboxes                |        ✅        |        ✅         |         ✅          |                     |
| `values`     | string[]           | Instead of a single `value` accepts multiple preset values        |                  |        ✅         |         ✅          |                     |
| `toggletype` | object             | Will spawn a button to toggle between the `type` and `toggletype` |        ✅        |                   |                     |                     |
| `autogrow`   | boolean            | Text areas will grow according to their input                     |                  |                   |                     |          ✅         |

Altering these attributes after instantiating a web component will not alter the component.

### `options`

Instead of creating multiple options for a `<datalist>`, `<option>`, `<input type="checkbox">` or `<input type="radio">`, the `options` property allows for a fast creation of option lists.

This is available as attribute and writable property.

A single list of options looks like this:

```json
["One", "Two", "Three"]
```

If you are in need of having values and labels of a options behave differently, you can use a structured array.

```json
[
  { "value": "1", "label": "One" },
  { "value": "2", "label": "Two" },
  { "value": "3", "label": "Three" }
]
```

### `values`

For `<select multiple />` as well as `<input type="checkbox" />` it is possible to have multiple selected values for a given input element. For these elements there is a helpful `values` property to set and read multiple `value`.

This is available as attribute and readable property.

```json
["One", "Two", "Three"]
```

### `toggletype`

This allows `<input>` field to change their type. The attribute requires the following JSON:

```json
{
  "type": "text",
  "labelOff": "⇄",
  "labelOn": "⇆",
  "title": "Show / hide password"
}
```

## Installation

…

## Usage

1. Load the JavaScript files to enable the web components.
2. Write the web components tags into your HTML.

## Status

[![GitHub Tag](https://img.shields.io/github/v/tag/fboes/formwerk)](https://github.com/fboes/formwerk)
[![NPM Version](https://img.shields.io/npm/v/%40fboes%2Fformwerk.svg)](https://www.npmjs.com/package/@fboes/formwerk)
![GitHub License](https://img.shields.io/github/license/fboes/formwerk)

## Legal stuff

Author: [Frank Boës](https://3960.org/) 2024

Copyright & license: See [LICENSE.txt](LICENSE.txt)
