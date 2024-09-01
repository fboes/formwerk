# Formwerk

Web components for improved HTML form elements.

These web components exist:

1. `<formwerk-input />` enhances [`<input />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
2. `<formwerk-select />` enhances [`<select />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
3. `<formwerk-checkboxes />` enhances [`<input type="chechbox" />` & `<input type="radio" />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
4. `<formwerk-textarea />` enhances [`<textarea />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)

All components have in common that any attributes attached will be attached to the `<input>` and/or `<select>` field inside of it. And then there are some extra attributes to make your live easier.

## Installation

Either download the [`formwerk.js`](dist/formwerk.js) and [`formwerk.css`](dist/formwerk.css) to a sensible location in your web project, or do a NPM installation:

```bash
npm install formwerk --save
```

Instead of a local installation you may also load the library from https://unpkg.com/. Beware: This makes https://unpkg.com/ a dependency of your project and may pose data protection issues.

```html
<script type="module" src="https://unpkg.com/formwerk@latest/dist/formwerk.js"></script>
<link rel="stylesheet" href="https://unpkg.com/formwerk@latest/dist/formwerk.css" />
```

Everything required for the front-end functionality of this web component is contained in [`formwerk.js`](./dist/formwerk.js)and [`formwerk.css`](dist/formwerk.css).

## Usage

Load the JavaScript file [`formwerk.js`](dist/formwerk.js) into your HTML document to enable the Formwerk web components.

```html
<script type="module" src="formwerk.js"></script>
```

Optional: Load additional [`formwerk.css`](dist/formwerk.css) style sheet for some basic styling of the Formwerk web components.

```html
<link rel="stylesheet" href="formwerk.css" />
```

Write the Formwerk web components tags into your HTML.

```html
<formwerk-input label="Example" name="example" helptext="This is an example text field"></formwerk-input>
```

Refer to the [Formwerk examples page](/examples/) on live examples as well as their code examples.

## Attributes

These additional attributes exists on the Formwerk web components:

### `label` (string)

Exists on: `<formwerk-input />`, `<formwerk-select />`, `<formwerk-checkboxes />`, `<formwerk-textarea />`

Will spawn an extra `<label>` before the form element, the attribute value will be the label text.

### `helptext` (string)

Exists on: `<formwerk-input />`, `<formwerk-select />`, `<formwerk-checkboxes />`, `<formwerk-textarea />`

Will spawn an extra help paragraph text after the form element, the attribute value will be the paragraph text.

### `output` (boolean)

Exists on: `<formwerk-input />`, `<formwerk-select />`

Will spawn an extra `<output>` after the form element, if set to `true`. This output show the current value, and may be helpful for inputs which do not show the current value like `<input type="range" />`.

### `unit` (string)

Exists on: `<formwerk-input />`, `<formwerk-select />`

Will spawn an extra extra unit name (e.g. "°C") text after the form element, the attribute value will be the unit text.

### `options` (string[]\|object[])

Exists on: `<formwerk-input />`, `<formwerk-select />`, `<formwerk-checkboxes />`

Instead of creating multiple options for a `<datalist>`, `<option>`, `<input type="checkbox">` or `<input type="radio">`, the `options` property allows for a fast creation of option lists.

This is available as attribute and element property.

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

### `values` (string[])

Exists on: `<formwerk-input />`, `<formwerk-select />`, `<formwerk-checkboxes />`

For `<select multiple />` as well as `<input type="checkbox" />` it is possible to have multiple selected values for a given input element. For these elements there is a helpful `values` property to set and read multiple `value`.

This is available as attribute and element property.

```json
["One", "Two", "Three"]
```

### `toggletype` (object)

Exists on: `<formwerk-input />`

This allows `<input>` field to change their type. The attribute requires the following JSON:

```json
{
  "type": "text",
  "labelOff": "⇄",
  "labelOn": "⇆",
  "title": "Show / hide password"
}
```

### `autogrow` (boolean)

Exists on: `<formwerk-textarea />`

Text areas will grow according to their input text size.

## Status

[![GitHub Tag](https://img.shields.io/github/v/tag/fboes/formwerk)](https://github.com/fboes/formwerk)
[![NPM Version](https://img.shields.io/npm/v/%40fboes%2Fformwerk.svg)](https://www.npmjs.com/package/@fboes/formwerk)
![GitHub License](https://img.shields.io/github/license/fboes/formwerk)

## Legal stuff

Author: [Frank Boës](https://3960.org/) 2024

Copyright & license: See [LICENSE.txt](LICENSE.txt)
